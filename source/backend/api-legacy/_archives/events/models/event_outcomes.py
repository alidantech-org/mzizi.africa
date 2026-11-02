from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class EventOutcomes(Base):
    """
    Event outcomes table - stores the results of events.
    Examples: Population count for a Census, election results, inauguration details.
    """

    __tablename__ = "event_outcomes"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    event_id = Column(
        String(26), ForeignKey("events.events.id"), nullable=False, index=True
    )

    # Core Fields
    outcome_json = Column(
        Text, nullable=False
    )  # JSON data for flexible outcome storage

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    event = relationship("Events", backref="outcomes")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_event_outcomes_event", "event_id"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<EventOutcomes(id={self.id}, event_id={self.event_id})>"
