from fastapi import APIRouter, status

from app.core.config import settings
from app.schemas.health import HealthCheckResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Application Health Check",
    description="Returns current operational status, environment, and services health.",
)
async def get_health() -> HealthCheckResponse:
    return HealthCheckResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        version="0.1.0",
        services={
            "api": "operational",
            "database": "configured",
        },
    )
