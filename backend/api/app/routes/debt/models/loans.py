from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class Loans(Base):
    """
    Loan contracts and agreements.
    Represents the legal obligation between borrower and lender.
    
    Core Principle: A loan is a contract + cash movements + obligation tracking
    """

    __tablename__ = "loans"
    __table_args__ = {"schema": "debt"}

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Loan Code (business identifier - for display/search only)
    loan_code = Column(String(100), nullable=False, unique=True, index=True)

    # Borrower Entity Code (references finance_entities.entity_code)
    borrower_entity_code = Column(String(100), nullable=True, index=True)

    # Borrower Entity ID (references finance_entities.id but not enforced)
    borrower_entity_id = Column(String(26), ForeignKey("entities.finance_entities.id"), nullable=True, index=True)

    # Lender Information
    lender_name = Column(String(255), nullable=False, index=True)  # external or internal lender
    lender_code = Column(String(100), nullable=True, index=True)  # lender identifier code

    # Financial Terms
    principal_amount = Column(Numeric(18, 2), nullable=False)
    currency_code = Column(String(10), nullable=False, index=True)
    interest_rate = Column(Numeric(5, 2), nullable=True)  # Percentage

    # Timeline
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)

    # Status
    status = Column(String(50), nullable=False, index=True)  # active, closed, defaulted
    status_code = Column(String(50), nullable=True, index=True)  # status identifier code

    # Relationships (using string references to avoid FK constraints)
    borrower_entity = relationship("FinanceEntities")
    disbursements = relationship("LoanDisbursements", backref="loan")
    repayments = relationship("LoanRepayments", backref="loan")

    def __repr__(self):
        return f"<Loans(id={self.id}, loan_code='{self.loan_code}', borrower_entity_code='{self.borrower_entity_code}', principal_amount={self.principal_amount})>"
