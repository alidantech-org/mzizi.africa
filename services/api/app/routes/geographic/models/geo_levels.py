from sqlalchemy import (
    Column,
    Index,
    Boolean,
    String,
    Text,
    DateTime,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class GeoLevels(Base):
    """
    Defines types of administrative levels and their hierarchical relationships.
    Examples: country, county, constituency, ward

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "geo_levels"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # geographic-level-code (business identifier - for display/search only) e.g., "country", "county", "constituency", "ward"
    geo_level_code = Column(String(30), nullable=False, unique=True, index=True)

    # Core Fields
    level_name = Column(String(100), nullable=False, index=True)
    level_order = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Self-referencing hierarchy
    parent_geo_level_id = Column(
        String(26), ForeignKey("geographic.geo_levels.id"), nullable=True, index=True
    )
    parent_geo_level_code = Column(
        String(30), nullable=True, index=True
    )  # Reference to parent geo_levels.geo_level_code

    # Is Active Field
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent_geo_level = relationship(
        "GeoLevels", remote_side=[id], backref="child_geo_levels"
    )

    # Indexes
    __table_args__ = (
        Index("idx_geo_levels_name", "level_name"),
        Index("uq_geo_levels_geo_level_code", "geo_level_code", unique=True),
        Index("idx_geo_levels_parent", "parent_geo_level_id"),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoLevels(id={self.id}, geo_level_code='{self.geo_level_code}', level_name='{self.level_name}')>"
