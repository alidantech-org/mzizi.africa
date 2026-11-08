from sqlalchemy import (
    UUID,
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class GeoUnits(Base):
    """
    Core table storing every geographic entity in the system.
    Examples: kenya, nairobi-county, westlands-constituency, parklands-ward

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "geo_units"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Geographic Unit Code (Business identifier - for display/search only)
    # e.g., "ke", "ke-nairobi", "ke-nairobi-westlands"
    geo_unit_code = Column(String(50), nullable=False, unique=True, index=True)

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    geo_code = Column(String(50), nullable=False, unique=True, index=True)

    # Foreign Keys (Use code references for easier seeding and searching)
    geo_level_id = Column(
        String(26),
        ForeignKey("geographic.geo_levels.id"),
        nullable=True,
        index=True,
    )
    geo_level_code = Column(
        String(30), nullable=False, index=True
    )  # Reference to geo_levels.geo_level_code

    parent_geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=True,
        index=True,
    )
    parent_geo_code = Column(
        String(50), nullable=True, index=True
    )  # Reference to geo_units.geo_unit_code

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
