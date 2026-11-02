from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class EventStatusEnum(enum.Enum):
    """Enumeration of event status types"""

    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    POSTPONED = "POSTPONED"


class Events(Base):
    """
    Events table - actual instances of temporal events.
    Examples: "The 2019 National Census", "2022 General Election".
    """

    __tablename__ = "events"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    mandate_id = Column(
        String(26),
        ForeignKey("events.event_mandates.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    name = Column(String(200), nullable=False, index=True)

    # Temporal Fields
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL for single-day events

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="PLANNED"
    )  # PLANNED, IN_PROGRESS, COMPLETED

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    mandate = relationship("EventMandates", backref="instances")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_events_mandate", "mandate_id"),
        Index("idx_events_dates", "start_date", "end_date"),
        Index("idx_events_status", "status"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<Events(id={self.id}, name='{self.name}', start_date={self.start_date}, status='{self.status}')>"
