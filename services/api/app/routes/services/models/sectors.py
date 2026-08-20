from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class SectorEnum(enum.Enum):
    """Enumeration of service sectors"""

    HEALTH = "HEALTH"
    EDUCATION = "EDUCATION"
    SECURITY = "SECURITY"
    WATER = "WATER"
    TRANSPORT = "TRANSPORT"
    AGRICULTURE = "AGRICULTURE"
    ENERGY = "ENERGY"
    HOUSING = "HOUSING"
    ENVIRONMENT = "ENVIRONMENT"
    ICT = "ICT"
    FINANCE = "FINANCE"
    SOCIAL_PROTECTION = "SOCIAL_PROTECTION"


class Sectors(Base):
    """
    Sectors table - defines broad service areas.
    Examples: Health, Education, Security, Water.
    """

    __tablename__ = "sectors"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    name = Column(
        String(100), unique=True, nullable=False, index=True
    )  # e.g. "Health", "Education"
    description = Column(Text, nullable=True)
    sector_code = Column(
        String(20), unique=True, nullable=False, index=True
    )  # e.g. HEALTH, EDUCATION

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    amenities = relationship("Amenities", backref="sector")
    public_services = relationship("PublicServices", backref="sector")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_sectors_name", "name", unique=True),
        Index("uq_sectors_sector_code", "sector_code", unique=True),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<Sectors(id={self.id}, name='{self.name}', sector_code='{self.sector_code}')>"
