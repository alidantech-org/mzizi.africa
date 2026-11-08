from sqlalchemy import (
    Column,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class ConfidenceLevelEnum(enum.Enum):
    """Enumeration of confidence levels for statistical data"""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    ESTIMATE = "estimate"
    PROJECTION = "projection"


class GeoStatistics(Base):
    """
    Core fact table - stores the actual statistical values.
    Links geography, indicators, and time periods with actual data.
    This is the central table for all statistical data.
    """

    __tablename__ = "geo_statistics"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys (ALWAYS use IDs for relationships)
    geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=False,
        index=True,
    )
    indicator_id = Column(
        String(26),
        ForeignKey("statistics.indicators.id"),
        nullable=False,
        index=True,
    )
    period_id = Column(
        String(26),
        ForeignKey("statistics.periods.id"),
        nullable=False,
        index=True,
    )
    indicator_value_id = Column(
        String(26),
        ForeignKey("statistics.indicator_values.id"),
        nullable=True,
        index=True,
    )

    # Display-Only Reference Codes (for search/filtering - NOT foreign keys)
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # e.g., "KE_NAIROBI_COUNTY"
    indicator_code = Column(
        String(30), nullable=False, index=True
    )  # e.g., "POPULATION_TOTAL"
    period_code = Column(String(50), nullable=False, index=True)  # e.g., "YEAR_2019"

    # Data Values
    value = Column(Numeric(15, 4), nullable=True, index=True)  # For numeric data
    text_value = Column(String(500), nullable=True, index=True)  # For qualitative data

    # Metadata
    source = Column(
        String(200), nullable=True, index=True
    )  # KNBS, census, survey, etc.
    confidence = Column(
        String(20), nullable=True, index=True
    )  # high, medium, low, estimate
    methodology = Column(String(500), nullable=True)  # How data was collected
    collector = Column(String(200), nullable=True, index=True)  # Who collected the data

    # Additional Fields
    notes = Column(String(1000), nullable=True)
    is_verified = Column(String(10), default="false", nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="geo_statistics")
    indicator = relationship("Indicators", backref="geo_statistics")
    period = relationship("Periods", backref="geo_statistics")
    indicator_value = relationship("IndicatorValues", backref="geo_statistics")

    # Constraints and Indexes
    __table_args__ = (
        # Ensure valid confidence levels
        CheckConstraint(
            "confidence IN ('high', 'medium', 'low', 'estimate', 'projection')",
            name="ck_geo_statistics_confidence",
        ),
        # Ensure either value or text_value is provided
        CheckConstraint(
            "(value IS NOT NULL) OR (text_value IS NOT NULL)",
            name="ck_geo_statistics_value_required",
        ),
        # Performance indexes (ID-based relationships only)
        Index("idx_geo_statistics_geo_indicator", "geo_unit_id", "indicator_id"),
        Index("idx_geo_statistics_geo_period", "geo_unit_id", "period_id"),
        Index("idx_geo_statistics_indicator_period", "indicator_id", "period_id"),
        Index("idx_geo_statistics_value", "value"),
        Index("idx_geo_statistics_source", "source", "confidence"),
        Index("idx_geo_statistics_verified", "is_verified", "confidence"),
        # Display-only reference code indexes (for fast search/filtering)
        Index("idx_geo_statistics_geo_unit_code", "geo_unit_code"),
        Index("idx_geo_statistics_indicator_code", "indicator_code"),
        Index("idx_geo_statistics_period_code", "period_code"),
        # Unique constraint to prevent duplicate entries
        UniqueConstraint(
            "geo_unit_id",
            "indicator_id",
            "period_id",
            "indicator_value_id",
            name="uq_geo_statistics_unique",
        ),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<GeoStatistics(id={self.id}, geo_unit_code='{self.geo_unit_code}', indicator_code='{self.indicator_code}', period_code='{self.period_code}')>"
