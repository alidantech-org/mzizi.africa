"""
FileType Model - Database model for file type management
"""

from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import uuid
from app.config.database import Base


class FileType(Base):
    """File type model for managing different file formats"""

    __tablename__ = "file_types"

    id = Column(String(26), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(
        String(100), nullable=False, unique=True, index=True
    )  # e.g., "PDF", "JPEG", "MP4"
    code = Column(
        String(50), nullable=False, unique=True, index=True
    )  # e.g., "pdf", "jpeg", "mp4"
    mime_type = Column(
        String(200), nullable=False, unique=True, index=True
    )  # e.g., "application/pdf"
    extension = Column(
        String(10), nullable=False, index=True
    )  # e.g., ".pdf", ".jpg", ".mp4"
    description = Column(Text, nullable=True)
    category = Column(
        String(50), nullable=True, index=True
    )  # e.g., "document", "image", "video", "audio"

    # File handling properties
    is_previewable = Column(Boolean, default=False)  # Can generate preview
    max_size_mb = Column(Integer, nullable=True)  # Maximum allowed size in MB
    allowed_extensions = Column(
        Text, nullable=True
    )  # Comma-separated list of allowed extensions
    processing_strategy = Column(
        String(50), nullable=True
    )  # e.g., "pdf_parser", "image_processor", "text_extractor"

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    files = relationship("File", back_populates="file_type_obj")

    def __repr__(self):
        return f"<FileType(id={self.id.hex[:8]}..., name='{self.name}', code='{self.code}', mime_type='{self.mime_type}')>"

    @property
    def extensions_list(self):
        """Get list of allowed extensions"""
        if self.allowed_extensions:
            return [ext.strip() for ext in self.allowed_extensions.split(",")]
        return [self.extension]

    def is_extension_allowed(self, extension: str) -> bool:
        """Check if an extension is allowed for this file type"""
        extension = extension.lower()
        if extension.startswith("."):
            extension = extension[1:]

        allowed_exts = self.extensions_list
        allowed_exts = [ext.lower().lstrip(".") for ext in allowed_exts]

        return extension in allowed_exts

    @classmethod
    def get_by_mime_type(cls, session, mime_type: str):
        """Get file type by MIME type"""
        from sqlalchemy import select

        stmt = select(cls).where(cls.mime_type == mime_type)
        return session.execute(stmt).scalar_one_or_none()

    @classmethod
    def get_by_extension(cls, session, extension: str):
        """Get file type by file extension"""
        from sqlalchemy import select, or_

        # Clean extension
        if extension.startswith("."):
            extension = extension[1:]
        extension = extension.lower()

        stmt = select(cls).where(
            or_(
                cls.extension == f".{extension}",
                cls.extension == extension,
                cls.allowed_extensions.ilike(f"%{extension}%"),
            )
        )
        return session.execute(stmt).scalar_one_or_none()
