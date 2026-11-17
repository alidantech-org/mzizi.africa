"""Row models of the Source group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.filesystem.entities.file_versions import FileVersionsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.addresses import AddressesRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.attributions import AttributionsRow
from mzizi_engine.api.schemas.postgres.source.entities.captures import CapturesRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.source.entities.discoveries import DiscoveriesRow
from mzizi_engine.api.schemas.postgres.source.entities.domains import DomainsRow
from mzizi_engine.api.schemas.postgres.source.entities.editions import SourceEditionsRow
from mzizi_engine.api.schemas.postgres.source.entities.products import ProductsRow
from mzizi_engine.api.schemas.postgres.source.entities.publishers import PublishersRow
from mzizi_engine.api.schemas.postgres.source.entities.relationships import SourceRelationshipsRow
from mzizi_engine.api.schemas.postgres.source.entities.sources import SourcesRow
from mzizi_engine.api.schemas.postgres.source.entities.verifications import VerificationsRow

__all__ = [
    "AddressesRow",
    "ArtifactsRow",
    "AttributionsRow",
    "CapturesRow",
    "CitationsRow",
    "CountryRow",
    "DiscoveriesRow",
    "DomainsRow",
    "EntitiesRow",
    "FileVersionsRow",
    "LanguageRow",
    "ProductsRow",
    "PublishersRow",
    "SourceEditionsRow",
    "SourceRelationshipsRow",
    "SourcesRow",
    "ValueRow",
    "VerificationsRow",
]
