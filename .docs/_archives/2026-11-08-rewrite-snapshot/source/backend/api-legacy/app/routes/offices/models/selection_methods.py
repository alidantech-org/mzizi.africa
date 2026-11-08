from sqlalchemy import Column, String, Text, Boolean, DateTime

from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class SelectionMethods(Base):
    """
    Office selection methods table - how offices are filled

    Examples:
    - election: Voted by public (president, governor, mp, mca)
    - nomination: Appointed without voting (nominated mps, senators)
    - appointment: Direct appointment (cabinet secretaries, judges)

    -- supporting link
    https://www.klrc.go.ke/index.php/constitution-of-kenya/138-chapter-eleven-devolved-government/140-part-2-county-governments/349-180-election-of-county-governor-and-deputy-county-governor

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.
    """

    __tablename__ = "selection_methods"
    __table_args__ = {"schema": "offices"}

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    selection_method_code = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    selection_rules = relationship("SelectionRules", back_populates="selection_method")
    holders = relationship("Holders", back_populates="selection_method")

    def __repr__(self):
        return f"<SelectionMethods(id={self.id}, selection_method_code='{self.selection_method_code}', name='{self.name}')>"
