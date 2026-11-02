from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class LedgerEntries(Base):
    """
    Ledger entries for financial balance integrity.
    Critical double-entry bookkeeping system.
    """

    __tablename__ = "ledger_entries"
    __table_args__ = {"schema": "finance"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    entity_id = Column(
        String(26), ForeignKey("entities.finance_entities.id"), nullable=True
    )
    entity_code = Column(String(100), nullable=True, index=True)

    account_code = Column(String(50), nullable=False, index=True)

    debit_amount = Column(Numeric(18, 2), default=0)
    credit_amount = Column(Numeric(18, 2), default=0)

    reference_type = Column(String(50), nullable=False)
    reference_id = Column(String(26), nullable=False)
    reference_code = Column(String(100), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    entity = relationship("FinanceEntities")

    def __repr__(self):
        return f"<LedgerEntries(entity_code='{self.entity_code}', account_code='{self.account_code}', debit={self.debit_amount}, credit={self.credit_amount})>"
