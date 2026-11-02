"""
File Type Detector - Detect file types from content and MIME types
"""

import mimetypes
from typing import Optional, Tuple
from pathlib import Path


class FileTypeDetector:
    """Detects file types from content and MIME types"""

    # Common file type mappings
    TYPE_MAPPINGS = {
        # Images
        "image/jpeg": "image",
        "image/png": "image",
        "image/gif": "image",
        "image/webp": "image",
        "image/svg+xml": "image",
        "image/bmp": "image",
        "image/tiff": "image",
        # Documents
        "application/pdf": "pdf",
        "application/msword": "document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
        "application/vnd.ms-excel": "spreadsheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "spreadsheet",
        "application/vnd.ms-powerpoint": "presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "presentation",
        # Text/Code
        "text/plain": "text",
        "text/csv": "csv",
        "text/html": "html",
        "text/css": "css",
        "text/javascript": "javascript",
        "application/json": "json",
        "application/xml": "xml",
        # Archives
        "application/zip": "archive",
        "application/x-rar-compressed": "archive",
        "application/x-7z-compressed": "archive",
        "application/gzip": "archive",
        "application/x-tar": "archive",
        # Audio
        "audio/mpeg": "audio",
        "audio/wav": "audio",
        "audio/ogg": "audio",
        "audio/mp4": "audio",
        # Video
        "video/mp4": "video",
        "video/quicktime": "video",
        "video/x-msvideo": "video",
        "video/webm": "video",
        # Default
        "application/octet-stream": "binary",
    }

    # File extensions that should override content-based detection
    OFFICE_DOCUMENT_EXTENSIONS = {
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "doc": "application/msword",
        "xls": "application/vnd.ms-excel",
        "ppt": "application/vnd.ms-powerpoint",
    }

    @staticmethod
    def detect_from_content(
        content: bytes, filename: Optional[str] = None
    ) -> Tuple[str, str]:
        """
        Detect file type and extension from content

        Args:
            content: File content as bytes
            filename: Optional original filename

        Returns:
            Tuple of (file_type, extension)
        """
        # First try to detect from filename extension - prioritize for office documents
        mime_type = None
        extension = None

        if filename:
            # Get extension from filename
            file_ext = Path(filename).suffix.lower().lstrip(".")

            # Check if it's an office document extension that should override content detection
            if file_ext in FileTypeDetector.OFFICE_DOCUMENT_EXTENSIONS:
                mime_type = FileTypeDetector.OFFICE_DOCUMENT_EXTENSIONS[file_ext]
                extension = file_ext
            else:
                # Use standard MIME type detection for other files
                mime_type, ext = mimetypes.guess_type(filename)
                if ext:
                    extension = ext.lstrip(".")

        # If we couldn't detect from filename or it's not an office doc, try content-based detection
        if not mime_type:
            mime_type = FileTypeDetector._detect_from_content_bytes(content)

        # If still no mime type, try to detect from content patterns
        if not mime_type:
            mime_type = FileTypeDetector._detect_content_pattern(content)

        # Default fallback
        if not mime_type:
            mime_type = "application/octet-stream"

        # Get file type from MIME type
        file_type = FileTypeDetector.TYPE_MAPPINGS.get(mime_type, "binary")

        # Get extension from MIME type if not already determined
        if not extension:
            extension = FileTypeDetector._get_extension_from_mime(mime_type)

        return file_type, extension

    @staticmethod
    def detect_from_mime_type(mime_type: str) -> Tuple[str, str]:
        """
        Detect file type and extension from MIME type


        Args:
            mime_type: MIME type string

        Returns:
            Tuple of (file_type, extension)
        """
        file_type = FileTypeDetector.TYPE_MAPPINGS.get(mime_type, "binary")
        extension = FileTypeDetector._get_extension_from_mime(mime_type)

        return file_type, extension

    @staticmethod
    def _get_extension_from_mime(mime_type: str) -> str:
        """Get file extension from MIME type"""
        mime_extensions = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "image/svg+xml": "svg",
            "image/bmp": "bmp",
            "image/tiff": "tiff",
            "application/pdf": "pdf",
            "application/msword": "doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "application/vnd.ms-excel": "xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
            "application/vnd.ms-powerpoint": "ppt",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
            "text/plain": "txt",
            "text/csv": "csv",
            "text/html": "html",
            "text/css": "css",
            "text/javascript": "js",
            "application/json": "json",
            "application/xml": "xml",
            "application/zip": "zip",
            "application/x-rar-compressed": "rar",
            "application/x-7z-compressed": "7z",
            "application/gzip": "gz",
            "application/x-tar": "tar",
            "audio/mpeg": "mp3",
            "audio/wav": "wav",
            "audio/ogg": "ogg",
            "audio/mp4": "m4a",
            "video/mp4": "mp4",
            "video/quicktime": "mov",
            "video/x-msvideo": "avi",
            "video/webm": "webm",
        }

        return mime_extensions.get(mime_type, "bin")

    @staticmethod
    def _detect_from_content_bytes(content: bytes) -> Optional[str]:
        """Detect MIME type from content bytes using basic patterns"""
        # Check for common file signatures
        if len(content) < 4:
            return None

        # PDF signature
        if content.startswith(b"%PDF"):
            return "application/pdf"

        # PNG signature
        if content.startswith(b"\x89PNG\r\n\x1a\n"):
            return "image/png"

        # JPEG signature
        if content.startswith(b"\xff\xd8\xff"):
            return "image/jpeg"

        # GIF signature
        if content.startswith(b"GIF87a") or content.startswith(b"GIF89a"):
            return "image/gif"

        # ZIP signature (also used for DOCX, XLSX, etc.)
        if content.startswith(b"PK\x03\x04") or content.startswith(b"PK\x05\x06"):
            return "application/zip"

        # MP4 signature
        if content.startswith(b"ftyp") or b"mp4" in content[:12]:
            return "video/mp4"

        return None

    @staticmethod
    def _detect_content_pattern(content: bytes) -> Optional[str]:
        """Detect file type from content patterns"""
        content_str = content[:1024].decode("utf-8", errors="ignore").lower()

        # Check for CSV patterns
        if "," in content_str and "\n" in content_str:
            lines = content_str.split("\n")[:5]
            if len(lines) > 1 and "," in lines[0]:
                # Simple CSV detection
                return "text/csv"

        # Check for HTML
        if "<html" in content_str or "<!doctype html" in content_str:
            return "text/html"

        # Check for JSON
        if content_str.strip().startswith("{") or content_str.strip().startswith("["):
            return "application/json"

        # Check for XML
        if content_str.strip().startswith("<"):
            return "application/xml"

        return None
