"""Push Provider: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PushProvider(StrEnum):
    APNS = "apns"
    FCM = "fcm"
    ONESIGNAL = "onesignal"
