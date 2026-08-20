from sqlalchemy import Column, String, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class AmendmentSectionChanges(Base):
    """
    Amendment section changes table - links amendments to section changes with document storage.
    """

    __tablename__ = "amendment_section_changes"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    amendment_id = Column(
        String(26),
        ForeignKey("constitution.amendments.id"),
        nullable=False,
        index=True,
    )
    section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    change_type = Column(String(20), nullable=False, index=True)

    # Document Storage Integration
    document_uri = Column(Text, nullable=False)  # FILE LOCATION
    document_hash = Column(String(128), nullable=False, index=True)

    # Relationships
    amendment = relationship("Amendments", backref="section_changes")
    section = relationship("ConstitutionSections", backref="amendment_changes")

    # Constraints and Indexes
    __table_args__ = {"schema": "constitution"}

    def __repr__(self):
        return f"<AmendmentSectionChanges(id={self.id}, amendment_id={self.amendment_id}, section_id={self.section_id}, change_type='{self.change_type}')>"
