"""Row models of the Civic group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.civic.entities.attachments import CivicAttachmentsRow
from mzizi_engine.api.schemas.postgres.civic.entities.bids import BidsRow
from mzizi_engine.api.schemas.postgres.civic.entities.contracts import ContractsRow
from mzizi_engine.api.schemas.postgres.civic.entities.deliveries import DeliveriesRow
from mzizi_engine.api.schemas.postgres.civic.entities.facilities import FacilitiesRow
from mzizi_engine.api.schemas.postgres.civic.entities.items import CivicItemsRow
from mzizi_engine.api.schemas.postgres.civic.entities.procurements import ProcurementsRow
from mzizi_engine.api.schemas.postgres.civic.entities.projects import ProjectsRow
from mzizi_engine.api.schemas.postgres.civic.entities.roles import CivicRolesRow
from mzizi_engine.api.schemas.postgres.civic.entities.scores import ScoresRow
from mzizi_engine.api.schemas.postgres.civic.entities.services import ServicesRow
from mzizi_engine.api.schemas.postgres.civic.entities.sites import CivicSitesRow
from mzizi_engine.api.schemas.postgres.civic.entities.variations import VariationsRow
from mzizi_engine.api.schemas.postgres.economy.entities.goods import GoodsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.jurisdictions import JurisdictionsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.media.entities.articles import ArticlesRow
from mzizi_engine.api.schemas.postgres.media.entities.assets import MediaAssetsRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.currencies import CurrenciesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "ArticlesRow",
    "BidsRow",
    "CivicAttachmentsRow",
    "CivicItemsRow",
    "CivicRolesRow",
    "CivicSitesRow",
    "ContractsRow",
    "CountriesRow",
    "CurrenciesRow",
    "DeliveriesRow",
    "FacilitiesRow",
    "FeaturesRow",
    "GoodsRow",
    "HoldersRow",
    "IdentitiesRow",
    "InstitutionsRow",
    "JurisdictionsRow",
    "LanguagesRow",
    "MediaAssetsRow",
    "ProcurementsRow",
    "ProjectsRow",
    "ScoresRow",
    "ServicesRow",
    "TermsRow",
    "UnitsRow",
    "VariationsRow",
]
