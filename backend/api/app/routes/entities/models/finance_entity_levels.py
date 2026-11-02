from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    Text,
    Index,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class FinanceEntityLevels(Base):
    """
    Defines types of finance entity levels and their order.
    Examples: national, county, department, program, sub-program

    NB: RULES: never add foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like finance/national/county/department.
    """

    __tablename__ = "finance_entity_levels"
    __table_args__ = {"schema": "entities"}

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Finance level code (business identifier - for display/search only) e.g., "national", "county", "department", "program", "sub-program"
    level_code = Column(String(100), nullable=False, unique=True, index=True)

    # Core Fields
    level_name = Column(String(100), nullable=False, index=True)
    level_order = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Is Active Field
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Geographic Level Code (defines which geographic level this finance level maps to)
    geo_level_code = Column(String(100), nullable=True, index=True)

    # Geographic Level ID (references geo_levels.id)
    geo_level_id = Column(
        String(26), ForeignKey("geographic.geo_levels.id"), nullable=True, index=True
    )

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships (using string references to avoid FK constraints)
    geo_level = relationship("GeoLevels")

    # Indexes
    __table_args__ = (
        Index("idx_finance_entity_levels_name", "level_name"),
        Index("uq_finance_entity_levels_level_code", "level_code", unique=True),
        {"schema": "entities"},
    )

    def __repr__(self):
        return f"<FinanceEntityLevels(id={self.id}, level_code='{self.level_code}', level_name='{self.level_name}')>"
