// ==============================================================================
// HUMANE - Complete Azure Container Apps Deployment Architecture (Bicep)
// Target Region: malaysiawest | Subscription: Azure for Students
// ==============================================================================

@description('Deployment environment name (e.g. dev, prod)')
param environment string = 'prod'

@description('Azure primary region for resource deployment (policy-constrained to malaysiawest)')
param location string = resourceGroup().location

@description('Project identifier')
param appName string = 'humane'

@description('PostgreSQL administrator login')
@secure()
param dbAdminUser string

@description('PostgreSQL administrator password')
@secure()
param dbAdminPassword string

@description('Production backend FastAPI container image with immutable version/SHA tag (e.g. <registry>/humane-backend:sha-<commit>)')
param backendImage string

@description('Production frontend Next.js standalone container image with immutable version/SHA tag (e.g. <registry>/humane-frontend:sha-<commit>)')
param frontendImage string

@description('PostgreSQL networking architecture: privateVnet (recommended, ~$0.50/mo Private DNS Zone, zero public DB exposure) or natGateway (~$36.50/mo dedicated static outbound public IP via Azure NAT Gateway)')
@allowed([
  'privateVnet'
  'natGateway'
])
param postgresNetworkingMode string = 'privateVnet'

@description('Optional administrator IPv4 address allowed to connect to PostgreSQL (when postgresNetworkingMode is natGateway) and Azure Storage for migrations/administration')
param adminClientIp string = ''

@description('Session signing secret - minimum 32 characters. Stored in Azure Key Vault.')
@secure()
@minLength(32)
param sessionSecretKey string

@description('CSRF signing secret - minimum 32 characters. Stored in Azure Key Vault.')
@secure()
@minLength(32)
param csrfSecretKey string

@description('Optional additional custom frontend origin (e.g. https://humane.org) to allow in backend CORS alongside the deployed Frontend Container App FQDN')
param frontendOrigin string = ''

@description('Container registry strategy: "ghcr" (default, $0/mo, uses GitHub Container Registry with GitHub Packages read token stored in Key Vault) or "acr" (optional, ~$5/mo Basic SKU with Managed Identity AcrPull)')
@allowed([
  'ghcr'
  'acr'
])
param containerRegistryType string = 'ghcr'

@description('External container registry server (e.g. ghcr.io) when containerRegistryType is "ghcr"')
param containerRegistryServer string = 'ghcr.io'

@description('External container registry username when containerRegistryType is "ghcr"')
param containerRegistryUsername string = ''

@description('External container registry password or personal access token (with read:packages) when containerRegistryType is "ghcr"')
@secure()
param containerRegistryPassword string = ''

var uniqueSuffix = uniqueString(resourceGroup().id)
var logAnalyticsName = '${appName}-log-${uniqueSuffix}'
var appInsightsName = '${appName}-ai-${uniqueSuffix}'
var storageAccountName = '${appName}st${uniqueSuffix}'
var keyVaultName = '${appName}-kv-${take(uniqueSuffix, 8)}'
var vnetName = '${appName}-vnet-${uniqueSuffix}'
var natPublicIpName = '${appName}-nat-pip-${uniqueSuffix}'
var natGatewayName = '${appName}-nat-${uniqueSuffix}'
var postgresPrivateDnsZoneName = '${appName}-zone-${uniqueSuffix}.postgres.database.azure.com'
var acaEnvName = '${appName}-aca-env-${uniqueSuffix}'
var postgresServerName = '${appName}-pg-${uniqueSuffix}'
var acrName = '${appName}acr${uniqueSuffix}'
var backendAppName = '${appName}-api'
var frontendAppName = '${appName}-web'

var isAcr = containerRegistryType == 'acr'
var useExternalPrivateRegistry = containerRegistryType == 'ghcr' && !empty(containerRegistryServer) && !empty(containerRegistryUsername) && !empty(containerRegistryPassword)

// Built-in Azure RBAC Role Definition IDs
var keyVaultSecretsUserRoleId = '4633458b-17de-408a-b874-0445c86b69e6'
var storageBlobDataContributorRoleId = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
var acrPullRoleId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'

