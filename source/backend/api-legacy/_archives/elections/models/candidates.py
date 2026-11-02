from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class Candidates(Base):
    """
    Candidates table - people contesting seats in elections.
    Links people to electoral contests with legal eligibility traceability.
    """

    __tablename__ = "candidates"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    candidate_code = Column(String(50), unique=True, nullable=False, index=True)

    # Foreign Keys
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )
    seat_id = Column(
        String(26), ForeignKey("elections.seats.id"), nullable=False, index=True
    )
    party_id = Column(
        String(26),
        ForeignKey("political_parties.parties.id"),
        nullable=True,
        index=True,
    )  # or independent

    # Independent Status
    is_independent = Column(Boolean, default=False, nullable=False, index=True)

    # LEGAL ELIGIBILITY TRACE
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="candidacies")
    seat = relationship("Seats", backref="candidates")
    party = relationship("Parties", backref="candidates")
    constitution_section = relationship("ConstitutionSections", backref="candidates")
    law_section = relationship("LegalSections", backref="candidates")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_candidates_candidate_code", "candidate_code", unique=True),
        Index("idx_candidates_seat_person", "seat_id", "person_id"),
        Index("idx_candidates_party", "party_id"),
        Index("idx_candidates_independent", "is_independent"),
        # Business rule: independent candidates should not have party_id
        Index("ck_candidates_independent_no_party", "party_id", "is_independent").where(
            (is_independent == True) & (party_id.is_(None))
        ),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Candidates(id={self.id}, candidate_code='{self.candidate_code}', person_id={self.person_id}, seat_id={self.seat_id})>"
