"""Platform: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Platform(StrEnum):
    ANDROID = "android"
    IOS = "ios"
    WEB = "web"
