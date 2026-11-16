"""Where MongoDB is. Both values are required: the engine guesses no host and no database."""

from __future__ import annotations

from collections.abc import Mapping

from pydantic import BaseModel, ConfigDict

MONGO_URL = "MZIZI_MONGO_URL"
MONGO_DATABASE = "MZIZI_MONGO_DATABASE"


class MongoSettingsError(ValueError):
    """MongoDB settings are missing; the message names each one."""


class MongoSettings(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    url: str
    database: str

    @classmethod
    def from_env(cls, env: Mapping[str, str]) -> MongoSettings:
        missing = [name for name in (MONGO_URL, MONGO_DATABASE) if not env.get(name)]
        if missing:
            raise MongoSettingsError(f"MongoDB settings missing: {', '.join(missing)}")
        return cls(url=env[MONGO_URL], database=env[MONGO_DATABASE])
