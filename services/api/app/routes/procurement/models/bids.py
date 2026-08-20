from sqlalchemy import (
    Column,
    String,
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
from ulid import ulid
import enum


class BidStatusEnum(enum.Enum):
    """Enumeration of bid status types"""

    SUBMITTED = "submitted"
    UNDER_EVALUATION = "under_evaluation"
    QUALIFIED = "qualified"
    DISQUALIFIED = "disqualified"
    WITHDRAWN = "withdrawn"
    WINNING = "winning"
    REJECTED = "rejected"


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
        default=lambda: str(ulid()),
        index=True,
    )

    # Core Fields
    bid_code = Column(
        String(100), unique=True, nullable=False, index=True
    )  # Business identifier code

    # Entity References (Code System)
    tender_code = Column(String(100), nullable=True, index=True)  # Tender code
    tender_id = Column(
        String(26),
        ForeignKey("procurement.tenders.id"),
        nullable=True,
        index=True,
    )
    bidder_entity_code = Column(
        String(100), nullable=True, index=True
    )  # LegalEntity code
    bidder_entity_id = Column(
        String(26),
        ForeignKey("entities.legal_entities.id"),
        nullable=True,
        index=True,
    )

    # Bidder Information
    bidder_name = Column(
        String(200), nullable=True, index=True
    )  # Redundant but kept for display

    # Financial Details
    bid_amount = Column(Numeric(18, 2), nullable=True, index=True)
    currency_code = Column(String(10), nullable=False, index=True, default="KES")

    # Timeline
    submission_date = Column(Date, nullable=False, index=True)

    # Status and Workflow
    status = Column(
        String(50), nullable=False, index=True, default="submitted"
    )  # submitted, qualified, etc.
    status_code = Column(
        String(50), nullable=True, index=True
    )  # Status code for business logic
    is_compliant = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    tender = relationship("Tenders", backref="bids")
    bidder_entity = relationship("LegalEntities", backref="bids")

    # Constraints and Indexes
    __table_args__ = (
        Index("uq_bids_bid_code", "bid_code", unique=True),
        Index("idx_bids_tender", "tender_id"),
        Index("idx_bids_bidder", "bidder_name"),
        Index("idx_bids_status", "status"),
        Index("idx_bids_compliant", "is_compliant"),
        Index("idx_bids_amount", "bid_amount"),
        Index("idx_bids_submission", "submission_date"),
        {"schema": "procurement"},
    )

    def __repr__(self):
        return f"<Bids(id={self.id}, bid_code='{self.bid_code}', tender_id={self.tender_id}, bidder_name='{self.bidder_name}')>"
