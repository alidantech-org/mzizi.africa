from sqlalchemy import Column, String, Date, DateTime, Index, CheckConstraint, Enum as SQLEnum
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class GranularityEnum(str):
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
    Examples: "year-2019", "q1-2024", "week-1-2024", "2010-2020"
    """

    __tablename__ = "periods"

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)
    # Period Code (Human-readable identifier)
    # # e.g., "year/2019", "quarter/q1-2024", "week/w1-2024", "decade/2010-2020"
    period_code = Column(String(100), nullable=False, unique=True, index=True)
    label = Column(String(100), nullable=False, index=True)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    granularity = Column(
        SQLEnum(
            GranularityEnum.DAY,
            GranularityEnum.WEEK,
            GranularityEnum.MONTH,
            GranularityEnum.QUARTER,
            GranularityEnum.YEAR,
            GranularityEnum.DECADE,
            GranularityEnum.CENTURY,
            GranularityEnum.CUSTOM,
            name="granularity_enum",
            schema="statistics",
        ),
        nullable=False,
        index=True,
    )
    description = Column(String(500), nullable=True)
    is_active = Column(String(10), default="true", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("end_date >= start_date", name="ck_periods_date_range"),
        Index("uq_periods_period_code", "period_code", unique=True),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<Periods(id={self.id}, period_code='{self.period_code}', label='{self.label}', granularity='{self.granularity}')>"
