from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class PartyIdeology(Base):
    """
    Party ideology table - tracks political ideology evolution over time.
    Examples: Social Democracy, Conservatism, Liberalism, Nationalism.
    """

    __tablename__ = "party_ideology"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    party_id = Column(String(26), ForeignKey("political.parties.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    party_code = Column(String(100), nullable=True, index=True)  # e.g. "odm", "uda"

    # Core Fields
    ideology_code = Column(String(100), nullable=False, unique=True, index=True)  # e.g. SOCIAL_DEMOCRACY, CONSERVATIVE
    description = Column(Text, nullable=True)

    # Temporal Fields
    valid_from = Column(Date, nullable=True, index=True)  # Made nullable
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    party = relationship("Parties", backref="ideologies")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_party_ideology_ideology_code", "ideology_code", unique=True),
        Index("idx_party_ideology_party", "party_id", "valid_from"),
        Index("idx_party_ideology_current", "party_id", "valid_to"),
        Index("idx_party_ideology_codes", "party_code", "ideology_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return (
            f"<PartyIdeology(id={self.id}, party_id={self.party_id}, ideology_code='{self.ideology_code}', valid_from={self.valid_from})>"
        )
