from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class StatusCodeEnum(enum.Enum):
    """Enumeration of person status codes"""

    ACTIVE = "ACTIVE"
    DECEASED = "DECEASED"
    DISQUALIFIED = "DISQUALIFIED"
    INCAPACITATED = "INCAPACITATED"
    MINOR = "MINOR"
    EMIGRATED = "EMIGRATED"


class PersonStatus(Base):
    """
    Person status table - tracks lifecycle states over time.
    Examples: ACTIVE, DECEASED, DISQUALIFIED, INCAPACITATED
    """

    __tablename__ = "person_status"

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
    status_code = Column(
        String(20), nullable=False, index=True
    )  # ACTIVE, DECEASED, DISQUALIFIED, INCAPACITATED
    reason = Column(Text, nullable=True)  # Explanation for status change

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="status_history")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_person_status_person", "person_id", "valid_from"),
        Index("idx_person_status_current", "person_id", "valid_to").filter(
            valid_to.is_(None)
        ),
        Index("idx_person_status_code", "status_code"),
        {"schema": "people"},
    )

    def __repr__(self):
        return f"<PersonStatus(id={self.id}, person_id={self.person_id}, status_code='{self.status_code}', valid_from={self.valid_from})>"
