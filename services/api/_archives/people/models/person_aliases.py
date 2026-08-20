from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class PersonAliases(Base):
    """
    Person aliases table - tracks name changes and variations over time.
    Examples: Legal name changes, married names, name corrections.
    """

    __tablename__ = "person_aliases"

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
    full_name = Column(String(200), nullable=False, index=True)

    # Temporal Fields
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    person = relationship("People", backref="aliases")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_person_aliases_person", "person_id", "valid_from"),
        Index("idx_person_aliases_current", "person_id", "valid_to").filter(
            valid_to.is_(None)
        ),
        Index("idx_person_aliases_name", "full_name"),
        {"schema": "people"},
    )

    def __repr__(self):
        return f"<PersonAliases(id={self.id}, person_id={self.person_id}, full_name='{self.full_name}', valid_from={self.valid_from})>"
