"""
File Interface - Abstract interface for file operations
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union, BinaryIO
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from fastapi import UploadFile, File, Form, Query
from app.routes.files.models.file import File
from app.routes.files.models.dto.file import FileResponse
from app.routes.files.models.dto.search import (
    FileSearchResponse,
    SearchMode,
    SortField,
    SortOrder,
)


class FileInterface(ABC):
    """Abstract interface for file operations"""

    # Search parameters
    SEARCH_TERM: Optional[str] = Query(None, description="Search term for filename")
    SEARCH_MODE: SearchMode = Query(
        SearchMode.CONTAINS,
        description="Search mode: contains, exact, starts_with, ends_with",
    )
    CASE_SENSITIVE: bool = Query(False, description="Case sensitive search")

    # Filter parameters
    FILE_TYPE_CODES: Optional[List[str]] = Query(
        None, description="Filter by file type codes (pdf, jpeg, png, etc.)"
    )
    DIRECTORY_IDS: Optional[List[str]] = Query(
        None, description="Filter by directory UUIDs"
    )
    CONTENT_TYPES: Optional[List[str]] = Query(
        None, description="Filter by content types"
    )

    # Size filters
    SIZE_MIN: Optional[int] = Query(
        None, ge=0, description="Minimum file size in bytes"
    )
    SIZE_MAX: Optional[int] = Query(
        None, ge=0, description="Maximum file size in bytes"
    )

    # Date filters
    DATE_FROM: Optional[datetime] = Query(
        None, description="Filter files created after this date"
    )
    DATE_TO: Optional[datetime] = Query(
        None, description="Filter files created before this date"
    )

    # Sorting
    SORT_FIELD: SortField = Query(SortField.CREATED_AT, description="Field to sort by")
    SORT_ORDER: SortOrder = Query(SortOrder.DESC, description="Sort order: asc or desc")

    # Pagination
    LIMIT: int = Query(100, ge=1, le=1000, description="Maximum results to return")
    OFFSET: int = Query(0, ge=0, description="Number of results to skip")

    # Response options
    INCLUDE_METADATA: bool = Query(
        False, description="Include file metadata in response"
    )
    INCLUDE_URLS: bool = Query(False, description="Include file URLs in response")
    INCLUDE_STATS: bool = Query(True, description="Include search statistics")

    # Upload parameters
    UPLOAD_FILE: UploadFile
    DESCRIPTION: Optional[str]

    # Type limits
    TYPES_LIMIT: int = Query(100, ge=1, le=1000, description="Maximum types to return")
    TYPES_OFFSET: int = Query(0, ge=0, description="Types to skip")

    # Folder limits
    FOLDERS_LIMIT: int = Query(
        100, ge=1, le=1000, description="Maximum folders to return"
    )
    FOLDERS_OFFSET: int = Query(0, ge=0, description="Folders to skip")

    @abstractmethod
    async def create_file(
        self,
        filename: str,
        content: Union[bytes, BinaryIO],
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, Any]] = None,
        upload_path: Optional[str] = None,
    ) -> FileResponse:
        """Create a new file record and upload to S3"""
        pass

    @abstractmethod
    async def get_file_by_id(self, file_id: UUID) -> FileResponse:
        """Get file by database ID"""
        pass

    @abstractmethod
    async def search_files(
        self, query: Dict[str, Any], include_stats: bool = True
    ) -> FileSearchResponse:
        """Comprehensive file search with all filtering capabilities"""
        pass

    @abstractmethod
    async def get_file_types(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get available file types and counts with pagination"""
        pass

    @abstractmethod
    async def get_folder_structure(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get folder structure with pagination and proper labeling"""
        pass

    @abstractmethod
    async def get_file_type_categories(self) -> List[str]:
        """Get all unique file type categories from the database"""
        pass

    @abstractmethod
    async def get_file_analytics(
        self,
        file_type: Optional[str] = None,
        folder: Optional[str] = None,
        size_range: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Get comprehensive file analytics with filtering and time-based grouping"""
        pass

    @abstractmethod
    async def delete_file(self, s3_key: str) -> Dict[str, Any]:
        """Delete file from S3 and database"""
        pass
