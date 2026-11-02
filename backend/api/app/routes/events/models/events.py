from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, Index, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ENUM as SQLEnum
from app.config.database import Base
from ulid import ulid


class EventStatusEnum(str):
    """Event status enumeration"""
    
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"
    DRAFT = "draft"


class Events(Base):
    """
    Government and Public Events table - categorical event model.
    Tracks both static events (holidays) and dynamic events (government activities).
    Examples: "Independence Day", "Budget Announcement", "COVID-19 Lockdown"
    """

    __tablename__ = "events"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Business Identifier Code (following common pattern)
    event_code = Column(
        String(100), nullable=False, unique=True, index=True
    )  # e.g. "ke/2024-independence-day", "ke/fy-2024-2025-budget-announcement"

    # Core Event Information
    title = Column(String(200), nullable=False, index=True)  # e.g. "Independence Day", "Budget Announcement"
    description = Column(Text, nullable=True)  # Detailed description of the event

    # Event Type Classification (normalized)
    event_type_id = Column(String(26), ForeignKey("events.event_types.id"), nullable=True, index=True)
    event_type_code = Column(String(50), nullable=False, index=True)  # Reference to event_types.event_type_code

    # Temporal Information
    planned_date = Column(DateTime(timezone=True), nullable=True, index=True)  # Originally planned date
    start_date = Column(DateTime(timezone=True), nullable=False, index=True)  # Actual date when event happens
    end_date = Column(DateTime(timezone=True), nullable=True, index=True)  # When it ends (Optional)
    date_calculation_code = Column(
        String(200), nullable=True, index=True
    )  # e.g. "every-second-tuesday-of-august", "every-second-sunday-of-may"

    # Recurrence Pattern
    is_recurring = Column(Boolean, nullable=False, default=False, index=True)  # TRUE for holidays, FALSE for one-time events

    # Public Impact Assessment
    affects_public = Column(Boolean, nullable=False, default=True, index=True)  # Filter "Important" vs "Administrative"
    impact_level = Column(Integer, nullable=False, default=1, index=True)  # 1: Informational, 5: Critical

    # Source and Verification
    source_url = Column(Text, nullable=True)  # Link to official Government Gazette or announcement
    is_verified = Column(Boolean, nullable=False, default=False, index=True)  # Whether source has been verified

    # Status Field
    status = Column(
        SQLEnum(
            EventStatusEnum.PLANNED,
            EventStatusEnum.IN_PROGRESS,
            EventStatusEnum.COMPLETED,
            EventStatusEnum.CANCELLED,
            EventStatusEnum.POSTPONED,
            EventStatusEnum.DRAFT,
            name="event_status_enum",
            schema="events",
        ),
        nullable=False,
        index=True,
        default=EventStatusEnum.PLANNED,
    )

    # Geographic Scope (Optional)
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)
    geo_unit_code = Column(String(100), nullable=True, index=True)  # Reference to geographic.geo_units.geo_unit_code
    geo_scope = Column(String(100), nullable=True, index=True)  # e.g. "national", "ke/nairobi", "ke/coast"

    # Additional Metadata
    tags = Column(String(500), nullable=True)  # Comma-separated tags for additional categorization
    notes = Column(Text, nullable=True)  # Internal notes for administrative purposes

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="events")
    event_type = relationship("EventTypes", backref="events")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_events_event_code", "event_code", unique=True),
        Index("uq_events_title_start_date", "title", "start_date", unique=False),
        Index("idx_events_type_date", "event_type_code", "start_date"),
        Index("idx_events_planned_actual", "planned_date", "start_date"),
        Index("idx_events_status", "status", "start_date"),
        Index("idx_events_impact_public", "affects_public", "impact_level"),
        Index("idx_events_recurring", "is_recurring", "event_type_code"),
        Index("idx_events_dates", "start_date", "end_date"),
        Index("idx_events_date_calculation", "date_calculation_code", "is_recurring"),
        Index("idx_events_geo_unit", "geo_unit_code", "event_code"),
        Index("idx_events_geo_scope", "geo_scope", "start_date"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<Events(id={self.id}, event_code='{self.event_code}', title='{self.title}', event_type_code='{self.event_type_code}', start_date='{self.start_date}')>"

    # Helper methods for common queries
    @classmethod
    def get_public_holidays(cls):
        """Get all public holiday events"""
        return cls.query.filter(cls.event_type_code == "holiday", cls.affects_public == True)

    @classmethod
    def get_critical_events(cls):
        """Get events with critical impact (level 4-5)"""
        return cls.query.filter(cls.impact_level >= 4, cls.affects_public == True)

    @classmethod
    def get_upcoming_events(cls, days=30):
        """Get events in the next N days"""
        from datetime import datetime, timedelta

        future_date = datetime.now() + timedelta(days=days)
        return cls.query.filter(cls.start_date >= datetime.now(), cls.start_date <= future_date, cls.affects_public == True)

    @classmethod
    def get_governance_events(cls):
        """Get governance-related events"""
        return cls.query.filter(cls.event_type_code == "governance")

    @classmethod
    def get_emergency_events(cls):
        """Get emergency and critical events"""
        return cls.query.filter(cls.event_type_code == "emergency", cls.impact_level >= 3)

    @classmethod
    def get_events_by_type(cls, event_type_code: str):
        """Get events by specific event type code"""
        return cls.query.filter(cls.event_type_code == event_type_code)
