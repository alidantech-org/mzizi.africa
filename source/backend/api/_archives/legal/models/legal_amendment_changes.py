from sqlalchemy import Column, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class LegalAmendmentChanges(Base):
    """
    Amendment changes audit trail.
    Tracks specific changes made by amendments to legal instruments and sections.
    """

    __tablename__ = "legal_amendment_changes"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    amendment_id = Column(String(26), nullable=False, index=True)
    affected_version_id = Column(String(26), nullable=False, index=True)
    section_id = Column(String(26), nullable=False, index=True)

    # Core Fields
    change_type = Column(
        String(20), nullable=False, index=True
    )  # create, update, repeal

    # Relationships
    amendment = relationship("LegalAmendments", backref="changes")
    affected_version = relationship(
        "LegalInstrumentVersions", backref="amendment_changes"
    )
    section = relationship("LegalSections", backref="amendment_changes")

    # Constraints and Indexes
    __table_args__ = ({"schema": "legal"},)

    def __repr__(self):
        return f"<LegalAmendmentChanges(id={self.id}, amendment_id={self.amendment_id}, change_type='{self.change_type}')>"
