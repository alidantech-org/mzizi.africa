"""
Application Lifecycle Management
Handles startup and shutdown events
"""

async def startup_app():
    """Application startup logic"""
    print(" Starting Katiba BookBackend API...")

async def shutdown_app(_scheduler):
    """Application shutdown logic"""
    print("👋 Shutting down Katiba BookBackend API...")
    
    
