from sqlalchemy import (
    Column,
    String,
    Text,
    Date,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class GeoRelationships(Base):
    """
    Handles non-standard relationships between geographic units.
    Used for boundary overlaps, temporary admin units, cross-cutting jurisdictions.

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs.
    """

    __tablename__ = "geo_relationships"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (Use code references for easier seeding and searching)
    parent_geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=True,
        index=True,
    )
    parent_geo_code = Column(
        String(50), nullable=False, index=True
    )  # Reference to geo_units.geo_unit_code

    child_geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=True,
        index=True,
    )
    child_geo_code = Column(
        String(50), nullable=False, index=True
    )  # Reference to geo_units.geo_unit_code

    # Relationship Fields
    relation_type = Column(
        String(50), nullable=False, index=True
    )  # contains, overlaps, shared, adjacent_to, part_of
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # null means currently valid
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent_geo_unit = relationship(
        "GeoUnits", foreign_keys=[parent_geo_unit_id], backref="child_relationships"
    )
    child_geo_unit = relationship(
        "GeoUnits", foreign_keys=[child_geo_unit_id], backref="parent_relationships"
    )

    # Constraints and Indexes
    __table_args__ = (
        # Ensure valid relation types
        CheckConstraint(
            "relation_type IN ('contains', 'overlaps', 'shared', 'adjacent_to', 'part_of')",
            name="ck_geo_relationships_type",
        ),
        # Prevent self-relationships
        CheckConstraint(
            "parent_geo_code != child_geo_code",
            name="ck_geo_relationships_no_self",
        ),
        # Indexes for performance
        Index(
            "idx_geo_relationships_parent_child", "parent_geo_code", "child_geo_code"
        ),
        Index(
            "idx_geo_relationships_type_valid",
            "relation_type",
            "valid_from",
            "valid_to",
        ),
        Index("idx_geo_relationships_active", "valid_to"),  # NULL means currently valid
        # Unique constraint to prevent duplicate relationships
        Index(
            "uq_geo_relationships_parent_child_type",
            "parent_geo_code",
            "child_geo_code",
            "relation_type",
            "valid_from",
            unique=True,
        ),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoRelationships(id={self.id}, parent='{self.parent_geo_code}', child='{self.child_geo_code}', type='{self.relation_type}')>"
