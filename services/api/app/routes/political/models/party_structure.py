from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class PartyStructure(Base):
    """
    Party structure table - defines internal hierarchical organization.
    Examples: National Executive, County Branches, Local Chapters.
    """

    __tablename__ = "party_structure"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    party_id = Column(String(26), ForeignKey("political.parties.id"), nullable=True, index=True)
    parent_unit_id = Column(String(26), ForeignKey("political.party_structure.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    party_code = Column(String(100), nullable=True, index=True)  # e.g. "odm", "uda"
    parent_unit_code = Column(String(100), nullable=True, index=True)  # e.g. "NATIONAL_EXEC"

    # Core Fields
    unit_code = Column(String(100), nullable=False, unique=True, index=True)  # e.g. NATIONAL_EXEC, COUNTY_BRANCH
    name = Column(String(200), nullable=False, index=True)
    level = Column(String(50), nullable=True, index=True)  # e.g. "national", "regional", "county", "local"

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    party = relationship("Parties", backref="structure_units")
    parent_unit = relationship("PartyStructure", remote_side=[id], backref="child_units")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_party_structure_unit_code", "unit_code", unique=True),
        Index("idx_party_structure_party", "party_id", "level"),
        Index("idx_party_structure_parent", "parent_unit_id"),
        Index("idx_party_structure_codes", "party_code", "unit_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return f"<PartyStructure(id={self.id}, unit_code='{self.unit_code}', name='{self.name}', level='{self.level}')>"
