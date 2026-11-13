from __future__ import annotations

import re
from unittest.mock import patch

import httpx
import pytest

from mzizi_engine.auth import DatabaseServiceFilesystemAuthorizer
from mzizi_engine.filesystem import PermissionDenied


def _response(payload: dict) -> httpx.Response:
    request = httpx.Request("POST", "http://database.test")
    return httpx.Response(201, json=payload, request=request)


@pytest.mark.parametrize(
    ("method", "endpoint", "arguments", "payload"),
    [
        (
            "for_new_child",
            "can-link",
            ("acct", "filesystem.edit", "filesystem.folders", "parent"),
            {"accountId": "acct", "permission": "filesystem.edit", "table": "filesystem.folders", "linkId": "parent"},
        ),
        (
            "for_record",
            "can-record",
            ("acct", "filesystem.read", "filesystem.files", "file"),
            {"accountId": "acct", "permission": "filesystem.read", "table": "filesystem.files", "recordId": "file"},
        ),
        (
            "for_move",
            "can-change",
            ("acct", "filesystem.edit", "filesystem.files", "file", "folder"),
            {
                "accountId": "acct",
                "permission": "filesystem.edit",
                "table": "filesystem.files",
                "recordId": "file",
                "newLinkId": "folder",
            },
        ),
        (
            "for_platform",
            "can-platform",
            ("acct", "filesystem.delete"),
            {"accountId": "acct", "permission": "filesystem.delete"},
        ),
    ],
)
def test_scoped_checks_call_the_named_database_operation(method, endpoint, arguments, payload):
    authorizer = DatabaseServiceFilesystemAuthorizer("http://database.test/", "service-token")
    with patch("httpx.post", return_value=_response({"allowed": True})) as post:
        getattr(authorizer, method)(*arguments)
    post.assert_called_once_with(
        f"http://database.test/internal/v1/auth/{endpoint}",
        json=payload,
        headers={"authorization": "Bearer service-token"},
        timeout=5.0,
    )


def test_denied_scoped_check_raises_filesystem_permission_error():
    authorizer = DatabaseServiceFilesystemAuthorizer("http://database.test", "service-token")
    with (
        patch("httpx.post", return_value=_response({"allowed": False, "reason": "out_of_scope"})),
        pytest.raises(PermissionDenied, match=re.escape("filesystem.read on filesystem.files denied: out_of_scope")),
    ):
        authorizer.for_record("acct", "filesystem.read", "filesystem.files", "file")
