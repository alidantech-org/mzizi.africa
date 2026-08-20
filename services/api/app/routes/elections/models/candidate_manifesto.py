from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class CandidateManifesto(Base):
    """
    CandidateManifesto table - stores candidate manifestos and policy documents.
    Links candidates to their detailed policy positions and campaign promises.
    Examples: "Raila Odinga 2022 Economic Manifesto", "Ruto 2022 Agriculture Policy"
    """

    __tablename__ = "candidate_manifestos"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Manifesto Code (Business identifier - represents manifesto documents)
    # These represent manifesto codes like "ke/nairobi/westlands/2022-general-election/john-doe/economic-manifesto" for easy reference
    manifesto_code = Column(String(200), nullable=False, unique=True, index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    candidate_id = Column(String(26), ForeignKey("elections.candidates.id"), nullable=True, index=True)

    # Reference Codes (for search/filtering - NOT foreign keys)
    candidate_code = Column(String(150), nullable=False, index=True)  # e.g. "ke/nairobi/westlands/2022-general-election/john-doe"

    # Core Fields
    title = Column(String(200), nullable=False, index=True)  # e.g. "Economic Development Manifesto 2022"
    description = Column(Text, nullable=True)  # Brief summary of the manifesto
    content = Column(Text, nullable=True)  # Full manifesto text content
    tags = Column(JSON, nullable=True)  # Array of tags like ["economy", "agriculture", "healthcare"]

    # Publication Details
    published_date = Column(DateTime(timezone=True), nullable=True, index=True)  # When manifesto was published
    version = Column(String(20), nullable=True, index=True)  # e.g. "v1.0", "v2.0"
    language = Column(String(10), nullable=True, default="en", index=True)  # e.g. "en", "sw"

    # External References
    pdf_url = Column(Text, nullable=True)  # URL to PDF version of manifesto
    website_url = Column(Text, nullable=True)  # URL to campaign website page

    # Status
    is_published = Column(String(10), nullable=True, default="draft", index=True)  # draft, published, archived
    is_featured = Column(String(10), nullable=True, default="false", index=True)  # true/false as string

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    candidate = relationship("Candidates", backref="manifestos")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_candidate_manifestos_manifesto_code", "manifesto_code", unique=True),
        Index("idx_candidate_manifestos_title", "title"),
        Index("idx_candidate_manifestos_candidate", "candidate_id", "published_date"),
        Index("idx_candidate_manifestos_published", "is_published", "published_date"),
        Index("idx_candidate_manifestos_featured", "is_featured", "published_date"),
        Index("idx_candidate_manifestos_tags", "candidate_id"),  # For JSON tag queries
        Index("idx_candidate_manifestos_codes", "candidate_code", "manifesto_code"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<CandidateManifesto(id={self.id}, manifesto_code='{self.manifesto_code}', title='{self.title}', candidate_id={self.candidate_id})>"
