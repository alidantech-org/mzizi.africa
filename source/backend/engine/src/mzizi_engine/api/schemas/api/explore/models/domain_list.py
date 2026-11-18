"""Domain List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.domain_info import DomainInfo


class DomainList(BaseModel):
    """Domain List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    domains: list[DomainInfo] = Field(alias="domains")
