from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    UniqueConstraint,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class SelectionRules(Base):
    """
    Office selection rules table - defines how offices are filled and by whom

    Examples:
    - president → election → iebc (iebc conducts presidential elections)
    - cabinet-secretary → appointment → president (president appoints cabinet secretaries)
    - mp → election → iebc (iebc conducts mp elections)
    - mp → nomination → parliament (parliament nominates some mps)
    - judge → appointment → judicial-service-commission (jsc appoints judges)

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "selection_rules"
    __table_args__ = (
        UniqueConstraint(
            "office_code",
            "selection_method_code",
            "appointing_institution_code",
            name="uq_selection_rules",
        ),
        {"schema": "offices"},
    )

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    office_id = Column(String(26), ForeignKey("offices.offices.id"), nullable=True, index=True)
    office_code = Column(String(100), nullable=False, index=True)
    selection_method_id = Column(
        String(26),
        ForeignKey("offices.selection_methods.id"),
        nullable=True,
        index=True,
    )
    selection_method_code = Column(String(100), nullable=False, index=True)
    appointing_institution_id = Column(
        String(26),
        ForeignKey("governance.institutions.id"),
        nullable=True,
        index=True,
    )
    appointing_institution_code = Column(String(100), nullable=False, index=True)
    appointing_office_id = Column(
        String(26),
        ForeignKey("offices.offices.id"),
        nullable=True,
        index=True,
    )
    appointing_office_code = Column(String(100), nullable=True, index=True)
    is_ex_officio = Column(Boolean, default=False, index=True)  # For ex-officio memberships
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    office = relationship(
        "Offices",
        foreign_keys=[office_id, office_code],
        back_populates="selection_rules",
    )
    selection_method = relationship(
        "SelectionMethods",
        foreign_keys=[selection_method_id, selection_method_code],
        back_populates="selection_rules",
    )
    appointing_institution = relationship(
        "Institutions",
        foreign_keys=[appointing_institution_id, appointing_institution_code],
    )

    def __repr__(self):
        return f"<SelectionRules(office='{self.office_code}', method='{self.selection_method_code}', appointer='{self.appointing_institution_code}')>"
