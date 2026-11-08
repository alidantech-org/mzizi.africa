from sqlalchemy import Column, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class OfficeHierarchy(Base):
    """
    Office hierarchy table - defines relationships between offices.
    Examples: Cabinet Secretary reports to President, MP reports to Speaker.
    """

    __tablename__ = "office_hierarchy"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    parent_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )
    child_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    relationship_type = Column(
        String(20), nullable=False, index=True
    )  # reports_to, supervises

    # Relationships
    parent_office = relationship(
        "Offices", foreign_keys=[parent_office_id], backref="child_offices"
    )
    child_office = relationship(
        "Offices", foreign_keys=[child_office_id], backref="parent_offices"
    )

    # Constraints and Indexes
    __table_args__ = (
        Index(
            "uq_office_hierarchy_relationship",
            "parent_office_id",
            "child_office_id",
            "relationship_type",
            unique=True,
        ),
        {"schema": "governance"},
    )

    def __repr__(self):
        return f"<OfficeHierarchy(id={self.id}, parent_office_id={self.parent_office_id}, child_office_id={self.child_office_id}, relationship_type='{self.relationship_type}')>"
