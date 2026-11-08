from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class IndicatorColumns(Base):
    """
    Represents actual table columns within indicator tables.
    Stores column names like "total", "density-per-sq-km", "land-area-sq-km".
    These columns belong to specific indicator tables (e.g., demographic/population table).
    Examples: Total Population, Population Density, Land Area, GDP Growth Rate, etc.
    """

    __tablename__ = "indicator_columns"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Column Code (represents actual table column names)
    # These are column names within indicator tables
    # e.g., "total", "density-per-sq-km", "land-area-sq-km", "growth-rate", "literacy-rate"
    column_code = Column(String(100), nullable=False, unique=True, index=True)

    # Foreign Keys (ALWAYS use IDs for relationships) - ALL NULLABLE for back-population
    indicator_id = Column(String(26), ForeignKey("statistics.indicators.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    indicator_code = Column(String(100), nullable=False, index=True)  # e.g., "demographic/population", "economic/gdp"

    # Core Fields
    label = Column(String(100), nullable=False, index=True)
    description = Column(String(500), nullable=True)
    data_type = Column(String(50), nullable=False, index=True)  # "numeric", "text", "json", "boolean"

    # Ordering
    sort_order = Column(Integer, default=0, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    indicator = relationship("Indicators", backref="indicator_columns")

    # Reduced Constraints and Indexes
    __table_args__ = (
        Index("uq_indicator_columns_column_code", "column_code", unique=True),
        Index("idx_indicator_columns_indicator_code", "indicator_code"),
        {"schema": "statistics"},
    )

    def __repr__(self):
        return f"<IndicatorColumns(id={self.id}, column_code='{self.column_code}', label='{self.label}', data_type='{self.data_type}')>"
