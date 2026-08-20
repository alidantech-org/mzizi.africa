from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class BoardTypeEnum(enum.Enum):
    """Enumeration of board types for amenities"""

    BOARD_OF_GOVERNORS = "BOARD_OF_GOVERNORS"
    BOARD_OF_MANAGEMENT = "BOARD_OF_MANAGEMENT"
    MANAGEMENT_COMMITTEE = "MANAGEMENT_COMMITTEE"
    ADMISSION_COMMITTEE = "ADMISSION_COMMITTEE"
    DISCIPLINARY_COMMITTEE = "DISCIPLINARY_COMMITTEE"
    FINANCE_COMMITTEE = "FINANCE_COMMITTEE"
    ACADEMIC_COMMITTEE = "ACADEMIC_COMMITTEE"
    MEDICAL_COMMITTEE = "MEDICAL_COMMITTEE"
    PROCUREMENT_COMMITTEE = "PROCUREMENT_COMMITTEE"
    STAFF_COMMITTEE = "STAFF_COMMITTEE"


class AmenityBoards(Base):
    """
    Amenity boards table - anchor link between governance and operational layers.
    The "Anchor" Link that keeps governance and operational layers connected for joint analytics.
    Example: The Alliance High Board (Amenity Layer) reports to the County Director of Education (Governance Layer).
    """

    __tablename__ = "amenity_boards"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    amenity_id = Column(
        String(26),
        ForeignKey("services.amenities.id"),
        nullable=False,
        index=True,
    )
    reporting_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )  # The anchor link

    # Core Fields
    board_name = Column(
        String(200), nullable=False, index=True
    )  # e.g. "Alliance High School Board of Governors"
    board_type = Column(
        String(30), nullable=False, index=True
    )  # BOARD_OF_GOVERNORS, MANAGEMENT_COMMITTEE, etc.

    # Description and Mandate
    description = Column(Text, nullable=True)
    legal_mandate = Column(Text, nullable=True)  # Legal basis for this board

    # Temporal Fields
    establishment_date = Column(Date, nullable=False, index=True)
    dissolution_date = Column(Date, nullable=True, index=True)  # NULL = still active
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    amenity = relationship("Amenities", backref="boards")
    reporting_office = relationship("Offices", backref="overseen_boards")

    # Constraints and Indexes
    __table_args__ = (
        Index(
            "uq_amenity_boards_amenity_type",
            "amenity_id",
            "board_type",
            "is_active",
            unique=True,
        ),  # One active board of each type per amenity
        Index("idx_amenity_boards_amenity", "amenity_id"),
        Index("idx_amenity_boards_reporting_office", "reporting_office_id"),
        Index("idx_amenity_boards_type", "board_type"),
        Index("idx_amenity_boards_active", "is_active"),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<AmenityBoards(id={self.id}, amenity_id={self.amenity_id}, reporting_office_id={self.reporting_office_id}, board_type='{self.board_type}')>"
