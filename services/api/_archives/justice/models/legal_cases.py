from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class CaseTypeEnum(enum.Enum):
    """Enumeration of case types"""

    CONSTITUTIONAL = "CONSTITUTIONAL"
    CIVIL = "CIVIL"
    CRIMINAL = "CRIMINAL"
    FAMILY = "FAMILY"
    COMMERCIAL = "COMMERCIAL"
    LAND = "LAND"
    LABOR = "LABOR"
    ELECTORAL = "ELECTORAL"
    HUMAN_RIGHTS = "HUMAN_RIGHTS"
    TAX = "TAX"
    CORPORATE = "CORPORATE"


class CaseStatusEnum(enum.Enum):
    """Enumeration of case status types"""

    FILED = "FILED"
    PENDING = "PENDING"
    HEARING = "HEARING"
    RESERVED = "RESERVED"
    JUDGMENT = "JUDGMENT"
    APPEALED = "APPEALED"
    DISMISSED = "DISMISSED"
    SETTLED = "SETTLED"
    WITHDRAWN = "WITHDRAWN"


class LegalCases(Base):
    """
    Legal cases table - tracks active disputes in the justice system.
    Examples: Constitutional challenges, civil disputes, criminal prosecutions.
    """

    __tablename__ = "legal_cases"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    case_number = Column(
        String(100), unique=True, nullable=False, index=True
    )  # e.g. "PETITION NO. 001 OF 2023"
    case_title = Column(
        String(500), nullable=False, index=True
    )  # Brief description of the case
    case_type = Column(
        String(20), nullable=False, index=True
    )  # CONSTITUTIONAL, CIVIL, CRIMINAL, etc.

    # Foreign Keys
    court_station_id = Column(
        String(26),
        ForeignKey("justice.court_stations.id"),
        nullable=False,
        index=True,
    )
    plaintiff_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=True, index=True
    )  # Person suing
    defendant_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=True, index=True
    )  # Person being sued

    # Government Entity Defendants (can sue/be sued)
    defendant_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=True,
        index=True,
    )  # Office being sued

    # Case Details
    case_summary = Column(Text, nullable=True)  # Brief summary of the dispute
    relief_sought = Column(
        Text, nullable=True
    )  # What the plaintiff wants the court to do

    # Timeline
    filing_date = Column(Date, nullable=False, index=True)
    hearing_date = Column(Date, nullable=True, index=True)
    judgment_date = Column(Date, nullable=True, index=True)

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="FILED"
    )  # FILED, PENDING, JUDGMENT, etc.

    # Legal References
    constitution_sections_challenged = Column(
        Text, nullable=True
    )  # JSON array of constitution sections being challenged
    laws_challenged = Column(Text, nullable=True)  # JSON array of laws being challenged

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    court_station = relationship("CourtStations", backref="cases")
    plaintiff = relationship(
        "People", foreign_keys=[plaintiff_id], backref="cases_as_plaintiff"
    )
    defendant = relationship(
        "People", foreign_keys=[defendant_id], backref="cases_as_defendant"
    )
    defendant_office = relationship("Offices", backref="cases_as_defendant")
    judicial_rulings = relationship("JudicialRulings", backref="legal_case")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_legal_cases_case_number", "case_number", unique=True),
        Index("idx_legal_cases_court", "court_station_id"),
        Index("idx_legal_cases_plaintiff", "plaintiff_id"),
        Index("idx_legal_cases_defendant", "defendant_id"),
        Index("idx_legal_cases_defendant_office", "defendant_office_id"),
        Index("idx_legal_cases_type", "case_type"),
        Index("idx_legal_cases_status", "status"),
        Index("idx_legal_cases_filing_date", "filing_date"),
        {"schema": "justice"},
    )

    def __repr__(self):
        return f"<LegalCases(id={self.id}, case_number='{self.case_number}', case_type='{self.case_type}', status='{self.status}')>"
