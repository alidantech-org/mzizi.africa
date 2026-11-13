"""Client behaviour against a mocked transport: no network, no database."""

from __future__ import annotations

import json
from uuid import UUID

import httpx
import pytest
from mzizi_database_client import ApiError, Conflict, CreateFolderRequest, DatabaseClient, Denied

ACCOUNT_ID = UUID("00000000-0000-7000-8000-000000000001")
ROLE_ID = UUID("00000000-0000-7000-8000-000000000007")


def _client(transport: httpx.MockTransport) -> DatabaseClient:
    return DatabaseClient("http://db.test", transport=transport)


@pytest.mark.asyncio
async def test_create_folder_sends_camel_case_and_parses_the_response():
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["body"] = json.loads(request.content)
        return httpx.Response(
            200,
            json={
                "folder": {
                    "id": "01a1d500-3688-707b-b907-1a8c20108da5",
                    "parentId": None,
                    "name": "Probe",
                    "code": "probe.folder",
                    "access": "internal",
                    "roleId": str(ROLE_ID),
                    "version": 1,
                    "createdAt": "2026-11-13T13:02:03.400097Z",
                }
            },
        )

    client = _client(httpx.MockTransport(handler))
    request = CreateFolderRequest(
        account_id=ACCOUNT_ID, name="Probe", code="probe.folder", access="internal", role_id=ROLE_ID
    )
    result = await client.create_folder(request)
    await client.close()

    assert captured["body"] == {
        "accountId": str(ACCOUNT_ID),
        "parentId": None,
        "name": "Probe",
        "code": "probe.folder",
        "access": "internal",
        "roleId": str(ROLE_ID),
    }
    assert result.folder.code == "probe.folder" and result.folder.version == 1


@pytest.mark.asyncio
async def test_a_duplicate_code_raises_conflict_and_a_denial_raises_denied():
    for status, code, expect in ((409, "validation_error", Conflict), (403, "forbidden", Denied)):

        def handler(request: httpx.Request, status=status, code=code) -> httpx.Response:
            return httpx.Response(status, json={"code": code})

        client = _client(httpx.MockTransport(handler))
        request = CreateFolderRequest(
            account_id=ACCOUNT_ID, name="Probe", code="probe.folder", access="internal", role_id=ROLE_ID
        )
        with pytest.raises(expect):
            await client.create_folder(request)
        await client.close()


@pytest.mark.asyncio
async def test_an_unmapped_status_raises_the_base_api_error():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(503, json={"code": "unavailable"})

    client = _client(httpx.MockTransport(handler))
    request = CreateFolderRequest(
        account_id=ACCOUNT_ID, name="Probe", code="probe.folder", access="internal", role_id=ROLE_ID
    )
    with pytest.raises(ApiError) as excinfo:
        await client.create_folder(request)
    await client.close()
    assert excinfo.value.status == 503 and excinfo.value.code == "unavailable"
