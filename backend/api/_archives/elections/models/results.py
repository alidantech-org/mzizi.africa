from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class Results(Base):
    """
    Results table - votes and outcomes for electoral contests.
    Links candidates to their electoral performance and determines winners.
    """

    __tablename__ = "results"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    seat_id = Column(
        String(26), ForeignKey("elections.seats.id"), nullable=False, index=True
    )
    candidate_id = Column(
        String(26),
        ForeignKey("elections.candidates.id"),
        nullable=False,
        index=True,
    )

    # Vote Count and Outcome
    votes = Column(Integer, nullable=False, default=0, index=True)
    result_position = Column(
        Integer, nullable=False, index=True
    )  # 1 = winner, 2 = runner-up
    is_winner = Column(Boolean, default=False, nullable=False, index=True)

    # Legal Declaration
    declared_at = Column(Date, nullable=False, index=True)  # gazettement date

    # Legal Basis
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    seat = relationship("Seats", backref="results")
    candidate = relationship("Candidates", backref="results")
    law_section = relationship("LegalSections", backref="election_results")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_results_seat_candidate", "seat_id", "candidate_id", unique=True),
        Index("idx_results_seat_position", "seat_id", "result_position"),
        Index("idx_results_winner", "seat_id", "is_winner"),
        Index("idx_results_votes", "votes"),
        # Business rule: only one winner per seat
        Index("ck_results_one_winner_per_seat", "seat_id", "is_winner").where(
            is_winner == True
        ),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Results(id={self.id}, seat_id={self.seat_id}, candidate_id={self.candidate_id}, votes={self.votes}, is_winner={self.is_winner})>"
