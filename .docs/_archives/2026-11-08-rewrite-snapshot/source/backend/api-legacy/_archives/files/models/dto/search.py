"""
File Search Schema
Unified search schema for comprehensive file search
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SearchMode(str, Enum):
    CONTAINS = "contains"
    EXACT = "exact"
    STARTS_WITH = "starts_with"
    ENDS_WITH = "ends_with"


class SortField(str, Enum):
    FILENAME = "filename"
    CREATED_AT = "createdAt"
    UPDATED_AT = "updatedAt"
    SIZE = "size_bytes"
    FILE_TYPE = "file_type"
    DIRECTORY_ID = "directory_id"


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"


class FileSearchResponse(BaseModel):
    """Unified file search response"""

    files: List[Dict[str, Any]] = Field(
        description="List of files matching the search criteria"
    )
    pagination: Dict[str, Any] = Field(description="Pagination information")

    # Search statistics
    search_time_ms: Optional[float] = Field(
        None, description="Time taken for search in milliseconds"
    )
    filter_summary: Optional[str] = Field(
        None, description="Human-readable summary of applied filters"
    )

    # Aggregations
    file_type_counts: Optional[Dict[str, int]] = Field(
        None, description="Count of files by type"
    )
    directory_counts: Optional[Dict[str, int]] = Field(
        None, description="Count of files by directory"
    )
    size_stats: Optional[Dict[str, int]] = Field(
        None, description="Size statistics (min, max, avg)"
    )

    # Applied filters
    applied_filters: Optional[Dict[str, Any]] = Field(
        None, description="Filters that were applied"
    )
