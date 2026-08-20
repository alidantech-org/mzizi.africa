"""
Page Model - Crawled page content (optional for future crawling)
"""

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class Page(Base):
    """Crawled page content (optional for future crawling)"""
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True)
    url = Column(Text, unique=True, index=True, nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    content_md = Column(Text)  # markdown snapshot
    content_html = Column(Text)  # optional raw HTML
    visited_at = Column(DateTime, default=func.utcnow())

    # Relationships
    source = relationship("Source", back_populates="pages")
