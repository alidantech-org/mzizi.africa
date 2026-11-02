"""
Scraper Controller - Web scraping endpoints for queries, sources, and runs
"""

from fastapi import APIRouter, Depends, Query
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.config.database import get_db
from .scraper_service import ScraperService
from .scraper_interface import ScraperInterface

router = APIRouter()


def get_scraper_service(db: Session = Depends(get_db)) -> ScraperInterface:
    """Dependency to get scraper service"""
    return ScraperService(db)


# === QUERIES ENDPOINTS ===

@router.get("/queries", summary="List scraping queries", response_model=Dict[str, Any])
async def list_queries(
    status: Optional[str] = Query(
        None, description="Filter by status (active, paused, archived)"
    ),
    limit: int = Query(20, description="Number of queries to return"),
    offset: int = Query(0, description="Number of queries to skip"),
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """List all scraping queries with optional status filtering"""
    return await scraper_service.list_queries(status=status, limit=limit, offset=offset)


@router.post(
    "/queries", summary="Create a new scraping query", response_model=Dict[str, Any]
)
async def create_query(
    query_config: Dict[str, Any],
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Create a new scraping query with schedule"""
    return await scraper_service.create_query(query_config=query_config)


@router.get(
    "/queries/{query_id}",
    summary="Get scraping query details",
    response_model=Dict[str, Any],
)
async def get_query(
    query_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get detailed information about a specific scraping query"""
    return await scraper_service.get_query(query_id=query_id)


@router.put(
    "/queries/{query_id}",
    summary="Update scraping query",
    response_model=Dict[str, Any],
)
async def update_query(
    query_id: str,
    query_config: Dict[str, Any],
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Update an existing scraping query"""
    return await scraper_service.update_query(
        query_id=query_id, query_config=query_config
    )


@router.post(
    "/queries/{query_id}/run",
    summary="Run query manually",
    response_model=Dict[str, Any],
)
async def run_query(
    query_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Manually trigger a query run"""
    return await scraper_service.run_query(query_id=query_id)


@router.post(
    "/queries/{query_id}/pause", summary="Pause query", response_model=Dict[str, Any]
)
async def pause_query(
    query_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Pause a scheduled query"""
    return await scraper_service.pause_query(query_id=query_id)


@router.post(
    "/queries/{query_id}/resume", summary="Resume query", response_model=Dict[str, Any]
)
async def resume_query(
    query_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Resume a paused query"""
    return await scraper_service.resume_query(query_id=query_id)


# === SOURCES ENDPOINTS ===


@router.get("/sources", summary="List scraping sources", response_model=Dict[str, Any])
async def list_sources(
    source_type: Optional[str] = Query(
        None, description="Filter by source type (website, api, file)"
    ),
    limit: int = Query(20, description="Number of sources to return"),
    offset: int = Query(0, description="Number of sources to skip"),
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """List all configured scraping sources"""
    return await scraper_service.list_sources(
        source_type=source_type, limit=limit, offset=offset
    )


@router.post(
    "/sources", summary="Configure a new source", response_model=Dict[str, Any]
)
async def configure_source(
    source_config: Dict[str, Any],
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Configure a new scraping source"""
    return await scraper_service.configure_source(source_config=source_config)


@router.get(
    "/sources/{source_id}", summary="Get source details", response_model=Dict[str, Any]
)
async def get_source(
    source_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get detailed information about a specific source"""
    return await scraper_service.get_source(source_id=source_id)


# === QUERY RUNS ENDPOINTS ===


@router.get("/runs", summary="List query runs", response_model=Dict[str, Any])
async def list_query_runs(
    query_id: Optional[str] = Query(None, description="Filter by query ID"),
    status: Optional[str] = Query(
        None, description="Filter by status (pending, running, completed, failed)"
    ),
    limit: int = Query(20, description="Number of runs to return"),
    offset: int = Query(0, description="Number of runs to skip"),
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """List all query runs with optional filtering"""
    return await scraper_service.list_query_runs(
        query_id=query_id, status=status, limit=limit, offset=offset
    )


@router.get(
    "/runs/{run_id}", summary="Get query run details", response_model=Dict[str, Any]
)
async def get_query_run(
    run_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get detailed information about a specific query run"""
    return await scraper_service.get_query_run(run_id=run_id)


@router.post(
    "/runs/{run_id}/stop", summary="Stop query run", response_model=Dict[str, Any]
)
async def stop_query_run(
    run_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Stop a running query"""
    return await scraper_service.stop_query_run(run_id=run_id)


# === RESULTS ENDPOINTS ===


@router.get(
    "/runs/{run_id}/results",
    summary="Get query run results",
    response_model=Dict[str, Any],
)
async def get_query_results(
    run_id: str,
    format: str = Query("json", description="Output format (json, csv, xml)"),
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get the results of a completed query run"""
    return await scraper_service.get_query_results(run_id=run_id, format=format)


@router.get(
    "/runs/{run_id}/results/download",
    summary="Download query results",
    response_model=Dict[str, Any],
)
async def download_query_results(
    run_id: str,
    format: str = Query("json", description="Download format (json, csv, xml)"),
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Download query results as file"""
    return await scraper_service.download_query_results(run_id=run_id, format=format)


# === STATISTICS ENDPOINTS ===


@router.get("/stats", summary="Get scraping statistics", response_model=Dict[str, Any])
async def get_scraping_stats(
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get overall scraping statistics and analytics"""
    return await scraper_service.get_stats()


@router.get(
    "/queries/{query_id}/stats",
    summary="Get query statistics",
    response_model=Dict[str, Any],
)
async def get_query_stats(
    query_id: str,
    scraper_service: ScraperInterface = Depends(get_scraper_service),
):
    """Get statistics for a specific query"""
    return await scraper_service.get_query_stats(query_id=query_id)
