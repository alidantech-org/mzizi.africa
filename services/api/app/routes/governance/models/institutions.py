from sqlalchemy import Column, String, Text, Boolean, DateTime

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class Institutions(Base):
    """
    Institutions table - main institutions (national, county, independent)

    Examples:
    - exec-office: Executive Office of President (exec)
    - parl: Parliament of Kenya (leg)
    - judiciary: Judiciary (jud)
    - iebc: Independent Electoral and Boundaries Commission (independent)
    - county-gov-nrb: County Government of Nairobi (exec)

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "institutions"
    __table_args__ = {"schema": "governance"}

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    institution_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    arm_code = Column(String(20), nullable=True, index=True)
    institution_type = Column(String(30), nullable=True, index=True)
    sub_type = Column(String(50), nullable=True, index=True)
    geo_level_code = Column(String(30), nullable=True, index=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    arm_of_government = relationship(
        "ArmsOfGovernment", back_populates="institutions", foreign_keys=[arm_code]
    )
    parent_relationships = relationship(
        "InstitutionRelationships",
        foreign_keys="InstitutionRelationships.parent_institution_id",
        back_populates="parent_institution",
    )
    child_relationships = relationship(
        "InstitutionRelationships",
        foreign_keys="InstitutionRelationships.child_institution_id",
        back_populates="child_institution",
    )

    def __repr__(self):
        return f"<Institutions(id={self.id}, institution_code='{self.institution_code}', name='{self.name}', arm='{self.arm_code}')>"
