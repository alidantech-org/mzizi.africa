"""Row models of the Civic group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.civic.entities.beneficiaries import BeneficiariesRow
from mzizi_engine.api.schemas.postgres.civic.entities.bids import BidsRow
from mzizi_engine.api.schemas.postgres.civic.entities.contracts import ContractsRow
from mzizi_engine.api.schemas.postgres.civic.entities.deliveries import CivicDeliveriesRow
from mzizi_engine.api.schemas.postgres.civic.entities.facilities import FacilitiesRow
from mzizi_engine.api.schemas.postgres.civic.entities.officials import OfficialsRow
from mzizi_engine.api.schemas.postgres.civic.entities.partners import PartnersRow
from mzizi_engine.api.schemas.postgres.civic.entities.procurements import ProcurementsRow
from mzizi_engine.api.schemas.postgres.civic.entities.project_features import ProjectFeaturesRow
from mzizi_engine.api.schemas.postgres.civic.entities.projects import ProjectsRow
from mzizi_engine.api.schemas.postgres.civic.entities.services import ServicesRow
from mzizi_engine.api.schemas.postgres.civic.entities.variations import VariationsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "BeneficiariesRow",
    "BidsRow",
    "CitationsRow",
    "CivicDeliveriesRow",
    "ContractsRow",
    "CountryRow",
    "EntitiesRow",
    "FacilitiesRow",
    "FeaturesRow",
    "IndividualsRow",
    "InstitutionsRow",
    "OfficesRow",
    "OfficialsRow",
    "PartnersRow",
    "ProcurementsRow",
    "ProjectFeaturesRow",
    "ProjectsRow",
    "ServicesRow",
    "ValueRow",
    "VariationsRow",
]
