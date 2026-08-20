"""
Exceptions Module
Custom exception classes and global handlers for the application
"""

from .handlers import (
    BaseCustomException,
    ValidationErrorException,
    DatabaseException,
    S3Exception,
    FileOperationException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    GlobalExceptionHandler,
    setup_exception_handlers
)

__all__ = [
    "BaseCustomException",
    "ValidationErrorException", 
    "DatabaseException",
    "S3Exception",
    "FileOperationException",
    "NotFoundException",
    "UnauthorizedException",
    "ForbiddenException",
    "GlobalExceptionHandler",
    "setup_exception_handlers"
]
