from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class PartyPositions(Base):
    """
    Party positions table - defines roles within party structure.
    Examples: Chairperson, Secretary General, Treasurer, Women Leader.
    """

    __tablename__ = "party_positions"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    party_id = Column(String(26), ForeignKey("political.parties.id"), nullable=True, index=True)
    unit_id = Column(String(26), ForeignKey("political.party_structure.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    party_code = Column(String(100), nullable=True, index=True)  # e.g. "odm", "uda"
    unit_code = Column(String(100), nullable=True, index=True)  # e.g. "NATIONAL_EXEC", "COUNTY_BRANCH"

    # Core Fields
    position_code = Column(String(100), nullable=False, unique=True, index=True)  # e.g. CHAIRPERSON, TREASURER
    name = Column(String(200), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    party = relationship("Parties", backref="positions")
    unit = relationship("PartyStructure", backref="positions")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_party_positions_position_code", "position_code", unique=True),
        Index("idx_party_positions_party", "party_id"),
        Index("idx_party_positions_unit", "unit_id"),
        Index("idx_party_positions_codes", "party_code", "position_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return f"<PartyPositions(id={self.id}, position_code='{self.position_code}', name='{self.name}', unit_id={self.unit_id})>"
