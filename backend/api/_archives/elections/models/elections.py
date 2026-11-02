from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class ElectionTypeEnum(enum.Enum):
    """Enumeration of election types"""

    GENERAL = "GENERAL"
    BY_ELECTION = "BY_ELECTION"


class Elections(Base):
    """
    Elections table - defines election events with legal basis.
    Examples: 2022 General Election, 2023 Nairobi County By-Election
    """

    __tablename__ = "elections"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    election_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. GE_2022
    name = Column(String(200), nullable=False, index=True)  # 2022 General Election

    # Election Classification
    election_type = Column(
        String(20), nullable=False, index=True
    )  # GENERAL, BY_ELECTION
    election_date = Column(Date, nullable=False, index=True)

    # Legal Basis
    constitution_id = Column(
        String(26),
        ForeignKey("constitution.constitutions.id"),
        nullable=False,
        index=True,
    )
    constitution_code = Column(
        String(20), nullable=False, index=True
    )  # legal basis reference

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    constitution = relationship("Constitutions", backref="elections")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_elections_election_code", "election_code", unique=True),
        Index("idx_elections_type_date", "election_type", "election_date"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Elections(id={self.id}, election_code='{self.election_code}', name='{self.name}', election_type='{self.election_type}')>"
