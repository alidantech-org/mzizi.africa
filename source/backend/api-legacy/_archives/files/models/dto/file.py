"""
File Schemas - Pydantic models for file validation and serialization
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID


class FileBase(BaseModel):
    """Base file schema"""

    filename: str = Field(..., description="Original filename")
    s3_key: str = Field(..., description="S3 key for the file")
    s3_bucket: str = Field(..., description="S3 bucket name")
    directory_id: UUID = Field(..., description="Directory ID")
    file_type_code: str = Field(..., description="File type code")
    size_bytes: int = Field(..., description="File size in bytes")
    checksum: str = Field(..., description="SHA-256 checksum")
    status: str = Field("uploaded", description="File processing status")
    file_metadata: Optional[Dict[str, Any]] = Field(
        None, description="Additional metadata"
    )


class FileCreate(FileBase):
    """File creation schema"""

    public_url: Optional[str] = Field(None, description="Public URL")


class FileUpdate(BaseModel):
    """File update schema"""

    filename: Optional[str] = None
    directory_id: Optional[int] = None
    file_type_id: Optional[int] = None
    size_bytes: Optional[int] = None
    public_url: Optional[str] = None
    file_metadata: Optional[Dict[str, Any]] = None


class FileResponse(FileBase):
    """File response schema"""

    id: UUID
    public_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Include directory and file type information
    directory_path: Optional[str] = None
    mime_type: Optional[str] = None

    class Config:
        from_attributes = True


class FileUploadRequest(BaseModel):
    """File upload request schema"""

    description: Optional[str] = Field(None, description="Optional file description")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class FileBulkUploadRequest(BaseModel):
    """Bulk file upload request schema"""

    description: Optional[str] = Field(
        None, description="Optional description for all files"
    )
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class FileSearchRequest(BaseModel):
    """File search request schema"""

    query: str = Field(..., min_length=2, description="Search query for filename")
    file_type: Optional[str] = Field(None, description="Filter by file type")
    limit: int = Field(50, ge=1, le=200, description="Maximum results to return")


class FileStatsResponse(BaseModel):
    """File statistics response schema"""

    total_files: int
    files_by_type: List[Dict[str, Any]]
    files_by_folder: List[Dict[str, Any]]


class FileTypeStats(BaseModel):
    """File type statistics"""

    type: str
    count: int
    description: str


class FolderStats(BaseModel):
    """Folder statistics"""

    path: str
    file_count: int
    files: List[str]


class FileListResponse(BaseModel):
    """File list response schema"""

    success: bool
    data: List[FileResponse]
    pagination: Dict[str, Any]
    filters: Dict[str, Any]


class FileDeleteResponse(BaseModel):
    """File delete response schema"""

    success: bool
    message: str
