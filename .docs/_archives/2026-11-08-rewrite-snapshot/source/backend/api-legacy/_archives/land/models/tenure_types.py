from sqlalchemy import Column, String, Text, Numeric, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class TenureCategoryEnum(enum.Enum):
    """Enumeration of tenure categories"""

    FREEHOLD = "FREEHOLD"
    LEASEHOLD = "LEASEHOLD"
    CUSTOMARY = "CUSTOMARY"
    STATUTORY = "STATUTORY"
    OCCUPATIONAL = "OCCUPATIONAL"
    TEMPORARY = "TEMPORARY"


class TenureTypes(Base):
    """
    Tenure types table - defines the rules of land ownership and use.
    Based on LADM (ISO 19152) standard for land administration.
    Examples: Freehold ownership, leasehold tenure, customary rights.
    """

    __tablename__ = "tenure_types"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    spatial_unit_id = Column(
        String(26),
        ForeignKey("land.spatial_units.id"),
        nullable=False,
        index=True,
    )

    # Core Fields
    tenure_code = Column(
        String(30), unique=True, nullable=False, index=True
    )  # e.g. FREEHOLD_001, LEASEHOLD_999
    tenure_category = Column(
        String(20), nullable=False, index=True
    )  # FREEHOLD, LEASEHOLD, CUSTOMARY, etc.

    # Tenure Details
    duration_years = Column(
        Numeric(5, 0), nullable=True, index=True
    )  # Duration in years (NULL for freehold)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL for freehold/perpetual
    is_perpetual = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO

    # Rights and Obligations
    rights_granted = Column(
        Text, nullable=True
    )  # JSON array of rights (e.g., ["USE", "DEVELOP", "TRANSFER"])
    obligations = Column(
        Text, nullable=True
    )  # JSON array of obligations (e.g., ["PAY_RATES", "MAINTAIN"])

    # Legal Basis
    legal_instrument = Column(
        String(100), nullable=True, index=True
    )  # e.g. "Title Deed", "Lease Agreement"
    instrument_number = Column(
        String(50), nullable=True, index=True
    )  # e.g. "TD 123456"
    registration_date = Column(Date, nullable=True, index=True)

    # Kenyan-Specific Extensions
    # Customary Tenure Details
    community_name = Column(
        String(200), nullable=True, index=True
    )  # For customary tenure
    clan_name = Column(String(100), nullable=True, index=True)  # For customary tenure
    customary_rules = Column(Text, nullable=True)  # Description of customary rules

    # Leasehold Details
    ground_rent_amount = Column(
        Numeric(15, 2), nullable=True, index=True
    )  # Annual ground rent
    ground_rent_frequency = Column(
        String(20), nullable=True, index=True
    )  # ANNUAL, QUARTERLY
    rent_review_date = Column(Date, nullable=True, index=True)  # When rent is reviewed

    # Gender Rights
    spousal_consent_required = Column(
        String(3), default="NO", nullable=False, index=True
    )  # YES, NO
    spousal_consent_date = Column(Date, nullable=True, index=True)
    spousal_consent_type = Column(
        String(20), nullable=True, index=True
    )  # MONOGAMY, POLYGAMY

    # Status
    is_active = Column(String(3), default="YES", nullable=False, index=True)  # YES, NO
    status_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    spatial_unit = relationship("SpatialUnits", backref="tenure_types")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_tenure_types_tenure_code", "tenure_code", unique=True),
        Index("idx_tenure_types_spatial_unit", "spatial_unit_id"),
        Index("idx_tenure_types_category", "tenure_category"),
        Index("idx_tenure_types_duration", "duration_years"),
        Index("idx_tenure_types_perpetual", "is_perpetual"),
        Index("idx_tenure_types_community", "community_name"),
        Index("idx_tenure_types_ground_rent", "ground_rent_amount"),
        Index("idx_tenure_types_spousal_consent", "spousal_consent_required"),
        Index("idx_tenure_types_active", "is_active"),
        {"schema": "land"},
    )

    def __repr__(self):
        return f"<TenureTypes(id={self.id}, tenure_code='{self.tenure_code}', tenure_category='{self.tenure_category}', spatial_unit_id={self.spatial_unit_id})>"
