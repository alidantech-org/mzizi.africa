"""
Filename Sanitizer - URL-friendly filename transformation
Handles sanitization of filenames for S3 storage and web access
"""

import re


class FilenameSanitizer:
    """Handles filename sanitization for URL-friendly storage"""

    @staticmethod
    def sanitize(filename: str) -> str:
        """
        Transform filename to be URL-friendly while preserving file extension

        Args:
            filename: Original filename to sanitize

        Returns:
            Sanitized filename suitable for URLs with extension preserved
        """
        # Split filename and extension
        if "." in filename:
            name_part, ext_part = filename.rsplit(".", 1)
        else:
            name_part, ext_part = filename, ""

        # Sanitize the name part (convert to lowercase, replace non-alphanumeric with dashes)
        name_lower = name_part.lower()
        sanitized_name = re.sub(r"[^a-z0-9]", "-", name_lower)
        sanitized_name = re.sub(r"-+", "-", sanitized_name)
        sanitized_name = sanitized_name.strip("-")

        # Limit length of name part
        if len(sanitized_name) > 100:
            sanitized_name = sanitized_name[:100].rstrip("-")

        # Reconstruct filename with extension
        if ext_part:
            return f"{sanitized_name}.{ext_part.lower()}"
        else:
            return sanitized_name

    @staticmethod
    def generate_s3_key(data_type: str, output_folder: str, filename: str) -> str:
        """
        Generate S3 key for file with sanitized filename

        Args:
            data_type: Type of data (pdf, csv, etc.)
            output_folder: Output folder name
            filename: Original filename

        Returns:
            S3 key with sanitized filename
        """
        sanitized_filename = FilenameSanitizer.sanitize(filename)
        return f"{data_type.lower()}/{output_folder.lower()}/{sanitized_filename}"
