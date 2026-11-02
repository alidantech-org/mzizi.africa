from sqlalchemy import Column, String, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class LegalAuthoritySources(Base):
    """
    Authority mapping - traces legal instruments to their constitutional sources.
    Critical for understanding legal hierarchy and constitutional traceability.
    """

    __tablename__ = "legal_authority_sources"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    child_instrument_id = Column(String(26), nullable=False, index=True)
    parent_instrument_id = Column(String(26), nullable=False, index=True)
    parent_section_id = Column(String(26), nullable=False, index=True)

    # Core Fields
    authority_type = Column(
        String(30), nullable=False, index=True
    )  # delegated, derived, enacted_under
    description = Column(Text, nullable=True)

    # Relationships
    child_instrument = relationship(
        "LegalInstruments",
        foreign_keys=[child_instrument_id],
        backref="authority_sources",
    )
    parent_instrument = relationship(
        "LegalInstruments",
        foreign_keys=[parent_instrument_id],
        backref="derived_authorities",
    )
    parent_section = relationship(
        "LegalSections", foreign_keys=[parent_section_id], backref="derived_instruments"
    )

    # Constraints and Indexes
    __table_args__ = ({"schema": "legal"},)

    def __repr__(self):
        return f"<LegalAuthoritySources(id={self.id}, child_instrument_id={self.child_instrument_id}, parent_instrument_id={self.parent_instrument_id}, authority_type='{self.authority_type}')>"
