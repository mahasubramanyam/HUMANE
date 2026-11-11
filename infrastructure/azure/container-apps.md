# Azure Container Apps Deployment Target

HUMANE is architected for deployment to Azure Container Apps (ACA), providing serverless container execution with automated scaling, integrated TLS ingress, and private virtual network connectivity.

## Target Architecture

1. **Frontend App**: Containerized Next.js instance running standalone Node.js server.
2. **Backend API**: Containerized FastAPI ASGI application running with Uvicorn workers.
3. **Database**: Azure Database for PostgreSQL Flexible Server with private endpoints.
4. **Sensitive Storage**: Azure Blob Storage account configured with private containers and customer-managed encryption keys.
5. **Secrets Management**: Azure Key Vault referenced via Key Vault references in Container Apps environment.
