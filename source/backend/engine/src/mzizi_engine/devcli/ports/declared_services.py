"""Ports for the developer service sandboxes (not yet built)."""

from __future__ import annotations

from mzizi_engine.devcli.ports.models import Port, binary, declare, module, service

DOCKER = binary("docker", hint="install Docker to run the dev services")
MONGO_LIB = module("pymongo", "add the optional dev-services group (not yet defined)")
MONGO_URL = service("DEV_MONGO_URL", "start `mzizi dev services up` or export DEV_MONGO_URL=mongodb://127.0.0.1:27018")
VECTOR_LIB = module("qdrant_client", "add the optional dev-services group (not yet defined)")
VECTOR_URL = service("DEV_VECTOR_URL", "start `mzizi dev services up` or export DEV_VECTOR_URL=http://127.0.0.1:6334")
PKG = "mzizi-engine"
NO_MONGO = "No Mongo port adapter exists yet."
NO_VECTOR = "No vector port adapter exists yet."

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
    declare("mongo.test", PKG, "Connect, write, read and delete one document", 6, NO_MONGO, MONGO_LIB, MONGO_URL),
    declare("mongo.load", PKG, "Load a run's records into Mongo", 6, NO_MONGO, MONGO_LIB, MONGO_URL),
    declare("mongo.find", PKG, "Query dev documents", 6, NO_MONGO, MONGO_LIB, MONGO_URL),
    declare("mongo.drop", PKG, "Drop the dev database", 6, NO_MONGO, MONGO_LIB, MONGO_URL),
    declare("vector.test", PKG, "Create a throwaway collection and search it", 6, NO_VECTOR, VECTOR_LIB, VECTOR_URL),
    declare("vector.index", PKG, "Chunk, embed and upsert a run's Markdown", 6, NO_VECTOR, VECTOR_LIB, VECTOR_URL),
    declare("vector.search", PKG, "Semantic search over indexed chunks", 6, NO_VECTOR, VECTOR_LIB, VECTOR_URL),
    declare(
        "vector.classify", PKG, "Propose a class from nearest labelled examples", 6, NO_VECTOR, VECTOR_LIB, VECTOR_URL
    ),
    declare("vector.drop", PKG, "Delete dev vector collections", 6, NO_VECTOR, VECTOR_LIB, VECTOR_URL),
)
