from sqlalchemy import Column, String, Text, Boolean, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class VendorTypeEnum(enum.Enum):
    """Enumeration of vendor types"""

    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"
    PARTNERSHIP = "PARTNERSHIP"
    JOINT_VENTURE = "JOINT_VENTURE"
    NGO = "NGO"
    FOREIGN_ENTITY = "FOREIGN_ENTITY"
    GOVERNMENT_ENTITY = "GOVERNMENT_ENTITY"


class VendorStatusEnum(enum.Enum):
    """Enumeration of vendor status types"""

    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    BLACKLISTED = "BLACKLISTED"
    INACTIVE = "INACTIVE"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"


class Vendors(Base):
    """
    Vendors table - companies and individuals who bid on government tenders.
    Examples: Construction companies, service providers, suppliers, consultants.
    """

    __tablename__ = "vendors"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    vendor_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. VENDOR_2023_001
    name = Column(String(200), nullable=False, index=True)
    vendor_type = Column(
        String(20), nullable=False, index=True
    )  # INDIVIDUAL, COMPANY, PARTNERSHIP, etc.

    # Contact Information
    email = Column(String(200), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    website = Column(String(200), nullable=True)

    # Business Information
    registration_number = Column(
        String(50), nullable=True, index=True
    )  # Company registration number
    tax_identification = Column(String(50), nullable=True, index=True)  # Tax ID/PIN
    business_category = Column(
        String(100), nullable=True, index=True
    )  # Construction, IT, Consulting

    # Status and Compliance
    status = Column(
        String(20), nullable=False, index=True, default="ACTIVE"
    )  # ACTIVE, SUSPENDED, BLACKLISTED
    is_blacklisted = Column(Boolean, default=False, nullable=False, index=True)
    blacklisting_reason = Column(Text, nullable=True)

    # Legal and Regulatory
    license_number = Column(String(50), nullable=True, index=True)
    license_expiry = Column(DateTime(timezone=True), nullable=True, index=True)
    compliance_status = Column(
        String(20), nullable=True, index=True
    )  # COMPLIANT, NON_COMPLIANT

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    bids = relationship("Bids", backref="vendor")
    contracts = relationship("Contracts", backref="vendor")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_vendors_vendor_code", "vendor_code", unique=True),
        Index("idx_vendors_name", "name"),
        Index("idx_vendors_type", "vendor_type"),
        Index("idx_vendors_status", "status"),
        Index("idx_vendors_blacklisted", "is_blacklisted"),
        Index("idx_vendors_registration", "registration_number"),
        Index("idx_vendors_tax_id", "tax_identification"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Vendors(id={self.id}, vendor_code='{self.vendor_code}', name='{self.name}', status='{self.status}')>"
