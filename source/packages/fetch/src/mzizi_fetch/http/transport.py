"""One bounded HTTP request: streams the body and refuses anything over the size limit."""

from __future__ import annotations

import httpx

from mzizi_fetch.models import Frozen
from mzizi_fetch.policy import Limits, TooLarge


class RawResponse(Frozen):
    status: int
    headers: dict[str, str]
    body: bytes


def get_once(client: httpx.Client, url: str, headers: dict[str, str], limits: Limits) -> RawResponse:
    with client.stream("GET", url, headers=headers, timeout=limits.timeout_seconds) as response:
        declared = int(response.headers.get("content-length", "0") or 0)
        if declared > limits.max_response_bytes:
            raise TooLarge(f"{declared} bytes declared, limit {limits.max_response_bytes}")
        chunks: list[bytes] = []
        size = 0
        for chunk in response.iter_bytes():
            size += len(chunk)
            if size > limits.max_response_bytes:
                raise TooLarge(f"response exceeds {limits.max_response_bytes} bytes")
            chunks.append(chunk)
        return RawResponse(status=response.status_code, headers=dict(response.headers), body=b"".join(chunks))
