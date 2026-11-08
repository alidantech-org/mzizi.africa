from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class UnitTypeEnum(enum.Enum):
    """Enumeration of spatial unit types"""

    PARCEL = "PARCEL"
    PLOT = "PLOT"
    SECTION = "SECTION"
    BLOCK = "BLOCK"
    ESTATE = "ESTATE"
    FARM = "FARM"
    RANCH = "RANCH"
    MIGRATION_CORRIDOR = "MIGRATION_CORRIDOR"
    GRAZING_AREA = "GRAZING_AREA"
    ANCESTRAL_LAND = "ANCESTRAL_LAND"


class LandClassificationEnum(enum.Enum):
    """Enumeration of constitutional land classifications (Article 61)"""

    PUBLIC = "PUBLIC"
    COMMUNITY = "COMMUNITY"
    PRIVATE = "PRIVATE"


class SpatialUnits(Base):
    """
    Spatial units table - defines the physical boundary of land parcels.
    Based on LADM (ISO 19152) standard for land administration.
    Examples: Individual parcels, plots, farms, migration corridors.
    """

    __tablename__ = "spatial_units"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    parcel_number = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. "LR NO. 12345/678"
    unit_type = Column(
        String(30), nullable=False, index=True
    )  # PARCEL, PLOT, SECTION, etc.

    # Constitutional Classification (Article 61)
    land_classification = Column(
        String(20), nullable=False, index=True
    )  # PUBLIC, COMMUNITY, PRIVATE

    # Geographic Information
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # County, constituency, ward
    area = Column(Numeric(15, 2), nullable=True, index=True)  # Area in square meters
    geometry = Column(Text, nullable=True)  # GIS geometry data (WKT format)

    # Physical Description
    physical_address = Column(String(500), nullable=True, index=True)
    land_use = Column(
        String(100), nullable=True, index=True
    )  # AGRICULTURAL, COMMERCIAL, RESIDENTIAL, etc.
    soil_type = Column(String(100), nullable=True, index=True)

    # Legal Status
    is_registered = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    registration_date = Column(DateTime(timezone=True), nullable=True, index=True)
    is_disputed = Column(String(3), default="NO", nullable=False, index=True)  # YES, NO
    dispute_notes = Column(Text, nullable=True)

    # Kenyan-Specific Extensions
    # Gender Recordation
    has_gender_rights = Column(
        String(3), default="YES", nullable=False, index=True
    )  # YES, NO
    marriage_type = Column(String(20), nullable=True, index=True)  # MONOGAMY, POLYGAMY

    # Pastoralist Rights
    is_temporal_right = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    temporal_season = Column(
        String(20), nullable=True, index=True
    )  # DRY, WET, ALL_YEAR

    # Informal Occupation
    has_informal_occupants = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    informal_occupant_count = Column(Numeric(10, 0), nullable=True, index=True)

    # Sectional Properties (3D ownership)
    is_sectional_property = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    floor_count = Column(Numeric(5, 0), nullable=True, index=True)
    unit_count = Column(Numeric(5, 0), nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    tenure_types = relationship("TenureTypes", backref="spatial_units")
    rights_restrictions = relationship("RightsRestrictions", backref="spatial_unit")
    land_authorities = relationship("LandAuthorities", backref="spatial_unit")
    amenities = relationship("Amenities", backref="spatial_unit")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_spatial_units_parcel_number", "parcel_number", unique=True),
        Index("idx_spatial_units_classification", "land_classification"),
        Index("idx_spatial_units_geo", "geo_unit_code"),
        Index("idx_spatial_units_type", "unit_type"),
        Index("idx_spatial_units_registered", "is_registered"),
        Index("idx_spatial_units_disputed", "is_disputed"),
        Index("idx_spatial_units_gender_rights", "has_gender_rights"),
        Index("idx_spatial_units_temporal", "is_temporal_right"),
        Index("idx_spatial_units_informal", "has_informal_occupants"),
        Index("idx_spatial_units_sectional", "is_sectional_property"),
        {"schema": "land"},
    )

    def __repr__(self):
        return f"<SpatialUnits(id={self.id}, parcel_number='{self.parcel_number}', land_classification='{self.land_classification}')>"
