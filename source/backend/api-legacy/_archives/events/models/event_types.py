from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class DefaultFrequencyEnum(enum.Enum):
    """Enumeration of default event frequencies"""

    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    ANNUALLY = "ANNUALLY"
    BIENNIAL = "BIENNIAL"
    QUADRENNIAL = "QUADRENNIAL"
    AD_HOC = "AD_HOC"


class EventTypes(Base):
    """
    Event types table - categories of temporal events.
    Examples: CENSUS, INAUGURATION, HOLIDAY, ELECTION.
    """

    __tablename__ = "event_types"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    name = Column(
        String(100), unique=True, nullable=False, index=True
    )  # e.g. "National Census"
    default_frequency = Column(
        String(20), nullable=True, index=True
    )  # e.g. QUADRENNIAL

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_event_types_name", "name", unique=True),
        Index("idx_event_types_frequency", "default_frequency"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<EventTypes(id={self.id}, name='{self.name}', default_frequency='{self.default_frequency}')>"
