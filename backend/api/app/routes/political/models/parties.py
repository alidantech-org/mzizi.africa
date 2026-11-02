from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid

class PartyStatusEnum(str):
    """Enumeration of party status types"""

    ACTIVE = "active"
    DISSOLVED = "dissolved"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"


class Parties(Base):
    """
    Parties table - core political party entity.
    Examples: ODM, UDA, Jubilee, Wiper, ANC.
    """

    __tablename__ = "parties"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Party Code (Business identifier - represents party names)
    # These represent party codes like "odm", "uda", "jubilee" for easy reference
    party_code = Column(String(100), nullable=False, unique=True, index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    geo_unit_code = Column(String(100), nullable=True, index=True)  # e.g. "ke", "ke/nairobi"

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    abbreviation = Column(String(10), nullable=True, index=True)
    symbol_url = Column(Text, nullable=True, index=True)  # URL to party symbol image
    founded_date = Column(Date, nullable=True, index=True)
    dissolved_date = Column(Date, nullable=True, index=True)  # Date when party ended/dissolved
    status = Column(
        SQLEnum(
            PartyStatusEnum.ACTIVE,
            PartyStatusEnum.DISSOLVED,
            PartyStatusEnum.SUSPENDED,
            PartyStatusEnum.INACTIVE,
            name="party_status_enum",
            schema="political",
        ),
        nullable=True,
        index=True,
        default=PartyStatusEnum.ACTIVE,
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="parties")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_parties_party_code", "party_code", unique=True),
        Index("idx_parties_name", "name"),
        Index("idx_parties_geo_unit", "geo_unit_code", "party_code"),
        {"schema": "political"},
    )

    def __repr__(self):
        return f"<Parties(id={self.id}, party_code='{self.party_code}', name='{self.name}', status='{self.status}')>"
