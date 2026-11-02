from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class MembershipTypeEnum(enum.Enum):
    """Enumeration of membership types"""

    MEMBER = "MEMBER"
    LEADER = "LEADER"
    OFFICIAL = "OFFICIAL"
    SUPPORTER = "SUPPORTER"


class PartyMembership(Base):
    """
    Party membership table - links people to political parties over time.
    Examples: Party members, leaders, officials, supporters.
    """

    __tablename__ = "party_membership"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )
    party_id = Column(
        String(26),
        ForeignKey("political_parties.parties.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    membership_type = Column(
        String(20), nullable=False, index=True
    )  # MEMBER, LEADER, OFFICIAL
    role_title = Column(
        String(100), nullable=True, index=True
    )  # e.g. Party Leader, Secretary General

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="party_memberships")
    party = relationship("Parties", backref="memberships")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_party_membership_person", "person_id", "valid_from"),
        Index("idx_party_membership_party", "party_id", "valid_from"),
        Index("idx_party_membership_current", "person_id", "is_active").filter(
            is_active == True
        ),
        Index("idx_party_membership_type", "membership_type"),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<PartyMembership(id={self.id}, person_id={self.person_id}, party_id={self.party_id}, membership_type='{self.membership_type}')>"
