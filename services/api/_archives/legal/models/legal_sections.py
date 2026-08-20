from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class LegalSections(Base):
    """
    Hierarchical sections of legal instruments with versioning and document links.
    Examples: Chapter One, Article 26, Section 123, Regulation 45(2)
    """

    __tablename__ = "legal_sections"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    instrument_id = Column(String(26), nullable=False, index=True)
    parent_section_id = Column(String(26), nullable=True, index=True)
    previous_section_id = Column(String(26), nullable=True, index=True)

    # Core Fields
    section_type = Column(
        String(30), nullable=False, index=True
    )  # chapter, article, clause
    section_code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=True, index=True)
    content = Column(Text, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0, index=True)

    # Document Storage Integration
    document_uri = Column(Text, nullable=False)
    document_hash = Column(String(128), nullable=False, index=True)

    # Temporal Fields
    valid_from = Column(DateTime(timezone=True), nullable=False, index=True)
    valid_to = Column(DateTime(timezone=True), nullable=True, index=True)

    # Relationships
    instrument = relationship("LegalInstruments", backref="sections")
    parent_section = relationship(
        "LegalSections", remote_side=[id], backref="child_sections"
    )
    previous_section = relationship(
        "LegalSections", remote_side=[id], backref="next_sections"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_section_hierarchy", "parent_section_id"),
        Index("uq_legal_sections_section_code", "section_code", unique=True),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<LegalSections(id={self.id}, section_code='{self.section_code}', section_type='{self.section_type}')>"
