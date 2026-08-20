from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class ServiceDeliveryMap(Base):
    """
    Service delivery map table - master join table connecting Office, Amenity, and Service.
    This is the "brain" of the Service Delivery & Infrastructure Domain.
    Links Office (The Boss) to Amenity (The Building) and Service (The Action).
    """

    __tablename__ = "service_delivery_map"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys - The Core Connections
    amenity_id = Column(
        String(26),
        ForeignKey("services.amenities.id"),
        nullable=False,
        index=True,
    )  # Where is this happening?
    service_id = Column(
        String(26),
        ForeignKey("services.public_services.id"),
        nullable=False,
        index=True,
    )  # What service is being offered?
    managing_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )  # Who is responsible?
    budget_code = Column(
        String(26), ForeignKey("finance.budgets.id"), nullable=True, index=True
    )  # Optional: Link to money trail

    # Additional Fields
    description = Column(Text, nullable=True)  # Specific implementation details
    start_date = Column(
        DateTime(timezone=True), nullable=True, index=True
    )  # When service delivery started
    end_date = Column(
        DateTime(timezone=True), nullable=True, index=True
    )  # When service delivery ended (NULL = ongoing)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    amenity = relationship("Amenities", backref="service_deliveries")
    service = relationship("PublicServices", backref="deliveries")
    managing_office = relationship("Offices", backref="managed_services")
    budget = relationship("Budgets", backref="service_deliveries")

    # Constraints and Indexes
    __table_args__ = (
        Index(
            "uq_service_delivery_map_amenity_service",
            "amenity_id",
            "service_id",
            unique=True,
        ),  # One service per amenity
        Index("idx_service_delivery_map_amenity", "amenity_id"),
        Index("idx_service_delivery_map_service", "service_id"),
        Index("idx_service_delivery_map_office", "managing_office_id"),
        Index("idx_service_delivery_map_budget", "budget_code"),
        {"schema": "services"},
    )

    def __repr__(self):
        return f"<ServiceDeliveryMap(id={self.id}, amenity_id={self.amenity_id}, service_id={self.service_id}, managing_office_id={self.managing_office_id})>"
