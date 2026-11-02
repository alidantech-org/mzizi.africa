from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class Offices(Base):
    """
    Offices table - pure roles within institutions (structure layer)
    Examples: president, governor, mp, senator, mca, commissioner, etc.

    NOTE: Geo scope belongs to office_holdings (reality layer), not here.

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "offices"
    __table_args__ = {"schema": "offices"}

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    office_code = Column(String(100), unique=True, nullable=False, index=True)
    title = Column(String(150), nullable=False, index=True)
    institution_id = Column(String(26), ForeignKey("governance.institutions.id"), nullable=True, index=True)
    institution_code = Column(String(100), nullable=False, index=True)
    parent_office_id = Column(String(26), ForeignKey("offices.offices.id"), nullable=True, index=True)
    parent_office_code = Column(String(100), nullable=True, index=True)
    is_singleton = Column(Boolean, default=False, index=True)
    max_terms = Column(Integer, nullable=True, index=True)  # 2 for President/Governor, null for others
    term_duration_years = Column(Integer, nullable=True, index=True)  # 5 for most Kenyan offices
    retirement_age = Column(Integer, nullable=True, index=True)  # 70/75 for Judiciary
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    institution = relationship("Institutions", foreign_keys=[institution_id, institution_code])
    parent_office = relationship("Offices", remote_side=[id], foreign_keys=[parent_office_id])
    child_offices = relationship("Offices", back_populates="parent_office", foreign_keys=[parent_office_id])
    holders = relationship("Holders", back_populates="office")
    selection_rules = relationship("SelectionRules", back_populates="office")

    def __repr__(self):
        return f"<Offices(id={self.id}, office_code='{self.office_code}', title='{self.title}', institution='{self.institution_code}')>"
