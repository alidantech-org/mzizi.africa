from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class EventLocations(Base):
    """
    Event locations table - geo join for events.
    Links events to the geographic units they affect.
    Examples: Census in specific counties, election in constituencies.
    """

    __tablename__ = "event_locations"

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
    geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=False,
        index=True,
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    event = relationship("Events", backref="locations")
    geo_unit = relationship("GeoUnits", backref="events")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_event_locations_event_geo", "event_id", "geo_unit_id", unique=True),
        Index("idx_event_locations_event", "event_id"),
        Index("idx_event_locations_geo", "geo_unit_id"),
        {"schema": "events"},
    )

    def __repr__(self):
        return f"<EventLocations(id={self.id}, event_id={self.event_id}, geo_unit_id={self.geo_unit_id})>"
