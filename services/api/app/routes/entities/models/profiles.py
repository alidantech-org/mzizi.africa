from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ulid import ulid

from app.config.database import Base


# --- 3. THE OPERATIONAL LAYER (Profiles) ---
class Profile(Base):
    """
    Stores soft data: Avatars (Logos), Socials, and Contact Info.
    """

    __tablename__ = "profiles"
    __table_args__ = {"schema": "entities"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()))

    # Foreign key reference for database integrity
    entity_id = Column(
        String(26), ForeignKey("entities.legal_entities.id"), nullable=True, index=True
    )

    # Relationship via code (primary for business logic)
    entity_code = Column(String(100), nullable=False, unique=True, index=True)

    logo_url = Column(String(500))
    website_url = Column(String(255))
    hq_address = Column(Text)
    social_links = Column(JSON, default={})  # {"x": "@company", "linkedin": "..."}

    industry_sector = Column(String(100), index=True)  # e.g., 'Construction', 'ICT'

    # Contact information
    email = Column(String(200))
    phone = Column(String(50))

    # Additional metadata
    description = Column(Text)
    employee_count = Column(String(50))  # e.g., "1000-5000"

    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), onupdate="now()")

    # Relationships
    entity = relationship(
        "LegalEntities", foreign_keys=[entity_id], back_populates="profile"
    )

    def __repr__(self):
        return f"<Profile(entity_code='{self.entity_code}', industry='{self.industry_sector}')>"
