from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ulid import ulid

from app.config.database import Base


# --- 2. THE OWNERSHIP LAYER ---
class Ownership(Base):
    """
    Connects People to Entities.
    Solves: Who actually owns this company?
    """

    __tablename__ = "ownership"
    __table_args__ = {"schema": "entities"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # Foreign key references for database integrity
    entity_id = Column(
        String(26), ForeignKey("entities.legal_entities.id"), nullable=True, index=True
    )
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=True, index=True
    )

    # Relationship via codes (primary for business logic)
    entity_code = Column(String(100), nullable=False, index=True)
    person_code = Column(String(100), nullable=False, index=True)

    ownership_percentage = Column(Integer, nullable=True)  # e.g., 51
    position = Column(String(100))  # e.g., Director, Shareholder, Secretary
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)

    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), onupdate="now()")

    # Relationships
    entity = relationship(
        "LegalEntities", foreign_keys=[entity_id], back_populates="ownership"
    )
    person = relationship("People", foreign_keys=[person_id])

    def __repr__(self):
        return f"<Ownership(entity='{self.entity_code}', person='{self.person_code}', percentage={self.ownership_percentage})>"
