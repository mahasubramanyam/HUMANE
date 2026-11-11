// ==============================================================================
// HUMANE — Azure Static Web App (Free Plan, $0.00/mo)
// Zero-cost hosting for Next.js landing page with global Anycast CDN & Free SSL
// ==============================================================================

@description('Location for Static Web App (e.g. eastus2, centralus, westeurope, eastasia)')
param location string = 'eastus2'

@description('Name of the Static Web App')
param appName string = 'humane-landing'

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: appName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
