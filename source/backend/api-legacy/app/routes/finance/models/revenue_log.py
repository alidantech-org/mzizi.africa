from sqlalchemy import Column, String, Numeric, Enum, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class RevenueLog(Base):
    """
    Revenue inflow tracking.
    Records all government revenue receipts with entity and category classification.
    """

    __tablename__ = "revenue_log"
    __table_args__ = {"schema": "finance"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    entity_id = Column(
        String(26), ForeignKey("entities.finance_entities.id"), nullable=True
    )
    entity_code = Column(String(100), nullable=True, index=True)

    fiscal_year_id = Column(
        String(26), ForeignKey("finance.fiscal_years.id"), nullable=True
    )
    fiscal_year_code = Column(String(100), nullable=True, index=True)

    source_id = Column(
        String(26), ForeignKey("finance.revenue_categories.id"), nullable=True
    )
    category_code = Column(String(100), nullable=True, index=True)

    amount = Column(Numeric(18, 2), nullable=False)

    fund_restriction = Column(
        Enum("general", "earmarked", name="fund_restriction", schema="finance"),
        nullable=True,
        index=True,
    )

    received_date = Column(Date, nullable=False)

    # Relationships
    entity = relationship("FinanceEntities")
    fiscal_year = relationship("FiscalYears")
    source = relationship("RevenueCategories")

    def __repr__(self):
        return f"<RevenueLog(entity_code='{self.entity_code}', amount={self.amount})>"
