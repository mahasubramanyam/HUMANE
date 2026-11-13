# Azure Container Apps Deployment Architecture (`malaysiawest`)

HUMANE is architected for deployment to **Azure Container Apps (ACA)** in the `malaysiawest` region within resource group `rg-humane-prod-mw`, tailored for the **Azure for Students** subscription ($100 credit) using a **GHCR-first architecture**.

## 1. Target Architecture (`infrastructure/azure/main.bicep`)

### 1. Frontend Container App (`humane-web`)
- Containerized Next.js 15 standalone server (`frontend/Dockerfile`) listening on port `3000`.
- External HTTPS-only ingress (`allowInsecure: false`, `transport: 'auto'`).
- Health probes: Startup, Liveness, and Readiness probes targeting `/` on port `3000`.
- Scaling: Serverless scale-to-zero (`minReplicas: 0`, `maxReplicas: 3`) on Consumption profile (`0.25` vCPU, `0.5Gi` RAM).
- **Runtime + Build-time API URL**:
  - `RootLayout` (`frontend/src/app/layout.tsx`) dynamically injects `window.__HUMANE_ENV__ = { apiUrl: ... }` from container runtime environment variables (`HUMANE_API_URL`).
  - `getApiHealthUrl()` in `frontend/src/features/shared/components/shell.tsx` resolves runtime injection in the browser, falling back to compile-time build args, and strictly avoiding `localhost` in production.

### 2. Backend API Container App (`humane-api`)
- Containerized FastAPI ASGI application (`backend/Dockerfile`) running Uvicorn workers on port `8000`.
- External HTTPS-only ingress (`allowInsecure: false`).
- Health probes: Startup & Liveness probes on `/healthz`, Readiness probe on `/api/v1/health` (port `8000`).
- Scaling: Serverless scale-to-zero (`minReplicas: 0`, `maxReplicas: 3`) on Consumption profile (`0.25` vCPU, `0.5Gi` RAM).
- Automatic CORS binding: `CORS_ORIGINS` is automatically bound to `https://${frontendAppName}.${acaEnvironment.properties.defaultDomain}` (plus optional custom `frontendOrigin` if configured).

### 3. PostgreSQL Networking (`postgresNetworkingMode`)
- **`privateVnet` (Recommended default — ~$0.50/mo, Zero Public Exposure)**:
  - Provisions a Virtual Network (`10.0.0.0/16`) containing:
    - `snet-aca` (`10.0.0.0/23`): Subnet delegated to `Microsoft.App/environments`. Injected as `infrastructureSubnetId` into the ACA Workload Profile environment.
    - `snet-postgres` (`10.0.2.0/24`): Subnet delegated to `Microsoft.DBforPostgreSQL/flexibleServers`.
    - Private DNS Zone (`${appName}-zone-${uniqueSuffix}.postgres.database.azure.com`): Linked to `vnet`. Azure automatically registers the database private record. The backend container resolves `POSTGRES_HOST` (`postgresServer.properties.fullyQualifiedDomainName`) over private IP.
    - PostgreSQL Flexible Server has `publicNetworkAccess: Disabled`. Zero inbound internet exposure.
- **`natGateway` (Alternative — ~$36.50/mo dedicated static egress)**:
  - Provisions Standard Static Public IP (`~$3.65/mo`) + Azure NAT Gateway (`~$32.85/mo`) attached to `snet-aca`.
  - Configures PostgreSQL firewall (`AllowContainerAppNatEgress`) strictly for `natPublicIp.properties.ipAddress` (`/32`).
  - *Note:* Not recommended for Azure for Students due to high standing costs.

### 4. Container Registry Strategy (`containerRegistryType`)
- **`ghcr` (Default — $0.00/mo, Zero Azure Bootstrap Dependency)**:
  - GitHub Actions publishes images to GitHub Container Registry (`ghcr.io`) using the standard runner `GITHUB_TOKEN`.
  - Azure Container Apps authenticates to private GHCR images using your GitHub username and a persistent read-only GitHub Personal Access Token (classic with `read:packages` scope, or fine-grained token with Read access to Packages).
  - The token is passed via `containerRegistryPassword` (from repository secret `GHCR_READ_TOKEN`), stored securely in Azure Key Vault as secret `container-registry-password`, and referenced by Container Apps using Managed Identity Key Vault references (`keyVaultUrl`). The token is never logged, exposed in ARM outputs, or stored in code.
  - No Azure Container Registry (ACR) resource is provisioned, saving ~$5/month and avoiding bootstrap chicken-and-egg issues.
- **`acr` (Optional Alternative — ~$5.00/mo)**:
  - Provisions Azure Container Registry (`Basic` tier).
  - Uses passwordless User-Assigned Managed Identity authentication (`AcrPull` role assignment).

