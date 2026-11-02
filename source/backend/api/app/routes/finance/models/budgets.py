from sqlalchemy import Column, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class Budgets(Base):
    """
    Budget appropriation layer.
    Legal spending authority for entities within fiscal years.
    """

    __tablename__ = "budgets"
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

    budget_code = Column(String(100), nullable=False, unique=True, index=True)
    program_code = Column(String(50), nullable=False, index=True)

    approved_amount = Column(Numeric(18, 2), nullable=False)

    # Relationships
    entity = relationship("FinanceEntities")
    fiscal_year = relationship("FiscalYears")

    def __repr__(self):
        return f"<Budgets(budget_code='{self.budget_code}', entity_code='{self.entity_code}', approved_amount={self.approved_amount})>"
