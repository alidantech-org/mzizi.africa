from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class RulingTypeEnum(enum.Enum):
    """Enumeration of ruling types"""

    JUDGMENT = "JUDGMENT"
    ORDER = "ORDER"
    DECREE = "DECREE"
    RULING = "RULING"
    DIRECTION = "DIRECTION"
    CERTIFICATE = "CERTIFICATE"
    PROHIBITION = "PROHIBITION"
    MANDAMUS = "MANDAMUS"


class RulingOutcomeEnum(enum.Enum):
    """Enumeration of ruling outcomes"""

    GRANTED = "GRANTED"
    DISMISSED = "DISMISSED"
    ALLOWED = "ALLOWED"
    REJECTED = "REJECTED"
    STRUCK_OUT = "STRUCK_OUT"
    WITHDRAWN = "WITHDRAWN"
    SETTLED = "SETTLED"
    PARTIALLY_GRANTED = "PARTIALLY_GRANTED"


class JudicialRulings(Base):
    """
    Judicial rulings table - official decisions of the court.
    Examples: Constitutional judgments, civil orders, criminal sentences.
    """

    __tablename__ = "judicial_rulings"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    case_id = Column(
        String(26),
        ForeignKey("justice.legal_cases.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    ruling_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. RULING_2023_001
    ruling_type = Column(
        String(20), nullable=False, index=True
    )  # JUDGMENT, ORDER, DECREE, etc.
    ruling_title = Column(
        String(500), nullable=True, index=True
    )  # Brief title of the ruling

    # Ruling Content
    ruling_text = Column(Text, nullable=False)  # Full text of the official decision
    ruling_summary = Column(Text, nullable=True)  # Brief summary of the decision

    # Outcome
    outcome = Column(
        String(20), nullable=False, index=True
    )  # GRANTED, DISMISSED, ALLOWED, etc.
    relief_granted = Column(Text, nullable=True)  # What the court granted/denied

    # Timeline
    date_issued = Column(Date, nullable=False, index=True)  # When the ruling was issued
    date_effective = Column(
        Date, nullable=True, index=True
    )  # When the ruling takes effect

    # Judicial Details
    presiding_judge = Column(
        String(200), nullable=True, index=True
    )  # Name of the judge
    coram_judges = Column(
        Text, nullable=True
    )  # JSON array of all judges who heard the case

    # Legal Impact
    precedent_value = Column(
        String(20), nullable=True, index=True
    )  # BINDING, PERSUASIVE, NONE
    citation_reference = Column(
        String(100), nullable=True, index=True
    )  # Legal citation

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    legal_case = relationship("LegalCases", backref="rulings")
    judicial_overrules = relationship("JudicialOverrules", backref="judicial_ruling")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_judicial_rulings_ruling_code", "ruling_code", unique=True),
        Index("idx_judicial_rulings_case", "case_id"),
        Index("idx_judicial_rulings_type", "ruling_type"),
        Index("idx_judicial_rulings_outcome", "outcome"),
        Index("idx_judicial_rulings_date", "date_issued"),
        Index("idx_judicial_rulings_judge", "presiding_judge"),
        Index("idx_judicial_rulings_precedent", "precedent_value"),
        {"schema": "justice"},
    )

    def __repr__(self):
        return f"<JudicialRulings(id={self.id}, ruling_code='{self.ruling_code}', ruling_type='{self.ruling_type}', outcome='{self.outcome}')>"
