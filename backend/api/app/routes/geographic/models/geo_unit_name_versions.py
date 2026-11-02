"""Historical names for canonical geography entities."""

from sqlalchemy import Column, Date, ForeignKey, Index, String, UniqueConstraint

from app.config.database import Base
from ulid import ulid


class GeoUnitNameVersions(Base):
    __tablename__ = "geo_unit_name_versions"
    __table_args__ = (
        UniqueConstraint("geo_unit_id", "name", "valid_from", name="uq_geo_unit_name_version"),
        Index("idx_geo_unit_name_validity", "geo_unit_id", "valid_from", "valid_to"),
        {"schema": "geographic"},
    )

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    valid_from = Column(Date, nullable=True)
    valid_to = Column(Date, nullable=True)
    source_reference = Column(String(1000), nullable=False)

