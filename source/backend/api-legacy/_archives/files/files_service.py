"""
File Service - Business logic for file operations
"""

import hashlib
import logging
import time
from pathlib import Path
from typing import Dict, Any, List, Optional, Union, BinaryIO
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.config.s3_service import s3_service
from app.config.redis import redis_manager
from app.config.config import settings
from .helpers.filename_sanitizer import FilenameSanitizer
from .helpers.file_type_detector import FileTypeDetector
from .helpers.analytics_helper import AnalyticsHelper
from app.routes.files.files_interface import FileInterface
from app.routes.files.repositories.files_repository import FileRepository
from app.routes.files.repositories.directory_repository import DirectoryRepository
from app.routes.files.repositories.file_type_repository import FileTypeRepository
from app.routes.files.models.dto.file import FileResponse
from app.routes.files.models.dto.search import FileSearchResponse
from .builders.response_builders import (
    SearchResponseBuilder,
    FileTypeResponseBuilder,
    FolderResponseBuilder,
    DeleteResponseBuilder,
)
from .builders.s3_builders import S3OperationsBuilder, S3PathBuilder, S3MetadataBuilder
from app.exceptions import FileOperationException, DatabaseException, S3Exception


# Cache configuration constants
CACHE_TTL = {
    "SEARCH_RESULTS": 300,  # 5 minutes - searches are dynamic
    "FILE_CATEGORIES": 1800,  # 30 minutes - categories change rarely
    "FILE_TYPES": 1800,  # 30 minutes - file types change rarely
    "ANALYTICS": 900,  # 15 minutes - analytics are expensive but should be fresh
    "FOLDERS": 600,  # 10 minutes - folder structure changes moderately
}

CACHE_KEYS = {
    "FILE_CATEGORIES": "file_type_categories",
    "FILE_TYPES_PREFIX": "file_types_by_category:",
    "SEARCH_PREFIX": "file_search:",
    "ANALYTICS_PREFIX": "file_analytics:",
    "FOLDERS_PREFIX": "folder_structure:",
}


