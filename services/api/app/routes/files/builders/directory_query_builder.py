"""
Directory Query Builder - Query construction for directory operations
"""

from typing import Dict, Any, List, Optional
from sqlalchemy import select, func, and_, or_
from sqlalchemy.sql import ColumnElement
from app.routes.files.models.directory import Directory


class DirectoryFilterHandler:
    """Handler for directory-specific filters"""

    @staticmethod
    def handle_search_filter(search_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle search term filtering for directories"""
        conditions = []
        if not search_config:
            return conditions

        term = search_config.get("term")
        if not term:
            return conditions

        case_sensitive = search_config.get("case_sensitive", False)

        if case_sensitive:
            conditions.extend(
                [Directory.name.like(f"%{term}%"), Directory.path.like(f"%{term}%")]
            )
        else:
            conditions.extend(
                [Directory.name.ilike(f"%{term}%"), Directory.path.ilike(f"%{term}%")]
            )

        return conditions

    @staticmethod
    def handle_depth_filter(depth_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle depth filtering"""
        conditions = []
        if not depth_config:
            return conditions

        if "min" in depth_config:
            conditions.append(Directory.depth >= depth_config["min"])
        if "max" in depth_config:
            conditions.append(Directory.depth <= depth_config["max"])

        return conditions

    @staticmethod
    def handle_parent_filter(parent_id: Optional[str]) -> List[ColumnElement]:
        """Handle parent directory filtering"""
        if not parent_id:
            return []
        return [Directory.parent_id == parent_id]

    @staticmethod
    def handle_path_filter(path_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle exact path filtering - returns direct children of the specified path"""
        exact_path = path_config.get("exact")
        if not exact_path:
            return []

        # This is a two-step process that needs to be handled at the repository level
        # For now, we'll filter by the exact path to find the parent folder
        # The repository will handle finding the direct children
        return [Directory.path == exact_path]

    @staticmethod
    def handle_active_filter(is_active: Optional[bool]) -> List[ColumnElement]:
        """Handle active status filtering"""
        if is_active is None:
            return []
        return [Directory.is_active == is_active]


class DirectorySortHandler:
    """Handle sorting for directories"""

    FIELD_MAPPING = {
        "name": Directory.name,
        "path": Directory.path,
        "depth": Directory.depth,
        "createdAt": Directory.created_at,
        "updatedAt": Directory.updated_at,
    }

    @staticmethod
    def apply_sorting(stmt, sort_config: Dict[str, Any]):
        """Apply sorting to directory query"""
        sort_field = sort_config.get("field", "path")
        sort_order = sort_config.get("order", "asc")

        column = DirectorySortHandler.FIELD_MAPPING.get(sort_field)
        if column:
            if sort_order == "desc":
                stmt = stmt.order_by(column.desc())
            else:
                stmt = stmt.order_by(column.asc())

        return stmt


class DirectoryQueryBuilder:
    """Query builder for directory operations"""

    def __init__(self):
        self.filter_handlers = {
            "search": DirectoryFilterHandler.handle_search_filter,
            "depth": DirectoryFilterHandler.handle_depth_filter,
            "parent_id": DirectoryFilterHandler.handle_parent_filter,
            "path": DirectoryFilterHandler.handle_path_filter,
            "is_active": DirectoryFilterHandler.handle_active_filter,
        }

    def build_search_query(self, query_params: Dict[str, Any]) -> select:
        """Build directory search query"""
        filters = query_params.get("filters", {})
        sort_config = query_params.get("sort", {})
        pagination = query_params.get("pagination", {})

        # Build base query
        stmt = select(Directory)

        # Apply all filters
        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))

        # Apply sorting
        stmt = DirectorySortHandler.apply_sorting(stmt, sort_config)

        # Apply pagination
        limit = pagination.get("limit", 100)
        offset = pagination.get("offset", 0)
        stmt = stmt.offset(offset).limit(limit)

        return stmt

    def build_count_query(self, query_params: Dict[str, Any]) -> select:
        """Build directory count query"""
        filters = query_params.get("filters", {})

        # Build count query
        stmt = select(func.count(Directory.id))

        # Apply same filters as search query
        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))

        return stmt

    def _build_conditions(self, filters: Dict[str, Any]) -> List[ColumnElement]:
        """Build all filter conditions"""
        all_conditions = []

        for filter_key, handler in self.filter_handlers.items():
            if filter_key in filters:
                conditions = handler(filters[filter_key])
                all_conditions.extend(conditions)

        return all_conditions
