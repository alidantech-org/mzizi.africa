from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class OverruleActionEnum(enum.Enum):
    """Enumeration of overrule actions"""

    STRIKE = "STRIKE"
    STAY = "STAY"
    SUSPEND = "SUSPEND"
    INVALIDATE = "INVALIDATE"
    MODIFY = "MODIFY"
    DECLARE_UNCONSTITUTIONAL = "DECLARE_UNCONSTITUTIONAL"
    SET_ASIDE = "SET_ASIDE"
    VARY = "VARY"


class JudicialOverrules(Base):
    """
    Judicial overrules table - bridge table linking rulings to laws.
    Explicitly links a ruling to a Law in your system to mark it as "Unconstitutional."
    Examples: Constitutional court striking down sections of laws, judicial review of regulations.
    """

    __tablename__ = "judicial_overrules"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    ruling_id = Column(
        String(26),
        ForeignKey("justice.judicial_rulings.id"),
        nullable=False,
        index=True,
    )
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )
    law_instrument_id = Column(
        String(26),
        ForeignKey("legal.legal_instruments.id"),
        nullable=True,
        index=True,
    )
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )

    # Core Fields
    action = Column(
        String(30), nullable=False, index=True
    )  # STRIKE, STAY, SUSPEND, INVALIDATE, etc.

    # Overrule Details
    overrule_reason = Column(
        Text, nullable=False
    )  # Why the court overruled this law/section
    legal_basis = Column(Text, nullable=True)  # Legal principles cited in the overrule

    # Scope and Effect
    scope = Column(String(20), nullable=True, index=True)  # TOTAL, PARTIAL, LIMITED
    effective_date = Column(
        Date, nullable=True, index=True
    )  # When the overrule takes effect
    expiry_date = Column(
        Date, nullable=True, index=True
    )  # When the overrule expires (if temporary)

    # Implementation
    compliance_required = Column(
        String(20), nullable=True, index=True
    )  # IMMEDIATE, WITHIN_PERIOD, NO_ACTION
    compliance_deadline = Column(
        Date, nullable=True, index=True
    )  # Deadline for compliance

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="ACTIVE"
    )  # ACTIVE, APPEALED, OVERTURNED, EXPIRED

    # References
    affected_offices = Column(
        Text, nullable=True
    )  # JSON array of office IDs affected by this overrule
    implementation_notes = Column(
        Text, nullable=True
    )  # Notes on how to implement the overrule

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    judicial_ruling = relationship("JudicialRulings", backref="overrules")
    law_section = relationship("LegalSections", backref="judicial_overrules")
    law_instrument = relationship("LegalInstruments", backref="judicial_overrules")
    constitution_section = relationship(
        "ConstitutionSections", backref="judicial_overrules"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_judicial_overrules_ruling", "ruling_id"),
        Index("idx_judicial_overrules_law_section", "law_section_id"),
        Index("idx_judicial_overrules_law_instrument", "law_instrument_id"),
        Index("idx_judicial_overrules_constitution_section", "constitution_section_id"),
        Index("idx_judicial_overrules_action", "action"),
        Index("idx_judicial_overrules_status", "status"),
        Index("idx_judicial_overrules_effective", "effective_date"),
        {"schema": "justice"},
    )

    def __repr__(self):
        return f"<JudicialOverrules(id={self.id}, ruling_id={self.ruling_id}, action='{self.action}', status='{self.status}')>"
