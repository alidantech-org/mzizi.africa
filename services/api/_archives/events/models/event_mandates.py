from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class EventMandates(Base):
    """
    Event mandates table - the bridge between event types and legal authority.
    Links an event type to the Law/Article that requires it.
    Examples: "The Census is required by the Statistics Act".
    """

    __tablename__ = "event_mandates"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    event_type_id = Column(
        String(26),
        ForeignKey("events.event_types.id"),
        nullable=False,
        index=True,
    )
    law_id = Column(
        String(26),
        ForeignKey("legal.legal_instruments.id"),
        nullable=True,
        index=True,
    )
    article_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Core Fields
    description = Column(Text, nullable=True)  # Description of the legal requirement

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    event_type = relationship("EventTypes", backref="mandates")
    law = relationship("LegalInstruments", backref="event_mandates")
    article = relationship("LegalSections", backref="event_mandates")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_event_mandates_event_type", "event_type_id"),
        Index("idx_event_mandates_law", "law_id"),
        Index("idx_event_mandates_article", "article_id"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<EventMandates(id={self.id}, event_type_id={self.event_type_id}, law_id={self.law_id})>"
