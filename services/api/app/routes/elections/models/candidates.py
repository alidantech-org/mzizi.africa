from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class Candidates(Base):
    """
    Candidates table - people contesting seats in elections.
    Links people to electoral contests with legal eligibility traceability.
    """

    __tablename__ = "candidates"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Candidate Code (Business identifier - represents candidacies)
    # These represent candidate codes like "ke/nairobi/westlands/2022-general-election/john-doe" for easy reference
    candidate_code = Column(String(150), nullable=False, unique=True, index=True)

    # Candidate Information
    description = Column(Text, nullable=True)  # Brief description of candidate's platform, background, or key messages

    # Foreign Keys (ALL NULLABLE for back-population)
    person_id = Column(String(26), ForeignKey("people.people.id"), nullable=True, index=True)
    seat_id = Column(String(26), ForeignKey("elections.seats.id"), nullable=True, index=True)
    party_id = Column(String(26), ForeignKey("political.parties.id"), nullable=True, index=True)  # or independent
    election_id = Column(String(26), ForeignKey("elections.elections.id"), nullable=True, index=True)  # Which election

    # Reference Codes (for search/filtering - NOT foreign keys)
    person_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/nairobi/john-doe"
    seat_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/nairobi/westlands/mp"
    election_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/2022-general-election", "ke/nairobi/2023-by-election"
    party_code = Column(String(100), nullable=True, index=True)  # e.g. "ke/odm" (NULL if independent)

    # Independent Status
    is_independent = Column(Boolean, nullable=True, default=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    person = relationship("People", backref="candidacies")
    seat = relationship("Seats", backref="candidates")
    party = relationship("Parties", backref="candidates")
    election = relationship("Elections", backref="candidates")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_candidates_candidate_code", "candidate_code", unique=True),
        Index("idx_candidates_seat_person", "seat_id", "person_id"),
        Index("idx_candidates_party", "party_id"),
        Index("idx_candidates_independent", "is_independent"),
        Index("idx_candidates_codes", "person_code", "seat_code", "party_code"),
        # Business rule: independent candidates should not have party_code
        CheckConstraint("(is_independent = false) OR (party_code IS NULL)", name="ck_candidates_independent_no_party"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Candidates(id={self.id}, candidate_code='{self.candidate_code}', person_id={self.person_id}, seat_id={self.seat_id})>"
