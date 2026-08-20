from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class LoanDisbursements(Base):
    """
    Loan disbursement events - actual inflow of cash to borrower.
    This is the critical event that creates the loan liability.

    Core Principle: Disbursement = Inflow Event
    Ledger Impact: Debit Cash, Credit Loan Liability
    """

    __tablename__ = "loan_disbursements"
    __table_args__ = {"schema": "debt"}

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Disbursement Code (business identifier - for display/search only)
    disbursement_code = Column(String(100), nullable=False, unique=True, index=True)

    # Loan Code (references loans.loan_code)
    loan_code = Column(String(100), nullable=True, index=True)

    # Loan ID (references loans.id with foreign key)
    loan_id = Column(String(26), ForeignKey("debt.loans.id"), nullable=True, index=True)

    # Disbursement Details
    amount = Column(Numeric(18, 2), nullable=False)
    currency_code = Column(String(10), nullable=False, index=True)
    disbursement_date = Column(Date, nullable=False, index=True)

    # Status
    status = Column(
        String(50), nullable=False, index=True
    )  # scheduled, completed, cancelled
    status_code = Column(
        String(50), nullable=True, index=True
    )  # status identifier code

    # Optional reference to ledger entry for double-entry tracking
    ledger_entry_id = Column(String(26), nullable=True, index=True)
    ledger_entry_code = Column(
        String(100), nullable=True, index=True
    )  # ledger entry identifier code

    # Relationships
    loan = relationship("Loans", backref="disbursements")

    def __repr__(self):
        return f"<LoanDisbursements(id={self.id}, disbursement_code='{self.disbursement_code}', loan_code='{self.loan_code}', amount={self.amount})>"
