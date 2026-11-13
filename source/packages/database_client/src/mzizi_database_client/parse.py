"""The one parsing boundary: an httpx response becomes a typed model or a typed error. Nothing
past this module sees a raw dict."""

from __future__ import annotations

import httpx
from pydantic import BaseModel, TypeAdapter

from mzizi_database_client.errors import ApiError, Conflict, Denied

_ERROR_TYPES = {403: Denied, 409: Conflict}


def raise_for_error(response: httpx.Response) -> None:
    if response.is_success:
        return
    try:
        code = str(response.json().get("code", "unknown"))
    except ValueError:
        code = "unknown"
    raise _ERROR_TYPES.get(response.status_code, ApiError)(response.status_code, code)


def parse_response[ResponseModel: BaseModel](response: httpx.Response, model: type[ResponseModel]) -> ResponseModel:
    raise_for_error(response)
    return TypeAdapter(model).validate_python(response.json())
