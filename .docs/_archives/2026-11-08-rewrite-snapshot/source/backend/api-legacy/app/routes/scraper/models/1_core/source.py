"""
Source Model - Domain-level grouping of scraping sources
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class Source(Base):
    """Domain-level grouping of scraping sources"""
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True)
    domain = Column(String(255), unique=True, index=True, nullable=False)  # e.g. treasury.go.ke
    is_trusted = Column(Boolean, default=False)
    has_search = Column(Boolean, default=False)
    search_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.utcnow())
    updated_at = Column(DateTime, default=func.utcnow(), onupdate=func.utcnow())

    # Relationships
    query_results = relationship("QueryResult", back_populates="source")
    pages = relationship("Page", back_populates="source")
    discovered_paths = relationship("DiscoveredPath", back_populates="source")
