"""
Legal Controller - API endpoints for legal operations
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional, List

from .legal_service import LegalService
from .legal_interface import LegalInterface
from ..geographic.helpers.global_response import GlobalResponse, ResponseMetadata
from app.config.database import get_db


router = APIRouter()


# Dependency injection
def get_legal_service(db: Session = Depends(get_db)) -> LegalInterface:
    """Get legal service instance"""
    return LegalService(db)


@router.get("/constitutions", response_model=Dict[str, Any])
async def get_constitutions(
    search: Optional[str] = Query(None, description="Search term for constitution name/code"),
    constitution_code: Optional[str] = Query(None, description="Filter by constitution code"),
    status: Optional[str] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Items per page"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitutions with filtering"""
    # Build query
    offset = (page - 1) * limit
    query = {"filters": {}, "limit": limit, "offset": offset}

    if search:
        query["filters"]["search_term"] = search
    if constitution_code:
        query["filters"]["constitution_code"] = constitution_code
    if status:
        query["filters"]["status"] = status

    # Get data
    constitutions = await legal_service.get_constitutions(query)

    # Get total count for pagination
    count_query = {"filters": query["filters"]}
    total_count = len(
        await legal_service.get_constitutions({**count_query, "limit": 10000})
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
        items=constitutions,
        item_key="constitutions",
        total_count=total_count,
        page=page,
        limit=limit,
        has_next=pagination["has_next"],
        has_prev=pagination["has_prev"],
        filter_summary=filter_summary,
        applied_filters=applied_filters,
    )