### 5. Secrets Management & Storage Hardening
- **Azure Key Vault**: Standard tier, RBAC authorized. Stores `postgres-password`, `session-secret-key`, `csrf-secret-key`, and `container-registry-password` (when GHCR is used). Injected into Container Apps via Managed Identity references (`Key Vault Secrets User` role).
- **Azure Blob Storage**: `Standard_LRS` Hot tier, `allowBlobPublicAccess: false`, `networkAcls.defaultAction: Deny`, service endpoint access from `snet-aca`, `Storage Blob Data Contributor` role assigned to Managed Identity.

---

## 2. Image Naming Convention

Images produced by `.github/workflows/ci.yml` strictly follow this immutable naming pattern:

- **Registry Server**: `ghcr.io` (or custom `CONTAINER_REGISTRY_SERVER`)
- **Repository Owner**: Lowercased GitHub username or organization (`<owner_lc>`)
- **Tag Format**: `sha-<12char_commit_sha>-r<github_run_number>` (e.g. `sha-4a2e8c1b9d0f-r42`)
- **Secondary Tag**: `sha-<full_commit_sha>`

**Exact Published Image References**:
- Backend: `ghcr.io/<owner_lc>/humane-backend:sha-<12char_commit_sha>-r<github_run_number>`
- Frontend: `ghcr.io/<owner_lc>/humane-frontend:sha-<12char_commit_sha>-r<github_run_number>`

The deployment workflow passes these exact outputs directly from the `container-images` job into Bicep (`backendImage` and `frontendImage`). Deployment cannot proceed unless both images are confirmed published.

---

## 3. Secure Secret Generation & Management

### Generation (Cryptographically Secure Pseudo-Random Number Generator)

Never use `Get-Random` or unreliable .NET 5+ methods like `[Convert]::ToHexString` which fail on Windows PowerShell 5.1. Use standard, cross-platform CSPRNG methods:

**PowerShell (Compatible with Windows PowerShell 5.1 & PowerShell 7+):**
```powershell
# 1. 32-byte hexadecimal secrets (SESSION_SECRET_KEY, CSRF_SECRET_KEY)
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$SessionKey = ([System.BitConverter]::ToString($bytes) -replace '-','').ToLowerInvariant()

$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$CsrfKey = ([System.BitConverter]::ToString($bytes) -replace '-','').ToLowerInvariant()

# 2. Database Password (satisfies Azure PostgreSQL Flexible Server complexity)
$bytes = New-Object byte[] 24
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$DbPass = [System.Convert]::ToBase64String($bytes) -replace '[\+/=]', 'x' + '!A9'
```

**Python (Cross-platform alternative):**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Storage Security: Never Pass Secrets as CLI Arguments

Passing passwords directly via `--parameters key="value"` exposes credentials in shell history (`ConsoleHost_history.txt`, `.bash_history`) and system process monitors.

1. **Production Pipeline (Recommended)**:
   Add secrets directly to GitHub Repository Secrets (`Settings > Secrets and variables > Actions > Secrets`). The CI/CD workflow passes them securely via environment variables into `az deployment group create`.
2. **Key Vault Pre-population (Optional Manual Step)**:
   If pre-populating secrets in Azure Key Vault:
   ```powershell
   # Prompt securely without echoing to terminal
   $securePass = Read-Host -AsSecureString "Enter Secret Value"
   az keyvault secret set --vault-name "<KEY_VAULT_NAME>" --name "postgres-password" --value ([System.Net.NetworkCredential]::new('', $securePass).Password)
   ```

---

## 4. Verified GHCR-First Deployment Sequence

1. **Step 1: Configure GitHub Repository Secrets & Variables**
   - Configure Azure OIDC credentials (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`).
   - Configure PostgreSQL admin credentials (`DB_ADMIN_USER`, `DB_ADMIN_PASSWORD`).
   - Configure application security secrets (`SESSION_SECRET_KEY`, `CSRF_SECRET_KEY`).
   - Configure `GHCR_READ_TOKEN`: A GitHub Personal Access Token with `read:packages` scope (used by Azure Container Apps to pull private images from GHCR).
2. **Step 2: Build & Publish Versioned Images to GHCR**
   - Push to `main` (or dispatch workflow with `publish_images=true`).
   - GitHub Actions logs in to `ghcr.io` via `GITHUB_TOKEN`, builds both Dockerfiles, and tags images with `sha-<12char>-r<run_number>` and `sha-<commit_sha>`.
3. **Step 3: Manually Gated Infrastructure Deployment**
   - Dispatch GitHub Actions workflow with `deploy_to_production: true`.
   - The workflow verifies that images were published, logs in to Azure via OIDC, and applies `main.bicep` with `containerRegistryType=ghcr`.
   - Bicep provisions VNet, Subnets, Key Vault, PostgreSQL, Managed Identity, and ACA Environment, writes the GHCR token into Key Vault, and starts the container apps referencing the exact GHCR images.
4. **Step 4: Post-Deployment Verification**
   - Workflow probes `/healthz` (backend liveness) and `/api/v1/health` (backend readiness).
   - Workflow probes the frontend Container App FQDN.
