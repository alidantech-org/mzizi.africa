from sqlalchemy import Column, String, Integer, Text, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class LegalLevels(Base):
    """
    Legal hierarchy definition - defines types of legal instruments.
    Examples: Constitution, Statute, Regulation, Ordinance, Case Law
    """

    __tablename__ = "legal_levels"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Core Fields
    code = Column(
        String(30), unique=True, nullable=False, index=True
    )  # CONSTITUTION, STATUTE, REGULATION, ORDINANCE, CASE_LAW
    name = Column(String(100), nullable=False)
    hierarchy_rank = Column(Integer, nullable=False)
    description = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_legal_levels_code", "code", unique=True),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<LegalLevels(id={self.id}, code='{self.code}', name='{self.name}')>"
