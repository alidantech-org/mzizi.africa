"""Row models of the Source group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.auth.entities.accounts import AccountsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.contacts import ContactsRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.attributions import AttributionsRow
from mzizi_engine.api.schemas.postgres.source.entities.captures import CapturesRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.source.entities.contenders import ContendersRow
from mzizi_engine.api.schemas.postgres.source.entities.coverage import CoverageRow
from mzizi_engine.api.schemas.postgres.source.entities.derivations import DerivationsRow
from mzizi_engine.api.schemas.postgres.source.entities.discoveries import DiscoveriesRow
from mzizi_engine.api.schemas.postgres.source.entities.disputes import DisputesRow
from mzizi_engine.api.schemas.postgres.source.entities.domains import DomainsRow
from mzizi_engine.api.schemas.postgres.source.entities.editions import SourceEditionsRow
from mzizi_engine.api.schemas.postgres.source.entities.evidence import EvidenceRow
from mzizi_engine.api.schemas.postgres.source.entities.paths import PathsRow
from mzizi_engine.api.schemas.postgres.source.entities.products import ProductsRow
from mzizi_engine.api.schemas.postgres.source.entities.publishers import PublishersRow
from mzizi_engine.api.schemas.postgres.source.entities.sources import SourcesRow
from mzizi_engine.api.schemas.postgres.source.entities.verifications import VerificationsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AccountsRow",
    "ArtifactsRow",
    "AttributionsRow",
    "CapturesRow",
    "CitationsRow",
    "ContactsRow",
    "ContendersRow",
    "CountriesRow",
    "CoverageRow",
    "DerivationsRow",
    "DiscoveriesRow",
    "DisputesRow",
    "DomainsRow",
    "EvidenceRow",
    "FeaturesRow",
    "IdentitiesRow",
    "LanguagesRow",
    "LevelsRow",
    "PathsRow",
    "ProductsRow",
    "PublishersRow",
    "SourceEditionsRow",
    "SourcesRow",
    "TermsRow",
    "VerificationsRow",
    "VersionsRow",
]
