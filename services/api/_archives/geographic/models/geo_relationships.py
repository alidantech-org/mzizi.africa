from sqlalchemy import (
    Column,
    Integer,
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


class GeoRelationships(Base):
    """
    Handles non-standard relationships between geographic units.
    Used for boundary overlaps, temporary admin units, cross-cutting jurisdictions.
    """

    __tablename__ = "geo_relationships"

    # Primary Key
    relation_id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    parent_geo_id = Column(
        Integer, ForeignKey("geographic.geo_units.geo_id"), nullable=False, index=True
    )
    child_geo_id = Column(
        Integer, ForeignKey("geographic.geo_units.geo_id"), nullable=False, index=True
    )

    # Relationship Fields
    relation_type = Column(
        String(50), nullable=False, index=True
    )  # contains, overlaps, shared
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # null means currently valid
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent_geo = relationship(
        "GeoUnits", foreign_keys=[parent_geo_id], backref="child_relationships"
    )
    child_geo = relationship(
        "GeoUnits", foreign_keys=[child_geo_id], backref="parent_relationships"
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
            "parent_geo_id != child_geo_id", name="ck_geo_relationships_no_self"
        ),
        # Performance indexes
        Index("idx_geo_relationships_parent_type", "parent_geo_id", "relation_type"),
        Index("idx_geo_relationships_child_type", "child_geo_id", "relation_type"),
        Index(
            "idx_geo_relationships_dates",
            "parent_geo_id",
            "child_geo_id",
            "valid_from",
            "valid_to",
        ),
        Index("idx_geo_relationships_current", "relation_type", "valid_to"),
        # Unique constraint to prevent duplicate relationships
        Index(
            "uq_geo_relationships_parent_child_type",
            "parent_geo_id",
            "child_geo_id",
            "relation_type",
            "valid_from",
            unique=True,
        ),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoRelationships(relation_id={self.relation_id}, parent_geo_id={self.parent_geo_id}, child_geo_id={self.child_geo_id}, relation_type='{self.relation_type}')>"
