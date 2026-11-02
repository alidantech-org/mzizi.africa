"""
File Type Query Builder - Query construction for file type operations
"""

from typing import Dict, Any, List, Optional
from sqlalchemy import select, func, and_, or_
from sqlalchemy.sql import ColumnElement
from app.routes.files.models.file_type import FileType


class FileTypeFilterHandler:
    """Handler for file type-specific filters"""
    
    @staticmethod
    def handle_search_filter(search_config: Dict[str, Any]) -> List[ColumnElement]:
        """Handle search term filtering for file types"""
        conditions = []
        if not search_config:
            return conditions
            
        term = search_config.get('term')
        if not term:
            return conditions
            
        case_sensitive = search_config.get('case_sensitive', False)
        
        if case_sensitive:
            conditions.extend([
                FileType.name.like(f"%{term}%"),
                FileType.code.like(f"%{term}%"),
                FileType.description.like(f"%{term}%")
            ])
        else:
            conditions.extend([
                FileType.name.ilike(f"%{term}%"),
                FileType.code.ilike(f"%{term}%"),
                FileType.description.ilike(f"%{term}%")
            ])
                
        return conditions
    
    @staticmethod
    def handle_category_filter(categories: List[str]) -> List[ColumnElement]:
        """Handle category filtering"""
        if not categories:
            return []
        return [FileType.category.in_(categories)]
    
    @staticmethod
    def handle_mime_type_filter(mime_types: List[str]) -> List[ColumnElement]:
        """Handle MIME type filtering"""
        if not mime_types:
            return []
        return [FileType.mime_type.in_(mime_types)]
    
    @staticmethod
    def handle_active_filter(is_active: Optional[bool]) -> List[ColumnElement]:
        """Handle active status filtering"""
        if is_active is None:
            return []
        return [FileType.is_active == is_active]


class FileTypeSortHandler:
    """Handle sorting for file types"""
    
    FIELD_MAPPING = {
        'name': FileType.name,
        'code': FileType.code,
        'category': FileType.category,
        'createdAt': FileType.created_at,
        'updatedAt': FileType.updated_at,
    }
    
    @staticmethod
    def apply_sorting(stmt, sort_config: Dict[str, Any]):
        """Apply sorting to file type query"""
        sort_field = sort_config.get('field', 'name')
        sort_order = sort_config.get('order', 'asc')
        
        column = FileTypeSortHandler.FIELD_MAPPING.get(sort_field)
        if column:
            if sort_order == 'desc':
                stmt = stmt.order_by(column.desc())
            else:
                stmt = stmt.order_by(column.asc())
                
        return stmt


class FileTypeQueryBuilder:
    """Query builder for file type operations"""
    
    def __init__(self):
        self.filter_handlers = {
            'search': FileTypeFilterHandler.handle_search_filter,
            'categories': FileTypeFilterHandler.handle_category_filter,
            'mime_types': FileTypeFilterHandler.handle_mime_type_filter,
            'is_active': FileTypeFilterHandler.handle_active_filter
        }
    
    def build_search_query(self, query_params: Dict[str, Any]) -> select:
        """Build file type search query"""
        filters = query_params.get('filters', {})
        sort_config = query_params.get('sort', {})
        pagination = query_params.get('pagination', {})
        
        # Build base query
        stmt = select(FileType)
        
        # Apply all filters
        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        # Apply sorting
        stmt = FileTypeSortHandler.apply_sorting(stmt, sort_config)
        
        # Apply pagination
        limit = pagination.get('limit', 100)
        offset = pagination.get('offset', 0)
        stmt = stmt.offset(offset).limit(limit)
        
        return stmt
    
    def build_count_query(self, query_params: Dict[str, Any]) -> select:
        """Build file type count query"""
        filters = query_params.get('filters', {})
        
        # Build count query
        stmt = select(func.count(FileType.id))
        
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
