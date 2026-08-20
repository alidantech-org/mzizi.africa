from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class AuthorityRoleEnum(enum.Enum):
    """Enumeration of authority roles"""

    REGISTRAR = "REGISTRAR"
    SURVEYOR = "SURVEYOR"
    VALUER = "VALUER"
    COMMISSIONER = "COMMISSIONER"
    DIRECTOR = "DIRECTOR"
    OFFICER = "OFFICER"
    INSPECTOR = "INSPECTOR"
    ADMINISTRATOR = "ADMINISTRATOR"


class LandAuthorities(Base):
    """
    Land authorities table - links land management offices to land parcels.
    Connects NLC (Public Land) or Ministry of Lands (Private Land) to parcels.
    Based on LADM (ISO 19152) standard for land administration.
    """

    __tablename__ = "land_authorities"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    spatial_unit_id = Column(
        String(26),
        ForeignKey("land.spatial_units.id"),
        nullable=False,
        index=True,
    )
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    authority_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. NLC_NAIROBI_001, MINISTRY_LANDS_002
    role = Column(
        String(20), nullable=False, index=True
    )  # REGISTRAR, SURVEYOR, VALUER, etc.

    # Jurisdiction and Scope
    jurisdiction_type = Column(
        String(20), nullable=False, index=True
    )  # NATIONAL, COUNTY, MUNICIPAL
    jurisdiction_description = Column(Text, nullable=True)

    # Legal Authority
    legal_basis = Column(
        String(100), nullable=True, index=True
    )  # e.g. "Land Act 2012", "NLC Act"
    legal_basis_section = Column(
        String(100), nullable=True, index=True
    )  # Specific legal provision

    # Appointment Details
    appointment_date = Column(Date, nullable=False, index=True)
    appointment_reference = Column(
        String(50), nullable=True, index=True
    )  # Appointment reference number
    appointing_authority = Column(
        String(200), nullable=True, index=True
    )  # Who appointed this authority

    # Contact Information
    office_address = Column(String(500), nullable=True)
    office_phone = Column(String(50), nullable=True)
    office_email = Column(String(200), nullable=True)

    # Kenyan-Specific Extensions
    # NLC vs Ministry of Lands
    authority_category = Column(
        String(20), nullable=False, index=True
    )  # NLC, MINISTRY_OF_LANDS, COUNTY_LANDS

    # NLC Specific (Public Land Management)
    nlc_region = Column(String(50), nullable=True, index=True)  # NLC region
    nlc_district = Column(String(50), nullable=True, index=True)  # NLC district

    # Ministry of Lands Specific (Private Land)
    land_registry = Column(
        String(50), nullable=True, index=True
    )  # Land registry office
    registry_district = Column(
        String(50), nullable=True, index=True
    )  # Registry district

    # County Lands Specific
    county_land_office = Column(
        String(100), nullable=True, index=True
    )  # County land office name

    # Technical Authority
    is_survey_authority = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    is_valuation_authority = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    is_registration_authority = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO

    # Status
    is_active = Column(String(3), default="YES", nullable=False, index=True)  # YES, NO
    status_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    spatial_unit = relationship("SpatialUnits", backref="land_authorities")
    office = relationship("Offices", backref="land_authorities")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_land_authorities_authority_code", "authority_code", unique=True),
        Index("idx_land_authorities_spatial_unit", "spatial_unit_id"),
        Index("idx_land_authorities_office", "office_id"),
        Index("idx_land_authorities_role", "role"),
        Index("idx_land_authorities_jurisdiction", "jurisdiction_type"),
        Index("idx_land_authorities_category", "authority_category"),
        Index("idx_land_authorities_nlc_region", "nlc_region"),
        Index("idx_land_authorities_registry", "land_registry"),
        Index("idx_land_authorities_county", "county_land_office"),
        Index("idx_land_authorities_survey", "is_survey_authority"),
        Index("idx_land_authorities_valuation", "is_valuation_authority"),
        Index("idx_land_authorities_registration", "is_registration_authority"),
        Index("idx_land_authorities_active", "is_active"),
        {"schema": "land"},
    )

    def __repr__(self):
        return f"<LandAuthorities(id={self.id}, authority_code='{self.authority_code}', role='{self.role}', spatial_unit_id={self.spatial_unit_id})>"
