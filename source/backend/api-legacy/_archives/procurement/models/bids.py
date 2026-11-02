from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Date,
    Numeric,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class BidderTypeEnum(enum.Enum):
    """Enumeration of bidder types"""

    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"
    PARTNERSHIP = "PARTNERSHIP"
    JOINT_VENTURE = "JOINT_VENTURE"
    NGO = "NGO"
    FOREIGN_ENTITY = "FOREIGN_ENTITY"


class BidStatusEnum(enum.Enum):
    """Enumeration of bid status types"""

    SUBMITTED = "SUBMITTED"
    UNDER_EVALUATION = "UNDER_EVALUATION"
    QUALIFIED = "QUALIFIED"
    DISQUALIFIED = "DISQUALIFIED"
    WITHDRAWN = "WITHDRAWN"
    WINNING = "WINNING"
    REJECTED = "REJECTED"


class Bids(Base):
    """
    Bids table - submissions for procurement tenders.
    Examples: Company bids for infrastructure projects, service provider proposals.
    """

    __tablename__ = "bids"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Core Fields
    bid_code = Column(
        String(50), unique=True, nullable=False, index=True
    )  # e.g. BID_2023_001_001

    # Foreign Keys
    tender_id = Column(
        String(26),
        ForeignKey("procurement.tenders.id"),
        nullable=False,
        index=True,
    )
    vendor_id = Column(
        String(26),
        ForeignKey("procurement.vendors.id"),
        nullable=False,
        index=True,
    )  # NEW: Link to vendor

    # Bidder Information
    bidder_name = Column(String(200), nullable=False, index=True)
    bidder_type = Column(
        String(20), nullable=False, index=True
    )  # INDIVIDUAL, COMPANY, PARTNERSHIP, etc.

    # Financial Details
    bid_amount = Column(Numeric(15, 2), nullable=True, index=True)

    # Timeline
    submission_date = Column(Date, nullable=False, index=True)

    # Status and Compliance
    status = Column(
        String(20), nullable=False, index=True, default="SUBMITTED"
    )  # SUBMITTED, QUALIFIED, etc.
    is_compliant = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tender = relationship("Tenders", backref="bids")
    vendor = relationship("Vendors", backref="bids")  # NEW: Vendor relationship

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_bids_bid_code", "bid_code", unique=True),
        Index("idx_bids_tender", "tender_id"),
        Index("idx_bids_vendor", "vendor_id"),  # NEW: Vendor index
        Index("idx_bids_bidder", "bidder_name", "bidder_type"),
        Index("idx_bids_status", "status"),
        Index("idx_bids_compliant", "is_compliant"),
        Index("idx_bids_amount", "bid_amount"),
        Index("idx_bids_submission", "submission_date"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Bids(id={self.id}, bid_code='{self.bid_code}', tender_id={self.tender_id}, bidder_name='{self.bidder_name}')>"
