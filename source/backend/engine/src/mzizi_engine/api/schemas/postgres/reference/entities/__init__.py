"""Row models of the Reference group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.geography.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.positions import PositionsRow
from mzizi_engine.api.schemas.postgres.official.entities.contacts import ContactsRow
from mzizi_engine.api.schemas.postgres.reference.entities.copy import CopyRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.instance import InstanceRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.language_name import LanguageNameRow
from mzizi_engine.api.schemas.postgres.reference.entities.pattern import PatternRow
from mzizi_engine.api.schemas.postgres.reference.entities.scheme import SchemeRow
from mzizi_engine.api.schemas.postgres.reference.entities.template import TemplateRow
from mzizi_engine.api.schemas.postgres.reference.entities.topic import TopicRow
from mzizi_engine.api.schemas.postgres.reference.entities.unit import UnitRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.reference.entities.value_label import ValueLabelRow
from mzizi_engine.api.schemas.postgres.reference.entities.value_relation import ValueRelationRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.source.entities.domains import DomainsRow

__all__ = [
    "CitationsRow",
    "ContactsRow",
    "CopyRow",
    "CountryRow",
    "DomainsRow",
    "FeaturesRow",
    "InstanceRow",
    "InstitutionsRow",
    "LanguageNameRow",
    "LanguageRow",
    "LevelsRow",
    "OfficesRow",
    "PatternRow",
    "PositionsRow",
    "SchemeRow",
    "TemplateRow",
    "TopicRow",
    "UnitRow",
    "ValueLabelRow",
    "ValueRelationRow",
    "ValueRow",
]
