# ==============================================================================
# HUMANE — Azure OIDC Federation Setup for GitHub Actions
# Configures passwordless authentication between GitHub Actions and Azure
# ==============================================================================

param (
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-humane-prod-mw",

    [Parameter(Mandatory=$false)]
    [string]$Location = "malaysiawest",

    [Parameter(Mandatory=$false)]
    [string]$GitHubOrg = "mahasubramanyam",

    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "HUMANE"
)

Write-Host ">>> Configuring Azure OIDC Federation for GitHub Actions: $GitHubOrg/$GitHubRepo..." -ForegroundColor Cyan

# 1. Set Azure Subscription
az account set --subscription $SubscriptionId

# 2. Create Resource Group if not exists
az group create --name $ResourceGroupName --location $Location

# 3. Create Microsoft Entra ID Application for GitHub Actions
$AppName = "github-actions-humane"
$App = az ad app create --display-name $AppName | ConvertFrom-Json
$AppId = $App.appId

# 4. Create Service Principal
$Sp = az ad sp create --id $AppId | ConvertFrom-Json

# 5. Assign Contributor Role on Resource Group
az role assignment create `
    --role "Contributor" `
    --assignee-object-id $Sp.id `
    --assignee-principal-type "ServicePrincipal" `
    --scope "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName"

# 6. Create Federated Identity Credential for main branch
$Params = @{
    name = "github-actions-humane-main"
    issuer = "https://token.actions.githubusercontent.com"
    subject = "repo:${GitHubOrg}/${GitHubRepo}:ref:refs/heads/main"
    description = "GitHub Actions OIDC deployment credential for main branch"
    audiences = @("api://AzureADTokenExchange")
} | ConvertTo-Json

az ad app federated-credential create --id $AppId --parameters $Params

# 7. Create Federated Identity Credential for Environment (production)
$EnvParams = @{
    name = "github-actions-humane-env-prod"
    issuer = "https://token.actions.githubusercontent.com"
    subject = "repo:${GitHubOrg}/${GitHubRepo}:environment:production"
    description = "GitHub Actions OIDC credential for production environment"
    audiences = @("api://AzureADTokenExchange")
} | ConvertTo-Json

az ad app federated-credential create --id $AppId --parameters $EnvParams

$TenantId = (az account show | ConvertFrom-Json).tenantId

Write-Host "`n>>> OIDC Setup Complete! Add these 3 Secrets in GitHub Repository (Settings -> Secrets and variables -> Actions):" -ForegroundColor Green
Write-Host "AZURE_CLIENT_ID: $AppId" -ForegroundColor Yellow
Write-Host "AZURE_TENANT_ID: $TenantId" -ForegroundColor Yellow
Write-Host "AZURE_SUBSCRIPTION_ID: $SubscriptionId" -ForegroundColor Yellow
