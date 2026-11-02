"""
DataSeedLog Model - Logs for seeding processed data to target systems
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class DataSeedLog(Base):
    """Logs for seeding processed data to target systems"""
    __tablename__ = "data_seed_logs"

    id = Column(Integer, primary_key=True)
    processed_item_id = Column(Integer, ForeignKey("processed_items.id"), nullable=False)
    target_table = Column(String(100))
    success = Column(Boolean)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.utcnow())

    # Relationships
    processed_item = relationship("ProcessedItem", back_populates="data_seed_logs")
