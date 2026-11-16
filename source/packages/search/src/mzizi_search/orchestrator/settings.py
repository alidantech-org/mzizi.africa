"""Everything the orchestrator needs from its caller. A provider left as `None` is not configured."""

from __future__ import annotations

from pydantic import Field

from mzizi_search.features.brave.settings import BraveSettings
from mzizi_search.features.google.settings import GoogleSettings
from mzizi_search.shared.contracts import Frozen


class SearchSettings(Frozen):
    #: The most results one query may return, whatever the caller asks for.
    max_results: int = Field(ge=1)
    brave: BraveSettings | None
    google: GoogleSettings | None
