"""
DiscoveredPath Model - Crawl frontier for discovered URLs
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class DiscoveredPath(Base):
    """Crawl frontier for discovered URLs"""
    __tablename__ = "discovered_paths"

    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    path = Column(String(500))  # /reports, /budget
    full_url = Column(Text, nullable=False)
    is_dynamic = Column(Boolean, default=False)
    discovered_from_url = Column(Text)
    last_seen_at = Column(DateTime, default=func.utcnow())

    # Relationships
    source = relationship("Source", back_populates="discovered_paths")
