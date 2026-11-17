"""Apply the same principal and error boundary to research HTTP routes."""

import asyncio
from collections.abc import Callable

from fastapi import HTTPException, Request

from mzizi_engine.config import ConfigError
from mzizi_engine.runtime.http.auth import Principal
from mzizi_engine.runtime.runs.artifacts import ArtifactAccess, ArtifactReadError


def research_access(request: Request, principal: Principal) -> ArtifactAccess:
    service = request.app.state.settings.auth == "service"
    if principal.account_id is None and not service:
        raise HTTPException(401, "Artifact access requires an authenticated service or account")
    return ArtifactAccess(account_id=principal.account_id, service=service)


async def call_research[R](action: Callable[[], R]) -> R:
    try:
        return await asyncio.to_thread(action)
    except ArtifactReadError as error:
        raise HTTPException(error.status, str(error)) from error
    except ConfigError as error:
        raise HTTPException(503, str(error)) from error
