"""Domain Info"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.table_info import TableInfo


class DomainInfo(BaseModel):
    """Domain Info"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    tables: list[TableInfo] = Field(alias="tables")
