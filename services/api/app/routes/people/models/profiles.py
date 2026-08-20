from sqlalchemy import Column, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from app.config.database import Base


class Profile(Base):
    """
    Rich profile data linked to People via internal ID.
    Contains extended biographical information, media, and social links.
    """

    __tablename__ = "profiles"
    __table_args__ = {"schema": "people"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    person_id = Column(
        String(36),
        ForeignKey("people.people.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    # Media and appearance
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)

    # Social media and external links
    social_links = Column(
        JSON, default=dict, nullable=True
    )  # {"x": "@ruto", "facebook": "...", "linkedin": "..."}

    # Professional background
    education = Column(
        JSON, default=dict, nullable=True
    )  # [{"institution": "UON", "degree": "LLB", "year": "2010"}]
    career_history = Column(
        JSON, default=dict, nullable=True
    )  # [{"position": "CEO", "company": "XYZ", "years": "2015-2020"}]

    # Contact information (public)
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)

    # Audit fields
    created_at = Column(
        String(50), nullable=True
    )  # Will be populated by database default
    updated_at = Column(
        String(50), nullable=True
    )  # Will be populated by database default

    # Relationships
    person = relationship("People", back_populates="profile")

    def __repr__(self):
        return f"<Profile(person_id={self.person_id}, avatar_url='{self.avatar_url}')>"
