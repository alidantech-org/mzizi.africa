"""Health"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.system.models.package_health import PackageHealth


class Health(BaseModel):
    """Health"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    active_jobs: int = Field(alias="activeJobs")
    auth: Annotated[str, Field(max_length=1000)] = Field(alias="auth")
    capabilities: int = Field(alias="capabilities")
    packages: list[PackageHealth] = Field(alias="packages")
    runtime: Annotated[str, Field(max_length=1000)] = Field(alias="runtime")
    service: Annotated[str, Field(max_length=1000)] = Field(alias="service")
    status: Annotated[str, Field(max_length=1000)] = Field(alias="status")
    store: Annotated[str, Field(max_length=1000)] = Field(alias="store")
    version: Annotated[str, Field(max_length=1000)] = Field(alias="version")
