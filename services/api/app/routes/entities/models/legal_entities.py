from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Date,
    Enum as SQLEnum,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from ulid import ulid

from app.config.database import Base


class EntityType(str):
    """
    Defines types of legal entities for Kenyan business registration.
    """

    PRIVATE_LIMITED = "private_limited"
    PUBLIC_LIMITED = "public_limited"
    SOLE_PROPRIETORSHIP = "sole_proprietorship"
    PARTNERSHIP = "partnership"
    NGO = "ngo"
    STATE_CORPORATION = "state_corporation"
    TRUST = "trust"


# --- 1. THE LEGAL IDENTITY LAYER ---
class LegalEntities(Base):
    """
    Stores the permanent legal identity of a non-human entity.

    Examples:
    - ke/private/safaricom-plc
    - ke/state-corp/kengen
    - ke/ngo/red-cross-kenya
    """

    __tablename__ = "legal_entities"
    __table_args__ = {"schema": "entities"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # The 'Public ID' - e.g., 'ke/private/equity-bank'
    entity_code = Column(String(100), unique=True, nullable=False, index=True)

    official_name = Column(String(255), nullable=False, index=True)
    registration_number = Column(String(100), unique=True, index=True)  # BRS Number
    tax_pin = Column(String(50), unique=True, index=True)  # KRA PIN

    entity_type = Column(
        SQLEnum(
            EntityType.PRIVATE_LIMITED,
            EntityType.PUBLIC_LIMITED,
            EntityType.SOLE_PROPRIETORSHIP,
            EntityType.PARTNERSHIP,
            EntityType.NGO,
            EntityType.STATE_CORPORATION,
            EntityType.TRUST,
            name="entity_type_enum",
            schema="entities",
        ),
        nullable=False,
        index=True,
    )
    registration_date = Column(Date, nullable=True)

    # Status tracking
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)  # Verified against BRS/KRA

    # Corporate hierarchy support
    parent_entity_id = Column(
        String(26), ForeignKey("entities.legal_entities.id"), nullable=True, index=True
    )
    parent_entity_code = Column(String(100), nullable=True, index=True)

    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), onupdate="now()")

    # Relationships
    profile = relationship("Profile", back_populates="entity", uselist=False)
    ownership = relationship("Ownership", back_populates="entity")
    locations = relationship("Location", back_populates="entity")

    # Self-referencing relationship for corporate hierarchy
    parent_entity = relationship(
        "LegalEntities", remote_side=[id], foreign_keys=[parent_entity_id]
    )
    child_entities = relationship(
        "LegalEntities", back_populates="parent_entity", foreign_keys=[parent_entity_id]
    )

    def __repr__(self):
        return f"<LegalEntities(entity_code='{self.entity_code}', official_name='{self.official_name}')>"
