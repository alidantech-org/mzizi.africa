from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class BudgetItems(Base):
    """
    Budget items table - detailed breakdown of budget allocations.
    Examples: Salaries, infrastructure, operations, development projects.
    """

    __tablename__ = "budget_items"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    budget_id = Column(
        String(26), ForeignKey("finance.budgets.id"), nullable=False, index=True
    )

    # Core Fields
    item_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. SALARIES_2023_001
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Financial Fields
    allocated_amount = Column(Numeric(15, 2), nullable=False, index=True)

    # Authority References
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=True,
        index=True,
    )
    geo_unit_code = Column(String(50), nullable=True, index=True)
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    budget = relationship("Budgets", backref="items")
    office = relationship("Offices", backref="budget_items")
    law_section = relationship("LegalSections", backref="budget_items")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_budget_items_item_code", "item_code", unique=True),
        Index("idx_budget_items_budget", "budget_id"),
        Index("idx_budget_items_office", "office_id"),
        Index("idx_budget_items_amount", "allocated_amount"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<BudgetItems(id={self.id}, item_code='{self.item_code}', name='{self.name}', allocated_amount={self.allocated_amount})>"
