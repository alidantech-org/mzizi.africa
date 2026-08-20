from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    Text,
    JSON,
    Enum as SQLEnum,
    Date,
)
from sqlalchemy.orm import relationship
import uuid

from app.config.database import Base


class LifeStatus(str):
    """
    Defines life status for people tracking.
    """

    ALIVE = "alive"
    DECEASED = "deceased"
    UNKNOWN = "unknown"


class Gender(str):
    """
    Defines gender for constitutional compliance tracking.
    """

    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


# --- 1. THE BIOGRAPHICAL LAYER ---
class People(Base):
    """
    Core Identity using a Public slug/code instead of National ID.
    Stores unique, permanent identity information for any individual
    who has ever held or will hold public office.
    """

    __tablename__ = "people"
    __table_args__ = {"schema": "people"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # The 'Public ID' - e.g., 'william-samoei-ruto' or 'gv-047-sakaja'
    # Unique, URL-friendly, and used for cross-referencing public data.
    person_code = Column(String(100), unique=True, nullable=False, index=True)

    full_name = Column(String(200), nullable=False, index=True)

    # Names & Formalities
    alternate_names = Column(
        JSON, default=list, nullable=True
    )  # ["W.S. Ruto", "William Samoei Ruto", "Ruto"]
    title_prefix = Column(String(50), nullable=True)  # Hon, H.E, Dr, Prof
    title_suffix = Column(String(50), nullable=True)  # EGH, CBS, SC, PhD

    # Demographics (For Constitutional Compliance checks)
    gender = Column(
        SQLEnum(
            Gender.MALE,
            Gender.FEMALE,
            Gender.OTHER,
            Gender.PREFER_NOT_TO_SAY,
            name="gender_enum",
            schema="people",
        ),
        nullable=True,
        index=True,
    )
    is_pwd = Column(Boolean, default=False, index=True)  # Person with Disability

    # Search capability
    search_vector = Column(Text, nullable=True)  # For full-text search

    # Life status tracking
    status = Column(
        SQLEnum(
            LifeStatus.ALIVE,
            LifeStatus.DECEASED,
            LifeStatus.UNKNOWN,
            name="life_status_enum",
            schema="people",
        ),
        default=LifeStatus.ALIVE,
        nullable=False,
        index=True,
    )
    date_of_birth = Column(Date, nullable=True, index=True)
    date_of_death = Column(Date, nullable=True, index=True)
    place_of_birth = Column(String(200), nullable=True, index=True)

    # Verification source for status changes
    status_source_url = Column(
        String(500), nullable=True
    )  # Gazette Notice, Official News, etc.

    # System Flags
    is_active = Column(Boolean, default=True, index=True)  # Soft delete/retirement flag
    last_verified_at = Column(
        DateTime(timezone=True), nullable=True
    )  # Last data verification

    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), onupdate="now()")

    # Relationships
    profile = relationship(
        "Profile", back_populates="person", uselist=False, cascade="all, delete-orphan"
    )
    holders = relationship(
        "Holders", back_populates="person", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<People(person_code='{self.person_code}', full_name='{self.full_name}')>"
        )
