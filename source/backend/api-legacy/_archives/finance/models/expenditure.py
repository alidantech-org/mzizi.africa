from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class Expenditure(Base):
    """
    Expenditure table - tracks spending against budget allocations.
    Examples: Salary payments, project costs, operational expenses.
    """

    __tablename__ = "expenditure"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    budget_item_id = Column(
        String(26),
        ForeignKey("finance.budget_items.id"),
        nullable=False,
        index=True,
    )
    fiscal_year_id = Column(
        String(26),
        ForeignKey("finance.fiscal_years.id"),
        nullable=False,
        index=True,
    )
    contract_id = Column(
        String(26),
        ForeignKey("tenders.contracts.id"),
        nullable=True,
        index=True,
    )  # NEW: Link to contract

    # Core Fields
    expenditure_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. EXP_2023_001
    amount = Column(Numeric(15, 2), nullable=False, index=True)

    # Temporal Fields
    spent_date = Column(Date, nullable=False, index=True)

    # Geographic and Authority References
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=True,
        index=True,
    )
    geo_unit_code = Column(String(50), nullable=True, index=True)
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )
    description = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    budget_item = relationship("BudgetItems", backref="expenditure")
    fiscal_year = relationship("FiscalYears", backref="expenditure")
    contract = relationship(
        "Contracts", backref="expenditure"
    )  # NEW: Contract relationship
    office = relationship("Offices", backref="expenditure")
    law_section = relationship("LegalSections", backref="expenditure")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_expenditure_expenditure_code", "expenditure_code", unique=True),
        Index("idx_expenditure_budget_item", "budget_item_id"),
        Index("idx_expenditure_fiscal_year", "fiscal_year_id"),
        Index("idx_expenditure_contract", "contract_id"),  # NEW: Contract index
        Index("idx_expenditure_office", "office_id"),
        Index("idx_expenditure_spent_date", "spent_date"),
        Index("idx_expenditure_amount", "amount"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<Expenditure(id={self.id}, expenditure_code='{self.expenditure_code}', amount={self.amount}, spent_date={self.spent_date})>"
