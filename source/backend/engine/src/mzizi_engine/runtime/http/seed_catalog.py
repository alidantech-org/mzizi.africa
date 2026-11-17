"""Connect the generated seed catalog route to the engine operation registry."""

import asyncio

from fastapi import HTTPException
from pydantic import ValidationError

from mzizi_engine.api.routes.catalog.seed_catalog import CatalogSeedCatalogService
from mzizi_engine.api.schemas.api.catalog.models.seed_catalog import SeedCatalog
from mzizi_engine.runtime.assembly.seed_catalog import SEED_CATALOG_OPERATION, UnknownSeedTable
from mzizi_engine.runtime.contracts.seed_catalog import SeedCatalogRequest
from mzizi_engine.runtime.runtime import EngineRuntime


class RuntimeSeedCatalogService(CatalogSeedCatalogService):
    def __init__(self, runtime: EngineRuntime) -> None:
        self._runtime = runtime

    async def get_seed_catalog(self, *, table: str | None) -> SeedCatalog:
        try:
            query = SeedCatalogRequest(table=table)
        except ValidationError as error:
            raise HTTPException(422, "Expected a nonempty seed table name of at most 200 characters") from error
        try:
            result = await asyncio.to_thread(self._runtime.call_validated, SEED_CATALOG_OPERATION, query)
        except UnknownSeedTable as error:
            raise HTTPException(404, str(error)) from error
        return SeedCatalog.model_validate(result)
