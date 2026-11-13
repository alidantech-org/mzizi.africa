"""Where the dev services are and how they are named. Defaults match a local Docker setup; environment overrides them."""

from __future__ import annotations

import os

from pydantic import BaseModel, ConfigDict

MONGO_URL_ENV, VECTOR_URL_ENV, EMBEDDING_MODEL_ENV = "DEV_MONGO_URL", "DEV_VECTOR_URL", "DEV_EMBEDDING_MODEL"
DEFAULT_MONGO_URL = "mongodb://127.0.0.1:27017"
DEFAULT_VECTOR_URL = "http://127.0.0.1:6333"
DEFAULT_MONGO_DATABASE = "mzizi_dev"
DEFAULT_COLLECTION_PREFIX = "mzizi_dev_"
DEFAULT_EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
EMBEDDING_CACHE_ENV = "DEV_EMBEDDING_CACHE"


class ServiceSettings(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    mongo_url: str = DEFAULT_MONGO_URL
    mongo_database: str = DEFAULT_MONGO_DATABASE
    vector_url: str = DEFAULT_VECTOR_URL
    collection_prefix: str = DEFAULT_COLLECTION_PREFIX
    embedding_model: str = DEFAULT_EMBEDDING_MODEL
    embedding_cache: str = ""


def load_settings() -> ServiceSettings:
    """The one place environment variables are read for the dev services."""
    return ServiceSettings(
        mongo_url=os.environ.get(MONGO_URL_ENV) or DEFAULT_MONGO_URL,
        vector_url=os.environ.get(VECTOR_URL_ENV) or DEFAULT_VECTOR_URL,
        embedding_model=os.environ.get(EMBEDDING_MODEL_ENV) or DEFAULT_EMBEDDING_MODEL,
        embedding_cache=os.environ.get(EMBEDDING_CACHE_ENV, ""),
    )
