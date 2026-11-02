"""
File Model - File storage metadata for downloaded content
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class File(Base):
    """File storage metadata for downloaded content"""
    __tablename__ = "files"

    id = Column(Integer, primary_key=True)
    storage_path = Column(Text, nullable=False)  # S3 path
    file_type = Column(String(50))  # pdf, image, html, md
    checksum = Column(String(64), index=True)
    size_bytes = Column(Integer)
    created_at = Column(DateTime, default=func.utcnow())

    # Relationships
    query_results = relationship("QueryResult", back_populates="file")
    processing_jobs = relationship("ProcessingJob", back_populates="file")
    processed_items = relationship("ProcessedItem", back_populates="file")
