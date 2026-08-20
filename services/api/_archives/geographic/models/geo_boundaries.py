from sqlalchemy import Column, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.config.database import Base


class GeoBoundaries(Base):
    """
    Handles all heavy GIS data for geographic boundaries.
    Stores both accurate and simplified geometries for different use cases.
    """

    __tablename__ = "geo_boundaries"

    # Primary Key
    boundary_id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    geo_version_id = Column(
        Integer,
        ForeignKey("geographic.geo_versions.geo_version_id"),
        nullable=False,
        index=True,
        unique=True,
    )

    # Geometry Fields
    # Full accurate boundary for precise calculations and analysis
    boundary_geom = Column(
        Geometry("MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=False,
        comment="Full accurate boundary for precise calculations",
    )

    # Optimized version for maps/UI (faster rendering)
    simplified_geom = Column(
        Geometry("MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=True,
        comment="Simplified geometry for faster map rendering",
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_version = relationship("GeoVersions", backref="boundary", uselist=False)

    # Constraints and Indexes
    __table_args__ = (
        # PostGIS GIST indexes for spatial queries
        Index("idx_geo_boundaries_geom", "boundary_geom", postgresql_using="gist"),
        Index(
            "idx_geo_boundaries_simplified", "simplified_geom", postgresql_using="gist"
        ),
        # Additional composite indexes for common queries
        Index(
            "idx_geo_boundaries_version_geom",
            "geo_version_id",
            "boundary_geom",
            postgresql_using="gist",
        ),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoBoundaries(boundary_id={self.boundary_id}, geo_version_id={self.geo_version_id})>"
