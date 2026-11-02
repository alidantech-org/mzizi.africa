"""
S3 Operations Builder - Replaces json/s3_data.py functionality
"""

from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional


class S3OperationsBuilder:
    """Builds S3 operations data structures"""

    @staticmethod
    def build_content_disposition(final_filename: str) -> str:
        """Build content disposition header"""
        return f'inline; filename="{final_filename}"'

    @staticmethod
    def build_upload_request(
        s3_key: str,
        content_bytes: bytes,
        content_type: str,
        metadata: Dict[str, Any],
        content_disposition: str,
    ) -> Dict[str, Any]:
        """Build S3 upload request data"""
        return {
            "file_content": content_bytes,
            "s3_key": s3_key,
            "content_type": content_type,
            "metadata": metadata,
            "content_disposition": content_disposition,
        }

    @staticmethod
    def build_delete_result(
        s3_key: str,
        s3_deleted: bool,
        db_deleted: bool,
        error_message: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Build S3 delete result"""
        result = {
            "s3_key": s3_key,
            "s3_deleted": s3_deleted,
            "db_deleted": db_deleted,
            "success": s3_deleted or db_deleted,
        }

        if error_message:
            result["error"] = error_message

        return result


class S3PathBuilder:
    """Builds S3 path structures"""

    @staticmethod
    def build_upload_path(
        upload_path: str, file_type: str, filename: str
    ) -> tuple[str, str]:
        """Build upload path and return both folder path and s3 key"""
        folder_path = ""
        if upload_path == "assets":
            folder_path = f"assets/{file_type}"
        else:
           # Get current date
            now = datetime.now()
            year = now.strftime("%Y")
            month = now.strftime("%m")
            day = now.strftime("%d")
            # Build folder path
            folder_path = f"input/uploads/{file_type}/{year}/{month}/{day}"

        s3_key = f"{folder_path}/{filename}"
        return folder_path, s3_key


class S3MetadataBuilder:
    """Builds S3 metadata structures"""

    @staticmethod
    def sanitize_metadata_for_s3(metadata: Dict[str, Any]) -> Dict[str, str]:
        """Sanitize metadata to ensure only ASCII characters for S3 compatibility"""
        sanitized = {}

        for key, value in metadata.items():
            if value is None:
                continue

            # Convert to string if not already
            str_value = str(value)

            # Remove non-ASCII characters and normalize
            # Option 1: Remove non-ASCII completely
            ascii_value = str_value.encode("ascii", errors="ignore").decode("ascii")

            # Option 2: Replace with safe alternatives (preserve some info)
            # ascii_value = unicodedata.normalize('NFKD', str_value).encode('ascii', 'ignore').decode('ascii')

            # Ensure metadata values are not too long (S3 limit is 2KB per metadata set)
            if len(ascii_value) > 1000:  # Conservative limit per value
                ascii_value = ascii_value[:1000] + "..."

            sanitized[key] = ascii_value

        return sanitized

    @staticmethod
    def build_file_metadata(
        original_filename: str,
        detected_file_type: str,
        detected_extension: str,
        upload_month_year: str,
        user_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Build comprehensive file metadata for S3"""
        metadata = {
            "original_filename": original_filename,
            "detected_file_type": detected_file_type,
            "detected_extension": detected_extension,
            "upload_month_year": upload_month_year,
            "upload_timestamp": str(Path(upload_month_year)),
        }

        if user_metadata:
            metadata.update(user_metadata)

        # Sanitize metadata for S3 ASCII compatibility
        return S3MetadataBuilder.sanitize_metadata_for_s3(metadata)
