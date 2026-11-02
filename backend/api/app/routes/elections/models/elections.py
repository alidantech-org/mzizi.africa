from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class ElectionTypeEnum(str):
    """Enumeration of election types"""

    GENERAL = "general"
    BY_ELECTION = "by-election"
    PRIMARY = "primary"
    RUNOFF = "runoff"
    REFERENDUM = "referendum"
    RECALL = "recall"
    NOMINATION = "nomination"
    SPECIAL = "special"


class ElectionStatusEnum(str):
    """Enumeration of election status"""

    PLANNED = "planned"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class Elections(Base):
    """
    Elections table - defines election events with legal basis.
    Examples: 2022 General Election, 2023 Nairobi County By-Election
    """

    __tablename__ = "elections"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Election Code (Business identifier - represents election events)
    # These represent election codes like "ke/nairobi/2023-by-election", "ke/2022-general-election" for easy reference
    election_code = Column(String(100), nullable=False, unique=True, index=True)
    name = Column(String(200), nullable=False, index=True)  # 2022 General Election

    # Election Classification
    election_type = Column(
        SQLEnum(
            ElectionTypeEnum.GENERAL,
            ElectionTypeEnum.BY_ELECTION,
            ElectionTypeEnum.PRIMARY,
            ElectionTypeEnum.RUNOFF,
            ElectionTypeEnum.REFERENDUM,
            ElectionTypeEnum.RECALL,
            ElectionTypeEnum.NOMINATION,
            ElectionTypeEnum.SPECIAL,
            name="election_type_enum",
            schema="elections",
        ),
        nullable=True,
        index=True,
        default=ElectionTypeEnum.GENERAL,
    )

    # Election Dates (Constitutional vs Actual)
    planned_date = Column(Date, nullable=True, index=True)  # Date as per constitution/legal requirement
    actual_date = Column(Date, nullable=True, index=True)  # Actual date when election occurred

    # Election Status
    election_status = Column(
        SQLEnum(
            ElectionStatusEnum.PLANNED,
            ElectionStatusEnum.SCHEDULED,
            ElectionStatusEnum.IN_PROGRESS,
            ElectionStatusEnum.COMPLETED,
            ElectionStatusEnum.CANCELLED,
            ElectionStatusEnum.POSTPONED,
            name="election_status_enum",
            schema="elections",
        ),
        nullable=True,
        index=True,
        default=ElectionStatusEnum.PLANNED,
    )

    # Foreign Keys (ALL NULLABLE for back-population)
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)
    institution_id = Column(String(26), ForeignKey("governance.institutions.id"), nullable=True, index=True)  # Institution in charge

    # Reference Codes (for search/filtering - NOT foreign keys)
    geo_unit_code = Column(String(100), nullable=True, index=True)  # e.g. "ke", "ke/nairobi"
    institution_code = Column(String(100), nullable=True, index=True)  # e.g. "ke/iebc", "ke/judiciary"

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="elections")
    institution = relationship("Institutions", backref="elections")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_elections_election_code", "election_code", unique=True),
        Index("idx_elections_name", "name"),
        Index("idx_elections_geo_unit", "geo_unit_code", "election_code"),
        Index("idx_elections_institution", "institution_code", "election_code"),
        Index("idx_elections_type_date", "election_type", "planned_date"),
        Index("idx_elections_status", "election_status", "actual_date"),
        Index("idx_elections_dates", "planned_date", "actual_date"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<Elections(id={self.id}, election_code='{self.election_code}', name='{self.name}', election_type='{self.election_type}')>"
