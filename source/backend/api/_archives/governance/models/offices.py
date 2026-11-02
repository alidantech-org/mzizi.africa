from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class OfficeTypeEnum(enum.Enum):
    """Enumeration of office types"""

    EXECUTIVE = "executive"
    LEGISLATIVE = "legislative"
    JUDICIARY = "judiciary"


class AppointmentTypeEnum(enum.Enum):
    """Enumeration of appointment types"""

    ELECTIVE = "ELECTIVE"
    APPOINTED = "APPOINTED"
    NOMINATED = "NOMINATED"


class LegalClassificationEnum(enum.Enum):
    """Enumeration of legal classifications for government offices"""

    STATE_OFFICE = "STATE_OFFICE"
    CONSTITUTIONAL_COMMISSION = "CONSTITUTIONAL_COMMISSION"
    STATUTORY_BODY = "STATUTORY_BODY"
    INDEPENDENT_OFFICE = "INDEPENDENT_OFFICE"
    JUDICIAL_OFFICE = "JUDICIAL_OFFICE"
    LEGISLATIVE_OFFICE = "LEGISLATIVE_OFFICE"
    EXECUTIVE_OFFICE = "EXECUTIVE_OFFICE"


class Offices(Base):
    """
    Core offices table - defines government offices with full legal traceability.
    Examples: President, MP, Cabinet Secretary, Chief Justice, County Governor

    Legal Classifications:
    - STATE_OFFICE: Individual head of state/government (President, Governor)
    - CONSTITUTIONAL_COMMISSION: Body created by Constitution (IEBC, CJSC)
    - STATUTORY_BODY: Board created by Act of Parliament (KRA, TSC)
    - INDEPENDENT_OFFICE: Specialized office created by Law/Constitution (ORPP, DPP)
    - JUDICIAL_OFFICE: Courts and judicial offices (Supreme Court, High Court)
    - LEGISLATIVE_OFFICE: Parliamentary offices (Speaker, MP, Senator)
    - EXECUTIVE_OFFICE: Executive branch offices (Cabinet Secretary, PS)
    """

    __tablename__ = "offices"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    office_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)

    # Office Classification
    office_type = Column(
        String(20), nullable=False, index=True
    )  # executive, legislative, judiciary
    appointment_type = Column(
        String(20), nullable=False, index=True
    )  # ELECTIVE, APPOINTED, NOMINATED

    # Legal Classification - NEW FIELD
    legal_classification = Column(
        String(30), nullable=False, index=True
    )  # STATE_OFFICE, CONSTITUTIONAL_COMMISSION, etc.

    # Geographic Scope
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # where the office exists

    # FULL LEGAL TRACEABILITY
    constitution_id = Column(
        String(26),
        ForeignKey("constitution.constitutions.id"),
        nullable=True,
        index=True,
    )
    constitution_code = Column(String(20), nullable=True, index=True)
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )

    law_id = Column(
        String(26),
        ForeignKey("legal.legal_instruments.id"),
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
    constitution = relationship("Constitutions", backref="offices")
    constitution_section = relationship("ConstitutionSections", backref="offices")
    law = relationship("LegalInstruments", backref="offices")
    law_section = relationship("LegalSections", backref="offices")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_offices_office_code", "office_code", unique=True),
        Index("idx_offices_type_geo", "office_type", "geo_unit_code"),
        Index("idx_offices_appointment", "appointment_type"),
        Index("idx_offices_legal_classification", "legal_classification"),
        {"schema": "governance"},
    )

    def __repr__(self):
        return f"<Offices(id={self.id}, office_code='{self.office_code}', name='{self.name}', legal_classification='{self.legal_classification}')>"
