from sqlalchemy import Column, String, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid
import enum


class ContractStatusEnum(enum.Enum):
    """Enumeration of contract status types"""

    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    TERMINATED = "terminated"
    SUSPENDED = "suspended"
    EXPIRED = "expired"


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
        default=lambda: str(ulid()),
        index=True,
    )

    # Core Fields
    contract_code = Column(
        String(100), unique=True, nullable=False, index=True
    )  # Business identifier code
    contract_title = Column(String(300), nullable=False, index=True)

    # Entity References (Code System)
    tender_code = Column(String(100), nullable=True, index=True)  # Tender code
    tender_id = Column(
        String(26),
        ForeignKey("procurement.tenders.id"),
        nullable=True,
        index=True,
    )
    awarded_to_entity_code = Column(
        String(100), nullable=True, index=True
    )  # LegalEntity code (supplier)
    awarded_to_entity_id = Column(
        String(26),
        ForeignKey("entities.legal_entities.id"),
        nullable=True,
        index=True,
    )
    contracting_entity_code = Column(
        String(100), nullable=True, index=True
    )  # FinanceEntity code (buyer)
    contracting_entity_id = Column(
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
    contracting_office_code = Column(
        String(100), nullable=True, index=True
    )  # Office code
    contracting_office_id = Column(
        String(26),
        ForeignKey("offices.offices.id"),
        nullable=True,
        index=True,
    )
    contracting_office_holder_code = Column(
        String(100), nullable=True, index=True
    )  # Office holder person code
    contracting_office_holder_id = Column(
        String(26),
        ForeignKey("offices.holders.id"),
        nullable=True,
        index=True,
    )  # Person currently holding the office

    # Contract Value
    contract_value = Column(Numeric(18, 2), nullable=False, index=True)
    currency_code = Column(String(10), nullable=False, index=True, default="KES")

    # Contract Timeline
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL for indefinite contracts
    awarded_date = Column(Date, nullable=False, index=True)

    # Status and Workflow
    status = Column(
        String(50), nullable=False, index=True, default="pending"
    )  # pending, active, completed, etc.
    status_code = Column(
        String(50), nullable=True, index=True
    )  # Status code for business logic

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    tender = relationship("Tenders", backref="contracts")
    awarded_to_entity = relationship("LegalEntities", backref="awarded_contracts")
    contracting_entity = relationship("FinanceEntities", backref="contracted_contracts")
    geo_unit = relationship("GeoUnits", backref="contracts")
    contracting_office = relationship("Offices", backref="managed_contracts")
    contracting_office_holder = relationship("Holders", backref="managed_contracts")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_contracts_contract_code", "contract_code", unique=True),
        Index("idx_contracts_tender", "tender_id"),
        Index("idx_contracts_office", "contracting_office_id"),
        Index("idx_contracts_holder", "contracting_office_holder_id"),
        Index("idx_contracts_geo", "geo_unit_code"),
        Index("idx_contracts_status", "status"),
        Index("idx_contracts_dates", "start_date", "end_date", "awarded_date"),
        Index("idx_contracts_value", "contract_value"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Contracts(id={self.id}, contract_code='{self.contract_code}', contract_title='{self.contract_title}', status='{self.status}')>"
