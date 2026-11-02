from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Index
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class WorkflowStages(Base):
    """
    Defines types of expenditure workflow stages and their order.
    Examples: requisition, commitment, verification, payment

    NB: RULES: never add foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like workflow/requisition/commitment.
    """

    __tablename__ = "workflow_stages"
    __table_args__ = {"schema": "finance"}

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Workflow stage code (business identifier - for display/search only) e.g., "requisition", "commitment", "verification", "payment"
    stage_code = Column(String(50), nullable=False, unique=True, index=True)

    # Core Fields
    stage_name = Column(String(100), nullable=False, index=True)
    stage_order = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Is Active Field
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index("idx_workflow_stages_name", "stage_name"),
        Index("uq_workflow_stages_stage_code", "stage_code", unique=True),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<WorkflowStages(id={self.id}, stage_code='{self.stage_code}', stage_name='{self.stage_name}')>"
