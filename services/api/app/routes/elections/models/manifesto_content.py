from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
from ulid import ulid


class ManifestoContent(Base):
    """
    ManifestoContent table - detailed sections and content of candidate manifestos.
    Breaks down manifestos into structured, categorized, and tagged sections.
    Examples: "Economic Policy - Job Creation", "Healthcare Plan - Universal Coverage"
    """

    __tablename__ = "manifesto_contents"

    # Primary Key (ULID - Time-ordered, consistent across system)
    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    # Content Code (Business identifier - represents manifesto sections)
    # These represent content codes like "ke/nairobi/westlands/2022-general-election/john-doe/economic-manifesto/job-creation" for easy reference
    content_code = Column(String(200), nullable=False, unique=True, index=True)

    # Foreign Keys (ALL NULLABLE for back-population)
    manifesto_id = Column(String(26), ForeignKey("elections.candidate_manifestos.id"), nullable=True, index=True)
    candidate_id = Column(String(26), ForeignKey("elections.candidates.id"), nullable=True, index=True)  # Direct link to candidate
    # e.g. "ke/nairobi/westlands/2022-general-election/john-doe/economic-manifesto"
    # Reference Codes (for search/filtering - NOT foreign keys)
    manifesto_code = Column(String(200), nullable=False, index=True)
    candidate_code = Column(String(150), nullable=False, index=True)  # e.g. "ke/nairobi/westlands/2022-general-election/john-doe"

    # Core Content Fields
    section_title = Column(String(200), nullable=False, index=True)  # e.g. "Job Creation Strategy"
    section_summary = Column(Text, nullable=True)  # Brief summary of this section
    section_content = Column(Text, nullable=True)  # Detailed content of this section

    # Classification Fields (all strings, no enums)
    category = Column(String(50), nullable=False, index=True)  # e.g. "economy", "healthcare", "education", "infrastructure"
    subcategory = Column(String(50), nullable=True, index=True)  # e.g. "job-creation", "universal-health", "primary-education"
    priority_level = Column(String(20), nullable=False, default="medium", index=True)  # "high", "medium", "low"
    implementation_timeline = Column(String(50), nullable=True, index=True)  # "short-term", "medium-term", "long-term"

    # Tags and Keywords (JSON arrays for flexible tagging)
    tags = Column(JSON, nullable=True)  # Array of tags like ["employment", "youth", "skills", "training"]
    keywords = Column(JSON, nullable=True)  # Array of keywords like ["jobs", "unemployment", "skills-development"]
    target_audience = Column(JSON, nullable=True)  # Array of audiences like ["youth", "women", "rural", "urban"]

    # Content Structure
    section_number = Column(String(10), nullable=True, index=True)  # e.g. "1.1", "2.3", "3.1"
    parent_section_code = Column(String(100), nullable=True, index=True)  # For hierarchical content
    sort_order = Column(String(10), nullable=True, default="1", index=True)  # For ordering sections

    # Content Metadata
    content_type = Column(String(20), nullable=False, default="policy", index=True)  # "policy", "promise", "plan", "vision"
    content_status = Column(String(20), nullable=False, default="draft", index=True)  # "draft", "review", "final", "published"
    verification_status = Column(String(20), nullable=True, default="pending", index=True)  # "pending", "verified", "fact-checked"

    # External References
    supporting_documents = Column(JSON, nullable=True)  # Array of document URLs or references
    data_sources = Column(JSON, nullable=True)  # Array of data source references
    cost_estimates = Column(
        JSON, nullable=True
    )  # Cost information as JSON: {"amount": "10B KES", "currency": "KES", "timeline": "5-years"}

    # Publication Details
    published_at = Column(DateTime(timezone=True), nullable=True, index=True)  # When this section was published
    last_reviewed_at = Column(DateTime(timezone=True), nullable=True, index=True)  # When this section was last reviewed
    reviewed_by = Column(String(100), nullable=True, index=True)  # Who reviewed this section

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    manifesto = relationship("CandidateManifesto", backref="contents")
    candidate = relationship("Candidates", backref="manifesto_contents")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_manifesto_contents_content_code", "content_code", unique=True),
        Index("idx_manifesto_contents_title", "section_title"),
        Index("idx_manifesto_contents_manifesto", "manifesto_id", "sort_order"),
        Index("idx_manifesto_contents_category", "category", "subcategory"),
        Index("idx_manifesto_contents_priority", "priority_level", "implementation_timeline"),
        Index("idx_manifesto_contents_status", "content_status", "verification_status"),
        Index("idx_manifesto_contents_tags", "category"),  # For JSON tag queries
        Index("idx_manifesto_contents_codes", "manifesto_code", "candidate_code"),
        Index("idx_manifesto_contents_hierarchy", "parent_section_code", "section_number"),
        {"schema": "elections"},
    )

    def __repr__(self):
        return f"<ManifestoContent(id={self.id}, content_code='{self.content_code}', section_title='{self.section_title}', manifesto_id={self.manifesto_id})>"
