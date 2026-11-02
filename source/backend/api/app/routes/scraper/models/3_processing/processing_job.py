"""
ProcessingJob Model - Background processing jobs for downloaded files
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class ProcessingJob(Base):
    """Background processing jobs for downloaded files"""
    __tablename__ = "processing_jobs"

    id = Column(Integer, primary_key=True)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    status = Column(String(50), default="pending")  # pending | processing | done | failed
    job_type = Column(String(100))  # pdf_extract | image_extract | table_extract
    created_at = Column(DateTime, default=func.utcnow())
    finished_at = Column(DateTime, nullable=True)

    # Relationships
    file = relationship("File", back_populates="processing_jobs")
    processed_items = relationship("ProcessedItem", back_populates="processing_job")
