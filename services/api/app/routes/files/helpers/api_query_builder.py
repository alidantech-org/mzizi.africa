"""
File Query Builder
Comprehensive query building for file search and filtering operations
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime


class FileQueryBuilder:
    """Builder class for constructing complex file queries"""

    def __init__(self):
        self.reset()

    def reset(self) -> "FileQueryBuilder":
        """Reset all query parameters"""
        self._search_term: Optional[str] = None
        self._file_type_codes: List[str] = []
        self._directory_ids: List[str] = []
        self._folder_path: Optional[str] = None
        self._category: Optional[str] = None
        self._size_min: Optional[int] = None
        self._size_max: Optional[int] = None
        self._date_from: Optional[datetime] = None
        self._date_to: Optional[datetime] = None
        self._content_types: List[str] = []
        self._metadata_filters: Dict[str, Any] = {}
        self._sort_field: str = "createdAt"
        self._sort_order: str = "desc"
        self._limit: int = 100
        self._offset: int = 0
        self._include_metadata: bool = False
        self._include_urls: bool = False
        self._exact_match: bool = False
        self._case_sensitive: bool = False
        return self

    def search_term(
        self, term: str, exact_match: bool = False, case_sensitive: bool = False
    ) -> "FileQueryBuilder":
        """Set search term for filename search"""
        self._search_term = term
        self._exact_match = exact_match
        self._case_sensitive = case_sensitive
        return self

    def file_type_codes(
        self, file_type_codes: Union[str, List[str]]
    ) -> "FileQueryBuilder":
        """Set file type code filters"""
        if isinstance(file_type_codes, str):
            self._file_type_codes = [file_type_codes]
        else:
            self._file_type_codes = file_type_codes
        return self

    def directory_ids(self, directory_ids: Union[str, List[str]]) -> "FileQueryBuilder":
        """Set directory UUID filters"""
        if isinstance(directory_ids, str):
            self._directory_ids = [directory_ids]
        else:
            self._directory_ids = directory_ids
        return self

    def folder_path(self, folder_path: str) -> "FileQueryBuilder":
        """Set folder path filter for S3 key pattern matching"""
        self._folder_path = folder_path
        return self

    def category_filter(self, category: str) -> "FileQueryBuilder":
        """Set category filter for file type categories"""
        self._category = category
        return self

    def size_range(
        self, min_size: Optional[int] = None, max_size: Optional[int] = None
    ) -> "FileQueryBuilder":
        """Set file size range filter in bytes"""
        self._size_min = min_size
        self._size_max = max_size
        return self

    def date_range(
        self, from_date: Optional[datetime] = None, to_date: Optional[datetime] = None
    ) -> "FileQueryBuilder":
        """Set date range filter"""
        self._date_from = from_date
        self._date_to = to_date
        return self

    def content_types(self, content_types: Union[str, List[str]]) -> "FileQueryBuilder":
        """Set content type filters"""
        if isinstance(content_types, str):
            self._content_types = [content_types]
        else:
            self._content_types = content_types
        return self

    def metadata_filter(self, key: str, value: Any) -> "FileQueryBuilder":
        """Add metadata filter"""
        self._metadata_filters[key] = value
        return self

    def metadata_filters(self, filters: Dict[str, Any]) -> "FileQueryBuilder":
        """Set multiple metadata filters"""
        self._metadata_filters.update(filters)
        return self

    def sort(self, field: str, order: str = "desc") -> "FileQueryBuilder":
        """Set sorting field and order"""
        self._sort_field = field
        self._sort_order = order
        return self

    def paginate(self, limit: int = 100, offset: int = 0) -> "FileQueryBuilder":
        """Set pagination parameters"""
        self._limit = min(limit, 1000)  # Max limit of 1000
        self._offset = max(offset, 0)
        return self

    def include_metadata(self, include: bool = True) -> "FileQueryBuilder":
        """Whether to include file metadata in results"""
        self._include_metadata = include
        return self

    def include_urls(self, include: bool = True) -> "FileQueryBuilder":
        """Whether to include file URLs in results"""
        self._include_urls = include
        return self

    def build(self) -> Dict[str, Any]:
        """Build the final query dictionary"""
        query = {
            "filters": {},
            "sort": {"field": self._sort_field, "order": self._sort_order},
            "pagination": {"limit": self._limit, "offset": self._offset},
            "options": {
                "include_metadata": self._include_metadata,
                "include_urls": self._include_urls,
            },
        }

        # Add search term
        if self._search_term:
            query["filters"]["search"] = {
                "term": self._search_term,
                "exact_match": self._exact_match,
                "case_sensitive": self._case_sensitive,
            }

        # Add file type codes
        if self._file_type_codes:
            query["filters"]["file_type_codes"] = self._file_type_codes

        # Add directory IDs
        if self._directory_ids:
            query["filters"]["directory_ids"] = self._directory_ids

        # Add folder path
        if self._folder_path:
            query["filters"]["folder_path"] = self._folder_path

        # Add category
        if self._category:
            query["filters"]["category"] = self._category

        # Add size range
        if self._size_min is not None or self._size_max is not None:
            query["filters"]["size"] = {}
            if self._size_min is not None:
                query["filters"]["size"]["min"] = self._size_min
            if self._size_max is not None:
                query["filters"]["size"]["max"] = self._size_max

        # Add date range
        if self._date_from or self._date_to:
            query["filters"]["date_range"] = {}
            if self._date_from:
                query["filters"]["date_range"]["from"] = self._date_from.isoformat()
            if self._date_to:
                query["filters"]["date_range"]["to"] = self._date_to.isoformat()

        # Add content types
        if self._content_types:
            query["filters"]["content_types"] = self._content_types

        # Add metadata filters
        if self._metadata_filters:
            query["filters"]["metadata"] = self._metadata_filters

        return query

    def build_summary(self) -> str:
        """Build a human-readable summary of the query"""
        parts = []

        if self._search_term:
            match_type = "exact" if self._exact_match else "partial"
            case_type = "case-sensitive" if self._case_sensitive else "case-insensitive"
            parts.append(f"search: '{self._search_term}' ({match_type}, {case_type})")

        if self._file_type_codes:
            parts.append(f"file type codes: {', '.join(self._file_type_codes)}")

        if self._directory_ids:
            parts.append(f"directories: {', '.join(self._directory_ids)}")

        if self._size_min is not None or self._size_max is not None:
            size_parts = []
            if self._size_min is not None:
                size_parts.append(f"min: {self._size_min} bytes")
            if self._size_max is not None:
                size_parts.append(f"max: {self._size_max} bytes")
            parts.append(f"size: {', '.join(size_parts)}")

        if self._date_from or self._date_to:
            date_parts = []
            if self._date_from:
                date_parts.append(f"from: {self._date_from.strftime('%Y-%m-%d')}")
            if self._date_to:
                date_parts.append(f"to: {self._date_to.strftime('%Y-%m-%d')}")
            parts.append(f"date: {', '.join(date_parts)}")

        if self._content_types:
            parts.append(f"content types: {', '.join(self._content_types)}")

        if self._metadata_filters:
            meta_parts = [f"{k}={v}" for k, v in self._metadata_filters.items()]
            parts.append(f"metadata: {', '.join(meta_parts)}")

        parts.append(f"sort: {self._sort_field.value} {self._sort_order.value}")
        parts.append(f"limit: {self._limit}, offset: {self._offset}")

        return " | ".join(parts) if parts else "all files"
