from sqlalchemy import Column, String, DateTime, ForeignKey, Index, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class ConfidenceLevelEnum(str):
    """Enumeration of confidence levels for statistical data"""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    ESTIMATE = "estimate"
    PROJECTION = "projection"


class StatisticsTables(Base):
    """
    Represents statistical data tables with their metadata and geographic specification.
    Stores verification status, notes, methodology, collector, source, confidence, ownership, and geographic level.
    Referenced by geo_statistics records for complete data provenance.
    """

    __tablename__ = "statistics_tables"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Table Code (Business identifier - for display/search only)
    # Pattern: country/indicator/selfname
    # e.g., "ke/demographic/population/census-2019", "ke/economic/gdp/knbs-2023"
    table_code = Column(String(100), nullable=False, unique=True, index=True)

    # Geographic Specification - ALL NULLABLE for back-population
    geo_level_id = Column(String(26), ForeignKey("geographic.geo_levels.id"), nullable=True, index=True)
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)
    geo_level_code = Column(String(100), nullable=True, index=True)  # e.g., "national", "county", "constituency"
    geo_unit_code = Column(String(100), nullable=True, index=True)  # e.g., "kenya", "nairobi-county"

    # Data Ownership - Who is responsible for this specific data point - ALL NULLABLE for back-population
    institution_id = Column(String(26), ForeignKey("governance.institutions.id"), nullable=True, index=True)
    office_id = Column(String(26), ForeignKey("offices.offices.id"), nullable=True, index=True)

    # Ownership Codes (for search/filtering - NOT foreign keys)
    institution_code = Column(String(100), nullable=True, index=True)  # e.g., "exec-office", "parliament", "judiciary"
    office_code = Column(String(100), nullable=True, index=True)  # e.g., "exec-office/president", "parliament/speaker"

    # Metadata Fields
    source = Column(String(200), nullable=True, index=True)  # KNBS, census, survey, etc.
    methodology = Column(Text, nullable=True)  # How data was collected
    collector = Column(String(200), nullable=True, index=True)  # Who collected the data
    notes = Column(Text, nullable=True)
    is_verified = Column(String(10), default="false", nullable=False, index=True)
    confidence = Column(
        SQLEnum(
            ConfidenceLevelEnum.HIGH,
            ConfidenceLevelEnum.MEDIUM,
            ConfidenceLevelEnum.LOW,
            ConfidenceLevelEnum.ESTIMATE,
            ConfidenceLevelEnum.PROJECTION,
            name="confidence_level_enum",
            schema="statistics",
        ),
        nullable=True,
        index=True,
    )  # high, medium, low, estimate

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships (reverse relationship - geo_statistics references this)
    institution = relationship("Institutions", backref="statistics_tables")
    office = relationship("Offices", backref="statistics_tables")
    geo_level = relationship("GeoLevels", backref="statistics_tables")
    geo_unit = relationship("GeoUnits", backref="statistics_tables")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_statistics_tables_table_code", "table_code", unique=True),
        Index("idx_statistics_tables_geo_level_code", "geo_level_code"),
        Index("idx_statistics_tables_geo_unit_code", "geo_unit_code"),
        Index("idx_statistics_tables_institution_code", "institution_code"),
        Index("idx_statistics_tables_office_code", "office_code"),
        Index("idx_statistics_tables_source", "source"),
        Index("idx_statistics_tables_collector", "collector"),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<StatisticsTables(id={self.id}, table_code='{self.table_code}', is_verified='{self.is_verified}')>"