// 1. Log Analytics Workspace (Free 5 GB/month ingestion tier with daily budget cap)
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    workspaceCapping: {
      dailyQuotaGb: 1
    }
  }
}

// 2. Application Insights (Connected to Log Analytics Workspace)
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
  }
}

// 3. User-Assigned Managed Identity for secure, passwordless intra-service auth
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${appName}-id-${uniqueSuffix}'
  location: location
}

// 4. Azure Container Registry (Basic Tier, Admin Disabled, Managed Identity AcrPull)
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = if (isAcr) {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (isAcr) {
  name: guid(resourceGroup().id, managedIdentity.id, acrPullRoleId)
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', acrPullRoleId)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// 5. Azure Key Vault (Standard Tier - RBAC authorized)
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    publicNetworkAccess: 'Enabled'
  }
}

// Key Vault Secrets User role assignment for Managed Identity
resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, managedIdentity.id, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Store Database Password in Key Vault
resource dbPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'postgres-password'
  properties: {
    value: dbAdminPassword
  }
}

// Store Session and CSRF secrets in Key Vault
resource sessionSecretKvSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'session-secret-key'
  properties: {
    value: sessionSecretKey
  }
}

resource csrfSecretKvSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'csrf-secret-key'
  properties: {
    value: csrfSecretKey
  }
}

resource registryPasswordKvSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (useExternalPrivateRegistry) {
  parent: keyVault
  name: 'container-registry-password'
  properties: {
    value: containerRegistryPassword
  }
}

// 6. Networking Architecture (VNet Integration + Optional NAT Gateway for Static Egress)
resource natPublicIp 'Microsoft.Network/publicIPAddresses@2023-09-01' = if (postgresNetworkingMode == 'natGateway') {
  name: natPublicIpName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Regional'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    publicIPAddressVersion: 'IPv4'
    idleTimeoutInMinutes: 4
  }
}

resource natGateway 'Microsoft.Network/natGateways@2023-09-01' = if (postgresNetworkingMode == 'natGateway') {
  name: natGatewayName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    idleTimeoutInMinutes: 4
    publicIpAddresses: [
      {
        id: natPublicIp!.id
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'snet-aca'
        properties: {
          addressPrefix: '10.0.0.0/23'
          delegations: [
            {
              name: 'app-environment-delegation'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
            }
          ]
          natGateway: postgresNetworkingMode == 'natGateway' ? {
            id: natGateway!.id
          } : null
          serviceEndpoints: [
            {
              service: 'Microsoft.Storage'
            }
            {
              service: 'Microsoft.KeyVault'
            }
          ]
        }
      }
      {
        name: 'snet-postgres'
        properties: {
          addressPrefix: '10.0.2.0/24'
          delegations: [
            {
              name: 'postgresqlFlexibleServerDelegation'
              properties: {
                serviceName: 'Microsoft.DBforPostgreSQL/flexibleServers'
              }
            }
          ]
        }
      }
    ]
  }
}

resource postgresPrivateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = if (postgresNetworkingMode == 'privateVnet') {
  name: postgresPrivateDnsZoneName
  location: 'global'
}

resource postgresPrivateDnsVnetLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (postgresNetworkingMode == 'privateVnet') {
  parent: postgresPrivateDnsZone
  name: '${vnetName}-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

// 7. Azure Blob Storage (Standard LRS Hot tier for sensitive documents, VNet restricted)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Deny'
      virtualNetworkRules: [
        {
          id: '${vnet.id}/subnets/snet-aca'
          action: 'Allow'
        }
      ]
      ipRules: !empty(adminClientIp) ? [
        {
          value: adminClientIp
          action: 'Allow'
        }
      ] : []
    }
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource sensitiveDocsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'humane-sensitive-documents'
  properties: {
    publicAccess: 'None'
  }
}

