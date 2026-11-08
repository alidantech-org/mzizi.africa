"""
Upload Response Models
Response models for file upload operations
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel
from .file import FileResponse


class FileUploadResponse(BaseModel):
    """Response model for file upload operations"""
    
    file: FileResponse
    
    class Config:
        from_attributes = True


class FileDeleteResponse(BaseModel):
    """Response model for file delete operations"""
    
    success: bool
    message: str
    deleted_file: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True
