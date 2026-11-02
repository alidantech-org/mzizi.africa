from sqlalchemy import Column, String, Boolean, Integer, Text, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class EventTypes(Base):
    """
    Event Types table - master list of event categories.
    Allows for dynamic management of event types without schema changes.
    Examples: "holiday", "governance", "emergency", "public_notice", "legislative", "economic"
    """

    __tablename__ = "event_types"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Business Identifier Code
    event_type_code = Column(
        String(100), nullable=False, unique=True, index=True
    )  # e.g. "holiday", "governance", "emergency", "public_notice", "legislative"

    # Core Information
    name = Column(String(100), nullable=False, index=True)  # e.g. "Public Holiday", "Governance Event"
    description = Column(Text, nullable=True)  # Detailed description of when to use this type

    # Configuration
    is_active = Column(Boolean, nullable=False, default=True, index=True)  # Whether this type can be used
    is_recurring_default = Column(Boolean, nullable=False, default=False, index=True)  # Default recurrence for new events
    default_impact_level = Column(Integer, nullable=False, default=1, index=True)  # Default impact level (1-5)
    default_affects_public = Column(Boolean, nullable=False, default=True, index=True)  # Default public impact

    # Display and Ordering
    display_order = Column(Integer, nullable=False, default=0, index=True)  # Order for UI display
    color_code = Column(String(7), nullable=True)  # Hex color for UI (e.g. "#FF5733")
    icon_name = Column(String(50), nullable=True)  # Icon name for UI (e.g. "calendar", "gavel")

    # Metadata
    category = Column(String(50), nullable=True, index=True)  # Grouping category (e.g. "government", "social", "economic")
    tags = Column(String(500), nullable=True)  # Comma-separated tags for additional categorization

    # Timestamps
    created_at = Column(String(50), server_default=func.now())
    updated_at = Column(String(50), onupdate=func.now())

    # Relationships
    events = relationship("Events", backref="event_type")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_event_types_event_type_code", "event_type_code", unique=True),
        Index("idx_event_types_active", "is_active", "display_order"),
        Index("idx_event_types_category", "category", "display_order"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<EventTypes(id={self.id}, event_type_code='{self.event_type_code}', name='{self.name}')>"
