from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class IndicatorCategories(Base):
    """
    Defines high-level categories for statistical indicators.
    Examples: demographic, religion, economic, climate
    """

    __tablename__ = "indicator_categories"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Indicator Category Code (Human-readable identifier)
    # e.g., "demographic", "religion", "economic", "climate", "education", "health"
    indicator_category_code = Column(String(100), nullable=False, unique=True, index=True)

    # Core Fields
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Reduced Indexes
    __table_args__ = (
        Index("uq_indicator_categories_indicator_category_code", "indicator_category_code", unique=True),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<IndicatorCategories(id={self.id}, indicator_category_code='{self.indicator_category_code}', name='{self.name}')>"
