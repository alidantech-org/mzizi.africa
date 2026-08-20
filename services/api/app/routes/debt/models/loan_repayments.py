from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class LoanRepayments(Base):
    """
    Loan repayment events - outflow of cash from borrower to lender.
    This reduces the loan liability over time.

    Core Principle: Repayment = Outflow Event
    Ledger Impact: Debit Loan Liability, Credit Cash
    """

    __tablename__ = "loan_repayments"
    __table_args__ = {"schema": "debt"}

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Repayment Code (business identifier - for display/search only)
    repayment_code = Column(String(100), nullable=False, unique=True, index=True)

    # Loan Code (references loans.loan_code)
    loan_code = Column(String(100), nullable=True, index=True)

    # Loan ID (references loans.id with foreign key)
    loan_id = Column(String(26), ForeignKey("debt.loans.id"), nullable=True, index=True)

    # Payment Details
    amount = Column(Numeric(18, 2), nullable=False)
    currency_code = Column(String(10), nullable=False, index=True)
    principal_paid = Column(Numeric(18, 2), nullable=False)
    interest_paid = Column(Numeric(18, 2), nullable=False)
    payment_date = Column(Date, nullable=False, index=True)

    # Status
    status = Column(
        String(50), nullable=False, index=True
    )  # scheduled, completed, defaulted
    status_code = Column(
        String(50), nullable=True, index=True
    )  # status identifier code

    # Optional reference to ledger entry for double-entry tracking
    ledger_entry_id = Column(String(26), nullable=True, index=True)
    ledger_entry_code = Column(
        String(100), nullable=True, index=True
    )  # ledger entry identifier code

    # Relationships
    loan = relationship("Loans", backref="repayments")

    def __repr__(self):
        return f"<LoanRepayments(id={self.id}, repayment_code='{self.repayment_code}', loan_code='{self.loan_code}', principal_paid={self.principal_paid}, interest_paid={self.interest_paid})>"
