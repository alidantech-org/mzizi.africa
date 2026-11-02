from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from ulid import ulid

from app.config.database import Base


class Location(Base):
    """
    Reality layer for Entity physical presence with PostGIS spatial support.
    Links a Legal Entity to a specific Geographic Unit with precise coordinates.

    Examples:
    - ke/private/equity-bank → ke/nairobi/westlands (Head Office) @ POINT(36.8 -1.3)
    - ke/private/equity-bank → ke/mombasa/mvita (Branch) @ POINT(39.7 -4.0)
    - ke/state-corp/kbc → ke/nairobi/central-business-district (Studio) @ POINT(36.8 -1.3)

    Spatial Features:
    - PostGIS POINT geometry for precise lat/lng coordinates
    - Spatial indexing for fast radius queries
    - SRID 4326 (WGS84) for GPS compatibility
    """

    __tablename__ = "locations"
    __table_args__ = {"schema": "entities"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # Foreign key references for database integrity
    entity_id = Column(
        String(26), ForeignKey("entities.legal_entities.id"), nullable=True, index=True
    )
    geo_unit_id = Column(
        String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True
    )

    # The 'Who' (Link to LegalEntities via code)
    entity_code = Column(String(100), nullable=False, index=True)

    # The 'Where' (Link to Geographic Schema via code)
    geo_unit_code = Column(String(100), nullable=False, index=True)

    # Specifics of this location
    location_name = Column(String(200), nullable=True)  # e.g., 'Westlands Branch', 'HQ'
    physical_address = Column(
        Text, nullable=True
    )  # e.g., 'Equity Centre, Hospital Road'

    # Geospatial data for radius queries
    coordinates = Column(
        Geometry("POINT", srid=4326, spatial_index=True), nullable=True, index=True
    )  # PostGIS point for lat/lng with spatial index

    # Metadata for the specific office
    location_type = Column(
        String(50), index=True
    )  # e.g., 'head_office', 'branch', 'warehouse'
    is_main_office = Column(Boolean, default=False, index=True)

    # Contact details specific to this office
    contact_info = Column(
        JSON, default={}
    )  # {"phone": "+254...", "email": "branch@..."}

    is_active = Column(Boolean, default=True, index=True)

    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), onupdate="now()")

    # Relationships
    entity = relationship("LegalEntities", foreign_keys=[entity_id])
    geo_unit = relationship("GeoUnits", foreign_keys=[geo_unit_id])

    def __repr__(self):
        return f"<Location(entity='{self.entity_code}', location='{self.location_name}', geo_unit='{self.geo_unit_code}')>"