resource storageBlobRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, managedIdentity.id, storageBlobDataContributorRoleId)
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageBlobDataContributorRoleId)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// 8. Azure Database for PostgreSQL Flexible Server (Burstable B1ms for student credit preservation)
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: dbAdminUser
    administratorLoginPassword: dbAdminPassword
    network: postgresNetworkingMode == 'privateVnet' ? {
      delegatedSubnetResourceId: '${vnet.id}/subnets/snet-postgres'
      privateDnsZoneArmResourceId: postgresPrivateDnsZone!.id
    } : null
    storage: {
      storageSizeGB: 32
      autoGrow: 'Disabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
  dependsOn: [
    postgresPrivateDnsVnetLink
  ]
}

// Create database
resource postgresDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'humane_db'
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// PostgreSQL firewall rule allowing dedicated static NAT Gateway outbound IP (only in natGateway mode)
resource pgFirewallAca 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = if (postgresNetworkingMode == 'natGateway') {
  parent: postgresServer
  name: 'AllowContainerAppNatEgress'
  properties: {
    startIpAddress: natPublicIp!.properties.ipAddress
    endIpAddress: natPublicIp!.properties.ipAddress
  }
}

// Optional administrator IP for migrations / management (only applicable when PostgreSQL uses public access + NAT Gateway)
resource pgFirewallAdmin 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = if (postgresNetworkingMode == 'natGateway' && !empty(adminClientIp)) {
  parent: postgresServer
  name: 'AllowAdminClientIp'
  properties: {
    startIpAddress: adminClientIp
    endIpAddress: adminClientIp
  }
}

// 9. Azure Container Apps Managed Environment (Workload Profiles, Consumption Serverless Tier, VNet-integrated)
resource acaEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: acaEnvName
  location: location
  properties: {
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
    ]
    vnetConfiguration: {
      infrastructureSubnetId: '${vnet.id}/subnets/snet-aca'
      internal: false
    }
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

var deployedFrontendOrigin = 'https://${frontendAppName}.${acaEnvironment.properties.defaultDomain}'
var deployedBackendOrigin = 'https://${backendAppName}.${acaEnvironment.properties.defaultDomain}'
var effectiveCorsOrigins = !empty(frontendOrigin) ? '${deployedFrontendOrigin},${frontendOrigin}' : deployedFrontendOrigin

var registryConfig = isAcr ? [
  {
    server: acr!.properties.loginServer
    identity: managedIdentity.id
  }
] : (useExternalPrivateRegistry ? [
  {
    server: containerRegistryServer
    username: containerRegistryUsername
    passwordSecretRef: 'container-registry-password'
  }
] : [])

// 10. Backend FastAPI Container App (Scale-to-zero enabled: $0 when idle)
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: acaEnvironment.id
    workloadProfileName: 'Consumption'
    configuration: {
      registries: registryConfig
      secrets: concat([
        {
          name: 'postgres-password'
          keyVaultUrl: dbPasswordSecret.properties.secretUri
          identity: managedIdentity.id
        }
        {
          name: 'session-secret-key'
          keyVaultUrl: sessionSecretKvSecret.properties.secretUri
          identity: managedIdentity.id
        }
        {
          name: 'csrf-secret-key'
          keyVaultUrl: csrfSecretKvSecret.properties.secretUri
          identity: managedIdentity.id
        }
      ], useExternalPrivateRegistry ? [
        {
          name: 'container-registry-password'
          keyVaultUrl: registryPasswordKvSecret!.properties.secretUri
          identity: managedIdentity.id
        }
      ] : [])
      ingress: {
        external: true
        targetPort: 8000
        transport: 'auto'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: backendImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'ENVIRONMENT'
              value: environment
            }
            {
              name: 'DEBUG'
              value: 'false'
            }
            {
              name: 'LOG_LEVEL'
              value: 'INFO'
            }
            {
              name: 'POSTGRES_HOST'
              value: postgresServer.properties.fullyQualifiedDomainName
            }
            {
              name: 'POSTGRES_PORT'
              value: '5432'
            }
            {
              name: 'POSTGRES_DB'
              value: 'humane_db'
            }
            {
              name: 'POSTGRES_USER'
              value: dbAdminUser
            }
            {
              name: 'POSTGRES_PASSWORD'
              secretRef: 'postgres-password'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: appInsights.properties.ConnectionString
            }
            {
              name: 'SESSION_SECRET_KEY'
              secretRef: 'session-secret-key'
            }
            {
              name: 'CSRF_SECRET_KEY'
              secretRef: 'csrf-secret-key'
            }
            {
              name: 'SESSION_SECURE_COOKIE'
              value: 'true'
            }
            {
              name: 'SESSION_SAME_SITE'
              value: 'lax'
            }
            {
              name: 'CORS_ORIGINS'
              value: effectiveCorsOrigins
            }
            {
              name: 'STORAGE_PROVIDER'
              value: 'azure'
            }
            {
              name: 'AZURE_STORAGE_ACCOUNT_NAME'
              value: storageAccount.name
            }
            {
              name: 'AZURE_STORAGE_CONTAINER_NAME'
              value: sensitiveDocsContainer.name
            }
            {
              name: 'AZURE_CLIENT_ID'
              value: managedIdentity.properties.clientId
            }
          ]
          probes: [
            {
              type: 'Startup'
              httpGet: {
                path: '/healthz'
                port: 8000
              }
              initialDelaySeconds: 3
              periodSeconds: 5
              failureThreshold: 12
            }
            {
              type: 'Liveness'
              httpGet: {
                path: '/healthz'
                port: 8000
              }
              initialDelaySeconds: 10
              periodSeconds: 15
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/api/v1/health'
                port: 8000
              }
              initialDelaySeconds: 5
              periodSeconds: 10
              failureThreshold: 3
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
        ]
      }
    }
  }
  dependsOn: [
    keyVaultSecretsUserRoleAssignment
    storageBlobRoleAssignment
    postgresDb
    acrPullRoleAssignment
  ]
}

