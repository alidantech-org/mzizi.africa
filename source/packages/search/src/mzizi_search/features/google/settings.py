"""What the Google adapter needs from its caller. There are no defaults: the engine supplies every value."""

from __future__ import annotations

from pydantic import Field

from mzizi_search.shared.contracts import Frozen


class GoogleSettings(Frozen):
    api_key: str = Field(min_length=1, repr=False)
    engine_id: str = Field(min_length=1)
    timeout_seconds: float = Field(gt=0)
