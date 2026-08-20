from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class LegalApplicability(Base):
    """
    Geographic applicability of legal instruments.
    Defines which laws apply to which geographic areas and when.
    """

    __tablename__ = "legal_applicability"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    instrument_id = Column(String(26), nullable=False, index=True)

    # Core Fields
    geo_unit_code = Column(String(50), nullable=False, index=True)

    # Temporal Fields
    applies_from = Column(DateTime(timezone=True), nullable=True, index=True)
    applies_to = Column(DateTime(timezone=True), nullable=True, index=True)

    notes = Column(Text, nullable=True)

    # Relationships
    instrument = relationship("LegalInstruments", backref="applicability")

    # Constraints and Indexes
    __table_args__ = ({"schema": "legal"},)

    def __repr__(self):
        return f"<LegalApplicability(id={self.id}, instrument_id={self.instrument_id}, geo_unit_code='{self.geo_unit_code}')>"
