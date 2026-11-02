from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class PublicServices(Base):
    """
    Public services table - defines the "product" government offers.
    Examples: Cancer Treatment, Primary Schooling, Emergency Law Enforcement.
    """

    __tablename__ = "public_services"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    name = Column(
        String(200), nullable=False, index=True
    )  # e.g. "Emergency Law Enforcement"
    description = Column(Text, nullable=True)
    service_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. EMERGENCY_POLICE, PRIMARY_EDUCATION

    # Foreign Keys
    sector_id = Column(
        String(26),
        ForeignKey("services.sectors.id"),
        nullable=False,
        index=True,
    )
    legal_basis_id = Column(
        String(26),
        ForeignKey("legal.legal_authority_sources.id"),
        nullable=True,
        index=True,
    )  # Law that mandates this service

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sector = relationship("Sectors", backref="public_services")
    legal_basis = relationship("LegalAuthoritySources", backref="services")
    service_deliveries = relationship("ServiceDeliveryMap", backref="service")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_public_services_service_code", "service_code", unique=True),
        Index("idx_public_services_sector", "sector_id"),
        Index("idx_public_services_legal_basis", "legal_basis_id"),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<PublicServices(id={self.id}, name='{self.name}', service_code='{self.service_code}', sector_id={self.sector_id})>"
