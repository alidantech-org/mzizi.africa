from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class IdentifierTypeEnum(enum.Enum):
    """Enumeration of identifier types"""

    NATIONAL_ID = "NATIONAL_ID"
    PASSPORT = "PASSPORT"
    VOTER_ID = "VOTER_ID"
    BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE"
    DRIVING_LICENSE = "DRIVING_LICENSE"
    TAX_ID = "TAX_ID"
    MILITARY_ID = "MILITARY_ID"


class PersonIdentifiers(Base):
    """
    Person identifiers table - flexible identity system with hashed security.
    Examples: National ID, Passport, Voter ID, Birth Certificate.
    """

    __tablename__ = "person_identifiers"

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
    identifier_type = Column(
        String(30), nullable=False, index=True
    )  # NATIONAL_ID, PASSPORT, VOTER_ID
    identifier_hash = Column(String(128), nullable=False, index=True)  # always hashed
    country_code = Column(String(10), nullable=False, index=True)  # Issuing country
    is_primary = Column(
        Boolean, default=False, nullable=False, index=True
    )  # Primary identifier

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="identifiers")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_person_identifiers_person", "person_id", "identifier_type"),
        Index("idx_person_identifiers_primary", "person_id", "is_primary"),
        Index(
            "uq_person_identifiers_hash_type",
            "person_id",
            "identifier_type",
            "identifier_hash",
            unique=True,
        ),
        # Business rule: only one primary identifier per person
        Index("ck_person_identifiers_one_primary", "person_id", "is_primary").where(
            is_primary == True
        ),
        {"schema": "people"},
    )

    def __repr__(self):
        return f"<PersonIdentifiers(id={self.id}, person_id={self.person_id}, identifier_type='{self.identifier_type}', is_primary={self.is_primary})>"