class FileService(FileInterface):
    """Service for file operations business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.repository = FileRepository(db)
        self.directory_repository = DirectoryRepository(db)
        self.file_type_repository = FileTypeRepository(db)
        self.s3_service = s3_service
        self.filename_sanitizer = FilenameSanitizer()
        self.logger = logging.getLogger(__name__)

    def _convert_uuid_strings_to_objects(self, data: Dict[str, Any]):
        """Convert UUID strings in cached data back to UUID objects"""
        AnalyticsHelper.convert_uuid_strings_to_objects(data)

    def _clear_file_cache(
        self, cache_type: Optional[str] = None, pattern: Optional[str] = None
    ):
        """
        Clear file-related cache entries with optional selective clearing

        Args:
            cache_type: Specific cache type to clear (search, categories, types, analytics, folders, all)
            pattern: Custom pattern for selective cache clearing
        """
        try:
            keys_to_delete = []

            if cache_type == "all" or not cache_type:
                # Clear all file-related caches
                keys_to_delete.extend(
                    [
                        CACHE_KEYS["FILE_CATEGORIES"],
                        f"{CACHE_KEYS['SEARCH_PREFIX']}*",
                        f"{CACHE_KEYS['FILE_TYPES_PREFIX']}*",
                        f"{CACHE_KEYS['ANALYTICS_PREFIX']}*",
                        f"{CACHE_KEYS['FOLDERS_PREFIX']}*",
                    ]
                )
            elif cache_type == "search":
                keys_to_delete.append(f"{CACHE_KEYS['SEARCH_PREFIX']}*")
            elif cache_type == "categories":
                keys_to_delete.append(CACHE_KEYS["FILE_CATEGORIES"])
            elif cache_type == "types":
                keys_to_delete.append(f"{CACHE_KEYS['FILE_TYPES_PREFIX']}*")
            elif cache_type == "analytics":
                keys_to_delete.append(f"{CACHE_KEYS['ANALYTICS_PREFIX']}*")
            elif cache_type == "folders":
                keys_to_delete.append(f"{CACHE_KEYS['FOLDERS_PREFIX']}*")

            # Add custom pattern if provided
            if pattern:
                keys_to_delete.append(pattern)

            # Delete keys (handle patterns differently)
            for key in keys_to_delete:
                if "*" in key:
                    # For pattern keys, we need to scan and delete matching keys
                    try:
                        matching_keys = redis_manager.client.scan_iter(
                            match=key.replace("*", "*")
                        )
                        if matching_keys:
                            redis_manager.client.delete(*matching_keys)
                            self.logger.info(
                                f"Cleared {len(matching_keys)} cache keys matching pattern: {key}"
                            )
                    except Exception as e:
                        self.logger.warning(f"Failed to clear pattern {key}: {e}")
                else:
                    # For exact keys, delete directly
                    redis_manager.delete(key)
                    self.logger.info(f"Cleared cache key: {key}")

            self.logger.info(
                f"Cache cleared successfully for type: {cache_type or 'all'}"
            )

        except Exception as e:
            self.logger.warning(f"Failed to clear cache: {e}")

    def _get_cached_data(self, cache_key: str, refresh: bool = False) -> Optional[str]:
        """
        Get cached data with optional refresh bypass

        Args:
            cache_key: The cache key to retrieve
            refresh: If True, bypasses cache and forces fresh data

        Returns:
            Cached data or None if not found/refresh requested
        """
        if refresh:
            self.logger.info(f"Refresh requested, bypassing cache for key: {cache_key}")
            return None

        return redis_manager.get(cache_key)

    def _set_cached_data(self, cache_key: str, data: str, ttl: int) -> None:
        """
        Set cached data with specified TTL

        Args:
            cache_key: The cache key to set
            data: The data to cache (should be JSON string)
            ttl: Time to live in seconds
        """
        try:
            redis_manager.set(cache_key, data, ttl=ttl)
            self.logger.info(f"Cached data for key: {cache_key} (TTL: {ttl}s)")
        except Exception as e:
            self.logger.warning(f"Failed to cache data for key {cache_key}: {e}")

    async def create_file(
        self,
        filename: str,
        content: Union[bytes, BinaryIO],
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, Any]] = None,
        upload_path: Optional[str] = None,
    ) -> FileResponse:
        """Create a new file record and upload to S3"""
        try:
            # Convert content to bytes if needed
            if isinstance(content, str):
                content_bytes = content.encode("utf-8")
            elif hasattr(content, "read"):
                content_bytes = content.read()
            else:
                content_bytes = content

            # Detect file type and extension from content
            detected_file_type, detected_extension = (
                FileTypeDetector.detect_from_content(content_bytes, filename)
            )

            # Generate filename with proper extension handling
            path = Path(filename)
            base_name = path.stem
            original_extension = path.suffix.lstrip(".")

            if not base_name:
                base_name = f"file_{hashlib.md5(content_bytes).hexdigest()[:8]}"

            sanitized_base_name = self.filename_sanitizer.sanitize(base_name)

            # Use original extension if it exists to avoid double extensions
            # Only use detected extension if original doesn't exist
            if original_extension:
                final_filename = f"{sanitized_base_name}.{original_extension}"
            else:
                final_filename = f"{sanitized_base_name}.{detected_extension}"

            folder_path, s3_key = S3PathBuilder.build_upload_path(
                upload_path=upload_path,
                file_type=detected_file_type,
                filename=final_filename,
            )

            directory = await self.directory_repository.get_or_create_path(folder_path)

            # Get or create file type
            file_type_obj = await self.file_type_repository.get_or_create_by_mime_type(
                content_type, detected_extension
            )

            # Calculate checksum
            checksum = hashlib.sha256(content_bytes).hexdigest()

            # Prepare metadata
            enhanced_metadata = {
                "original_filename": filename,
                "detected_file_type": detected_file_type,
                "detected_extension": detected_extension,
                **(metadata or {}),
            }

            # Sanitize metadata for S3 ASCII compatibility
            sanitized_metadata = S3MetadataBuilder.sanitize_metadata_for_s3(
                enhanced_metadata
            )

            # Build upload request
            upload_request = S3OperationsBuilder.build_upload_request(
                s3_key=s3_key,
                content_bytes=content_bytes,
                content_type=content_type,
                metadata=sanitized_metadata,
                content_disposition=S3OperationsBuilder.build_content_disposition(
                    final_filename
                ),
            )

            # Upload to S3
            upload_success = self.s3_service.upload_file(**upload_request)

            if not upload_success:
                raise Exception("Failed to upload file to S3")

            # Generate URLs
            public_url = self.s3_service.get_public_url(s3_key)

            # Create file record
            file_data = {
                "filename": final_filename,
                "s3_key": s3_key,
                "s3_bucket": settings.s3_files_bucket,
                "directory_id": directory.id,
                "file_type_code": file_type_obj.code,
                "size_bytes": len(content_bytes),
                "public_url": public_url,
                "checksum": checksum,
                "file_metadata": enhanced_metadata,
                "status": "uploaded",
            }

            created_file = await self.repository.upsert(file_data)

            # Schedule background task to update folder statistics
            try:
                from .utils.background_tasks import schedule_background_task

                schedule_background_task(
                    self._update_folder_statistics_background, directory.id
                )
            except ImportError:
                # Fallback if background tasks module not available
                self.logger.warning(
                    "Background tasks module not available, skipping folder statistics update"
                )
            except Exception as e:
                self.logger.warning(f"Failed to schedule folder statistics update: {e}")

            # Clear cache after file creation
            self._clear_file_cache(cache_type="all")

            return FileResponse.from_orm(created_file)

        except Exception as e:
            self.logger.error(f"Failed to create file {filename}: {e}")
            # Use appropriate custom exception based on error type
            if "database" in str(e).lower() or "constraint" in str(e).lower():
                raise DatabaseException(f"Database error while creating file: {str(e)}")
            elif "s3" in str(e).lower() or "storage" in str(e).lower():
                raise S3Exception(f"Storage error while uploading file: {str(e)}")
            else:
                raise FileOperationException(
                    f"Failed to create file {filename}: {str(e)}"
                )

    async def get_file_by_id(self, file_id: UUID) -> FileResponse:
        """Get file by database ID"""
        file = await self.repository.get_by_id(file_id)
        return FileResponse.from_orm(file) if file else None

    async def search_files(
        self, query: Dict[str, Any], include_stats: bool = True, refresh: bool = False
    ) -> FileSearchResponse:
        """Comprehensive file search with all filtering capabilities and Redis caching"""
        start_time = time.time()

        # Create a cache key based on the query parameters
        import json
        import hashlib

        query_str = json.dumps(query, sort_keys=True)
        query_hash = hashlib.md5(query_str.encode()).hexdigest()
        cache_key = f"{CACHE_KEYS['SEARCH_PREFIX']}{query_hash}"

        try:
            # Try to get from cache first (with refresh bypass)
            cached_result = self._get_cached_data(cache_key, refresh=refresh)
            if cached_result:
                self.logger.info("Retrieved file search results from cache")
                # Parse cached JSON back to response
                cached_data = json.loads(cached_result)
                # Convert UUID strings back to UUID objects for Pydantic model
                self._convert_uuid_strings_to_objects(cached_data)
                return FileSearchResponse(**cached_data)

            # Handle category filtering by converting to file type codes
            filters = query.get("filters", {})
            if "category" in filters and filters["category"]:
                category = filters["category"]
                # Get file type codes for this category
                file_type_codes = await self.get_file_types_by_category(category)

                # Add file type codes filter and remove category filter
                filters["file_type_codes"] = file_type_codes
                del filters["category"]

                # Update the query with modified filters
                query["filters"] = filters

            # Execute search
            files = await self.repository.advanced_search(query)
            total = await self.repository.advanced_search_count(query)
            stats = {}

            # Calculate search time
            search_time_ms = (time.time() - start_time) * 1000

            # Extract pagination info
            pagination = query.get("pagination", {})
            limit = pagination.get("limit", 100)
            offset = pagination.get("offset", 0)
            filters = query.get("filters", {})

            # Get statistics if requested

            # Build response using response builder
            response_data = SearchResponseBuilder.build_search_response(
                files=files,
                total=total,
                limit=limit,
                offset=offset,
                search_time_ms=search_time_ms,
                filters=filters,
                include_stats=include_stats,
                stats=stats,
            )

            # Create response object
            search_response = FileSearchResponse(**response_data)

            # Convert UUID objects to strings for JSON serialization
            response_data_json = json.dumps(response_data, default=str)

            # Cache the result using new cache function
            self._set_cached_data(
                cache_key, response_data_json, CACHE_TTL["SEARCH_RESULTS"]
            )
            self.logger.info("Fetched file search results from database and cached")

            return search_response

        except Exception as e:
            self.logger.error(f"Search failed: {e}")
            raise

    async def get_file_types(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get available file types and counts with pagination and filtering"""
        file_types_result = await self.file_type_repository.get_all(
            limit=limit, offset=offset, filters=filters
        )

        # Extract the items from the paginated result
        file_types = file_types_result.get("items", [])
        total = file_types_result.get("pagination", {}).get("total", 0)

        # Build response using response builder
        return FileTypeResponseBuilder.build_file_type_response(
            file_types=file_types, total=total, limit=limit, offset=offset
        )

    async def get_folder_structure(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get folder structure with pagination and proper labeling"""
        folders_result = await self.directory_repository.get_all(
            limit=limit, offset=offset, filters=filters
        )

        # Extract the items from the paginated result
        folders = folders_result.get("items", [])
        total = folders_result.get("pagination", {}).get("total", 0)

        # Build response using response builder
        return FolderResponseBuilder.build_folder_response(
            folders=folders, total=total, limit=limit, offset=offset
        )

    async def get_file_type_categories(self, refresh: bool = False) -> List[str]:
        """Get all unique file type categories from the database with Redis caching"""
        cache_key = CACHE_KEYS["FILE_CATEGORIES"]

        try:
            # Try to get from cache first (with refresh bypass)
            cached_categories = self._get_cached_data(cache_key, refresh=refresh)
            if cached_categories:
                self.logger.info("Retrieved file type categories from cache")
                # Parse cached JSON back to list
                import json

                return json.loads(cached_categories)

            # Cache miss - fetch from database
            categories = await self.file_type_repository.get_all_categories()

            # Cache the result using new cache function
            import json

            self._set_cached_data(
                cache_key, json.dumps(categories), CACHE_TTL["FILE_CATEGORIES"]
            )
            self.logger.info("Fetched file type categories from database and cached")

            return categories

        except Exception as e:
            self.logger.error(f"Failed to get file type categories: {e}")
            raise DatabaseException(
                f"Database error while fetching categories: {str(e)}"
            )

    async def get_file_types_by_category(
        self, category: str, refresh: bool = False
    ) -> List[str]:
        """Get all file type codes belonging to a specific category with Redis caching"""
        cache_key = f"{CACHE_KEYS['FILE_TYPES_PREFIX']}{category}"

        try:
            # Try to get from cache first (with refresh bypass)
            cached_file_types = self._get_cached_data(cache_key, refresh=refresh)
            if cached_file_types:
                self.logger.info(
                    f"Retrieved file types for category '{category}' from cache"
                )
                # Parse cached JSON back to list
                import json

                return json.loads(cached_file_types)

            # Cache miss - fetch from database
            file_types = await self.file_type_repository.get_codes_by_category(category)

            # Cache the result using new cache function
            import json

            self._set_cached_data(
                cache_key, json.dumps(file_types), CACHE_TTL["FILE_TYPES"]
            )
            self.logger.info(
                f"Fetched file types for category '{category}' from database and cached"
            )

            return file_types

        except Exception as e:
            self.logger.error(f"Failed to get file types by category {category}: {e}")
            raise DatabaseException(
                f"Database error while fetching file types by category: {str(e)}"
            )

    async def delete_file(self, s3_key: str) -> Dict[str, Any]:
        """Delete file from S3 and database"""
        try:
            # Get the file before deletion to get directory info
            file = await self.repository.get_by_s3_key(s3_key)
            directory_id = file.directory_id if file else None

            # Delete from S3
            s3_deleted = self.s3_service.delete_file(s3_key)
            if not s3_deleted:
                self.logger.warning(f"Failed to delete file from S3: {s3_key}")

            # Delete from database
            db_deleted = await self.repository.delete_by_s3_key(s3_key)
            if not db_deleted:
                self.logger.warning(
                    f"Failed to delete file record from database: {s3_key}"
                )

            success = s3_deleted or db_deleted
            if success:
                self.logger.info(f"Deleted file: {s3_key}")

                # Clear cache after file deletion
                self._clear_file_cache()

                # Clean up empty directories if file was deleted successfully
                if directory_id and db_deleted:
                    try:
                        deleted_directories = (
                            await self.directory_repository.cleanup_empty_directories(
                                directory_id
                            )
                        )
                        if deleted_directories:
                            self.logger.info(
                                f"Cleaned up {len(deleted_directories)} empty directories"
                            )
                    except Exception as cleanup_error:
                        self.logger.warning(
                            f"Failed to cleanup empty directories: {cleanup_error}"
                        )

            # Build response using response builder
            return DeleteResponseBuilder.build_delete_response(
                s3_key=s3_key, s3_deleted=s3_deleted, db_deleted=db_deleted
            )

        except Exception as e:
            self.logger.error(f"Failed to delete file {s3_key}: {e}")
            return DeleteResponseBuilder.build_delete_response(
                s3_key=s3_key, s3_deleted=False, db_deleted=False, error_message=str(e)
            )

    async def _update_folder_statistics_background(self, directory_id: str) -> None:
        """Background task to update folder statistics"""
        try:
            from .helpers.utils.background_tasks import BackgroundTasks

            background_tasks = BackgroundTasks(self.db)
            await background_tasks.update_folder_statistics(directory_id)
        except Exception as e:
            self.logger.error(f"Background folder statistics update failed: {e}")

    async def _update_folder_statistics_sync(self, directory_id: str) -> None:
        """Synchronous update of folder statistics (fallback)"""
        try:
            from .repositories.directory_repository import DirectoryRepository

            dir_repo = DirectoryRepository(self.db)
            await dir_repo.update_statistics_for_directory(directory_id)
        except Exception as e:
            self.logger.error(f"Sync folder statistics update failed: {e}")

    async def get_file_analytics(
        self,
        file_type: Optional[str] = None,
        folder: Optional[str] = None,
        size_range: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        refresh: bool = False,
    ) -> Dict[str, Any]:
        """Get comprehensive file analytics with filtering and time-based grouping"""
        cache_key = f"{CACHE_KEYS['ANALYTICS_PREFIX']}{AnalyticsHelper.build_cache_key(
            file_type, folder, size_range, date_from, date_to
        )}"

        try:
            # Try cache first (with refresh bypass)
            cached_result = self._get_cached_data(cache_key, refresh=refresh)
            if cached_result:
                self.logger.info("Retrieved file analytics from cache")
                import json

                cached_data = json.loads(cached_result)
                self._convert_uuid_strings_to_objects(cached_data)
                return cached_data

            filters = {}

            # Apply filters
            if file_type and file_type != "all":
                # Get file type codes for this category
                file_type_codes = await self.get_file_types_by_category(file_type)
                filters["file_type_codes"] = file_type_codes

            if folder and folder != "all":
                filters["folder_path"] = folder

            if size_range and size_range != "all":
                size_filters = AnalyticsHelper.parse_size_range(size_range)
                if size_filters:
                    filters["size"] = size_filters

            if date_from or date_to:
                filters["date_range"] = {"from": date_from, "to": date_to}

            # Build base query for analytics
            base_query = {
                "filters": filters,
                "include_metadata": True,
                "include_stats": True,
            }

            # Get analytics data
            analytics_data = await self.repository.get_analytics(base_query)

            # Build comprehensive response using helper
            response = AnalyticsHelper.build_analytics_response(analytics_data)

            # Cache result using new cache function
            import json

            response_json = json.dumps(response, default=str)
            self._set_cached_data(cache_key, response_json, CACHE_TTL["ANALYTICS"])
            self.logger.info("Generated file analytics and cached")

            return response

        except Exception as e:
            self.logger.error(f"Failed to get file analytics: {e}")
            raise DatabaseException(
                f"Database error while fetching analytics: {str(e)}"
            )
