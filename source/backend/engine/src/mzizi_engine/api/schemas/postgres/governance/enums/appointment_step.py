"""Appointment Step: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AppointmentStep(StrEnum):
    APPOINTMENT = "appointment"
    APPROVAL = "approval"
    NOMINATION = "nomination"
    RECOMMENDATION = "recommendation"
    SWEARING_IN = "swearing-in"
    VETTING = "vetting"
