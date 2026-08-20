from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class GeoVersions(Base):
    """
    Tracks boundary or structural changes over time.
    Used for historical data accuracy and electoral boundary changes.
    """

    __tablename__ = "geo_versions"

    # Primary Key
    geo_version_id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    geo_id = Column(
        Integer, ForeignKey("geographic.geo_units.geo_id"), nullable=False, index=True
    )

    # Time-based Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # null means currently valid

    # Version Information
    version_label = Column(String(200), nullable=False, index=True)
    source = Column(String(200), nullable=True, index=True)  # IEBC, law, etc.
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="versions")

    # Constraints and Indexes
    __table_args__ = (
        # Ensure no overlapping date ranges for same geo unit
        Index("idx_geo_versions_dates", "geo_id", "valid_from", "valid_to"),
        Index("idx_geo_versions_current", "geo_id", "valid_to"),
        Index("idx_geo_versions_date_range", "valid_from", "valid_to"),
        Index("idx_geo_versions_source", "source", "valid_from"),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoVersions(geo_version_id={self.geo_version_id}, geo_id={self.geo_id}, version_label='{self.version_label}')>"
