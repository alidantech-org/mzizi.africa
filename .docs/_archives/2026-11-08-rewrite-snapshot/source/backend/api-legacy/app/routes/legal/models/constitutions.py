from sqlalchemy import Column, String, Date, Text, Index, Enum as SQLEnum
from app.config.database import Base
from ulid import ulid


class ConstitutionStatus(str):
    """Defines the status of constitutions"""

    DRAFT = "draft"
    ACTIVE = "active"
    RETIRED = "retired"
    SUPERSEDED = "superseded"
    SUSPENDED = "suspended"


class Constitutions(Base):
    """
    Constitutions table - tracks different versions of constitutions with document storage.
    """

    __tablename__ = "constitutions"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Constitution Code
    constitution_code = Column(String(30), nullable=False, unique=True, index=True)

    # Core Fields
    name = Column(String(200), nullable=False, index=True)
    effective_from = Column(Date, nullable=False, index=True)
    effective_to = Column(Date, nullable=True, index=True)
    status = Column(
        SQLEnum(
            ConstitutionStatus.DRAFT,
            ConstitutionStatus.ACTIVE,
            ConstitutionStatus.RETIRED,
            ConstitutionStatus.SUPERSEDED,
            ConstitutionStatus.SUSPENDED,
            name="constitution_status_enum",
            schema="legal",
        ),
        nullable=False,
        index=True,
    )

    # Document Storage Integration
    document_uri = Column(Text, nullable=False)  # FILE LOCATION
    document_hash = Column(String(128), nullable=False, index=True)

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_constitutions_constitution_code", "constitution_code", unique=True),
        {"schema": "legal"},
    )

    def __repr__(self):
        return f"<Constitutions(id={self.id}, constitution_code='{self.constitution_code}', name='{self.name}')>"
