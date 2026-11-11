// ==============================================================================
// HUMANE — Complete Azure Infrastructure Definition (Bicep)
// Tailored for Azure for Students ($100 budget optimization)
// ==============================================================================

@description('Deployment environment name (e.g. dev, prod)')
param environment string = 'prod'

@description('Azure primary region for resource deployment')
param location string = resourceGroup().location

@description('Project identifier')
param appName string = 'humane'

@description('PostgreSQL administrator login')
@secure()
param dbAdminUser string = 'humane_admin'

@description('PostgreSQL administrator password')
@secure()
param dbAdminPassword string

@description('Backend FastAPI container image tag')
param backendImage string = 'mcr.microsoft.com/azuredocs/aci-helloworld:latest'

@description('Optional administrator IPv4 address allowed to connect directly to PostgreSQL for database migrations and administration')
param adminClientIp string = ''

@description('Session signing secret — minimum 32 characters. Store in Key Vault or pass as a secure param.')
@secure()
param sessionSecretKey string

@description('CSRF signing secret — minimum 32 characters. Store in Key Vault or pass as a secure param.')
@secure()
param csrfSecretKey string

@description('Production frontend origin (e.g. https://happy-moon-abc123.azurestaticapps.net). Used to configure backend CORS.')
param frontendOrigin string = ''

var uniqueSuffix = uniqueString(resourceGroup().id)
var logAnalyticsName = '${appName}-log-${uniqueSuffix}'
var appInsightsName = '${appName}-ai-${uniqueSuffix}'
var storageAccountName = '${appName}st${uniqueSuffix}'
var keyVaultName = '${appName}-kv-${take(uniqueSuffix, 8)}'
var acaEnvName = '${appName}-aca-env-${uniqueSuffix}'
var postgresServerName = '${appName}-pg-${uniqueSuffix}'
var backendAppName = '${appName}-api'

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

// 4. Azure Key Vault (Standard Tier - Pay only pennies per 10k ops)
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
  }
}

// Key Vault Secrets User role assignment for Managed Identity
resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, managedIdentity.id, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
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

// 5. Azure Blob Storage (Standard LRS Hot tier for sensitive documents)
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
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
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

// 6. Azure Database for PostgreSQL Flexible Server (Burstable B1ms for student credit preservation)
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

// 7. Azure Container Apps Managed Environment (Consumption Serverless Tier)
resource acaEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: acaEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Restricted PostgreSQL Firewall: Container Apps environment outbound IPs only
resource pgFirewallAca 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = [for (ip, i) in acaEnvironment.properties.outboundIpAddresses: {
  parent: postgresServer
  name: 'AllowContainerAppEgress-${i}'
  properties: {
    startIpAddress: ip
    endIpAddress: ip
  }
}]

// Optional administrator IP for migrations / management
resource pgFirewallAdmin 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = if (!empty(adminClientIp)) {
  parent: postgresServer
  name: 'AllowAdminClientIp'
  properties: {
    startIpAddress: adminClientIp
    endIpAddress: adminClientIp
  }
}

// 8. Backend FastAPI Container App (Scale-to-zero enabled: $0 when idle)
resource backendApp 'Microsoft.App/containerApps@2023-05-01' = {
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
    configuration: {
      secrets: [
        {
          name: 'postgres-password'
          keyVaultUrl: '${keyVault.properties.vaultUri}secrets/postgres-password'
          identity: managedIdentity.id
        }
        {
          name: 'session-secret-key'
          keyVaultUrl: '${keyVault.properties.vaultUri}secrets/session-secret-key'
          identity: managedIdentity.id
        }
        {
          name: 'csrf-secret-key'
          keyVaultUrl: '${keyVault.properties.vaultUri}secrets/csrf-secret-key'
          identity: managedIdentity.id
        }
      ]
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
              name: 'POSTGRES_HOST'
              value: postgresServer.properties.fullyQualifiedDomainName
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
              name: 'CORS_ORIGINS'
              value: !empty(frontendOrigin) ? frontendOrigin : 'http://localhost:3000'
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/healthz'
                port: 8000
              }
              initialDelaySeconds: 5
              periodSeconds: 15
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
}

// NOTE: Frontend is served by Azure Static Web Apps (Free tier) provisioned via
// static-web-app.bicep. No Container App is needed for the frontend.
// The frontendAppName variable is retained for naming consistency only.

// Outputs
output backendUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output postgresFqdn string = postgresServer.properties.fullyQualifiedDomainName
output keyVaultUri string = keyVault.properties.vaultUri
