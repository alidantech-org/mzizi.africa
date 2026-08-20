from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class LegalAmendments(Base):
    """
    Legal amendments - applies across all legal levels.
    Tracks changes to constitutions, statutes, regulations, etc.
    """

    __tablename__ = "legal_amendments"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    instrument_id = Column(String(26), nullable=False, index=True)

    # Core Fields
    amendment_code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=True, index=True)
    description = Column(Text, nullable=True)

    # Temporal Fields
    date_passed = Column(DateTime(timezone=True), nullable=True, index=True)
    date_effective = Column(DateTime(timezone=True), nullable=True, index=True)

    # Relationships
    instrument = relationship("LegalInstruments", backref="amendments")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_legal_amendments_amendment_code", "amendment_code", unique=True),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<LegalAmendments(id={self.id}, amendment_code='{self.amendment_code}', instrument_id={self.instrument_id})>"
