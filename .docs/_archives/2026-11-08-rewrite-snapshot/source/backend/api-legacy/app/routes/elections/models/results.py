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
from ulid import ulid


class Results(Base):
    """
    Results table - votes and outcomes for electoral contests.
    Links candidates to their electoral performance and determines winners.
    """

    __tablename__ = "results"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    seat_id = Column(String(26), ForeignKey("elections.seats.id"), nullable=True, index=True)
    candidate_id = Column(String(26), ForeignKey("elections.candidates.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    seat_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/nairobi/westlands/mp"
    candidate_code = Column(String(150), nullable=False, index=True)  # e.g. "ke/nairobi/westlands/2022-general-election/john-doe"
    election_code = Column(String(100), nullable=False, index=True)  # e.g. "ke/2022-general-election", "ke/nairobi/2023-by-election"

    # Vote Count and Outcome
    votes = Column(Integer, nullable=True, default=0, index=True)
    result_position = Column(Integer, nullable=True, index=True)  # 1 = winner, 2 = runner-up
    is_winner = Column(Boolean, nullable=True, default=False, index=True)

    # Legal Declaration
    declared_at = Column(Date, nullable=True, index=True)  # gazettement date

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    seat = relationship("Seats", backref="results")
    candidate = relationship("Candidates", backref="results")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_results_seat_candidate", "seat_id", "candidate_id", unique=True),
        Index("idx_results_seat_position", "seat_id", "result_position"),
        Index("idx_results_winner", "seat_id", "is_winner"),
        Index("idx_results_votes", "votes"),
        Index("idx_results_codes", "seat_code", "candidate_code"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Results(id={self.id}, seat_id={self.seat_id}, candidate_id={self.candidate_id}, votes={self.votes}, is_winner={self.is_winner})>"
