from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class PartyIdeology(Base):
    """
    Party ideology table - tracks political ideology evolution over time.
    Examples: Social Democracy, Conservatism, Liberalism, Nationalism.
    """

    __tablename__ = "party_ideology"

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

    # Core Fields
    ideology_code = Column(
        String(50), nullable=False, index=True
    )  # e.g. SOCIAL_DEMOCRACY, CONSERVATIVE
    description = Column(Text, nullable=True)

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    party = relationship("Parties", backref="ideologies")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_party_ideology_party", "party_id", "valid_from"),
        Index("idx_party_ideology_current", "party_id", "valid_to").filter(
            valid_to.is_(None)
        ),
        Index("idx_party_ideology_code", "ideology_code"),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<PartyIdeology(id={self.id}, party_id={self.party_id}, ideology_code='{self.ideology_code}', valid_from={self.valid_from})>"