// 11. Frontend Next.js 15 Standalone Container App (Scale-to-zero enabled: $0 when idle)
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: acaEnvironment.id
    workloadProfileName: 'Consumption'
    configuration: {
      registries: registryConfig
      secrets: useExternalPrivateRegistry ? [
        {
          name: 'container-registry-password'
          keyVaultUrl: registryPasswordKvSecret!.properties.secretUri
          identity: managedIdentity.id
        }
      ] : []
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'frontend'
          image: frontendImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '3000'
            }
            {
              name: 'HOSTNAME'
              value: '0.0.0.0'
            }
            {
              name: 'NEXT_TELEMETRY_DISABLED'
              value: '1'
            }
            {
              name: 'NEXT_PUBLIC_APP_NAME'
              value: 'HUMANE'
            }
            {
              name: 'NEXT_PUBLIC_APP_ENV'
              value: environment
            }
            {
              name: 'HUMANE_API_URL'
              value: '${deployedBackendOrigin}/api/v1'
            }
            {
              name: 'NEXT_PUBLIC_API_URL'
              value: '${deployedBackendOrigin}/api/v1'
            }
          ]
          probes: [
            {
              type: 'Startup'
              httpGet: {
                path: '/'
                port: 3000
              }
              initialDelaySeconds: 2
              periodSeconds: 5
              failureThreshold: 12
            }
            {
              type: 'Liveness'
              httpGet: {
                path: '/'
                port: 3000
              }
              initialDelaySeconds: 5
              periodSeconds: 15
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/'
                port: 3000
              }
              initialDelaySeconds: 3
              periodSeconds: 10
              failureThreshold: 3
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
        ]
      }
    }
  }
  dependsOn: [
    keyVaultSecretsUserRoleAssignment
    acrPullRoleAssignment
  ]
}

// Outputs
output frontendUrl string = 'https://${frontendApp.properties.configuration.ingress.fqdn}'
output backendUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output backendHealthUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}/api/v1/health'
output acaDefaultDomain string = acaEnvironment.properties.defaultDomain
output postgresFqdn string = postgresServer.properties.fullyQualifiedDomainName
output postgresNetworkingMode string = postgresNetworkingMode
output natGatewayOutboundIp string = postgresNetworkingMode == 'natGateway' ? natPublicIp!.properties.ipAddress : ''
output keyVaultUri string = keyVault.properties.vaultUri
output storageAccountName string = storageAccount.name
output containerRegistryLoginServer string = isAcr ? acr!.properties.loginServer : containerRegistryServer
output containerRegistryType string = containerRegistryType
