from sqlalchemy import Column, String, Integer, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class Seats(Base):
    """
    Seats table - static political seats that exist over time.
    Represents permanent political offices like MP positions, governor seats, etc.
    Examples: ke/nairobi/westlands/mp, ke/nairobi/governor, ke/kiambu/senator
    Seats are timeless entities that can become inactive but don't change with elections.
    """

    __tablename__ = "seats"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Seat Code (Business identifier - represents static political seats)
    # These represent seat codes like "ke/nairobi/westlands/mp", "ke/nairobi/governor" for easy reference
    # Seats are static and don't change with elections - they represent the actual political position
    seat_code = Column(String(100), nullable=False, unique=True, index=True)

    # Core Fields
    title = Column(String(200), nullable=False, index=True)  # e.g. "Member of Parliament for Westlands"
    description = Column(Text, nullable=True)  # e.g. "Represents Westlands constituency in the National Assembly"

    # Foreign Keys (ALL NULLABLE for back-population)
    office_id = Column(String(26), ForeignKey("offices.offices.id"), nullable=True, index=True)  # WHAT type of seat
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)  # WHERE the seat exists
    constitution_id = Column(String(26), ForeignKey("legal.constitutions.id"), nullable=True, index=True)  # Legal basis

    # Reference Codes (for search/filtering - NOT foreign keys)
    office_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/office/mp"
    geo_unit_code = Column(String(100), nullable=False, index=True)  # WHERE (constituency, county, ward)
    constitution_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/2010-constitution/chapter-1/article-99"

    # Seat Configuration
    total_positions = Column(Integer, nullable=True, default=1, index=True)  # usually 1, but supports multi-seat

    # Seat Validity (Temporal tracking for static seats)
    is_active = Column(String(10), nullable=True, default="true", index=True)  # true/false as string
    valid_from = Column(Date, nullable=True, index=True)  # When seat became valid
    valid_to = Column(Date, nullable=True, index=True)  # When seat becomes invalid (NULL = still valid)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    office = relationship("Offices", backref="seats")
    geo_unit = relationship("GeoUnits", backref="seats")
    constitution = relationship("Constitutions", backref="seats")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_seats_seat_code", "seat_code", unique=True),
        Index("idx_seats_name", "seat_code", "geo_unit_code"),
        Index("idx_seats_office_geo", "office_id", "geo_unit_id"),
        Index("idx_seats_geo_office", "geo_unit_code", "office_code"),
        Index("idx_seats_codes", "office_code", "geo_unit_code"),
        Index("idx_seats_active", "is_active", "valid_from", "valid_to"),
        Index("idx_seats_constitution", "constitution_id"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Seats(id={self.id}, seat_code='{self.seat_code}', office_id={self.office_id}, geo_unit_id={self.geo_unit_id})>"
