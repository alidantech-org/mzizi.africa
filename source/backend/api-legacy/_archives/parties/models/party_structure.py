from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class StructureLevelEnum(enum.Enum):
    """Enumeration of party structure levels"""

    NATIONAL = "NATIONAL"
    REGIONAL = "REGIONAL"
    COUNTY = "COUNTY"
    LOCAL = "LOCAL"


class PartyStructure(Base):
    """
    Party structure table - defines internal hierarchical organization.
    Examples: National Executive, County Branches, Local Chapters.
    """

    __tablename__ = "party_structure"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    party_id = Column(
        String(26),
        ForeignKey("political_parties.parties.id"),
        nullable=False,
        index=True,
    )
    parent_unit_id = Column(
        String(26),
        ForeignKey("political_parties.party_structure.id"),
        nullable=True,
        index=True,
    )

    # Core Fields
    unit_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. NATIONAL_EXEC, COUNTY_BRANCH
    name = Column(String(200), nullable=False, index=True)
    level = Column(
        String(20), nullable=False, index=True
    )  # NATIONAL, REGIONAL, COUNTY, LOCAL

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    party = relationship("Parties", backref="structure_units")
    parent_unit = relationship(
        "PartyStructure", remote_side=[id], backref="child_units"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_party_structure_unit_code", "unit_code", unique=True),
        Index("idx_party_structure_party", "party_id", "level"),
        Index("idx_party_structure_parent", "parent_unit_id"),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<PartyStructure(id={self.id}, unit_code='{self.unit_code}', name='{self.name}', level='{self.level}')>"
