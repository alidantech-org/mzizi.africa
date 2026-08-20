"""
Global Response Structure - Standardized API responses matching files API pattern
"""

from typing import Dict, Any, List, Optional
from datetime import datetime


class GlobalResponse:
    """Standardized response structure matching files API pattern"""

    @staticmethod
    def list_response(
        items: List[Dict[str, Any]],
        item_key: str,
        total_count: int,
        page: int = 1,
        limit: int = 100,
        has_next: bool = False,
        has_prev: bool = False,
        search_time_ms: Optional[float] = None,
        filter_summary: Optional[str] = None,
        applied_filters: Optional[Dict[str, Any]] = None,
        aggregations: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a standardized list response matching files API pattern"""
        response = {
            item_key: items,
            "pagination": {
                "total_count": total_count,
                "page": page,
                "limit": limit,
                "has_next": has_next,
                "has_prev": has_prev,
                "total_pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            },
        }

        # Optional search metadata
        if search_time_ms is not None:
            response["search_time_ms"] = search_time_ms
        if filter_summary:
            response["filter_summary"] = filter_summary
        if applied_filters:
            response["applied_filters"] = applied_filters
        if aggregations:
            response.update(aggregations)

        return response

    @staticmethod
    def analytics_response(
        analytics_data: Dict[str, Any],
        analytics_type: str,
        data_type: str,
        search_time_ms: Optional[float] = None,
        applied_filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a standardized analytics response"""
        response = {
            "analytics": analytics_data,
            "analytics_type": analytics_type,
            "data_type": data_type,
        }

        if search_time_ms is not None:
            response["search_time_ms"] = search_time_ms
        if applied_filters:
            response["applied_filters"] = applied_filters

        return response

    @staticmethod
    def hierarchy_response(
        hierarchy_data: List[Dict[str, Any]],
        root_code: str,
        depth: int,
        search_time_ms: Optional[float] = None,
        applied_filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a standardized hierarchy response"""
        response = {
            "hierarchy": hierarchy_data,
            "root_geo_unit_code": root_code,
            "depth": depth,
        }

        if search_time_ms is not None:
            response["search_time_ms"] = search_time_ms
        if applied_filters:
            response["applied_filters"] = applied_filters

        return response

    @staticmethod
    def search_response(
        results: Dict[str, Any],
        total_count: int,
        search_time_ms: Optional[float] = None,
        applied_filters: Optional[Dict[str, Any]] = None,
        aggregations: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a standardized search response"""
        response = {"results": results, "total_count": total_count}

        if search_time_ms is not None:
            response["search_time_ms"] = search_time_ms
        if applied_filters:
            response["applied_filters"] = applied_filters
        if aggregations:
            response.update(aggregations)

        return response

    @staticmethod
    def error(
        message: str,
        error_code: str = "OPERATION_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create an error response"""
        response = {
            "error": True,
            "error_code": error_code,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(),
        }

        if details:
            response["details"] = details

        return response


class ResponseMetadata:
    """Helper class for building response metadata"""

    @staticmethod
    def pagination_info(total_count: int, page: int, limit: int) -> Dict[str, Any]:
        """Build pagination metadata"""
        total_pages = (total_count + limit - 1) // limit if limit > 0 else 1
        return {
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }

    @staticmethod
    def applied_filters(
        search: Optional[str] = None,
        filters: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Build applied filters metadata"""
        applied = {}
        if search:
            applied["search"] = search
        if filters:
            applied["filters"] = filters
        if sort:
            applied["sort"] = sort
        return applied if applied else {}

    @staticmethod
    def filter_summary(
        search: Optional[str] = None, filters: Optional[Dict[str, Any]] = None
    ) -> Optional[str]:
        """Build human-readable filter summary"""
        parts = []
        if search:
            parts.append(f"search: '{search}'")
        if filters:
            for key, value in filters.items():
                parts.append(f"{key}: {value}")
        return " | ".join(parts) if parts else None
