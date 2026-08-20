from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from ulid import ulid


class FinanceEntities(Base):
    """
    Finance entities for budgetary control and spending authority.
    Linked to LegalEntities for legal identity but separate for financial hierarchy.
    Also linked to Institutions for governmental structure alignment.

    Examples:
    - National Treasury (linked to legal entity and institution)
    - Ministry of Health - HIV Program (program-level control)
    - Nairobi County - Education Department (county-level control)
    """

    __tablename__ = "finance_entities"
    __table_args__ = {"schema": "entities"}

    id = Column(String(26), primary_key=True, default=lambda: str(ulid()), index=True)

    name = Column(String(255), nullable=False, index=True)
    entity_code = Column(String(100), nullable=False, unique=True, index=True)

    # Finance level code (references finance_levels table but not enforced)
    level_code = Column(String(100), nullable=False, index=True)

    # Institution ID (references governance.institutions.id but not enforced)
    institution_id = Column(String(26), nullable=True, index=True)
    institution_code = Column(String(100), nullable=True, index=True)

    # Parent entity (self-referencing hierarchy)
    parent_id = Column(
        String(26),
        ForeignKey("entities.finance_entities.id"),
        nullable=True,
        index=True,
    )
    parent_code = Column(String(100), nullable=True, index=True)

    # Legal entity reference
    legal_entity_id = Column(
        String(26), ForeignKey("entities.legal_entities.id"), nullable=True, index=True
    )
    legal_entity_code = Column(String(100), nullable=True, index=True)

    # Geographic Unit Code (specific geographic unit for this finance entity)
    geo_unit_code = Column(String(100), nullable=True, index=True)

    # Geographic Unit ID (references geo_units.id)
    geo_unit_id = Column(
        String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True
    )

    # Level order for hierarchical sorting
    level_order = Column(Integer, nullable=False, index=True)

    # Relationships (using string references to avoid FK constraints)
    parent = relationship("FinanceEntities", remote_side=[id], backref="children")
    legal_entity = relationship("LegalEntities")
    institution = relationship("Institutions")
    geo_unit = relationship("GeoUnits")

    def __repr__(self):
        return f"<FinanceEntities(name='{self.name}', entity_code='{self.entity_code}', institution_code='{self.institution_code}', level_code='{self.level_code}')>"
