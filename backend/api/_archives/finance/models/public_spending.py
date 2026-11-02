from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class RecipientTypeEnum(enum.Enum):
    """Enumeration of recipient types"""

    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"
    NGO = "NGO"
    GOVERNMENT = "GOVERNMENT"
    FOREIGN_GOVERNMENT = "FOREIGN_GOVERNMENT"
    INTERNATIONAL_ORG = "INTERNATIONAL_ORG"
    OTHER = "OTHER"


class PublicSpending(Base):
    """
    Public spending table - tracks detailed government transactions.
    Examples: Contract payments, service procurements, transfer payments.
    """

    __tablename__ = "public_spending"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    expenditure_id = Column(
        String(26),
        ForeignKey("finance.expenditure.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    spending_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. SPEND_2023_001
    amount = Column(Numeric(15, 2), nullable=False, index=True)

    # Transaction Details
    transaction_date = Column(Date, nullable=False, index=True)
    recipient_name = Column(String(200), nullable=False, index=True)
    recipient_type = Column(
        String(30), nullable=False, index=True
    )  # INDIVIDUAL, COMPANY, NGO, etc.
    description = Column(Text, nullable=True)

    # Procurement Link
    tender_id = Column(
        String(26),
        ForeignKey("procurement.tenders.id"),
        nullable=True,
        index=True,
    )

    # Geographic References
    geo_unit_code = Column(String(50), nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    expenditure = relationship("Expenditure", backref="public_spending")
    tender = relationship("Tenders", backref="public_spending")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_public_spending_spending_code", "spending_code", unique=True),
        Index("idx_public_spending_expenditure", "expenditure_id"),
        Index("idx_public_spending_recipient", "recipient_name", "recipient_type"),
        Index("idx_public_spending_date", "transaction_date"),
        Index("idx_public_spending_amount", "amount"),
        Index("idx_public_spending_geo", "geo_unit_code"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<PublicSpending(id={self.id}, spending_code='{self.spending_code}', amount={self.amount}, recipient_name='{self.recipient_name}')>"
