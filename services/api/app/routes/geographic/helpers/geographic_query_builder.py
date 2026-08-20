"""
Geographic Query Builder - Build queries for geographic operations
"""

from typing import Dict, Any, Optional


class GeographicQueryBuilder:
    """Builder class for constructing geographic queries"""

    def __init__(self):
        self.reset()

    def reset(self) -> "GeographicQueryBuilder":
        """Reset all query parameters"""
        self._search_term: Optional[str] = None
        self._geo_level_code: Optional[str] = None
        self._geo_unit_code: Optional[str] = None
        self._parent_geo_code: Optional[str] = None
        self._is_active: Optional[bool] = None
        self._level_order: Optional[int] = None
        self._include_children: bool = False
        self._limit: int = 100
        self._offset: int = 0
        return self

    def search_term(self, term: str) -> "GeographicQueryBuilder":
        """Set search term for name/code search"""
        self._search_term = term
        return self

    def geo_level_code(self, code: str) -> "GeographicQueryBuilder":
        """Set geo level code filter"""
        self._geo_level_code = code
        return self

    def geo_unit_code(self, code: str) -> "GeographicQueryBuilder":
        """Set geo unit code filter"""
        self._geo_unit_code = code
        return self

    def parent_geo_code(self, code: str) -> "GeographicQueryBuilder":
        """Set parent geo unit code filter"""
        self._parent_geo_code = code
        return self

    def is_active(self, active: bool) -> "GeographicQueryBuilder":
        """Set active status filter"""
        self._is_active = active
        return self

    def level_order(self, order: int) -> "GeographicQueryBuilder":
        """Set level order filter"""
        self._level_order = order
        return self

    def include_children(self, include: bool = True) -> "GeographicQueryBuilder":
        """Whether to include child units in results"""
        self._include_children = include
        return self

    def paginate(self, limit: int = 100, offset: int = 0) -> "GeographicQueryBuilder":
        """Set pagination parameters"""
        self._limit = min(limit, 1000)
        self._offset = max(offset, 0)
        return self

    def build_geo_levels_query(self) -> Dict[str, Any]:
        """Build query for geo levels"""
        query = {
            "model": "geo_levels",
            "filters": {},
            "options": {"include_details": True},
        }

        # Add search term
        if self._search_term:
            query["filters"]["search_term"] = self._search_term

        # Add geo level code
        if self._geo_level_code:
            query["filters"]["level_code"] = self._geo_level_code

        # Add active filter
        if self._is_active is not None:
            query["filters"]["is_active"] = self._is_active

        # Add level order
        if self._level_order is not None:
            query["filters"]["level_order"] = self._level_order

        # Add pagination
        query["limit"] = self._limit
        query["offset"] = self._offset

        return query

    def build_geo_units_query(self) -> Dict[str, Any]:
        """Build query for geo units"""
        query = {
            "model": "geo_units",
            "filters": {},
            "options": {"include_details": True},
        }

        # Add search term
        if self._search_term:
            query["filters"]["search_term"] = self._search_term

        # Add geo unit code
        if self._geo_unit_code:
            query["filters"]["geo_unit_code"] = self._geo_unit_code

        # Add geo level code
        if self._geo_level_code:
            query["filters"]["level_code"] = self._geo_level_code

        # Add parent geo code
        if self._parent_geo_code:
            query["filters"]["parent_geo_code"] = self._parent_geo_code

        # Add active filter
        if self._is_active is not None:
            query["filters"]["is_active"] = self._is_active

        # Add pagination
        query["limit"] = self._limit
        query["offset"] = self._offset

        return query

    def build_geo_levels_analytics_query(self) -> Dict[str, Any]:
        """Build analytics query for geo levels"""
        return {"model": "geo_levels", "analytics_type": "summary"}

    def build_geo_units_analytics_query(self) -> Dict[str, Any]:
        """Build analytics query for geo units"""
        return {"model": "geo_units", "analytics_type": "summary"}

    def build_hierarchy_query(self) -> Dict[str, Any]:
        """Build query for hierarchical relationships"""
        query = {
            "model": "geo_units",
            "filters": {},
            "options": {"include_details": True},
        }

        # Add geo unit code
        if self._geo_unit_code:
            query["filters"]["geo_unit_code"] = self._geo_unit_code

        # Include children
        if self._include_children:
            query["filters"]["include_children"] = True

        return query

    def build_search_query(self) -> Dict[str, Any]:
        """Build comprehensive search query"""
        query = {"model": "all", "filters": {}, "options": {"include_details": True}}

        # Add search term
        if self._search_term:
            query["filters"]["search_term"] = self._search_term

        # Add geo level code
        if self._geo_level_code:
            query["filters"]["level_code"] = self._geo_level_code

        # Add geo unit code
        if self._geo_unit_code:
            query["filters"]["geo_unit_code"] = self._geo_unit_code

        # Add parent geo code
        if self._parent_geo_code:
            query["filters"]["parent_geo_code"] = self._parent_geo_code

        # Add active filter
        if self._is_active is not None:
            query["filters"]["is_active"] = self._is_active

        return query
