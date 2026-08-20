from sqlalchemy import Column, String, Boolean, DateTime, Date, ForeignKey, Integer

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class Holders(Base):
    """
    Holders table - reality layer: who holds which office where and how

    This is the critical reality layer that connects:
    - People (who)
    - Offices (what role)
    - Geo Units (where they serve)
    - Selection Methods (how they got there)
    - Appointing Institutions (who appointed them)

    Examples:
    - william ruto → president → kenya → election → iebc
    - johnson sakaja → governor → nairobi-county → election → iebc
    - john mbadi → mp → suba-constituency → election → iebc
    - jane doe → mca → kilimani-ward → election → iebc
    - alice smith → nominated-mp → kenya → nomination → parliament
    - bob jones → cabinet-secretary → kenya → appointment → president

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "holders"
    __table_args__ = {"schema": "offices"}

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    office_id = Column(
        String(26), ForeignKey("offices.offices.id"), nullable=True, index=True
    )
    office_code = Column(String(100), nullable=False, index=True)
    person_id = Column(String(26), nullable=False, index=True)
    person_code = Column(String(100), nullable=False, index=True)
    geo_unit_id = Column(
        String(26), ForeignKey("geographic.geo_units.id"), nullable=True, index=True
    )
    geo_unit_code = Column(String(100), nullable=False, index=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    term_number = Column(Integer, nullable=True, index=True)  # 1st term, 2nd term, etc.
    departure_reason = Column(
        String(50), nullable=True, index=True
    )  # DEATH, RESIGNATION, REMOVAL, TERM_EXPIRED
    is_current = Column(Boolean, default=True, index=True)
    status = Column(
        String(20), nullable=True, index=True
    )  # Permanent, Acting, Caretaker
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    office = relationship(
        "Offices",
        foreign_keys=[office_id, office_code],
        back_populates="holders",
    )
    geo_unit = relationship(
        "GeoUnits",
        foreign_keys=[geo_unit_id, geo_unit_code],
    )
    person = relationship(
        "People",
        foreign_keys=[person_id],
        back_populates="holders",
    )

    def __repr__(self):
        return f"<Holders(person_id={self.person_id}, office='{self.office_code}', geo_unit='{self.geo_unit_code}')>"
