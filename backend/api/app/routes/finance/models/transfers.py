from sqlalchemy import Column, String, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class Transfers(Base):
    """
    Inter-entity fund transfers.
    Tracks movement of funds between government entities.
    """

    __tablename__ = "transfers"
    __table_args__ = {"schema": "finance"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    from_entity_id = Column(
        String(26), ForeignKey("entities.finance_entities.id"), nullable=True
    )
    from_entity_code = Column(String(100), nullable=True, index=True)

    to_entity_id = Column(
        String(26), ForeignKey("entities.finance_entities.id"), nullable=True
    )
    to_entity_code = Column(String(100), nullable=True, index=True)

    fiscal_year_id = Column(
        String(26), ForeignKey("finance.fiscal_years.id"), nullable=True
    )
    fiscal_year_code = Column(String(100), nullable=True, index=True)

    transfer_type = Column(String(100), nullable=False, index=True)

    fund_restriction = Column(
        Enum("general", "earmarked", name="transfer_restriction", schema="finance"),
        nullable=True,
    )

    amount = Column(Numeric(18, 2), nullable=False)

    status = Column(
        Enum(
            "Planned", "Approved", "Disbursed", name="transfer_status", schema="finance"
        ),
        default="Planned",
        index=True,
    )

    # Relationships
    from_entity = relationship("FinanceEntities", foreign_keys=[from_entity_id])
    to_entity = relationship("FinanceEntities", foreign_keys=[to_entity_id])
    fiscal_year = relationship("FiscalYears")

    def __repr__(self):
        return f"<Transfers(from_entity_code='{self.from_entity_code}', to_entity_code='{self.to_entity_code}', amount={self.amount})>"
