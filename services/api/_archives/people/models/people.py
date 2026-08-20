from sqlalchemy import Column, String, Date, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class GenderEnum(enum.Enum):
    """Enumeration of gender options"""

    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"


class People(Base):
    """
    People table - core identity table for all individuals in the system.
    Examples: citizens, officials, candidates, office holders.
    """

    __tablename__ = "people"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Identity Fields
    person_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # public-safe identifier
    full_name = Column(String(200), nullable=False, index=True)
    date_of_birth = Column(Date, nullable=True, index=True)
    gender = Column(String(20), nullable=True, index=True)  # optional but structured
    nationality_code = Column(String(10), nullable=False, index=True)  # e.g. KE

    # Security Fields (NEVER store raw sensitive data)
    national_id_hash = Column(
        String(128), nullable=True, index=True
    )  # hashed (NOT raw ID for security)

    # Life-cycle Status
    is_deceased = Column(Boolean, default=False, nullable=False, index=True)
    date_of_death = Column(Date, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_people_person_code", "person_code", unique=True),
        Index("idx_people_name", "full_name"),
        Index("idx_people_nationality", "nationality_code"),
        Index("idx_people_deceased", "is_deceased", "date_of_death"),
        {"schema": "people"},
    )

    def __repr__(self):
        return f"<People(id={self.id}, person_code='{self.person_code}', full_name='{self.full_name}')>"
