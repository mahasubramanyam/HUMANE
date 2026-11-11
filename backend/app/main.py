from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifespan handler."""
    # Startup: Initialize shared resources if needed
    yield
    # Shutdown: Clean up connection pools


def create_application() -> FastAPI:
    """FastAPI application factory."""
    application = FastAPI(
        title=settings.APP_NAME,
        description="Unified three-sided social-impact platform backend: Volunteers, NGOs, and CSR Partners.",
        version="0.1.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json" if settings.DEBUG else None,
        docs_url=f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else None,
        redoc_url=f"{settings.API_V1_PREFIX}/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # CORS configuration
    if settings.CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allow_headers=["*"],
        )

    # Root health probe (used by container orchestrators / Azure Container Apps)
    @application.get("/healthz", tags=["System"], summary="Liveness probe")
    async def liveness() -> JSONResponse:
        return JSONResponse(status_code=200, content={"status": "live", "app": settings.APP_NAME})

    # Mount API v1 router
    application.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return application


app = create_application()
