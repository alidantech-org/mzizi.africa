from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class Indicators(Base):
    """
    The most important table - defines what we measure.
    Examples: Population, Christianity, Temperature, GDP
    """

    __tablename__ = "indicators"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Indicator Code (Business identifier - represents table names)
    # These represent table names like "demographic/population" (Population by Region table)
    # Examples: "demographic/population", "economic/gdp", "education/literacy", "health/mortality"
    indicator_code = Column(String(100), nullable=False, unique=True, index=True)

    # Foreign Keys (ALWAYS use IDs for relationships) - ALL NULLABLE for back-population
    indicator_category_id = Column(String(26), ForeignKey("statistics.indicator_categories.id"), nullable=True, index=True)
    # Self-referencing for hierarchy
    parent_indicator_id = Column(String(26), ForeignKey("statistics.indicators.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)# e.g., "demographic/population" for "demographic/population/male"
    parent_indicator_code = Column(String(100), nullable=True, index=True)

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    unit = Column(String(50), nullable=True, index=True)  # people, %, °C, KES, etc.

    # Behavioral Flags # can be compared across geo/period
    is_comparable = Column(Boolean, nullable=True, index=True)
    # can be summed or averaged
    is_aggregatable = Column(Boolean, nullable=True, index=True)

    # Additional Information
    description = Column(Text, nullable=True)  # Notes about the indicator

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    indicator_category = relationship("IndicatorCategories", backref="indicators")
    parent_indicator = relationship("Indicators", remote_side=[id], backref="child_indicators")

    # Reduced Constraints and Indexes
    __table_args__ = (
        Index("uq_indicators_indicator_code", "indicator_code", unique=True),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<Indicators(id={self.id}, indicator_code='{self.indicator_code}', name='{self.name}')>"
