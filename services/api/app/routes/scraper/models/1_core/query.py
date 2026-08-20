"""
Query Model - User-defined scraping queries with scheduling
"""

from sqlalchemy import Column, Integer, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class Query(Base):
    """User-defined scraping queries with scheduling"""
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True)
    query_text = Column(Text, nullable=False)
    frequency_minutes = Column(Integer, nullable=True)
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)
    max_results = Column(Integer, default=20)
    trusted_sources = Column(JSON, nullable=True)  # list of domains
    created_at = Column(DateTime, default=func.utcnow())
    updated_at = Column(DateTime, default=func.utcnow(), onupdate=func.utcnow())

    # Relationships
    query_runs = relationship("QueryRun", back_populates="query")
