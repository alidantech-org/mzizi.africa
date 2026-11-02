from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class TenderTypeEnum(enum.Enum):
    """Enumeration of tender types"""

    WORKS = "WORKS"
    SUPPLIES = "SUPPLIES"
    SERVICES = "SERVICES"
    CONSULTANCY = "CONSULTANCY"
    CONCESSION = "CONCESSION"


class ProcurementMethodEnum(enum.Enum):
    """Enumeration of procurement methods"""

    OPEN_TENDER = "OPEN_TENDER"
    RESTRICTED_TENDER = "RESTRICTED_TENDER"
    DIRECT_PROCUREMENT = "DIRECT_PROCUREMENT"
    QUOTATIONS = "QUOTATIONS"
    FRAMEWORK = "FRAMEWORK"
    E_PROCUREMENT = "E_PROCUREMENT"


class TenderStatusEnum(enum.Enum):
    """Enumeration of tender status types"""

    PUBLISHED = "PUBLISHED"
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    EVALUATED = "EVALUATED"
    AWARDED = "AWARDED"
    CANCELLED = "CANCELLED"


class Tenders(Base):
    """
    Tenders table - procurement opportunities and requirements.
    Examples: Infrastructure projects, service contracts, supply tenders.
    """

    __tablename__ = "tenders"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    tender_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. TENDER_2023_001
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Procurement Details
    procuring_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )
    geo_unit_code = Column(String(50), nullable=False, index=True)
    budget_item_id = Column(
        String(26),
        ForeignKey("finance.budget_items.id"),
        nullable=True,
        index=True,
    )

    tender_type = Column(
        String(20), nullable=False, index=True
    )  # WORKS, SUPPLIES, SERVICES, CONSULTANCY
    procurement_method = Column(
        String(20), nullable=False, index=True
    )  # OPEN_TENDER, DIRECT_PROCUREMENT, etc.
    estimated_value = Column(Numeric(15, 2), nullable=True, index=True)

    # Timeline
    publication_date = Column(Date, nullable=False, index=True)
    closing_date = Column(Date, nullable=False, index=True)

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="PUBLISHED"
    )  # PUBLISHED, OPEN, CLOSED, etc.

    # LEGAL TRACEABILITY
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
    procuring_office = relationship("Offices", backref="procured_tenders")
    budget_item = relationship("BudgetItems", backref="tenders")
    constitution = relationship("Constitutions", backref="tenders")
    constitution_section = relationship("ConstitutionSections", backref="tenders")
    law = relationship("LegalInstruments", backref="tenders")
    law_section = relationship("LegalSections", backref="tenders")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_tenders_tender_code", "tender_code", unique=True),
        Index("idx_tenders_office", "procuring_office_id"),
        Index("idx_tenders_geo", "geo_unit_code"),
        Index("idx_tenders_status", "status"),
        Index("idx_tenders_type", "tender_type"),
        Index("idx_tenders_dates", "publication_date", "closing_date"),
        Index("idx_tenders_value", "estimated_value"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Tenders(id={self.id}, tender_code='{self.tender_code}', title='{self.title}', status='{self.status}')>"
