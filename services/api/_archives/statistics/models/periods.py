from sqlalchemy import Column, String, Date, DateTime, Index, CheckConstraint
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class GranularityEnum(enum.Enum):
    """Enumeration of time granularities for periods"""

    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"
    DECADE = "decade"
    CENTURY = "century"
    CUSTOM = "custom"


class Periods(Base):
    """
    Unified time periods table - replaces period_types.
    Handles all time granularity through data, not schema.
    Examples: "2019", "Q1 2024", "Week 1", "2010-2020"
    """

    __tablename__ = "periods"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Period Code (Human-readable identifier)
    period_code = Column(
        String(50), nullable=False, unique=True, index=True
    )  # e.g., "YEAR_2019", "Q1_2024", "WEEK_1_2024"

    # Core Fields
    label = Column(
        String(100), nullable=False, index=True
    )  # "2019", "Q1 2024", "Week 1"
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)

    # Time Granularity
    granularity = Column(
        String(20), nullable=False, index=True
    )  # day, week, month, year, decade, etc.

    # Additional Information
    description = Column(String(500), nullable=True)
    is_active = Column(String(10), default="true", nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints and Indexes
    __table_args__ = (
        # Ensure valid granularities
        CheckConstraint(
            "granularity IN ('day', 'week', 'month', 'quarter', 'year', 'decade', 'century', 'custom')",
            name="ck_periods_granularity",
        ),
        # Ensure end_date >= start_date
        CheckConstraint("end_date >= start_date", name="ck_periods_date_range"),
        # Performance indexes
        Index("idx_periods_dates", "start_date", "end_date"),
        Index("idx_periods_granularity", "granularity", "start_date"),
        Index("idx_periods_active", "is_active", "granularity"),
        Index("idx_periods_label", "label"),
        # Unique constraint to prevent duplicate periods
        Index(
            "uq_periods_dates_granularity",
            "start_date",
            "end_date",
            "granularity",
            unique=True,
        ),
        # Period Code unique constraint
        Index("uq_periods_period_code", "period_code", unique=True),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<Periods(id={self.id}, period_code='{self.period_code}', label='{self.label}', granularity='{self.granularity}')>"
