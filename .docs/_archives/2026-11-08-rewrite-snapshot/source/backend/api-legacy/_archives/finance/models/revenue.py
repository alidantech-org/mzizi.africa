from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class RevenueTypeEnum(enum.Enum):
    """Enumeration of revenue types"""

    TAX = "TAX"
    FEE = "FEE"
    GRANT = "GRANT"
    LOAN = "LOAN"
    AID = "AID"
    INVESTMENT = "INVESTMENT"
    OTHER = "OTHER"


class Revenue(Base):
    """
    Revenue table - tracks income sources and amounts.
    Examples: Tax revenue, fees, grants, loans, foreign aid.
    """

    __tablename__ = "revenue"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    budget_id = Column(
        String(26), ForeignKey("finance.budgets.id"), nullable=True, index=True
    )
    fiscal_year_id = Column(
        String(26),
        ForeignKey("finance.fiscal_years.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    revenue_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. TAX_INCOME_2023_001
    revenue_type = Column(
        String(20), nullable=False, index=True
    )  # TAX, FEE, GRANT, LOAN, AID
    source = Column(String(200), nullable=False, index=True)  # Source description
    amount = Column(Numeric(15, 2), nullable=False, index=True)

    # Temporal Fields
    received_date = Column(Date, nullable=False, index=True)

    # Geographic and Legal References
    geo_unit_code = Column(String(50), nullable=True, index=True)
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
    budget = relationship("Budgets", backref="revenue")
    fiscal_year = relationship("FiscalYears", backref="revenue")
    law = relationship("LegalInstruments", backref="revenue")
    law_section = relationship("LegalSections", backref="revenue")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_revenue_revenue_code", "revenue_code", unique=True),
        Index("idx_revenue_fiscal_year", "fiscal_year_id"),
        Index("idx_revenue_budget", "budget_id"),
        Index("idx_revenue_type", "revenue_type"),
        Index("idx_revenue_source", "source"),
        Index("idx_revenue_amount", "amount"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<Revenue(id={self.id}, revenue_code='{self.revenue_code}', revenue_type='{self.revenue_type}', amount={self.amount})>"
