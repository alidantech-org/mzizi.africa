from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class Seats(Base):
    """
    Seats table - bridge between office, geography, and election.
    Defines what is being contested where and when.
    Examples: KE_WESTLANDS_MP_2022, KE_NAIROBI_GOV_2022
    """

    __tablename__ = "seats"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    seat_code = Column(
        String(100), unique=True, nullable=False, index=True
    )  # e.g. KE_WESTLANDS_MP_2022

    # Foreign Keys
    election_id = Column(
        String(26),
        ForeignKey("elections.elections.id"),
        nullable=False,
        index=True,
    )
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )  # WHAT is being contested

    # Geographic Scope
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # WHERE (constituency, county, ward)

    # Legal Basis
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Seat Configuration
    total_positions = Column(
        Integer, nullable=False, default=1, index=True
    )  # usually 1, but supports multi-seat

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    election = relationship("Elections", backref="seats")
    office = relationship("Offices", backref="seats")
    constitution_section = relationship("ConstitutionSections", backref="seats")
    law_section = relationship("LegalSections", backref="seats")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_seats_seat_code", "seat_code", unique=True),
        Index("idx_seats_election_office", "election_id", "office_id"),
        Index("idx_seats_geo_office", "geo_unit_code", "office_id"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Seats(id={self.id}, seat_code='{self.seat_code}', election_id={self.election_id}, office_id={self.office_id})>"
