from datetime import UTC, datetime

from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = Field(default="healthy", description="Application status")
    environment: str = Field(..., description="Running environment")
    version: str = Field(default="0.1.0", description="API version")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC), description="UTC timestamp of the health check"
    )
    services: dict[str, str] = Field(
        default_factory=lambda: {
            "api": "operational",
            "database": "configured",
        },
        description="Subsystem health status",
    )
