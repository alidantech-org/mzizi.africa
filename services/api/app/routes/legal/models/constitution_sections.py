from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    Date,
    UniqueConstraint,
    Integer,
    Enum as SQLEnum,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class SectionType(str):
    """
    Defines types of constitutional sections.

    Examples:
    - PREAMBLE: Introduction and founding principles
    - CHAPTER: Major divisions (e.g., Bill of Rights)
    - PART: Subdivisions within chapters
    - SECTION: Individual provisions
    - SCHEDULE: Lists and annexes
    - ARTICLE: Specific constitutional articles
    - AMENDMENT: Constitutional amendments
    - CLAUSE: Specific clauses within sections
    - SUBCLAUSE: Sub-clauses within clauses
    - APPENDIX: Additional materials
    """

    PREAMBLE = "preamble"
    CHAPTER = "chapter"
    PART = "part"
    SECTION = "section"
    SCHEDULE = "schedule"
    ARTICLE = "article"
    AMENDMENT = "amendment"
    CLAUSE = "clause"
    SUBCLAUSE = "subclause"
    APPENDIX = "appendix"


class ConstitutionSections(Base):
    """
    Constitution sections table - hierarchical structure of constitutional content

    Examples:
    - PREAMBLE: Introduction and founding principles
    - CHAPTER: Major divisions (e.g., Bill of Rights)
    - PART: Subdivisions within chapters
    - SECTION: Individual provisions
    - SCHEDULE: Lists and annexes
    - ARTICLE: Specific constitutional articles
    """

    __tablename__ = "constitution_sections"
    __table_args__ = (
        UniqueConstraint(
            "constitution_code",
            "section_code",
            name="uq_constitution_sections",
        ),
        {
            "schema": "legal",
        },
    )

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # ID-based Foreign Keys (nullable for flexibility)
    constitution_id = Column(
        String(26),
        ForeignKey("legal.constitutions.id"),
        nullable=True,
        index=True,
    )
    parent_section_id = Column(
        String(26),
        ForeignKey("legal.constitution_sections.id"),
        nullable=True,
        index=True,
    )

    previous_version_id = Column(
        String(26),
        ForeignKey("legal.constitution_sections.id"),
        nullable=True,
        index=True,
    )

    # Code References
    constitution_code = Column(String(30), nullable=False, index=True)
    parent_section_code = Column(String(50), nullable=True, index=True)
    previous_version_code = Column(String(50), nullable=True, index=True)

    # Core Fields
    # Update your column definition to this:
    section_type = Column(
        SQLEnum(
            SectionType.PREAMBLE,
            SectionType.CHAPTER,
            SectionType.PART,
            SectionType.SECTION,
            SectionType.SCHEDULE,
            SectionType.ARTICLE,
            SectionType.AMENDMENT,
            SectionType.CLAUSE,
            SectionType.SUBCLAUSE,
            SectionType.APPENDIX,
            name="section_type_enum",
            schema="legal",
        ),
        nullable=False,
        index=True,
    )
    section_code = Column(String(50), nullable=False, unique=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    content = Column(Text, nullable=True)
    link_url = Column(
        Text,
        nullable=True,
        index=True,
        comment="URL to external site with additional information",
    )
    sort_order = Column(Integer, nullable=False, default=0, index=True)

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)
    transaction_at = Column(DateTime(timezone=True), nullable=False, index=True)

    # Status Fields
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    constitution = relationship("Constitutions", backref="sections")
    parent_section = relationship(
        "ConstitutionSections",
        remote_side=[id],
        backref="child_sections",
        foreign_keys=[parent_section_id],
    )
    previous_version = relationship(
        "ConstitutionSections",
        remote_side=[id],
        backref="next_versions",
        foreign_keys=[previous_version_id],
    )

    def __repr__(self):
        return f"<ConstitutionSections(id={self.id}, section_code='{self.section_code}', title='{self.title}')>"
