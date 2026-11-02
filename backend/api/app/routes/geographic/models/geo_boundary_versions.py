"""Verified, versioned GeoJSON boundary records for stable geography IDs."""

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.sql import func

from app.config.database import Base
from ulid import ulid


class GeoBoundaryVersions(Base):
    __tablename__ = "geo_boundary_versions"
    __table_args__ = (
        Index("idx_geo_boundary_versions_validity", "geo_unit_id", "valid_from", "valid_to"),
        Index("idx_geo_boundary_versions_current_verified", "geo_unit_id", "is_current", "is_verified"),
        Index("idx_geo_boundary_versions_verified", "is_verified"),
        Index("idx_geo_boundary_versions_current", "is_current"),
        Index("idx_geo_boundary_versions_valid_from", "valid_from"),
        Index("idx_geo_boundary_versions_valid_to", "valid_to"),
        UniqueConstraint("geo_unit_id", "version_number", name="uq_geo_boundary_version_number"),
        {"schema": "geographic"},
    )

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    geometry = Column(JSON, nullable=False)
    label_point = Column(JSON, nullable=True)
    source_name = Column(String(300), nullable=False)
    source_reference = Column(Text, nullable=False)
    license = Column(String(300), nullable=False)
    reference_year = Column(String(30), nullable=True)
    retrieved_at = Column(DateTime(timezone=True), nullable=True)
    valid_from = Column(Date, nullable=True)
    valid_to = Column(Date, nullable=True)
    version_label = Column(String(200), nullable=True)
    is_verified = Column(Boolean, nullable=False, default=False, server_default="false")
    is_current = Column(Boolean, nullable=False, default=True, server_default="true")
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

