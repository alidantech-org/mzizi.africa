"""
Centralized API Router - Version 1
Professional API architecture with domain-based organization
"""

from fastapi import APIRouter
from app.routes.__root__.root import router as root_router
from .files.files_controller import router as files_router

# from .scraper.scraper_controller import router as scraper_router
from .geographic.geographic_controller import router as geographic_router
from .legal.legal_controller import router as legal_router

# Create versioned API router
api_v1_router = APIRouter(prefix="")

# ============================================================================
# ROOT DOMAIN - Root for
# ============================================================================
api_v1_router.include_router(root_router, tags=["Root"])


# ============================================================================
# FILES DOMAIN - File management and retrieval
# ============================================================================
api_v1_router.include_router(files_router, prefix="/files", tags=["Files"])


# ============================================================================
# GEOGRAPHIC DOMAIN - Geographic data and administrative units
# ============================================================================
api_v1_router.include_router(geographic_router, tags=["Geographic"])


# ============================================================================
# LEGAL DOMAIN - Constitutions and legal documents
# ============================================================================
api_v1_router.include_router(legal_router, tags=["Legal"])


# ============================================================================
# SCRAPER DOMAIN - Web scraping queries and sources
# ============================================================================
# api_v1_router.include_router(scraper_router, prefix="/scraper", tags=["Scraper"])
