from sqlalchemy import Column, String, Date, Text, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class PartyStatusEnum(enum.Enum):
    """Enumeration of party status types"""

    ACTIVE = "ACTIVE"
    DISSOLVED = "DISSOLVED"
    SUSPENDED = "SUSPENDED"
    INACTIVE = "INACTIVE"


class Parties(Base):
    """
    Parties table - core political party entity.
    Examples: ODM, UDA, Jubilee, Wiper, ANC.
    """

    __tablename__ = "parties"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    party_code = Column(
        String(20), unique=True, nullable=False, index=True
    )  # e.g. ODM, UDA
    name = Column(String(200), nullable=False, index=True)
    abbreviation = Column(String(10), nullable=True, index=True)

    # Geographic and Temporal
    country_code = Column(String(10), nullable=False, index=True)  # e.g. KE
    founded_date = Column(Date, nullable=True, index=True)

    # Status
    status = Column(
        String(20), nullable=False, index=True, default="ACTIVE"
    )  # ACTIVE, DISSOLVED

    # Document Storage
    constitution_document_uri = Column(
        Text, nullable=True
    )  # Party constitution document
    constitution_document_hash = Column(String(128), nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_parties_party_code", "party_code", unique=True),
        Index("idx_parties_name", "name"),
        Index("idx_parties_country_status", "country_code", "status"),
        {"schema": "political_parties"},
    )

    def __repr__(self):
        return f"<Parties(id={self.id}, party_code='{self.party_code}', name='{self.name}', status='{self.status}')>"
