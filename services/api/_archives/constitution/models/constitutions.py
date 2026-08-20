from sqlalchemy import Column, String, Date, Text, Index
from app.config.database import Base
import ulid


class Constitutions(Base):
    """
    Constitutions table - tracks different versions of constitutions with document storage.
    """

    __tablename__ = "constitutions"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Code
    code = Column(String(20), nullable=False, unique=True, index=True)

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    effective_from = Column(Date, nullable=False, index=True)
    effective_to = Column(Date, nullable=True, index=True)
    status = Column(String(20), nullable=False, index=True)

    # Document Storage Integration
    document_uri = Column(Text, nullable=False)  # FILE LOCATION
    document_hash = Column(String(128), nullable=False, index=True)

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_constitutions_code", "code", unique=True),
        {"schema": "constitution"},
    )

    def __repr__(self):
        return f"<Constitutions(id={self.id}, code='{self.code}', name='{self.name}')>"
