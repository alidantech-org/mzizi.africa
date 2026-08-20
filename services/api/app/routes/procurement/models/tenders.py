from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid
import enum


class TenderTypeEnum(enum.Enum):
    """Enumeration of tender types"""

    WORKS = "works"
    SUPPLIES = "supplies"
    SERVICES = "services"
    CONSULTANCY = "consultancy"
    CONCESSION = "concession"


class ProcurementMethodEnum(enum.Enum):
    """Enumeration of procurement methods"""

    OPEN_TENDER = "open_tender"
    RESTRICTED_TENDER = "restricted_tender"
    DIRECT_PROCUREMENT = "direct_procurement"
    QUOTATIONS = "quotations"
    FRAMEWORK = "framework"
    E_PROCUREMENT = "e_procurement"


class TenderStatusEnum(enum.Enum):
    """Enumeration of tender status types"""

    PUBLISHED = "published"
    OPEN = "open"
    CLOSED = "closed"
    EVALUATED = "evaluated"
    AWARDED = "awarded"
    CANCELLED = "cancelled"


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
        default=lambda: str(ulid()),
        index=True,
    )

    # Core Fields
    tender_code = Column(
        String(100), unique=True, nullable=False, index=True
    )  # Business identifier code
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Entity References (Code System)
    issuing_entity_code = Column(
        String(100), nullable=True, index=True
    )  # FinanceEntity code
    issuing_entity_id = Column(
        String(26),
        ForeignKey("entities.finance_entities.id"),
        nullable=True,
        index=True,
    )
    geo_unit_code = Column(String(100), nullable=True, index=True)  # GeoUnit code
    geo_unit_id = Column(
        String(26),
        ForeignKey("geographic.geo_units.id"),
        nullable=True,
        index=True,
    )

    # Office References (for office holders in charge)
    procuring_office_code = Column(
        String(100), nullable=True, index=True
    )  # Office code
    procuring_office_id = Column(
        String(26),
        ForeignKey("offices.offices.id"),
        nullable=True,
        index=True,
    )
    procuring_office_holder_code = Column(
        String(100), nullable=True, index=True
    )  # Office holder person code
    procuring_office_holder_id = Column(
        String(26),
        ForeignKey("offices.holders.id"),
        nullable=True,
        index=True,
    )  # Person currently holding the office

    tender_type = Column(
        String(20), nullable=False, index=True
    )  # WORKS, SUPPLIES, SERVICES, CONSULTANCY
    procurement_method = Column(
        String(20), nullable=False, index=True
    )  # OPEN_TENDER, DIRECT_PROCUREMENT, etc.
    # Financial Details
    estimated_value = Column(Numeric(18, 2), nullable=True, index=True)
    currency_code = Column(String(10), nullable=False, index=True, default="KES")

    # Timeline
    publication_date = Column(Date, nullable=False, index=True)
    closing_date = Column(Date, nullable=False, index=True)

    # Status and Workflow
    status = Column(
        String(50), nullable=False, index=True, default="published"
    )  # published, open, closed, etc.
    status_code = Column(
        String(50), nullable=True, index=True
    )  # Status code for business logic

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    issuing_entity = relationship("FinanceEntities", backref="issued_tenders")
    geo_unit = relationship("GeoUnits", backref="tenders")
    procuring_office = relationship("Offices", backref="procured_tenders")
    procuring_office_holder = relationship("Holders", backref="managed_tenders")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_tenders_tender_code", "tender_code", unique=True),
        Index("idx_tenders_geo", "geo_unit_code"),
        Index("idx_tenders_office", "procuring_office_id"),
        Index("idx_tenders_holder", "procuring_office_holder_id"),
        Index("idx_tenders_status", "status"),
        Index("idx_tenders_type", "tender_type"),
        Index("idx_tenders_dates", "publication_date", "closing_date"),
        Index("idx_tenders_value", "estimated_value"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Tenders(id={self.id}, tender_code='{self.tender_code}', title='{self.title}', status='{self.status}')>"
