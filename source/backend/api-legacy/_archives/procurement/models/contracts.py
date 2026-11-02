from sqlalchemy import Column, String, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class ContractStatusEnum(enum.Enum):
    """Enumeration of contract status types"""

    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    TERMINATED = "TERMINATED"
    SUSPENDED = "SUSPENDED"
    EXPIRED = "EXPIRED"


class Contracts(Base):
    """
    Contracts table - awarded procurement contracts.
    Examples: Infrastructure contracts, service agreements, supply contracts.
    """

    __tablename__ = "contracts"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    contract_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. CONTRACT_2023_001
    contract_title = Column(String(300), nullable=False, index=True)

    # Foreign Keys
    tender_id = Column(
        String(26),
        ForeignKey("procurement.tenders.id"),
        nullable=False,
        index=True,
    )
    winning_bid_id = Column(
        String(26), ForeignKey("procurement.bids.id"), nullable=True, index=True
    )
    vendor_id = Column(
        String(26),
        ForeignKey("procurement.vendors.id"),
        nullable=False,
        index=True,
    )  # NEW: Direct vendor link

    # Contract Value
    contract_value = Column(Numeric(15, 2), nullable=False, index=True)

    # Contract Timeline
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL for indefinite contracts
    awarded_date = Column(Date, nullable=False, index=True)

    # Contract Management
    procuring_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )
    geo_unit_code = Column(String(50), nullable=False, index=True)

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="PENDING"
    )  # PENDING, ACTIVE, COMPLETED, etc.

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
    tender = relationship("Tenders", backref="contracts")
    winning_bid = relationship("Bids", backref="awarded_contracts")
    vendor = relationship(
        "Vendors", backref="contracts"
    )  # NEW: Direct vendor relationship
    procuring_office = relationship("Offices", backref="managed_contracts")
    constitution = relationship("Constitutions", backref="contracts")
    constitution_section = relationship("ConstitutionSections", backref="contracts")
    law = relationship("LegalInstruments", backref="contracts")
    law_section = relationship("LegalSections", backref="contracts")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_contracts_contract_code", "contract_code", unique=True),
        Index("idx_contracts_tender", "tender_id"),
        Index("idx_contracts_winning_bid", "winning_bid_id"),
        Index("idx_contracts_vendor", "vendor_id"),  # NEW: Vendor index
        Index("idx_contracts_office", "procuring_office_id"),
        Index("idx_contracts_geo", "geo_unit_code"),
        Index("idx_contracts_status", "status"),
        Index("idx_contracts_dates", "start_date", "end_date", "awarded_date"),
        Index("idx_contracts_value", "contract_value"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Contracts(id={self.id}, contract_code='{self.contract_code}', contract_title='{self.contract_title}', status='{self.status}')>"
