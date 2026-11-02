from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class IndicatorCategoryEnum(enum.Enum):
    """Enumeration of indicator categories for type safety"""

    DEMOGRAPHIC = "demographic"
    RELIGION = "religion"
    ECONOMIC = "economic"
    CLIMATE = "climate"
    EDUCATION = "education"
    HEALTH = "health"
    INFRASTRUCTURE = "infrastructure"
    AGRICULTURE = "agriculture"
    SOCIAL = "social"
    POLITICAL = "political"


class IndicatorCategories(Base):
    """
    Defines high-level categories for statistical indicators.
    Examples: demographic, religion, economic, climate
    """

    __tablename__ = "indicator_categories"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Indicator Category Code (Human-readable identifier)
    indicator_category_code = Column(
        String(20), nullable=False, unique=True, index=True
    )  # e.g., "DEMOGRAPHIC", "RELIGION", "ECONOMIC", "CLIMATE"

    # Core Fields
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index("idx_indicator_categories_name", "name"),
        Index(
            "uq_indicator_categories_indicator_category_code",
            "indicator_category_code",
            unique=True,
        ),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<IndicatorCategories(id={self.id}, indicator_category_code='{self.indicator_category_code}', name='{self.name}')>"
