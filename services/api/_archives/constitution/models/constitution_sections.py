from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class ConstitutionSections(Base):
    """
    Constitution sections table - hierarchical sections with temporal support.
    """

    __tablename__ = "constitution_sections"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    constitution_id = Column(
        String(26),
        ForeignKey("constitution.constitutions.id"),
        nullable=False,
        index=True,
    )
    parent_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )
    previous_version_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )

    # Core Fields
    section_type = Column(String(20), nullable=False, index=True)
    section_code = Column(String(50), nullable=False, unique=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    content = Column(Text, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0, index=True)

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)
    transaction_at = Column(DateTime(timezone=True), nullable=False, index=True)

    # Relationships
    constitution = relationship("Constitutions", backref="sections")
    parent_section = relationship(
        "ConstitutionSections", remote_side=[id], backref="child_sections"
    )
    previous_version = relationship(
        "ConstitutionSections", remote_side=[id], backref="next_versions"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_constitution_sections_section_code", "section_code", unique=True),
        {"schema": "constitution"},
    )

    def __repr__(self):
        return f"<ConstitutionSections(id={self.id}, section_code='{self.section_code}', title='{self.title}')>"
