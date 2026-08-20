from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class PartyPositionHolders(Base):
    """
    Party position holders table - tracks people holding party positions over time.
    Examples: Current party chairperson, secretary general, treasurer.
    """

    __tablename__ = "party_position_holders"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    position_id = Column(
        String(26),
        ForeignKey("political_parties.party_positions.id"),
        nullable=False,
        index=True,
    )
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    position = relationship("PartyPositions", backref="holders")
    person = relationship("People", backref="party_positions")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_party_position_holders_position", "position_id", "valid_from"),
        Index("idx_party_position_holders_person", "person_id", "valid_from"),
        Index("idx_party_position_holders_current", "position_id", "is_active").filter(
            is_active == True
        ),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<PartyPositionHolders(id={self.id}, position_id={self.position_id}, person_id={self.person_id}, is_active={self.is_active})>"
