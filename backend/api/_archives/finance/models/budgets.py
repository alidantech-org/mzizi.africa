from sqlalchemy import Column, String, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class BudgetStatusEnum(enum.Enum):
    """Enumeration of budget status types"""

    PROPOSED = "PROPOSED"
    APPROVED = "APPROVED"
    IMPLEMENTED = "IMPLEMENTED"
    AMENDED = "AMENDED"
    CANCELLED = "CANCELLED"


class Budgets(Base):
    """
    Budgets table - tracks financial allocations and approvals.
    Examples: National budget, county budget, departmental budget.
    """

    __tablename__ = "budgets"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    budget_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. NAT_BUDGET_2023_001
    name = Column(String(200), nullable=False, index=True)

    # Foreign Keys
    fiscal_year_id = Column(
        String(26),
        ForeignKey("finance.fiscal_years.id"),
        nullable=False,
        index=True,
    )
    geo_unit_code = Column(String(50), nullable=True, index=True)  # Geographic scope
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=True,
        index=True,
    )

    # Legal Authority
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

    # Financial Fields
    total_amount = Column(
        Numeric(15, 2), nullable=False, index=True
    )  # Total budget amount
    status = Column(
        String(20), nullable=False, index=True, default="PROPOSED"
    )  # PROPOSED, APPROVED, IMPLEMENTED

    # Approval Fields
    approved_date = Column(Date, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    fiscal_year = relationship("FiscalYears", backref="budgets")
    office = relationship("Offices", backref="budgets")
    constitution_section = relationship("ConstitutionSections", backref="budgets")
    law = relationship("LegalInstruments", backref="budgets")
    law_section = relationship("LegalSections", backref="budgets")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_budgets_budget_code", "budget_code", unique=True),
        Index("idx_budgets_fiscal_year", "fiscal_year_id"),
        Index("idx_budgets_office", "office_id"),
        Index("idx_budgets_geo", "geo_unit_code"),
        Index("idx_budgets_status", "status"),
        Index("idx_budgets_amount", "total_amount"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<Budgets(id={self.id}, budget_code='{self.budget_code}', name='{self.name}', total_amount={self.total_amount})>"
