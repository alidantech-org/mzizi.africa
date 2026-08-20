from sqlalchemy import Column, String, Numeric, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class ExpenditureWorkflow(Base):
    """
    Expenditure workflow state machine.
    Tracks spending process from requisition to payment.
    """

    __tablename__ = "expenditure_workflow"
    __table_args__ = {"schema": "finance"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # Entity ID (references finance_entities.id but not enforced)
    entity_id = Column(String(26), nullable=True, index=True)
    entity_code = Column(String(100), nullable=True, index=True)

    # Budget ID (references finance.budgets.id but not enforced)
    budget_id = Column(String(26), nullable=True, index=True)
    budget_code = Column(String(100), nullable=True, index=True)

    # Workflow stage code (references workflow_stages.stage_code but not enforced)
    stage_code = Column(String(50), nullable=False, index=True)

    # Stage ID (optional - references workflow_stages.id but not enforced)
    stage_id = Column(
        String(26), ForeignKey("finance.workflow_stages.id"), nullable=True, index=True
    )

    # Stage order for workflow progression tracking
    stage_order = Column(Integer, nullable=False, index=True)

    amount = Column(Numeric(18, 2), nullable=False)

    # Approver ID (references people or users but not enforced)
    approver_id = Column(String(26), nullable=True, index=True)

    # Relationships (using string references to avoid FK constraints)
    entity = relationship("FinanceEntities")
    budget = relationship("Budgets")

    def __repr__(self):
        return f"<ExpenditureWorkflow(entity_code='{self.entity_code}', budget_code='{self.budget_code}', stage_code='{self.stage_code}', amount={self.amount})>"
