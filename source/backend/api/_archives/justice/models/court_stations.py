from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class CourtRankEnum(enum.Enum):
    """Enumeration of court ranks"""

    SUPREME = "SUPREME"
    HIGH = "HIGH"
    MAGISTRATE = "MAGISTRATE"
    KADHI = "KADHI"
    COURT_MARTIAL = "COURT_MARTIAL"
    TRIBUNAL = "TRIBUNAL"
    SMALL_CLAIMS = "SMALL_CLAIMS"


class CourtStations(Base):
    """
    Court stations table - specialized court offices where cases are heard.
    Examples: Supreme Court of Kenya, High Court stations, Magistrate courts.
    """

    __tablename__ = "court_stations"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    name = Column(
        String(200), nullable=False, index=True
    )  # e.g. "Supreme Court of Kenya", "Nairobi High Court"
    court_rank = Column(
        String(20), nullable=False, index=True
    )  # SUPREME, HIGH, MAGISTRATE, etc.
    court_code = Column(
        String(20), unique=True, nullable=False, index=True
    )  # e.g. SC_KENYA, HC_NAIROBI

    # Geographic Scope
    geo_unit_code = Column(
        String(50), nullable=False, index=True
    )  # Where this court has jurisdiction

    # Contact and Location
    address = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(200), nullable=True)

    # Status
    is_active = Column(String(10), default="YES", nullable=False, index=True)  # YES, NO

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    legal_cases = relationship("LegalCases", backref="court_station")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_court_stations_court_code", "court_code", unique=True),
        Index("idx_court_stations_rank", "court_rank"),
        Index("idx_court_stations_geo", "geo_unit_code"),
        Index("idx_court_stations_active", "is_active"),
        {"schema": "justice"},
    )

    def __repr__(self):
        return f"<CourtStations(id={self.id}, name='{self.name}', court_rank='{self.court_rank}', geo_unit_code='{self.geo_unit_code}')>"
