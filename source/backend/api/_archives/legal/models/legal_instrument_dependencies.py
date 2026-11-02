from sqlalchemy import Column, String, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.config.database import Base
import ulid


class LegalInstrumentDependencies(Base):
    """
    Legal instrument dependencies - relationships between laws and regulations.
    Maps how regulations implement statutes and how statutes depend on constitutional authority.
    """

    __tablename__ = "legal_instrument_dependencies"

    # Primary Key
    id = Column(String(26), primary_key=True, default=lambda: str(ulid.ULID()))

    # Foreign Keys
    parent_instrument_id = Column(String(26), nullable=False, index=True)
    child_instrument_id = Column(String(26), nullable=False, index=True)

    # Core Fields
    relationship_type = Column(
        String(30), nullable=False, index=True
    )  # implements, extends
    description = Column(Text, nullable=True)

    # Relationships
    parent_instrument = relationship(
        "LegalInstruments",
        foreign_keys=[parent_instrument_id],
        backref="dependent_instruments",
    )
    child_instrument = relationship(
        "LegalInstruments",
        foreign_keys=[child_instrument_id],
        backref="prerequisite_instruments",
    )

    # Constraints and Indexes
    __table_args__ = ({"schema": "legal"},)

    def __repr__(self):
        return f"<LegalInstrumentDependencies(id={self.id}, parent_instrument_id={self.parent_instrument_id}, child_instrument_id={self.child_instrument_id}, relationship_type='{self.relationship_type}')>"
