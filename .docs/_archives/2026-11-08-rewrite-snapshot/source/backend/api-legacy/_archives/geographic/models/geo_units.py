from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
    Integer,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class GeoUnits(Base):
    """
    Core table storing every geographic entity in the system.
    Examples: Kenya, Nairobi County, Westlands Constituency, Parklands Ward
    """

    __tablename__ = "geo_units"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Geographic Unit Code (Business identifier - for display/search only)
    geo_unit_code = Column(
        String(50), nullable=False, unique=True, index=True
    )  # e.g., "KE_COUNTRY", "KE_NAIROBI_COUNTY", "KE_WESTLANDS_CONSTITUENCY"

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    geo_code = Column(String(50), nullable=False, unique=True, index=True)

    # Foreign Keys (ALWAYS use IDs for relationships)
    geo_level_id = Column(
        String(26),
        ForeignKey("geographic.geo_levels.id"),
        nullable=False,
        index=True,
    )
    parent_geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=True,
        index=True,
    )

    # Status Fields False if version is outdated
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_level = relationship("GeoLevels", backref="geo_units")
    parent_geo_unit = relationship(
        "GeoUnits", remote_side=[id], backref="child_geo_units"
    )

    # Constraints and Indexes
    __table_args__ = (
        # Ensure geo_code follows hierarchical pattern
        Index("idx_geo_units_code_hierarchy", "geo_code"),
        Index("idx_geo_units_parent_level", "parent_geo_unit_id", "geo_level_id"),
        Index("idx_geo_units_active_level", "is_active", "geo_level_id"),
        Index("idx_geo_units_geo_unit_code", "geo_unit_code"),  # For display/search
        Index("idx_geo_units_name", "name"),  # For display/search
        # Unique constraint for name within same parent and level
        UniqueConstraint(
            "name",
            "parent_geo_unit_id",
            "geo_level_id",
            name="uq_geo_units_name_parent_level",
        ),
        # Geographic Unit Code unique constraint (business identifier)
        Index("uq_geo_units_geo_unit_code", "geo_unit_code", unique=True),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoUnits(id={self.id}, geo_unit_code='{self.geo_unit_code}', name='{self.name}')>"
