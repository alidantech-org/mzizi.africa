"""
Application Configuration
Centralized configuration settings
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""

    # Initialize FastAPI application
    app = FastAPI(
        title="Political Finance Risk Intelligence API",
        description="AI-powered corruption detection and political finance analysis platform",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/api/v1/openapi.json",
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


def configure_lifespan(app: FastAPI):
    """Configure application lifespan"""
    from contextlib import asynccontextmanager
    from .lifecycle import startup_app, shutdown_app

    @asynccontextmanager
    async def lifespan(_app_instance: FastAPI):
        # Startup
        scheduler = await startup_app()

        yield

        # Shutdown
        await shutdown_app(scheduler)

    # Update the app's lifespan
    app.router.lifespan_context = lifespan


def configure_routes(app: FastAPI):
    """Configure application routes"""
    from app.routes.api_router import api_v1_router

    # Include API routes
    app.include_router(api_v1_router)


def configure_exception_handlers(app: FastAPI):
    """Configure global exception handlers"""
    from app.exceptions import setup_exception_handlers

    # Register all exception handlers
    setup_exception_handlers(app)
