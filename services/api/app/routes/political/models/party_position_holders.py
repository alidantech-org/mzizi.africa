from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class PartyPositionHolders(Base):
    """
    Party position holders table - tracks people holding party positions over time.
    Examples: Current party chairperson, secretary general, treasurer.
    """

    __tablename__ = "party_position_holders"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    position_id = Column(String(26), ForeignKey("political.party_positions.id"), nullable=True, index=True)
    person_id = Column(String(26), ForeignKey("people.people.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    position_code = Column(String(100), nullable=True, index=True)  # e.g. "CHAIRPERSON", "TREASURER"
    person_code = Column(String(100), nullable=True, index=True)  # e.g. "john-doe-123"

    # Temporal Fields
    valid_from = Column(Date, nullable=True, index=True)  # Made nullable
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current
    is_active = Column(Boolean, nullable=True, index=True)  # Made nullable

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    position = relationship("PartyPositions", backref="holders")
    person = relationship("People", backref="party_positions")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_party_position_holders_position", "position_id", "valid_from"),
        Index("idx_party_position_holders_person", "person_id", "valid_from"),
        Index("idx_party_position_holders_current", "position_id", "is_active"),
        Index("idx_party_position_holders_codes", "person_code", "position_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return (
            f"<PartyPositionHolders(id={self.id}, position_id={self.position_id}, person_id={self.person_id}, is_active={self.is_active})>"
        )
