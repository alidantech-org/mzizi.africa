"""Sourced identity transitions such as rename, split, and merger."""

from sqlalchemy import CheckConstraint, Column, Date, ForeignKey, Index, String, Text, UniqueConstraint

from app.config.database import Base
from ulid import ulid


class GeoUnitChangeRelationships(Base):
    __tablename__ = "geo_unit_change_relationships"
    __table_args__ = (
        CheckConstraint(
            "relation_type IN ('renamed_to', 'split_into', 'merged_into', 'continued_as')",
            name="ck_geo_unit_change_relationship_type",
        ),
        Index("idx_geo_unit_change_source", "source_geo_unit_id", "valid_from"),
        Index("idx_geo_unit_change_target", "target_geo_unit_id", "valid_from"),
        UniqueConstraint("source_geo_unit_id", "target_geo_unit_id", "relation_type", "valid_from", name="uq_geo_unit_change_relationship"),
        {"schema": "geographic"},
    )

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))
    source_geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False)
    target_geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False)
    relation_type = Column(String(30), nullable=False)
    valid_from = Column(Date, nullable=False)
    valid_to = Column(Date, nullable=True)
    source_reference = Column(Text, nullable=False)

