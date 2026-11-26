"""Contact Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ContactKind(StrEnum):
    EMAIL = "email"
    FACEBOOK = "facebook"
    FAX = "fax"
    INSTAGRAM = "instagram"
    LANDMARK = "landmark"
    MOBILE = "mobile"
    PHYSICAL_ADDRESS = "physical-address"
    POSTAL_ADDRESS = "postal-address"
    SOCIAL_MEDIA = "social-media"
    TELEPHONE = "telephone"
    TIKTOK = "tiktok"
    WEBSITE = "website"
    X = "x"
    YOUTUBE = "youtube"
