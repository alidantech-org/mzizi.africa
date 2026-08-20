from sqlalchemy import Column, String, Date, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class FiscalYears(Base):
    """
    Fiscal years table - defines fiscal year periods for financial tracking.
    Examples: FY 2023/2024, FY 2024/2025.
    """

    __tablename__ = "fiscal_years"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    fiscal_year_code = Column(
        String(20), unique=True, nullable=False, index=True
    )  # e.g. FY_2023_2024
    name = Column(
        String(100), nullable=False, index=True
    )  # e.g. "Fiscal Year 2023/2024"

    # Temporal Fields
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)

    # Geographic Scope
    country_code = Column(String(10), nullable=False, index=True)  # e.g. KE

    # Status
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_fiscal_years_fiscal_year_code", "fiscal_year_code", unique=True),
        Index("idx_fiscal_years_country", "country_code"),
        Index("idx_fiscal_years_active", "is_active"),
        Index("idx_fiscal_years_dates", "start_date", "end_date"),
        {"schema": "finance"},
    )

    def __repr__(self):
        return f"<FiscalYears(id={self.id}, fiscal_year_code='{self.fiscal_year_code}', name='{self.name}')>"
