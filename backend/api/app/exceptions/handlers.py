"""
Global Exception Handlers
Centralized error handling for the FastAPI application
"""

import logging
import traceback
from typing import Union, Any, Dict
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, OperationalError
from botocore.exceptions import ClientError, NoCredentialsError
from uuid import UUID


logger = logging.getLogger(__name__)


class BaseCustomException(Exception):
    """Base class for custom application exceptions"""
    
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_ERROR",
        details: Dict[str, Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationErrorException(BaseCustomException):
    """Custom validation error"""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="VALIDATION_ERROR",
            details=details
        )


class DatabaseException(BaseCustomException):
    """Database operation errors"""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="DATABASE_ERROR",
            details=details
        )


class S3Exception(BaseCustomException):
    """S3 storage operation errors"""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="STORAGE_ERROR",
            details=details
        )


class FileOperationException(BaseCustomException):
    """File operation errors"""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="FILE_OPERATION_ERROR",
            details=details
        )


class NotFoundException(BaseCustomException):
    """Resource not found errors"""
    
    def __init__(self, message: str, resource_type: str = None, resource_id: Union[str, UUID] = None):
        details = {}
        if resource_type:
            details["resource_type"] = resource_type
        if resource_id:
            details["resource_id"] = str(resource_id)
            
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
            details=details
        )


class UnauthorizedException(BaseCustomException):
    """Authorization errors"""
    
    def __init__(self, message: str = "Unauthorized access", details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="UNAUTHORIZED",
            details=details
        )


class ForbiddenException(BaseCustomException):
    """Permission denied errors"""
    
    def __init__(self, message: str = "Access forbidden", details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="FORBIDDEN",
            details=details
        )


