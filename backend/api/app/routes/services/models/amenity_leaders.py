from sqlalchemy import Column, String, Text, Date, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid
import enum


class LeadershipRoleEnum(enum.Enum):
    """Enumeration of operational leadership roles in amenities"""

    PRINCIPAL = "PRINCIPAL"
    HEAD_TEACHER = "HEAD_TEACHER"
    MEDICAL_SUPERINTENDENT = "MEDICAL_SUPERINTENDENT"
    CHIEF_MEDICAL_OFFICER = "CHIEF_MEDICAL_OFFICER"
    OCS = "OCS"  # Officer Commanding Station
    STATION_COMMANDER = "STATION_COMMANDER"
    FACILITY_MANAGER = "FACILITY_MANAGER"
    WATER_MANAGER = "WATER_MANAGER"
    HEAD_NURSE = "HEAD_NURSE"
    LIBRARIAN = "LIBRARIAN"
    LABORATORY_TECHNICIAN = "LABORATORY_TECHNICIAN"
    ADMINISTRATOR = "ADMINISTRATOR"


class AmenityLeaders(Base):
    """
    Amenity leaders table - operational layer leadership for service delivery.
    Contains "Implementation" roles (Principal, OCS, Medical Superintendent) that define Service Delivery.
    Examples: School principals, hospital medical superintendents, police station commanders.
    """

    __tablename__ = "amenity_leaders"

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
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )

    # Core Fields
    role = Column(
        String(30), nullable=False, index=True
    )  # PRINCIPAL, OCS, MEDICAL_SUPERINTENDENT
    title = Column(
        String(100), nullable=True, index=True
    )  # e.g. "Senior Principal", "Chief Medical Superintendent"

    # Sector-Specific Professional Credentials
    teaching_license_number = Column(String(50), nullable=True, index=True)
    medical_registration_id = Column(String(50), nullable=True, index=True)
    police_service_number = Column(String(50), nullable=True, index=True)
    engineering_license_number = Column(String(50), nullable=True, index=True)

    # Temporal Fields
    appointment_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL = current
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    amenity = relationship("Amenities", backref="leaders")
    person = relationship("People", backref="amenity_leaderships")

    # Constraints and Indexes
    __table_args__ = (
        Index(
            "uq_amenity_leaders_amenity_role",
            "amenity_id",
            "role",
            "is_active",
            unique=True,
        ),  # One active leader per role per amenity
        Index("idx_amenity_leaders_amenity", "amenity_id"),
        Index("idx_amenity_leaders_person", "person_id"),
        Index("idx_amenity_leaders_role", "role"),
        Index("idx_amenity_leaders_active", "is_active"),
        Index(
            "idx_amenity_leaders_credentials",
            "teaching_license_number",
            "medical_registration_id",
        ),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<AmenityLeaders(id={self.id}, amenity_id={self.amenity_id}, role='{self.role}', is_active={self.is_active})>"
