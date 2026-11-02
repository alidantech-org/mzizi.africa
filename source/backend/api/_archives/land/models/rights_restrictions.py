from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class RightTypeEnum(enum.Enum):
    """Enumeration of right types"""

    OWNERSHIP = "OWNERSHIP"
    USE = "USE"
    DEVELOPMENT = "DEVELOPMENT"
    TRANSFER = "TRANSFER"
    LEASE = "LEASE"
    MORTGAGE = "MORTGAGE"
    EASEMENT = "EASEMENT"
    SERVITUDE = "SERVITUDE"
    MINERAL_RIGHTS = "MINERAL_RIGHTS"
    WATER_RIGHTS = "WATER_RIGHTS"
    ACCESS_RIGHTS = "ACCESS_RIGHTS"


class RestrictionTypeEnum(enum.Enum):
    """Enumeration of restriction types"""

    BUILDING_RESTRICTION = "BUILDING_RESTRICTION"
    USE_RESTRICTION = "USE_RESTRICTION"
    HEIGHT_RESTRICTION = "HEIGHT_RESTRICTION"
    COVERAGE_RESTRICTION = "COVERAGE_RESTRICTION"
    ENVIRONMENTAL_RESTRICTION = "ENVIRONMENTAL_RESTRICTION"
    HERITAGE_RESTRICTION = "HERITAGE_RESTRICTION"
    AGRICULTURAL_RESTRICTION = "AGRICULTURAL_RESTRICTION"


class RightsRestrictions(Base):
    """
    Rights and restrictions table - tracks what can be done with land parcels.
    Based on LADM (ISO 19152) standard for land administration.
    Examples: Easements, mineral rights, building restrictions, access rights.
    """

    __tablename__ = "rights_restrictions"

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
    authority_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )  # Office granting/restricting right

    # Core Fields
    right_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. EASEMENT_001, MINERAL_RIGHT_001
    right_type = Column(
        String(20), nullable=False, index=True
    )  # OWNERSHIP, USE, EASEMENT, etc.
    restriction_type = Column(
        String(30), nullable=True, index=True
    )  # BUILDING_RESTRICTION, etc.

    # Right Details
    right_description = Column(
        Text, nullable=False
    )  # Description of the right or restriction
    is_right = Column(
        String(3), default="YES", nullable=False, index=True
    )  # YES (right), NO (restriction)

    # Legal Basis
    legal_instrument = Column(
        String(100), nullable=True, index=True
    )  # e.g. "Title Deed", "Court Order"
    instrument_number = Column(String(50), nullable=True, index=True)
    registration_date = Column(Date, nullable=True, index=True)

    # Temporal Aspects
    effective_date = Column(
        Date, nullable=False, index=True
    )  # When right/restriction takes effect
    expiry_date = Column(
        Date, nullable=True, index=True
    )  # When right/restriction expires (NULL = perpetual)
    is_temporary = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO

    # Scope and Extent
    affected_area = Column(
        Numeric(15, 2), nullable=True, index=True
    )  # Area affected in square meters
    scope_description = Column(Text, nullable=True)  # Description of scope

    # Beneficiary/Holder
    beneficiary_name = Column(
        String(200), nullable=True, index=True
    )  # Who holds the right
    beneficiary_type = Column(
        String(20), nullable=True, index=True
    )  # INDIVIDUAL, COMPANY, GOVERNMENT
    beneficiary_id = Column(
        String(26), nullable=True, index=True
    )  # Links to people or offices

    # Kenyan-Specific Extensions
    # Mineral Rights
    mineral_type = Column(
        String(50), nullable=True, index=True
    )  # Type of mineral (e.g., GOLD, COPPER)
    mining_license_number = Column(String(50), nullable=True, index=True)

    # Water Rights
    water_source = Column(String(100), nullable=True, index=True)  # River, well, spring
    water_use_purpose = Column(
        String(100), nullable=True, index=True
    )  # IRRIGATION, DOMESTIC, INDUSTRIAL
    water_extraction_limit = Column(
        Numeric(15, 2), nullable=True, index=True
    )  # Cubic meters per year

    # Easement Details
    easement_type = Column(
        String(50), nullable=True, index=True
    )  # RIGHT_OF_WAY, UTILITY, DRAINAGE
    dominant_land = Column(
        String(50), nullable=True, index=True
    )  # Parcel benefiting from easement
    servient_land = Column(
        String(50), nullable=True, index=True
    )  # Parcel burdened by easement

    # Status
    is_active = Column(String(3), default="YES", nullable=False, index=True)  # YES, NO
    status_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    spatial_unit = relationship("SpatialUnits", backref="rights_restrictions")
    authority = relationship("Offices", backref="granted_rights")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_rights_restrictions_right_code", "right_code", unique=True),
        Index("idx_rights_restrictions_spatial_unit", "spatial_unit_id"),
        Index("idx_rights_restrictions_authority", "authority_id"),
        Index("idx_rights_restrictions_type", "right_type"),
        Index("idx_rights_restrictions_is_right", "is_right"),
        Index("idx_rights_restrictions_effective", "effective_date"),
        Index("idx_rights_restrictions_beneficiary", "beneficiary_name"),
        Index("idx_rights_restrictions_mineral", "mineral_type"),
        Index("idx_rights_restrictions_water", "water_source"),
        Index("idx_rights_restrictions_easement", "easement_type"),
        Index("idx_rights_restrictions_active", "is_active"),
        {"schema": "land"},
    )

    def __repr__(self):
        return f"<RightsRestrictions(id={self.id}, right_code='{self.right_code}', right_type='{self.right_type}', spatial_unit_id={self.spatial_unit_id})>"
