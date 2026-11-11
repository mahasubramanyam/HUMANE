from fastapi import APIRouter

from app.api.v1.endpoints import health

api_router = APIRouter()

# Health & System
api_router.include_router(health.router, tags=["Health"])

# Module routers (will be registered here as features are designed and approved)
# api_router.include_router(shared_auth.router, prefix="/auth", tags=["Authentication"])
# api_router.include_router(volunteer.router, prefix="/volunteers", tags=["Volunteers"])
# api_router.include_router(ngo.router, prefix="/ngos", tags=["NGOs"])
# api_router.include_router(csr.router, prefix="/csr", tags=["CSR"])
