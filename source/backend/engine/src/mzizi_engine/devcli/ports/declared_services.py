"""Ports for the developer service sandboxes: MongoDB and Qdrant (and the not-yet-built container helpers)."""

from __future__ import annotations

from mzizi_engine.devcli.ports.models import Port, binary, declare, module, service
from mzizi_engine.devservices.settings import DEFAULT_MONGO_URL, DEFAULT_VECTOR_URL, MONGO_URL_ENV, VECTOR_URL_ENV

PKG = "mzizi-engine"
SERVICES_EXTRA = "install the optional services group: `uv sync --all-packages --extra services`"
DOCKER = binary("docker", hint="install Docker to run the dev services")
MONGO_LIB = module("pymongo", SERVICES_EXTRA)
MONGO_URL = service(MONGO_URL_ENV, f"start MongoDB or export {MONGO_URL_ENV}", DEFAULT_MONGO_URL)
VECTOR_LIB = module("qdrant_client", SERVICES_EXTRA)
EMBED_LIB = module("fastembed", SERVICES_EXTRA)
VECTOR_URL = service(
    VECTOR_URL_ENV, f"start Qdrant (docker run qdrant/qdrant) or export {VECTOR_URL_ENV}", DEFAULT_VECTOR_URL
)

SERVICES: tuple[Port, ...] = (
    declare(
        "devservice.compose",
        PKG,
        "Start and stop the dev Mongo and vector containers",
        6,
        "No compose generator exists yet.",
        DOCKER,
    ),
    declare("devservice.serve", PKG, "Serve fixtures over loopback HTTP", 3, "Fixture server is not written yet."),
    declare("mongo.test", PKG, "Connect, write, read and delete one document", 6, "", MONGO_LIB, MONGO_URL),
    declare("mongo.stats", PKG, "Collections and counts in the dev database", 6, "", MONGO_LIB, MONGO_URL),
    declare("mongo.load", PKG, "Load a run's records and Markdown into Mongo", 6, "", MONGO_LIB, MONGO_URL),
    declare("mongo.find", PKG, "Query dev documents", 6, "", MONGO_LIB, MONGO_URL),
    declare("mongo.drop", PKG, "Drop the dev database", 6, "", MONGO_LIB, MONGO_URL),
    declare("vector.test", PKG, "Write and read back one point in Qdrant", 6, "", VECTOR_LIB, VECTOR_URL),
    declare("vector.status", PKG, "Qdrant reachability and dev collections", 6, "", VECTOR_LIB, VECTOR_URL),
    declare("vector.index", PKG, "Chunk, embed and upsert a run's Markdown", 6, "", VECTOR_LIB, EMBED_LIB, VECTOR_URL),
    declare("vector.search", PKG, "Semantic search over indexed chunks", 6, "", VECTOR_LIB, EMBED_LIB, VECTOR_URL),
    declare(
        "vector.classify",
        PKG,
        "Propose a class from nearest labelled examples",
        6,
        "",
        VECTOR_LIB,
        EMBED_LIB,
        VECTOR_URL,
    ),
    declare("vector.drop", PKG, "Delete the dev vector collections", 6, "", VECTOR_LIB, VECTOR_URL),
)
