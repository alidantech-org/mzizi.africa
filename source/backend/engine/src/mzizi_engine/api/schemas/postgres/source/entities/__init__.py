"""Row models of the Source group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.filesystem.entities.file_versions import FileVersionsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.attributions import AttributionsRow
from mzizi_engine.api.schemas.postgres.source.entities.captures import CapturesRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.source.entities.dataset_lineage import DatasetLineageRow
from mzizi_engine.api.schemas.postgres.source.entities.datasets import SourceDatasetsRow
from mzizi_engine.api.schemas.postgres.source.entities.documents import DocumentsRow
from mzizi_engine.api.schemas.postgres.source.entities.domains import DomainsRow
from mzizi_engine.api.schemas.postgres.source.entities.evidence import EvidenceRow
from mzizi_engine.api.schemas.postgres.source.entities.manifest_bindings import ManifestBindingsRow
from mzizi_engine.api.schemas.postgres.source.entities.manifest_releases import ManifestReleasesRow
from mzizi_engine.api.schemas.postgres.source.entities.manifests import ManifestsRow
from mzizi_engine.api.schemas.postgres.source.entities.paths import PathsRow
from mzizi_engine.api.schemas.postgres.source.entities.provenance import ProvenanceRow
from mzizi_engine.api.schemas.postgres.source.entities.publication_receipts import PublicationReceiptsRow
from mzizi_engine.api.schemas.postgres.source.entities.publishers import PublishersRow
from mzizi_engine.api.schemas.postgres.source.entities.sources import SourcesRow
from mzizi_engine.api.schemas.postgres.source.entities.verifications import VerificationsRow

__all__ = [
    "AttributionsRow",
    "CapturesRow",
    "CitationsRow",
    "CountryRow",
    "DatasetLineageRow",
    "DocumentsRow",
    "DomainsRow",
    "EntitiesRow",
    "EvidenceRow",
    "FileVersionsRow",
    "ManifestBindingsRow",
    "ManifestReleasesRow",
    "ManifestsRow",
    "PathsRow",
    "ProvenanceRow",
    "PublicationReceiptsRow",
    "PublishersRow",
    "SourceDatasetsRow",
    "SourcesRow",
    "ValueRow",
    "VerificationsRow",
]
