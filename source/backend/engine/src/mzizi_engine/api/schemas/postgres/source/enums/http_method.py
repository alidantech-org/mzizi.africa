"""Http Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class HttpMethod(StrEnum):
    GET = "GET"
    HEAD = "HEAD"
    POST = "POST"
