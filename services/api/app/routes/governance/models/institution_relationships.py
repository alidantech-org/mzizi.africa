from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    Date,
    UniqueConstraint,
    ForeignKey,
    Enum as SQLEnum,
)

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class RelationshipType(str):
    """
    Defines types of institutional relationships.

    Examples:
    - HAS_COMPONENT: Sub-institution under main institution
    - HAS_OFFICE: Office under institution
    - HAS_BRANCH: Branch of institution
    - HAS_DEPARTMENT: Department within institution
    - HAS_AGENCY: Agency under institution
    """

    HAS_COMPONENT = "has_component"
    HAS_OFFICE = "has_office"
    HAS_BRANCH = "has_branch"
    HAS_DEPARTMENT = "has_department"
    HAS_AGENCY = "has_agency"


class InstitutionRelationships(Base):
    """
    Institution relationships table - structure layer only
    Models: "Sub-institutions under a main institution at a specific geo level"

    This is for institutional structure, not office assignments.

    Examples:
    - county-gov-nrb → nairobi-county-office → county
    - parliament → constituency-office → constituency
    - iebc → county-returning-office → county

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "institution_relationships"
    __table_args__ = (
        UniqueConstraint(
            "parent_institution_code",
            "child_institution_code",
            "relationship_type",
            name="uq_institution_relationships",
        ),
        {"schema": "governance"},
    )

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    parent_institution_id = Column(
        String(26),
        ForeignKey("governance.institutions.id"),
        nullable=True,
        index=True,
    )
    child_institution_id = Column(
        String(26),
        ForeignKey("governance.institutions.id"),
        nullable=True,
        index=True,
    )
    parent_institution_code = Column(String(50), nullable=False, index=True)
    child_institution_code = Column(String(50), nullable=False, index=True)
    relationship_type = Column(
        SQLEnum(
            RelationshipType.HAS_COMPONENT,
            RelationshipType.HAS_OFFICE,
            RelationshipType.HAS_BRANCH,
            RelationshipType.HAS_DEPARTMENT,
            RelationshipType.HAS_AGENCY,
            name="relationship_type_enum",
            schema="governance",
        ),
        nullable=False,
        index=True,
    )
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    parent_institution = relationship(
        "Institutions",
        foreign_keys=[parent_institution_id, parent_institution_code],
        back_populates="parent_relationships",
    )
    child_institution = relationship(
        "Institutions",
        foreign_keys=[child_institution_id, child_institution_code],
        back_populates="child_relationships",
    )

    def __repr__(self):
        return f"<InstitutionRelationships(parent='{self.parent_institution_code}', child='{self.child_institution_code}', type='{self.relationship_type}')>"
