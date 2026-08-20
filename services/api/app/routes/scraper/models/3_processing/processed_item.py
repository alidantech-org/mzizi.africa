"""
ProcessedItem Model - Results from processing jobs
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class ProcessedItem(Base):
    """Results from processing jobs"""
    __tablename__ = "processed_items"

    id = Column(Integer, primary_key=True)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    processing_job_id = Column(Integer, ForeignKey("processing_jobs.id"), nullable=False)
    output_type = Column(String(50))  # csv | json | text
    output_path = Column(Text)  # S3 path
    success = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.utcnow())

    # Relationships
    file = relationship("File", back_populates="processed_items")
    processing_job = relationship("ProcessingJob", back_populates="processed_items")
    processing_feedback = relationship("ProcessingFeedback", back_populates="processed_item")
    data_seed_logs = relationship("DataSeedLog", back_populates="processed_item")
