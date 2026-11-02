"""
ProcessingFeedback Model - User feedback on processed items
"""

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class ProcessingFeedback(Base):
    """User feedback on processed items"""
    __tablename__ = "processing_feedback"

    id = Column(Integer, primary_key=True)
    processed_item_id = Column(Integer, ForeignKey("processed_items.id"), nullable=False)
    feedback = Column(Text)
    rating = Column(Integer)  # optional scoring
    created_at = Column(DateTime, default=func.utcnow())

    # Relationships
    processed_item = relationship("ProcessedItem", back_populates="processing_feedback")
