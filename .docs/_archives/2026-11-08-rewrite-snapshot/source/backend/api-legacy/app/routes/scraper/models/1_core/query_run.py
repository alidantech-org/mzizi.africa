"""
QueryRun Model - Execution tracking for query runs
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class QueryRun(Base):
    """Execution tracking for query runs"""
    __tablename__ = "query_runs"

    id = Column(Integer, primary_key=True)
    query_id = Column(Integer, ForeignKey("queries.id"), nullable=False)
    status = Column(String(50), default="running")  # running | completed | failed
    started_at = Column(DateTime, default=func.utcnow())
    finished_at = Column(DateTime, nullable=True)

    # Relationships
    query = relationship("Query", back_populates="query_runs")
    query_results = relationship("QueryResult", back_populates="query_run")
