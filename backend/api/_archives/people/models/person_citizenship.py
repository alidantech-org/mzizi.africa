from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class CitizenshipTypeEnum(enum.Enum):
    """Enumeration of citizenship types"""

    BIRTH = "BIRTH"
    REGISTRATION = "REGISTRATION"
    NATURALIZATION = "NATURALIZATION"
    DESCENT = "DESCENT"
    MARRIAGE = "MARRIAGE"


class PersonCitizenship(Base):
    """
    Person citizenship table - tracks citizenship status over time.
    Examples: Kenyan by birth, dual citizenship, naturalized citizen.
    """

    __tablename__ = "person_citizenship"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )

    # Core Fields
    country_code = Column(String(10), nullable=False, index=True)
    citizenship_type = Column(
        String(20), nullable=False, index=True
    )  # BIRTH, REGISTRATION, NATURALIZATION

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="citizenships")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_person_citizenship_person", "person_id", "country_code"),
        Index("idx_person_citizenship_current", "person_id", "valid_to").filter(
            valid_to.is_(None)
        ),
        Index("idx_person_citizenship_type", "citizenship_type"),
        {"schema": "people"},
    )

    def __repr__(self):
        return f"<PersonCitizenship(id={self.id}, person_id={self.person_id}, country_code='{self.country_code}', citizenship_type='{self.citizenship_type}')>"
