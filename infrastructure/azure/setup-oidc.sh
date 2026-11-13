#!/usr/bin/env bash
# ==============================================================================
# HUMANE — Azure OIDC Federation Setup for GitHub Actions (Bash)
# ==============================================================================
set -euo pipefail

SUBSCRIPTION_ID="${1:-}"
RESOURCE_GROUP="${2:-rg-humane-prod-mw}"
LOCATION="${3:-malaysiawest}"
GITHUB_ORG="${4:-mahasubramanyam}"
GITHUB_REPO="${5:-HUMANE}"

if [[ -z "$SUBSCRIPTION_ID" ]]; then
    echo "Usage: $0 <SubscriptionId> [ResourceGroupName] [Location] [GitHubOrg] [GitHubRepo]"
    exit 1
fi

echo ">>> Setting Azure subscription to: $SUBSCRIPTION_ID"
az account set --subscription "$SUBSCRIPTION_ID"

echo ">>> Ensuring resource group exists: $RESOURCE_GROUP ($LOCATION)"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

echo ">>> Creating Microsoft Entra ID Application for GitHub Actions"
APP_JSON=$(az ad app create --display-name "github-actions-humane")
APP_ID=$(echo "$APP_JSON" | jq -r '.appId')

echo ">>> Creating Service Principal"
SP_JSON=$(az ad sp create --id "$APP_ID")
SP_OBJECT_ID=$(echo "$SP_JSON" | jq -r '.id')

echo ">>> Assigning Contributor role on resource group"
az role assignment create \
    --role "Contributor" \
    --assignee-object-id "$SP_OBJECT_ID" \
    --assignee-principal-type "ServicePrincipal" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"

echo ">>> Configuring federated identity credential for branch main"
az ad app federated-credential create --id "$APP_ID" --parameters "{
    \"name\": \"github-actions-humane-main\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"repo:${GITHUB_ORG}/${GITHUB_REPO}:ref:refs/heads/main\",
    \"description\": \"GitHub Actions OIDC deployment credential for main branch\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
}"

echo ">>> Configuring federated identity credential for environment production"
az ad app federated-credential create --id "$APP_ID" --parameters "{
    \"name\": \"github-actions-humane-env-prod\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:production\",
    \"description\": \"GitHub Actions OIDC credential for production environment\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
}"

TENANT_ID=$(az account show --query tenantId -o tsv)

echo ""
echo ">>> OIDC Configuration Complete! Add these GitHub Secrets under Settings -> Secrets and variables -> Actions:"
echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
