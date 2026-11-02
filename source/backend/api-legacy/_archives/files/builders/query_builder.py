"""
Query Builder - Automatic query construction from parameters
"""

from typing import Dict, Any, List, Optional, Callable
from sqlalchemy import select, func, and_, or_
from sqlalchemy.sql import ColumnElement
from app.routes.files.models.file import File


class FilterHandler:
    """Base class for handling specific filter types"""

    @staticmethod
    def handle_search_filter(search_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle search term filtering"""
        conditions = []
        if not search_config:
            return conditions

        term = search_config.get("term")
        if not term:
            return conditions

        exact_match = search_config.get("exact_match", False)
        case_sensitive = search_config.get("case_sensitive", False)

        if exact_match:
            if case_sensitive:
                conditions.append(File.filename == term)
            else:
                conditions.append(func.lower(File.filename) == func.lower(term))
        else:
            if case_sensitive:
                conditions.append(File.filename.like(f"%{term}%"))
            else:
                conditions.append(
                    func.lower(File.filename).like(func.lower(f"%{term}%"))
                )

        return conditions

    @staticmethod
    def handle_file_type_filter(file_type_codes: List[str]) -> List[ColumnElement]:
        """Handle file type code filtering"""
        if not file_type_codes:
            return []
        return [File.file_type_code.in_(file_type_codes)]

    @staticmethod
    def handle_directory_filter(directory_ids: List[str]) -> List[ColumnElement]:
        """Handle directory ID filtering"""
        if not directory_ids:
            return []
        return [File.directory_id.in_(directory_ids)]

    @staticmethod
    def handle_content_type_filter(content_types: List[str]) -> List[ColumnElement]:
        """Handle content type filtering"""
        if not content_types:
            return []
        # Filter by file type code since we don't have direct content_type
        return [File.file_type_code.in_(content_types)]

    @staticmethod
    def handle_folder_path_filter(folder_path: str) -> List[ColumnElement]:
        """Handle folder path filtering using S3 key pattern matching"""
        if not folder_path:
            return []
        # Use LIKE pattern matching on S3 key
        # Ensure the folder path ends with '/' to match subdirectories properly
        pattern = folder_path if folder_path.endswith("/") else f"{folder_path}/"
        return [File.s3_key.like(f"{pattern}%")]

    @staticmethod
    def handle_category_filter(category: str) -> List[ColumnElement]:
        """Handle category filtering by mapping to file type codes"""
        if not category:
            return []
        # This will need to be handled at the service level since we need to query file types first
        # For now, return empty list - the actual filtering will be done in the service
        return []

    @staticmethod
    def handle_size_filter(size_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle size range filtering"""
        conditions = []
        if not size_config:
            return conditions

        if "min" in size_config:
            conditions.append(File.size_bytes >= size_config["min"])
        if "max" in size_config:
            conditions.append(File.size_bytes <= size_config["max"])

        return conditions

    @staticmethod
    def handle_date_filter(date_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle date range filtering"""
        conditions = []
        if not date_config:
            return conditions

        if "from" in date_config:
            conditions.append(File.created_at >= date_config["from"])
        if "to" in date_config:
            conditions.append(File.created_at <= date_config["to"])

        return conditions

    @staticmethod
    def handle_metadata_filter(metadata_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle metadata filtering"""
        conditions = []
        if not metadata_config:
            return conditions

        for key, value in metadata_config.items():
            conditions.append(File.file_metadata[key].astext == str(value))

        return conditions


class SortHandler:
    """Handle sorting configuration"""

    # Field mapping for sort fields
    FIELD_MAPPING = {
        "filename": File.filename,
        "createdAt": File.created_at,
        "updatedAt": File.updated_at,
        "size": File.size_bytes,
        "file_type": File.file_type_code,
        "directory": File.directory_id,
    }

    @staticmethod
    def apply_sorting(stmt, sort_config: Dict[str, Any]):
        """Apply sorting to query statement"""
        sort_field = sort_config.get("field", "createdAt")
        sort_order = sort_config.get("order", "desc")

        column = SortHandler.FIELD_MAPPING.get(sort_field)
        if column:
            if sort_order == "desc":
                stmt = stmt.order_by(column.desc())
            else:
                stmt = stmt.order_by(column.asc())

        return stmt


class QueryBuilder:
    """Main query builder that automatically constructs queries from parameters"""

    def __init__(self):
        self.filter_handlers = {
            "search": FilterHandler.handle_search_filter,
            "file_type_codes": FilterHandler.handle_file_type_filter,
            "directory_ids": FilterHandler.handle_directory_filter,
            "content_types": FilterHandler.handle_content_type_filter,
            "folder_path": FilterHandler.handle_folder_path_filter,
            "category": FilterHandler.handle_category_filter,
            "size": FilterHandler.handle_size_filter,
            "date_range": FilterHandler.handle_date_filter,
            "metadata": FilterHandler.handle_metadata_filter,
        }

    def build_search_query(self, query_params: Dict[str, Any]) -> select:
        """Build complete search query from parameters"""
        filters = query_params.get("filters", {})
        sort_config = query_params.get("sort", {})
        pagination = query_params.get("pagination", {})

        # Build base query
        stmt = select(File)

        # Apply all filters automatically
        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))

        # Apply sorting
        stmt = SortHandler.apply_sorting(stmt, sort_config)

        # Apply pagination
        limit = pagination.get("limit", 100)
        offset = pagination.get("offset", 0)
        stmt = stmt.offset(offset).limit(limit)

        return stmt

    def build_count_query(self, query_params: Dict[str, Any]) -> select:
        """Build count query from parameters"""
        filters = query_params.get("filters", {})

        # Build count query
        stmt = select(func.count(File.id))

        # Apply same filters as search query
        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))

        return stmt

    def _build_conditions(self, filters: Dict[str, Any]) -> List[ColumnElement]:
        """Build all filter conditions automatically"""
        all_conditions = []

        for filter_key, handler in self.filter_handlers.items():
            if filter_key in filters:
                conditions = handler(filters[filter_key])
                all_conditions.extend(conditions)

        return all_conditions

    def register_filter_handler(self, filter_key: str, handler: Callable):
        """Register custom filter handler"""
        self.filter_handlers[filter_key] = handler

    def get_available_filters(self) -> List[str]:
        """Get list of available filter keys"""
        return list(self.filter_handlers.keys())
