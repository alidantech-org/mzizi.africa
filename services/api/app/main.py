"""
Katiba BookBackend API - Main Application Entry Point
Political Finance Risk Intelligence Platform
"""

from .util.config import (
    create_app,
    configure_lifespan,
    configure_routes,
    configure_exception_handlers,
)

# Create application
app = create_app()

# Configure application
configure_lifespan(app)
configure_routes(app)
configure_exception_handlers(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app", host="0.0.0.0", port=8000, reload=False, log_level="info"
    )
