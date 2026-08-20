from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class PartyPositions(Base):
    """
    Party positions table - defines roles within party structure.
    Examples: Chairperson, Secretary General, Treasurer, Women Leader.
    """

    __tablename__ = "party_positions"

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
    unit_id = Column(
        String(26),
        ForeignKey("political_parties.party_structure.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    position_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. CHAIRPERSON, TREASURER
    name = Column(String(200), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    party = relationship("Parties", backref="positions")
    unit = relationship("PartyStructure", backref="positions")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_party_positions_position_code", "position_code", unique=True),
        Index("idx_party_positions_party", "party_id"),
        Index("idx_party_positions_unit", "unit_id"),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<PartyPositions(id={self.id}, position_code='{self.position_code}', name='{self.name}', unit_id={self.unit_id})>"
