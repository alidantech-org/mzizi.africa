"""
QueryResult Model - RAW search output from query runs
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class QueryResult(Base):
    """RAW search output from query runs"""
    __tablename__ = "query_results"

    id = Column(Integer, primary_key=True)
    query_run_id = Column(Integer, ForeignKey("query_runs.id"), nullable=False)
    url = Column(Text, nullable=False)
    title = Column(Text, nullable=True)
    snippet = Column(Text, nullable=True)
    rank = Column(Integer, nullable=True)
    engine = Column(String(100))  # primary engine
    engines = Column(JSON)  # all contributing engines
    result_type = Column(String(50))  # page | pdf | image | unknown
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=True)
    created_at = Column(DateTime, default=func.utcnow())

    # Relationships
    query_run = relationship("QueryRun", back_populates="query_results")
    source = relationship("Source", back_populates="query_results")
    file = relationship("File", back_populates="query_results")
