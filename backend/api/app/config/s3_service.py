"""
S3 Service Configuration and Client
Handles all S3/MinIO operations with settings configuration
"""

import logging
from typing import Optional, Dict, Any, Union, BinaryIO
from botocore.exceptions import ClientError
from botocore.config import Config
import tempfile
from pathlib import Path

from app.config.config import settings

logger = logging.getLogger(__name__)


class S3Service:
    """S3 service for all file operations"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.client = self._create_client()

    def _create_client(self):
        """Create S3 client with configuration"""
        try:
            import boto3

            config = Config(
                signature_version="s3v4",
                s3={"addressing_style": "path"},
                max_pool_connections=50,
                retries={"max_attempts": 3, "mode": "adaptive"},
            )

            client = boto3.client(
                "s3",
                endpoint_url=settings.s3_endpoint,
                aws_access_key_id=settings.s3_access_key,
                aws_secret_access_key=settings.s3_secret_key,
                region_name="us-east-1",
                config=config,
            )
            self.logger.info(f"S3 client created for endpoint: {settings.s3_endpoint}")
            return client
        except Exception as e:
            self.logger.error(f"Failed to create S3 client: {e}")
            raise

    def check_bucket_access(self) -> bool:
        """Check if bucket is accessible"""
        try:
            self.client.head_bucket(Bucket=settings.s3_files_bucket)
            self.logger.info(f"Bucket '{settings.s3_files_bucket}' is accessible")
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                self.logger.error(f"Bucket '{settings.s3_files_bucket}' does not exist")
            else:
                self.logger.error(f"Failed to access bucket: {e}")
            return False
        except Exception as e:
            self.logger.error(f"Error checking bucket access: {e}")
            return False

    def set_bucket_public_policy(self) -> bool:
        """Set bucket to public read policy"""
        try:
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": ["s3:GetObject"],
                        "Resource": f"arn:aws:s3:::{settings.s3_files_bucket}/*",
                    }
                ],
            }
            self.client.put_bucket_policy(
                Bucket=settings.s3_files_bucket, Policy=str(policy).replace("'", '"')
            )
            self.logger.info(
                f"Set public policy on bucket '{settings.s3_files_bucket}'"
            )
            return True
        except Exception as e:
            self.logger.error(f"Failed to set bucket policy: {e}")
            return False

    def upload_file(
        self,
        file_content: Union[bytes, BinaryIO],
        s3_key: str,
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, Any]] = None,
        content_disposition: Optional[str] = None,
    ) -> bool:
        """Upload file to S3"""
        try:
            # Convert all metadata values to strings for S3 compatibility
            s3_metadata = {
                k: str(v) if not isinstance(v, str) else v
                for k, v in (metadata or {}).items()
            }
            extra_args = {"ContentType": content_type, "Metadata": s3_metadata}

            if content_disposition:
                extra_args["ContentDisposition"] = content_disposition

            # Handle different input types
            if isinstance(file_content, bytes):
                # Use BytesIO for bytes
                from io import BytesIO

                file_obj = BytesIO(file_content)
            elif hasattr(file_content, "read"):
                # File-like object
                file_obj = file_content
            else:
                raise ValueError("file_content must be bytes or file-like object")

            self.client.upload_fileobj(
                Bucket=settings.s3_files_bucket,
                Key=s3_key,
                Fileobj=file_obj,
                ExtraArgs=extra_args,
            )

            self.logger.info(f"Uploaded file to S3: {s3_key}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to upload file {s3_key}: {e}")
            return False

    def upload_file_from_path(self, file_path: Union[str, Path], s3_key: str) -> bool:
        """Upload file from local path to S3"""
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")

            # Determine content type
            content_type = self._get_content_type(file_path)

            # Upload with streaming
            with open(file_path, "rb") as file_obj:
                return self.upload_file(
                    file_content=file_obj,
                    s3_key=s3_key,
                    content_type=content_type,
                    content_disposition=f'inline; filename="{file_path.name}"',
                )

        except Exception as e:
            self.logger.error(f"Failed to upload file from path {file_path}: {e}")
            return False

    def download_file(self, s3_key: str) -> Optional[bytes]:
        """Download file from S3 to bytes"""
        try:
            response = self.client.get_object(
                Bucket=settings.s3_files_bucket, Key=s3_key
            )
            return response["Body"].read()
        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                self.logger.warning(f"File not found: {s3_key}")
            else:
                self.logger.error(f"Failed to download file {s3_key}: {e}")
            return None
        except Exception as e:
            self.logger.error(f"Error downloading file {s3_key}: {e}")
            return None

    def download_file_to_temp(self, s3_key: str) -> Optional[Path]:
        """Download file from S3 to temporary file"""
        try:
            content = self.download_file(s3_key)
            if content is None:
                return None

            # Create temporary file
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=Path(s3_key).suffix
            ) as temp_file:
                temp_file.write(content)
                temp_path = Path(temp_file.name)

            self.logger.info(f"Downloaded {s3_key} to temporary file: {temp_path}")
            return temp_path

        except Exception as e:
            self.logger.error(f"Failed to download {s3_key} to temp file: {e}")
            return None

    def delete_file(self, s3_key: str) -> bool:
        """Delete file from S3"""
        try:
            self.client.delete_object(Bucket=settings.s3_files_bucket, Key=s3_key)
            self.logger.info(f"Deleted file from S3: {s3_key}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to delete file {s3_key}: {e}")
            return False

    def file_exists(self, s3_key: str) -> bool:
        """Check if file exists in S3"""
        try:
            self.client.head_object(Bucket=settings.s3_files_bucket, Key=s3_key)
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                return False
            else:
                self.logger.error(f"Error checking file existence {s3_key}: {e}")
                return False
        except Exception as e:
            self.logger.error(f"Error checking file existence {s3_key}: {e}")
            return False

    def get_file_metadata(self, s3_key: str) -> Optional[Dict[str, Any]]:
        """Get file metadata from S3"""
        try:
            response = self.client.head_object(
                Bucket=settings.s3_files_bucket, Key=s3_key
            )
            return {
                "content_type": response.get("ContentType"),
                "content_length": response.get("ContentLength"),
                "last_modified": response.get("LastModified"),
                "metadata": response.get("Metadata", {}),
                "etag": response.get("ETag"),
            }
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                self.logger.warning(f"File not found: {s3_key}")
            else:
                self.logger.error(f"Failed to get metadata for {s3_key}: {e}")
            return None

    def list_files(self, prefix: str = "", max_keys: int = 1000) -> list:
        """List files in bucket with optional prefix"""
        try:
            response = self.client.list_objects_v2(
                Bucket=settings.s3_files_bucket, Prefix=prefix, MaxKeys=max_keys
            )
            files = []
            for obj in response.get("Contents", []):
                files.append(
                    {
                        "key": obj["Key"],
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"],
                        "etag": obj["ETag"],
                    }
                )
            return files
        except Exception as e:
            self.logger.error(f"Failed to list files: {e}")
            return []

    def generate_presigned_url(
        self, s3_key: str, expiration: int = 3600
    ) -> Optional[str]:
        """Generate presigned URL for file access"""
        try:
            url = self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.s3_files_bucket, "Key": s3_key},
                ExpiresIn=expiration,
            )
            return url
        except Exception as e:
            self.logger.error(f"Failed to generate presigned URL for {s3_key}: {e}")
            return None

    def get_public_url(self, s3_key: str) -> str:
        """Get public URL for file"""
        return f"{settings.s3_public_url_base}/{settings.s3_files_bucket}/{s3_key}"

    def _get_content_type(self, file_path: Path) -> str:
        """Get content type based on file extension"""
        import mimetypes

        content_type, _ = mimetypes.guess_type(str(file_path))
        return content_type or "application/octet-stream"


# Global S3 service instance
s3_service = S3Service()