class GlobalExceptionHandler:
    """Global exception handler class following FastAPI patterns"""
    
    @staticmethod
    def create_error_response(
        status_code: int,
        error_code: str,
        message: str,
        details: Dict[str, Any] = None,
        request_id: str = None
    ) -> JSONResponse:
        """Create standardized error response"""
        
        error_response = {
            "error": {
                "code": error_code,
                "message": message,
                "status_code": status_code,
                "details": details or {},
                "timestamp": "2026-03-17T07:18:00Z"  # This should be dynamic in production
            }
        }
        
        if request_id:
            error_response["error"]["request_id"] = request_id
            
        return JSONResponse(
            status_code=status_code,
            content=error_response
        )
    
    @staticmethod
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """Handle HTTP exceptions"""
        return GlobalExceptionHandler.create_error_response(
            status_code=exc.status_code,
            error_code="HTTP_ERROR",
            message=exc.detail,
            details={"path": str(request.url.path)}
        )
    
    @staticmethod
    async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        """Handle Starlette HTTP exceptions"""
        return GlobalExceptionHandler.create_error_response(
            status_code=exc.status_code,
            error_code="HTTP_ERROR",
            message=exc.detail,
            details={"path": str(request.url.path)}
        )
    
    @staticmethod
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Handle FastAPI request validation errors"""
        errors = []
        for error in exc.errors():
            errors.append({
                "field": ".".join(str(x) for x in error["loc"]),
                "message": error["msg"],
                "type": error["type"]
            })
        
        return GlobalExceptionHandler.create_error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            message="Request validation failed",
            details={"validation_errors": errors}
        )
    
    @staticmethod
    async def pydantic_validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
        """Handle Pydantic model validation errors"""
        errors = []
        for error in exc.errors():
            errors.append({
                "field": ".".join(str(x) for x in error["loc"]),
                "message": error["msg"],
                "type": error["type"]
            })
        
        return GlobalExceptionHandler.create_error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="MODEL_VALIDATION_ERROR",
            message="Model validation failed",
            details={"validation_errors": errors}
        )
    
    @staticmethod
    async def database_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        """Handle database-related exceptions"""
        logger.error(f"Database error: {exc}")
        logger.error(traceback.format_exc())
        
        # Handle specific database errors
        if isinstance(exc, IntegrityError):
            return GlobalExceptionHandler.create_error_response(
                status_code=status.HTTP_409_CONFLICT,
                error_code="INTEGRITY_ERROR",
                message="Database integrity constraint violation",
                details={"original_error": str(exc.orig) if hasattr(exc, 'orig') else None}
            )
        elif isinstance(exc, OperationalError):
            return GlobalExceptionHandler.create_error_response(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                error_code="DATABASE_OPERATIONAL_ERROR",
                message="Database operation failed",
                details={"original_error": str(exc.orig) if hasattr(exc, 'orig') else None}
            )
        else:
            return GlobalExceptionHandler.create_error_response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                error_code="DATABASE_ERROR",
                message="Database operation failed",
                details={"error_type": type(exc).__name__}
            )
    
    @staticmethod
    async def s3_exception_handler(request: Request, exc: ClientError) -> JSONResponse:
        """Handle S3/Boto3 client errors"""
        logger.error(f"S3 error: {exc}")
        
        error_code = exc.response.get("Error", {}).get("Code", "S3_ERROR")
        error_message = exc.response.get("Error", {}).get("Message", "S3 operation failed")
        
        # Map common S3 errors to HTTP status codes
        status_code_map = {
            "NoSuchKey": status.HTTP_404_NOT_FOUND,
            "AccessDenied": status.HTTP_403_FORBIDDEN,
            "NoSuchBucket": status.HTTP_404_NOT_FOUND,
            "BucketAlreadyExists": status.HTTP_409_CONFLICT,
            "InvalidBucketName": status.HTTP_400_BAD_REQUEST,
            "AllAccessDisabled": status.HTTP_403_FORBIDDEN,
        }
        
        http_status = status_code_map.get(error_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return GlobalExceptionHandler.create_error_response(
            status_code=http_status,
            error_code="S3_ERROR",
            message=f"S3 error: {error_message}",
            details={
                "s3_error_code": error_code,
                "aws_request_id": exc.response.get("RequestId"),
                "region": exc.response.get("Region")
            }
        )
    
    @staticmethod
    async def s3_credentials_handler(request: Request, exc: NoCredentialsError) -> JSONResponse:
        """Handle S3 credentials errors"""
        logger.error(f"S3 credentials error: {exc}")
        
        return GlobalExceptionHandler.create_error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="S3_CREDENTIALS_ERROR",
            message="S3 credentials not configured",
            details={"error": str(exc)}
        )
    
    @staticmethod
    async def custom_exception_handler(request: Request, exc: BaseCustomException) -> JSONResponse:
        """Handle custom application exceptions"""
        logger.error(f"Custom exception: {exc.error_code} - {exc.message}")
        
        return GlobalExceptionHandler.create_error_response(
            status_code=exc.status_code,
            error_code=exc.error_code,
            message=exc.message,
            details=exc.details
        )
    
    @staticmethod
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle all other unhandled exceptions"""
        logger.error(f"Unhandled exception: {type(exc).__name__}: {exc}")
        logger.error(traceback.format_exc())
        
        # In production, don't expose internal error details
        message = "An internal server error occurred"
        
        return GlobalExceptionHandler.create_error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="INTERNAL_SERVER_ERROR",
            message=message,
            details={"error_type": type(exc).__name__}
        )


def setup_exception_handlers(app) -> None:
    """Register all exception handlers with the FastAPI app"""
    
    # HTTP exceptions
    app.add_exception_handler(HTTPException, GlobalExceptionHandler.http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, GlobalExceptionHandler.starlette_http_exception_handler)
    
    # Validation exceptions
    app.add_exception_handler(RequestValidationError, GlobalExceptionHandler.validation_exception_handler)
    app.add_exception_handler(ValidationError, GlobalExceptionHandler.pydantic_validation_exception_handler)
    
    # Database exceptions
    app.add_exception_handler(SQLAlchemyError, GlobalExceptionHandler.database_exception_handler)
    app.add_exception_handler(IntegrityError, GlobalExceptionHandler.database_exception_handler)
    app.add_exception_handler(OperationalError, GlobalExceptionHandler.database_exception_handler)
    
    # S3/Storage exceptions
    app.add_exception_handler(ClientError, GlobalExceptionHandler.s3_exception_handler)
    app.add_exception_handler(NoCredentialsError, GlobalExceptionHandler.s3_credentials_handler)
    
    # Custom application exceptions
    app.add_exception_handler(BaseCustomException, GlobalExceptionHandler.custom_exception_handler)
    
    # Generic exception handler (must be last)
    app.add_exception_handler(Exception, GlobalExceptionHandler.generic_exception_handler)
