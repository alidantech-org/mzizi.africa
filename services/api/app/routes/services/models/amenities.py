from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class Amenities(Base):
    """
    Amenities table - physical assets and infrastructure.
    The actual "Brick and Mortar" (e.g., Kenyatta National Hospital).
    Examples: Schools, hospitals, police stations, water treatment plants.
    """

    __tablename__ = "amenities"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    name = Column(
        String(200), nullable=False, index=True
    )  # e.g. "Central Police Station"

    # Foreign Keys
    sector_id = Column(
        String(26),
        ForeignKey("services.sectors.id"),
        nullable=False,
        index=True,
    )
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # Jurisdiction where it sits

    # Status
    is_operational = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sector = relationship("Sectors", backref="amenities")
    service_deliveries = relationship("ServiceDeliveryMap", backref="amenity")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_amenities_sector", "sector_id"),
        Index("idx_amenities_geo", "geo_unit_code"),
        Index("idx_amenities_operational", "is_operational"),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<Amenities(id={self.id}, name='{self.name}', sector_id={self.sector_id}, is_operational={self.is_operational})>"
