"""
Geographic Controller - API endpoints for geographic operations
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional, List

from .geographic_service import GeoService
from .geographic_interface import GeographicInterface
from .helpers.global_response import GlobalResponse, ResponseMetadata
from app.config.database import get_db


router = APIRouter()


# Dependency injection
def get_geo_service(db: Session = Depends(get_db)) -> GeographicInterface:
    """Get geographic service instance"""
    return GeoService(db)


@router.get("/levels", response_model=Dict[str, Any])
async def get_geo_levels(
    search: Optional[str] = Query(None, description="Search term for level name/code"),
    level_code: Optional[str] = Query(None, description="Filter by level code"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    level_order: Optional[int] = Query(None, description="Filter by level order"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Items per page"),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Get geographic levels with filtering"""
    # Build query
    offset = (page - 1) * limit
    query = {"filters": {}, "limit": limit, "offset": offset}

    if search:
        query["filters"]["search_term"] = search
    if level_code:
        query["filters"]["geo_level_code"] = level_code
    if is_active is not None:
        query["filters"]["is_active"] = is_active
    if level_order is not None:
        query["filters"]["level_order"] = level_order

    # Get data
    levels = await geo_service.get_geo_levels(query)

    # Get total count for pagination
    count_query = {"filters": query["filters"]}
    total_count = len(
        await geo_service.get_geo_levels({**count_query, "limit": 10000})
    )  # Get all for count

    # Build pagination info
    pagination = ResponseMetadata.pagination_info(total_count, page, limit)

    # Build applied filters
    applied_filters = ResponseMetadata.applied_filters(
        search=search, filters=query["filters"]
    )

    # Build filter summary
    filter_summary = ResponseMetadata.filter_summary(
        search=search, filters=query["filters"]
    )

    return GlobalResponse.list_response(
        items=levels,
        item_key="geo_levels",
        total_count=total_count,
        page=page,
        limit=limit,
        has_next=pagination["has_next"],
        has_prev=pagination["has_prev"],
        filter_summary=filter_summary,
        applied_filters=applied_filters,
    )


