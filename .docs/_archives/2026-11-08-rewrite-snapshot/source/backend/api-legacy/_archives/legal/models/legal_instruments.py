from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class LegalInstruments(Base):
    """
    Top-level legal instruments - laws, statutes, regulations, etc.
    Examples: Kenya Constitution 2010, Companies Act 2015, Public Procurement Act
    """

    __tablename__ = "legal_instruments"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Core Fields
    code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. KENYA_CONSTITUTION_2010
    title = Column(String(255), nullable=False)

    # Foreign Keys
    legal_level_id = Column(String(26), nullable=False, index=True)

    # Geographic Scope
    jurisdiction_code = Column(
        String(50), nullable=False, index=True
    )  # links to geo_units

    # Status and Dates
    status = Column(
        String(20), nullable=False, index=True
    )  # active, repealed, superseded
    date_enacted = Column(DateTime(timezone=True), index=True)
    date_effective = Column(DateTime(timezone=True), index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    legal_level = relationship("LegalLevels", backref="instruments")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_legal_instruments_code", "code", unique=True),
        Index("idx_legal_instruments_jurisdiction", "jurisdiction_code"),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<LegalInstruments(id={self.id}, code='{self.code}', title='{self.title}')>"
