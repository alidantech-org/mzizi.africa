"""Row models of the Event group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.event.entities.calendars import CalendarsRow
from mzizi_engine.api.schemas.postgres.event.entities.changes import EventChangesRow
from mzizi_engine.api.schemas.postgres.event.entities.events import EventsRow
from mzizi_engine.api.schemas.postgres.event.entities.items import EventItemsRow
from mzizi_engine.api.schemas.postgres.event.entities.occurrences import EventOccurrencesRow
from mzizi_engine.api.schemas.postgres.event.entities.participants import ParticipantsRow
from mzizi_engine.api.schemas.postgres.event.entities.rules import RulesRow
from mzizi_engine.api.schemas.postgres.event.entities.schedules import SchedulesRow
from mzizi_engine.api.schemas.postgres.event.entities.seasons import SeasonsRow
from mzizi_engine.api.schemas.postgres.event.entities.subjects import EventSubjectsRow
from mzizi_engine.api.schemas.postgres.event.entities.venues import VenuesRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.reference.entities.timezones import TimezonesRow
from mzizi_engine.api.schemas.postgres.template.entities.templates import TemplatesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "CalendarsRow",
    "CountriesRow",
    "EventChangesRow",
    "EventItemsRow",
    "EventOccurrencesRow",
    "EventSubjectsRow",
    "EventsRow",
    "FeaturesRow",
    "IdentitiesRow",
    "LanguagesRow",
    "LevelsRow",
    "ParticipantsRow",
    "RulesRow",
    "SchedulesRow",
    "SeasonsRow",
    "TemplatesRow",
    "TermsRow",
    "TimezonesRow",
    "VenuesRow",
]
