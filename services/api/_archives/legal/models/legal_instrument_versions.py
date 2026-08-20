from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class LegalInstrumentVersions(Base):
    """
    Temporal versions of legal instruments with document storage integration.
    Each version has content and links to actual document files.
    """

    __tablename__ = "legal_instrument_versions"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    instrument_id = Column(String(26), nullable=False, index=True)
    previous_version_id = Column(String(26), nullable=True, index=True)

    # Core Fields
    version_code = Column(String(50), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)

    # Document Storage Integration
    document_uri = Column(Text, nullable=False)  # FILE LOCATION
    document_hash = Column(String(128), nullable=False, index=True)

    # Temporal Fields
    valid_from = Column(DateTime(timezone=True), nullable=False, index=True)
    valid_to = Column(DateTime(timezone=True), nullable=True, index=True)
    transaction_at = Column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    # Relationships
    instrument = relationship("LegalInstruments", backref="versions")
    previous_version = relationship(
        "LegalInstrumentVersions", remote_side=[id], backref="next_versions"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_liv_instrument_valid", "instrument_id", "valid_from", "valid_to"),
        Index("uq_legal_instrument_versions_version_code", "version_code", unique=True),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<LegalInstrumentVersions(id={self.id}, version_code='{self.version_code}', instrument_id={self.instrument_id})>"
