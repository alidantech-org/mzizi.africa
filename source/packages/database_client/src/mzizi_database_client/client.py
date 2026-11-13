"""The database service client: one async function per named HTTP operation. No SQL, no table
or schema names, no database credential ever appears here — only the service's own bearer
token, scoped to whichever caller holds it (the engine, NestJS, ...).
"""

from __future__ import annotations

from types import TracebackType

import httpx

from mzizi_database_client.models import CreateFolderRequest, CreateFolderResponse
from mzizi_database_client.parse import parse_response

DEFAULT_TIMEOUT_SECONDS = 10.0


class DatabaseClient:
    """One HTTP client per caller process. Use as an async context manager."""

    def __init__(
        self,
        base_url: str,
        *,
        token: str | None = None,
        timeout: float = DEFAULT_TIMEOUT_SECONDS,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        """`transport` lets tests use `httpx.MockTransport` instead of a real socket."""
        headers = {"authorization": f"Bearer {token}"} if token else {}
        self._http = httpx.AsyncClient(
            base_url=base_url.rstrip("/"), headers=headers, timeout=timeout, transport=transport
        )

    async def __aenter__(self) -> DatabaseClient:
        return self

    async def __aexit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, traceback: TracebackType | None
    ) -> None:
        await self.close()

    async def close(self) -> None:
        await self._http.aclose()

    async def create_folder(self, request: CreateFolderRequest) -> CreateFolderResponse:
        """`FilesystemWrite.CreateFolder`: creates a folder; denies on a duplicate code."""
        response = await self._http.post("/v1/filesystem/folders", json=request.model_dump(mode="json", by_alias=True))
        return parse_response(response, CreateFolderResponse)