@router.get("/levels/analytics", response_model=Dict[str, Any])
async def get_geo_levels_analytics(
    analytics_type: str = Query("summary", description="Type of analytics to return"),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Get analytics for geographic levels"""
    query = {"analytics_type": analytics_type}
    analytics_data = await geo_service.get_geo_level_analytics(query)

    applied_filters = ResponseMetadata.applied_filters(
        filters={"analytics_type": analytics_type}
    )

    return GlobalResponse.analytics_response(
        analytics_data=analytics_data,
        analytics_type=analytics_type,
        data_type="geo_levels",
        applied_filters=applied_filters,
    )


@router.get("/units", response_model=Dict[str, Any])
async def get_geo_units(
    search: Optional[str] = Query(None, description="Search term for unit name/code"),
    geo_unit_code: Optional[str] = Query(None, description="Filter by geo unit code"),
    level_code: Optional[str] = Query(None, description="Filter by level code"),
    parent_geo_code: Optional[str] = Query(
        None, description="Filter by parent geo unit code"
    ),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Items per page"),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Get geographic units with filtering"""
    # Build query
    offset = (page - 1) * limit
    query = {"filters": {}, "limit": limit, "offset": offset}

    if search:
        query["filters"]["search_term"] = search
    if geo_unit_code:
        query["filters"]["geo_unit_code"] = geo_unit_code
    if level_code:
        query["filters"]["geo_level_code"] = level_code
    if parent_geo_code:
        query["filters"]["parent_geo_code"] = parent_geo_code
    if is_active is not None:
        query["filters"]["is_active"] = is_active

    # Get data
    units = await geo_service.get_geo_units(query)

    # Get total count for pagination
    count_query = {"filters": query["filters"]}
    total_count = len(
        await geo_service.get_geo_units({**count_query, "limit": 10000})
    )  # Get all for count

    # Build pagination info
    pagination = ResponseMetadata.pagination_info(total_count, page, limit)

    # Build applied filters
    applied_filters = ResponseMetadata.applied_filters(
        search=search, filters=query["filters"]
    )

    # Build filter summary
    filter_summary = ResponseMetadata.filter_summary(
        search=search, filters=query["filters"]
    )

    return GlobalResponse.list_response(
        items=units,
        item_key="geo_units",
        total_count=total_count,
        page=page,
        limit=limit,
        has_next=pagination["has_next"],
        has_prev=pagination["has_prev"],
        filter_summary=filter_summary,
        applied_filters=applied_filters,
    )


@router.get("/units/analytics", response_model=Dict[str, Any])
async def get_geo_units_analytics(
    analytics_type: str = Query("summary", description="Type of analytics to return"),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Get analytics for geographic units"""
    query = {"analytics_type": analytics_type}
    analytics_data = await geo_service.get_geo_unit_analytics(query)

    applied_filters = ResponseMetadata.applied_filters(
        filters={"analytics_type": analytics_type}
    )

    return GlobalResponse.analytics_response(
        analytics_data=analytics_data,
        analytics_type=analytics_type,
        data_type="geo_units",
        applied_filters=applied_filters,
    )


@router.get("/hierarchy/{geo_unit_code}", response_model=Dict[str, Any])
async def get_geo_hierarchy(
    geo_unit_code: str,
    include_children: bool = Query(True, description="Whether to include child units"),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Get hierarchical tree for a geographic unit"""
    query = {"geo_unit_code": geo_unit_code, "include_children": include_children}
    hierarchy = await geo_service.get_geo_hierarchy(query)

    # Calculate depth
    def calculate_depth(items: List[Dict[str, Any]]) -> int:
        if not items:
            return 0

        def get_depth(item: Dict[str, Any], current_depth: int = 1) -> int:
            children = item.get("children", [])
            if not children:
                return current_depth
            return max(get_depth(child, current_depth + 1) for child in children)

        return max(get_depth(item) for item in items)

    depth = calculate_depth(hierarchy)

    applied_filters = ResponseMetadata.applied_filters(
        filters={"geo_unit_code": geo_unit_code, "include_children": include_children}
    )

    return GlobalResponse.hierarchy_response(
        hierarchy_data=hierarchy,
        root_code=geo_unit_code,
        depth=depth,
        applied_filters=applied_filters,
    )


@router.get("/search", response_model=Dict[str, Any])
async def search_geographic_data(
    search: Optional[str] = Query(
        None, description="Search term across all geographic data"
    ),
    scope: str = Query("all", description="Search scope: 'all', 'levels', or 'units'"),
    level_code: Optional[str] = Query(None, description="Filter by level code"),
    parent_geo_code: Optional[str] = Query(
        None, description="Filter by parent geo unit code"
    ),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    include_analytics: bool = Query(
        False, description="Whether to include analytics in results"
    ),
    geo_service: GeographicInterface = Depends(get_geo_service),
) -> Dict[str, Any]:
    """Search across all geographic data"""
    # Build query
    query = {
        "filters": {},
        "scope": scope,
        "include_analytics": include_analytics,
        "limit": 1000,  # Get all results for search
        "offset": 0,
    }

    if search:
        query["filters"]["search_term"] = search
    if level_code:
        query["filters"]["geo_level_code"] = level_code
    if parent_geo_code:
        query["filters"]["parent_geo_code"] = parent_geo_code
    if is_active is not None:
        query["filters"]["is_active"] = is_active

    # Get search results
    results = await geo_service.search_geographic_data(query)

    # Calculate total count
    total_count = 0
    if "geo_levels" in results:
        total_count += len(results["geo_levels"])
    if "geo_units" in results:
        total_count += len(results["geo_units"])

    # Build applied filters
    filters = query["filters"].copy()
    filters["scope"] = scope
    filters["include_analytics"] = include_analytics
    applied_filters = ResponseMetadata.applied_filters(search=search, filters=filters)

    # Build aggregations
    aggregations = {}
    if "geo_levels" in results:
        aggregations["geo_level_count"] = len(results["geo_levels"])
    if "geo_units" in results:
        aggregations["geo_unit_count"] = len(results["geo_units"])
    if "analytics" in results:
        aggregations["analytics"] = results["analytics"]

    return GlobalResponse.search_response(
        results=results,
        total_count=total_count,
        applied_filters=applied_filters,
        aggregations=aggregations,
    )
