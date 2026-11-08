from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Numeric,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class OfficeLocations(Base):
    """
    Office locations table - grounds virtual offices in physical world.
    Allows differentiation between office jurisdiction (area it rules) and physical status (where building actually is).
    Examples: State House coordinates, KRA branch addresses, IEBC office locations.
    """

    __tablename__ = "office_locations"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    name = Column(
        String(200), nullable=True, index=True
    )  # e.g. "KRA Times Tower", "Mombasa Branch"

    # Precise Coordinates (using DECIMAL for sub-meter precision)
    latitude = Column(Numeric(10, 7), nullable=True, index=True)  # ~1cm accuracy
    longitude = Column(Numeric(11, 7), nullable=True, index=True)  # ~1cm accuracy

    # Address Information
    address = Column(Text, nullable=True)  # Physical street address for humans

    # Office Status
    is_headquarters = Column(
        Boolean, default=False, nullable=False, index=True
    )  # Flag to identify "Primary Seat"

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    office = relationship("Offices", backref="locations")

    # Constraints and Indexes
    __table_args__ = (
        Index(
            "uq_office_locations_main", "office_id", "is_headquarters", unique=True
        ),  # One HQ per office
        Index("idx_office_locations_office", "office_id"),
        Index(
            "idx_office_locations_coordinates", "latitude", "longitude"
        ),  # Spatial queries
        Index("idx_office_locations_headquarters", "is_headquarters"),
        # Spatial index for proximity searches
        Index(
            "idx_office_locations_spatial", "latitude", "longitude"
        ),  # PostGIS would be better, but this works
        {"schema": "governance"},
    )

    def __repr__(self):
        return f"<OfficeLocations(id={self.id}, office_id={self.office_id}, name='{self.name}', is_headquarters={self.is_headquarters})>"
