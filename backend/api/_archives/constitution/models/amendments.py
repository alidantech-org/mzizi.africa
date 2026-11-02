from sqlalchemy import Column, String, Text, Date, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class Amendments(Base):
    """
    Amendments table - tracks constitutional amendments.
    """

    __tablename__ = "amendments"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    constitution_id = Column(
        String(26),
        ForeignKey("constitution.constitutions.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    amendment_code = Column(String(30), nullable=False, unique=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=True)
    date_passed = Column(Date, nullable=True, index=True)
    date_effective = Column(Date, nullable=True, index=True)

    # Relationships
    constitution = relationship("Constitutions", backref="amendments")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_amendments_amendment_code", "amendment_code", unique=True),
        {"schema": "constitution"},
    )

    def __repr__(self):
        return f"<Amendments(id={self.id}, amendment_code='{self.amendment_code}', title='{self.title}')>"
