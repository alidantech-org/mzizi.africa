from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class IndicatorValues(Base):
    """
    Optional table for distribution-based indicators.
    Stores the possible values for categorical/distribution indicators.
    Examples: Christian, Muslim, Kikuyu, Luo, etc.
    """

    __tablename__ = "indicator_values"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Indicator Value Code (Business identifier - for display/search only)
    indicator_value_code = Column(
        String(20), nullable=False, unique=True, index=True
    )  # e.g., "CHRISTIAN", "MUSLIM", "KIKUYU", "LUO"

    # Foreign Keys (ALWAYS use IDs for relationships)
    indicator_id = Column(
        String(26),
        ForeignKey("statistics.indicators.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    label = Column(String(100), nullable=False, index=True)
    description = Column(String(500), nullable=True)

    # Ordering
    sort_order = Column(Integer, default=0, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    indicator = relationship("Indicators", backref="indicator_values")

    # Constraints and Indexes
    __table_args__ = (
        # Performance indexes
        Index("idx_indicator_values_indicator", "indicator_id", "sort_order"),
        Index("idx_indicator_values_label", "label"),
        Index(
            "idx_indicator_values_indicator_value_code", "indicator_value_code"
        ),  # For display/search
        # Unique constraint for label within indicator
        UniqueConstraint(
            "indicator_id", "label", name="uq_indicator_values_indicator_label"
        ),
        # Indicator Value Code unique constraint (business identifier)
        Index(
            "uq_indicator_values_indicator_value_code",
            "indicator_value_code",
            unique=True,
        ),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<IndicatorValues(id={self.id}, indicator_value_code='{self.indicator_value_code}', label='{self.label}')>"
