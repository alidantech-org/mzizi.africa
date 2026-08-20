from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class OfficeAuthority(Base):
    """
    Office authority table - defines powers and responsibilities of offices.
    Links offices to their constitutional and legal authority sources.
    """

    __tablename__ = "office_authority"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    authority_code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)

    # Legal Authority Sources
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=False,
        index=True,
    )  # primary legal source
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )  # optional supporting law

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    office = relationship("Offices", backref="authorities")
    constitution_section = relationship(
        "ConstitutionSections", backref="office_authorities"
    )
    law_section = relationship("LegalSections", backref="office_authorities")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_office_authority_authority_code", "authority_code", unique=True),
        Index("idx_office_authority_office", "office_id", "valid_from"),
        Index("idx_office_authority_validity", "valid_from", "valid_to"),
        {"schema": "governance"},
    )

    def __repr__(self):
        return f"<OfficeAuthority(id={self.id}, authority_code='{self.authority_code}', office_id={self.office_id})>"
