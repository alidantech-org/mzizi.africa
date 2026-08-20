from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import ulid


class OfficeHolders(Base):
    """
    Office holders table - key table tracking people in government positions.
    Links people to offices with full legitimacy traceability.
    """

    __tablename__ = "office_holders"

    # Primary Key
    id = Column(
        String(26),
        primary_key=True,
        default=lambda: str(ulid.ULID()),
        index=True,
    )

    # Foreign Keys
    office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=False,
        index=True,
    )
    person_id = Column(
        String(26), ForeignKey("people.people.id"), nullable=False, index=True
    )

    # Appointment Classification
    appointment_type = Column(
        String(20), nullable=False, index=True
    )  # ELECTIVE, APPOINTED, NOMINATED

    # 🔗 LEGITIMACY LINKS
    election_id = Column(
        String(26),
        ForeignKey("elections.elections.id"),
        nullable=True,
        index=True,
    )  # REQUIRED if ELECTIVE
    appointed_by_office_id = Column(
        String(26),
        ForeignKey("governance.offices.id"),
        nullable=True,
        index=True,
    )  # REQUIRED if APPOINTED
    nominated_by_entity = Column(
        String(100), nullable=True, index=True
    )  # e.g. PARLIAMENT, SENATE, PSC

    # TRACEABILITY TO LAW
    constitution_section_id = Column(
        String(26),
        ForeignKey("constitution.constitution_sections.id"),
        nullable=True,
        index=True,
    )
    law_section_id = Column(
        String(26),
        ForeignKey("legal.legal_sections.id"),
        nullable=True,
        index=True,
    )

    # Temporal Fields
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True, index=True)  # NULL = current

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    office = relationship("Offices", foreign_keys=[office_id], backref="holders")
    person = relationship("People", backref="office_positions")
    election = relationship("Elections", backref="elected_officers")
    appointed_by_office = relationship(
        "Offices", foreign_keys=[appointed_by_office_id], backref="appointments"
    )
    constitution_section = relationship(
        "ConstitutionSections", backref="office_holder_appointments"
    )
    law_section = relationship("LegalSections", backref="office_holder_appointments")

    # Constraints and Indexes
    __table_args__ = (
        Index("idx_office_holders_office", "office_id", "start_date"),
        Index("idx_office_holders_person", "person_id", "start_date"),
        Index("idx_office_holders_appointment_type", "appointment_type"),
        Index("idx_office_holders_current", "end_date").filter(end_date.is_(None)),
        # Strict rule enforcement indexes
        Index(
            "ck_office_holders_elective_rules", "appointment_type", "election_id"
        ).where((appointment_type == "ELECTIVE") & (election_id.isnot(None))),
        Index(
            "ck_office_holders_appointed_rules",
            "appointment_type",
            "appointed_by_office_id",
        ).where(
            (appointment_type == "APPOINTED") & (appointed_by_office_id.isnot(None))
        ),
        Index(
            "ck_office_holders_nominated_rules",
            "appointment_type",
            "nominated_by_entity",
        ).where((appointment_type == "NOMINATED") & (nominated_by_entity.isnot(None))),
        {"schema": "governance"},
    )

    def __repr__(self):
        return f"<OfficeHolders(id={self.id}, office_id={self.office_id}, person_id={self.person_id}, appointment_type='{self.appointment_type}')>"
