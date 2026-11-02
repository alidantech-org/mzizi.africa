from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, Index, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid

class MembershipTypeEnum(str):
    """Enumeration of membership types"""

    MEMBER = "member"
    LEADER = "leader"
    OFFICIAL = "official"
    SUPPORTER = "supporter"


class PartyMembership(Base):
    """
    Party membership table - links people to political parties over time.
    Examples: Party members, leaders, officials, supporters.
    """

    __tablename__ = "party_membership"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    person_id = Column(String(26), ForeignKey("people.people.id"), nullable=True, index=True)
    party_id = Column(String(26), ForeignKey("political.parties.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    person_code = Column(String(100), nullable=True, index=True)
    party_code = Column(String(100), nullable=True, index=True)

    # Core Fields
    membership_type = Column(
        SQLEnum(
            MembershipTypeEnum.MEMBER,
            MembershipTypeEnum.LEADER,
            MembershipTypeEnum.OFFICIAL,
            MembershipTypeEnum.SUPPORTER,
            name="membership_type_enum",
            schema="political",
        ),
        nullable=True,
        index=True,
        default=MembershipTypeEnum.MEMBER,
    )
    role_title = Column(String(100), nullable=True, index=True)  # e.g. Party Leader, Secretary General

    # Temporal Fields
    valid_from = Column(Date, nullable=True, index=True)  # Made nullable
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current
    is_active = Column(Boolean, nullable=True, index=True)  # Made nullable

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    person = relationship("People", backref="party_memberships")
    party = relationship("Parties", backref="memberships")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_party_membership_person", "person_id", "valid_from"),
        Index("idx_party_membership_party", "party_id", "valid_from"),
        Index("idx_party_membership_current", "person_id", "is_active"),
        Index("idx_party_membership_type", "membership_type"),
        Index("idx_party_membership_codes", "person_code", "party_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return f"<PartyMembership(id={self.id}, person_id={self.person_id}, party_id={self.party_id}, membership_type='{self.membership_type}')>"
