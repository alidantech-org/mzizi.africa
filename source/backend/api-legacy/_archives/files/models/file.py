"""
File Model - SQLAlchemy model for file metadata
"""

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Text,
    Index,
    func,
    BigInteger,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import declarative_base, relationship
import uuid

from app.config.database import Base


class File(Base):
    """File model - tracks file metadata and S3 storage information"""

    __tablename__ = "files"

    id = Column(String(26), primary_key=True, default=uuid.uuid4, index=True)
    filename = Column(String(255), nullable=False)
    s3_key = Column(String(500), nullable=False, unique=True)
    s3_bucket = Column(String(100), nullable=False)

    # Foreign key relationships
    directory_id = Column(
        String(26), ForeignKey("directories.id"), nullable=True, index=True
    )
    file_type_code = Column(
        String(50), ForeignKey("file_types.code"), nullable=True, index=True
    )

    # File properties
    size_bytes = Column(BigInteger)
    public_url = Column(Text)
    checksum = Column(String(64))
    status = Column(
        String(20), nullable=False, default="uploaded", index=True
    )  # uploaded, processing, failed, completed
    file_metadata = Column("file_metadata", JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        Index("idx_files_filename", "filename"),
        Index("idx_files_s3_key", "s3_key"),
        Index("idx_files_created_at", "created_at"),
        Index("idx_files_size_bytes", "size_bytes"),
        Index("idx_files_checksum", "checksum"),
        Index("idx_files_status", "status"),
        # New indexes for foreign keys
        Index("idx_files_directory_id", "directory_id"),
        Index("idx_files_file_type_code", "file_type_code"),
        # Composite indexes for common search patterns
        Index("idx_files_directory_created", "directory_id", "created_at"),
        Index("idx_files_filetype_created", "file_type_code", "created_at"),
        Index("idx_files_status_created", "status", "created_at"),
        Index("idx_files_directory_status", "directory_id", "status"),
    )

    # Relationships
    directory = relationship("Directory", back_populates="files")
    file_type_obj = relationship("FileType", back_populates="files")

    def __repr__(self):
        return f"<File(id={self.id.hex[:8]}..., filename={self.filename}, s3_key={self.s3_key})>"

    @property
    def directory_path(self):
        """Get directory path from directory relationship"""
        if self.directory:
            return self.directory.path
        return None

    @property
    def file_type_code_property(self):
        """Get file type code - directly from field"""
        return self.file_type_code

    @property
    def mime_type(self):
        """Get MIME type from file_type_obj relationship"""
        if self.file_type_obj:
            return self.file_type_obj.mime_type
        return None

    @property
    def is_processing(self):
        """Check if file is currently being processed"""
        return self.status in ["processing", "uploaded"]

    @property
    def is_completed(self):
        """Check if file processing is completed"""
        return self.status == "completed"

    @property
    def has_failed(self):
        """Check if file processing has failed"""
        return self.status == "failed"
