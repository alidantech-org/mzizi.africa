from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class GeoLevels(Base):
    """
    Defines types of administrative levels and their order.
    Examples: Country, County, Constituency, Ward
    """

    __tablename__ = "geo_levels"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Geographic Level Code (Business identifier - for display/search only)
    geo_level_code = Column(
        String(10), nullable=False, unique=True, index=True
    )  # e.g., "CTR", "CNTY", "CONST", "WARD"

    # Core Fields
    level_name = Column(String(100), nullable=False, index=True)
    level_order = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index("idx_geo_levels_name", "level_name"),
        Index("uq_geo_levels_geo_level_code", "geo_level_code", unique=True),
        {"schema": "geographic"},
    )

    def __repr__(self):
        return f"<GeoLevels(id={self.id}, geo_level_code='{self.geo_level_code}', level_name='{self.level_name}')>"
