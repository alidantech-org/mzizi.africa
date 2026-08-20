from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Index, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class GeoStatistics(Base):
    """
    Core fact table - stores specific data values for geographic units.
    Minimal design focusing only on essential data point information.
    Links geography, tables, indicators, periods, and columns with actual values.
    All foreign keys are nullable for flexible back-population.
    """

    __tablename__ = "geo_statistics"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Foreign Keys (link codes to IDs) - ALL NULLABLE for back-population
    geo_unit_id = Column(String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True)
    table_id = Column(String(26), ForeignKey("statistics.statistics_tables.id"), nullable=True, index=True)
    column_id = Column(String(26), ForeignKey("statistics.indicator_columns.id"), nullable=True, index=True)
    indicator_id = Column(String(26), ForeignKey("statistics.indicators.id"), nullable=True, index=True)  # For fast queries
    period_id = Column(String(26), ForeignKey("statistics.periods.id"), nullable=True, index=True)  # For fast queries

    # Essential Reference Codes (for search/filtering)
    geo_unit_code = Column(String(100), nullable=False, index=True)  # e.g., "ke/nairobi-county"
    table_code = Column(String(100), nullable=False, index=True)  # e.g., "ke/demographic/population/census-2019"
    column_code = Column(String(100), nullable=False, index=True)  # e.g., "total", "density-per-sq-km"
    indicator_code = Column(String(100), nullable=False, index=True)  # e.g., "demographic/population"
    period_code = Column(String(100), nullable=False, index=True)  # e.g., "year/2019", "quarter/q1-2024"

    # Data Values (based on column data_type)
    numeric_value = Column(Numeric(25, 4), nullable=True, index=True)  # For numeric data - increased precision for large economic values
    text_value = Column(Text, nullable=True, index=True)  # For generic string data

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    geo_unit = relationship("GeoUnits", backref="geo_statistics")
    table = relationship("StatisticsTables", backref="geo_statistics")
    column = relationship("IndicatorColumns", backref="geo_statistics")
    indicator = relationship("Indicators", backref="geo_statistics")
    period = relationship("Periods", backref="geo_statistics")

    # Constraints and Indexes
    __table_args__ = (
        # Ensure either numeric_value or text_value is provided
        CheckConstraint("(numeric_value IS NOT NULL) OR (text_value IS NOT NULL)", name="ck_geo_statistics_value_required"),
        # Essential indexes for fast queries
        Index("idx_geo_statistics_geo_unit_code", "geo_unit_code"),
        Index("idx_geo_statistics_table_code", "table_code"),
        Index("idx_geo_statistics_column_code", "column_code"),
        Index("idx_geo_statistics_indicator_code", "indicator_code"),
        Index("idx_geo_statistics_period_code", "period_code"),
        # Composite indexes for common query patterns
        Index("idx_geo_statistics_geo_indicator", "geo_unit_code", "indicator_code"),
        Index("idx_geo_statistics_indicator_period", "indicator_code", "period_code"),
        Index("idx_geo_statistics_geo_period", "geo_unit_code", "period_code"),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<GeoStatistics(id={self.id}, geo_unit_code='{self.geo_unit_code}', column_code='{self.column_code}')>"
