from sqlalchemy import Column, String
from app.config.database import Base
from ulid import ulid


class RevenueCategories(Base):
    """
    Revenue categories aligned with SCOA (Standard Chart of Accounts).
    Defines classification for all government revenue streams.
    """

    __tablename__ = "revenue_categories"
    __table_args__ = {"schema": "finance"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    category_code = Column(
        String(100), unique=True, nullable=False, index=True
    )  # e.g. tax, grants, fees
    category_name = Column(
        String(255), nullable=False
    )  # e.g. Tax Revenue, Grant Revenue

    def __repr__(self):
        return f"<RevenueCategories(category_code='{self.category_code}', category_name='{self.category_name}')>"