@router.get("/constitutions/analytics", response_model=Dict[str, Any])
async def get_constitutions_analytics(
    analytics_type: str = Query("summary", description="Type of analytics to return"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get analytics for constitutions"""
    query = {"analytics_type": analytics_type}
    analytics_data = await legal_service.get_constitution_analytics(query)

    applied_filters = ResponseMetadata.applied_filters(
        filters={"analytics_type": analytics_type}
    )

    return GlobalResponse.analytics_response(
        analytics_data=analytics_data,
        analytics_type=analytics_type,
        data_type="constitutions",
        applied_filters=applied_filters,
    )


@router.get("/constitutions/{constitution_id}", response_model=Dict[str, Any])
async def get_constitution_by_id(
    constitution_id: str,
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitution by ID"""
    constitution = await legal_service.get_constitution_by_id(constitution_id)
    
    if not constitution:
        return GlobalResponse.error(
            message=f"Constitution with ID {constitution_id} not found",
            error_code="CONSTITUTION_NOT_FOUND"
        )
    
    return constitution


@router.get("/constitutions/code/{constitution_code}", response_model=Dict[str, Any])
async def get_constitution_by_code(
    constitution_code: str,
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitution by code"""
    constitution = await legal_service.get_constitution_by_code(constitution_code)
    
    if not constitution:
        return GlobalResponse.error(
            message=f"Constitution with code {constitution_code} not found",
            error_code="CONSTITUTION_NOT_FOUND"
        )
    
    return constitution


@router.get("/sections", response_model=Dict[str, Any])
async def get_constitution_sections(
    search: Optional[str] = Query(None, description="Search term for section title/code"),
    constitution_code: Optional[str] = Query(None, description="Filter by constitution code"),
    section_code: Optional[str] = Query(None, description="Filter by section code"),
    section_type: Optional[str] = Query(None, description="Filter by section type"),
    parent_section_code: Optional[str] = Query(None, description="Filter by parent section code"),
    include_content: bool = Query(False, description="Include section content"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Items per page"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitution sections with filtering"""
    # Build query
    offset = (page - 1) * limit
    query = {"filters": {}, "limit": limit, "offset": offset}

    if search:
        query["filters"]["search_term"] = search
    if constitution_code:
        query["filters"]["constitution_code"] = constitution_code
    if section_code:
        query["filters"]["section_code"] = section_code
    if section_type:
        query["filters"]["section_type"] = section_type
    if parent_section_code:
        query["filters"]["parent_section_code"] = parent_section_code
    if include_content:
        query["options"] = {"include_content": True}

    # Get data
    sections = await legal_service.get_constitution_sections(query)

    # Get total count for pagination
    count_query = {"filters": query["filters"]}
    total_count = len(
        await legal_service.get_constitution_sections({**count_query, "limit": 10000})
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
        items=sections,
        item_key="constitution_sections",
        total_count=total_count,
        page=page,
        limit=limit,
        has_next=pagination["has_next"],
        has_prev=pagination["has_prev"],
        filter_summary=filter_summary,
        applied_filters=applied_filters,
    )


@router.get("/sections/analytics", response_model=Dict[str, Any])
async def get_constitution_sections_analytics(
    analytics_type: str = Query("summary", description="Type of analytics to return"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get analytics for constitution sections"""
    query = {"analytics_type": analytics_type}
    analytics_data = await legal_service.get_constitution_sections_analytics(query)

    applied_filters = ResponseMetadata.applied_filters(
        filters={"analytics_type": analytics_type}
    )

    return GlobalResponse.analytics_response(
        analytics_data=analytics_data,
        analytics_type=analytics_type,
        data_type="constitution_sections",
        applied_filters=applied_filters,
    )


@router.get("/sections/{section_id}", response_model=Dict[str, Any])
async def get_constitution_section_by_id(
    section_id: str,
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitution section by ID"""
    section = await legal_service.get_constitution_section_by_id(section_id)
    
    if not section:
        return GlobalResponse.error(
            message=f"Constitution section with ID {section_id} not found",
            error_code="SECTION_NOT_FOUND"
        )
    
    return section


@router.get("/sections/code/{section_code}", response_model=Dict[str, Any])
async def get_constitution_section_by_code(
    section_code: str,
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get constitution section by code"""
    section = await legal_service.get_constitution_section_by_code(section_code)
    
    if not section:
        return GlobalResponse.error(
            message=f"Constitution section with code {section_code} not found",
            error_code="SECTION_NOT_FOUND"
        )
    
    return section


@router.get("/hierarchy/{constitution_code}", response_model=Dict[str, Any])
async def get_constitution_hierarchy(
    constitution_code: str,
    section_code: Optional[str] = Query(None, description="Root section code"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Get hierarchical tree for constitution sections"""
    hierarchy = await legal_service.get_constitution_hierarchy(constitution_code, section_code)

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
        filters={"constitution_code": constitution_code, "section_code": section_code}
    )

    return GlobalResponse.hierarchy_response(
        hierarchy_data=hierarchy,
        root_code=constitution_code,
        depth=depth,
        applied_filters=applied_filters,
    )


@router.get("/search", response_model=Dict[str, Any])
async def search_legal_data(
    search: Optional[str] = Query(
        None, description="Search term across all legal data"
    ),
    scope: str = Query("all", description="Search scope: 'all', 'constitutions', or 'sections'"),
    constitution_code: Optional[str] = Query(None, description="Filter by constitution code"),
    section_type: Optional[str] = Query(None, description="Filter by section type"),
    include_analytics: bool = Query(False, description="Include analytics in results"),
    legal_service: LegalInterface = Depends(get_legal_service),
) -> Dict[str, Any]:
    """Search across all legal data"""
    query = {
        "filters": {},
        "scope": scope,
        "include_analytics": include_analytics,
    }

    if search:
        query["filters"]["search_term"] = search
    if constitution_code:
        query["filters"]["constitution_code"] = constitution_code
    if section_type:
        query["filters"]["section_type"] = section_type

    # Get search results
    results = await legal_service.search_legal_data(query)

    # Calculate total count
    total_count = 0
    if "constitutions" in results:
        total_count += len(results["constitutions"])
    if "constitution_sections" in results:
        total_count += len(results["constitution_sections"])

    applied_filters = ResponseMetadata.applied_filters(
        search=search, filters=query["filters"]
    )

    return GlobalResponse.search_response(
        results=results,
        total_count=total_count,
        applied_filters=applied_filters,
    )
