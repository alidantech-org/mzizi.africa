from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class DataTypeEnum(enum.Enum):
    """Enumeration of data types for indicators"""

    NUMERIC = "numeric"
    PERCENTAGE = "percentage"
    RATIO = "ratio"
    DISTRIBUTION = "distribution"
    CATEGORICAL = "categorical"
    INDEX = "index"


class Indicators(Base):
    """
    The most important table - defines what we measure.
    Examples: Population, Christianity, Temperature, GDP
    """

    __tablename__ = "indicators"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Indicator Code (Business identifier - for display/search only)
    indicator_code = Column(
        String(30), nullable=False, unique=True, index=True
    )  # e.g., "POPULATION_TOTAL", "RELIGION_CHRISTIANITY", "TEMPERATURE_AVERAGE"

    # Foreign Keys (ALWAYS use IDs for relationships)
    indicator_category_id = Column(
        String(26),
        ForeignKey("statistics.indicator_categories.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    data_type = Column(
        String(50), nullable=False, index=True
    )  # numeric, percentage, ratio, distribution
    unit = Column(String(50), nullable=True, index=True)  # people, %, °C, KES, etc.

    # Behavioral Flags
    is_comparable = Column(
        Boolean, default=True, nullable=False, index=True
    )  # can be compared across geo/period
    is_aggregatable = Column(
        Boolean, default=True, nullable=False, index=True
    )  # can be summed or averaged

    # Additional Information
    description = Column(Text, nullable=True)
    source_notes = Column(String(500), nullable=True)  # KNBS, census, survey, etc.

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    indicator_category = relationship("IndicatorCategories", backref="indicators")

    # Constraints and Indexes
    __table_args__ = (
        # Ensure valid data types
        CheckConstraint(
            "data_type IN ('numeric', 'percentage', 'ratio', 'distribution', 'categorical', 'index')",
            name="ck_indicators_data_type",
        ),
        # Performance indexes
        Index("idx_indicators_category", "indicator_category_id", "name"),
        Index("idx_indicators_type", "data_type", "is_comparable"),
        Index("idx_indicators_aggregatable", "is_aggregatable", "data_type"),
        Index("idx_indicators_unit", "unit", "data_type"),
        Index("idx_indicators_indicator_code", "indicator_code"),  # For display/search
        Index("idx_indicators_name", "name"),  # For display/search
        # Unique constraint for name within category
        Index(
            "uq_indicators_name_category", "name", "indicator_category_id", unique=True
        ),
        # Indicator Code unique constraint (business identifier)
        Index("uq_indicators_indicator_code", "indicator_code", unique=True),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<Indicators(id={self.id}, indicator_code='{self.indicator_code}', name='{self.name}')>"
