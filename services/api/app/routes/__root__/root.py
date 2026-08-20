"""
Root and Health Endpoints
"""

from fastapi import APIRouter
from app.config.database_init import get_database_status

router = APIRouter()

@router.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": "Katiba BookBackend API",
        "description": "Political Finance Risk Intelligence Platform",
        "version": "1.0.0",
        "api_version": "v1",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/api/v1/openapi.json",
        },
        "api_base": "/api/v1",
        "domains": ["auth", "political", "finance", "documents", "analysis", "files"],
    }

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    Returns service and database status
    """
    db_status = get_database_status()
    is_healthy = db_status.get("status") == "connected"

    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "service": "Katiba BookBackend API",
        "version": "1.0.0",
        "database": db_status,
    }
