from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.config.database import Base
import uuid


class ArmsOfGovernment(Base):
    """
    Arms of government table - executive, legislative, judicial branches

    Examples:
    - exec: Executive arm (president, ministries, county governments)
    - leg: Legislative arm (parliament, county assemblies)
    - jud: Judicial arm (courts, tribunals)

    NB: RULES: never add a field id or foreign key id, strong codes system will handle relationships:
    The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces
    and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows
    a parent/child pattern, exemplified by structures use full word name no shortened codes
    """

    __tablename__ = "arms_of_government"
    __table_args__ = {"schema": "governance"}

    id = Column(String(26), primary_key=True, default=uuid.uuid4)
    arm_code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()")

    # Relationships
    institutions = relationship("Institutions", back_populates="arm_of_government")

    def __repr__(self):
        return f"<ArmsOfGovernment(id={self.id}, arm_code='{self.arm_code}', name='{self.name}')>"
