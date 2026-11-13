"""Registers the dev-service capabilities with the engine registry."""

from __future__ import annotations

from mzizi_engine.capabilities import Capability, CapabilityRegistry
from mzizi_engine.devservices.handlers import mongo, vector
from mzizi_engine.devservices.requests import ClassifyRequest, FindRequest, NoRequest, RunRequest, SearchRequest
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.web.handlers.common import capability

PACKAGE = "mzizi-engine"
VERSION = "0.1.0"
SCHEMA: Payload = {"type": "object"}


def register_devservices(registry: CapabilityRegistry) -> None:
    for name, description, handler in (
        (
            "mongo.test",
            "Connect to the dev MongoDB, write/read/delete one document, list collections",
            capability(NoRequest, mongo.mongo_test),
        ),
        ("mongo.stats", "Collections and document counts in the dev MongoDB", capability(NoRequest, mongo.mongo_stats)),
        (
            "mongo.load",
            "Load a run folder's records and Markdown into MongoDB, idempotently",
            capability(RunRequest, mongo.mongo_load),
        ),
        ("mongo.find", "Query dev documents with a JSON filter", capability(FindRequest, mongo.mongo_find)),
        (
            "mongo.drop",
            "Drop the dev MongoDB database (only the configured dev one)",
            capability(NoRequest, mongo.mongo_drop),
        ),
        (
            "vector.test",
            "Qdrant connectivity: write and read back one point, no model needed",
            capability(NoRequest, vector.vector_test),
        ),
        ("vector.status", "Qdrant reachability and dev collections", capability(NoRequest, vector.vector_status)),
        (
            "vector.index",
            "Chunk, embed and upsert a run's Markdown into Qdrant",
            capability(RunRequest, vector.vector_index),
        ),
        ("vector.search", "Semantic search over indexed chunks", capability(SearchRequest, vector.vector_search)),
        (
            "vector.classify",
            "Propose a class for a text from labelled examples (a proposal, not a fact)",
            capability(ClassifyRequest, vector.vector_classify),
        ),
        ("vector.drop", "Delete every dev Qdrant collection", capability(NoRequest, vector.vector_drop)),
    ):
        registry.register(Capability(name, VERSION, PACKAGE, description, handler, SCHEMA, concurrency=1))
