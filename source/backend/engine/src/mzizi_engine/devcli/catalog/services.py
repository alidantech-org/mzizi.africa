"""Commands for the dev service sandboxes: MongoDB and Qdrant."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import no_payload, passthrough, run_source_payload
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command

RUN = Arg(
    "run", ArgKind.RUN, "Run folder name (or `last`), or the path of any crawl or PDF output folder", default="last"
)
YAML = (".yaml", ".yml")

COMMANDS: tuple[Command, ...] = (
    Command("mongo", "test", "Connect to MongoDB: write, read and delete one document", "mongo.test", (), no_payload),
    Command("mongo", "stats", "Collections and document counts in the dev database", "mongo.stats", (), no_payload),
    Command(
        "mongo",
        "load",
        "Load a run folder's records and Markdown into MongoDB",
        "mongo.load",
        (RUN,),
        run_source_payload,
    ),
    Command(
        "mongo",
        "find",
        "Query dev documents with a JSON filter",
        "mongo.find",
        (
            Arg("collection", ArgKind.TEXT, "Collection, e.g. pages, links, markdown", positional=True),
            Arg("query", ArgKind.TEXT, "JSON filter", optional=True, default="{}"),
            Arg("limit", ArgKind.INT, "Documents to show", optional=True, default=10),
        ),
        passthrough,
    ),
    Command("mongo", "drop-dev", "Drop the dev MongoDB database (only mzizi_dev)", "mongo.drop", (), no_payload),
    Command("vector", "test", "Qdrant connectivity: write and read back one point", "vector.test", (), no_payload),
    Command("vector", "status", "Qdrant reachability and dev collections", "vector.status", (), no_payload),
    Command(
        "vector",
        "index",
        "Chunk, embed and index a run's Markdown in Qdrant",
        "vector.index",
        (RUN,),
        run_source_payload,
    ),
    Command(
        "vector",
        "search",
        "Semantic search over indexed chunks",
        "vector.search",
        (
            Arg("query", ArgKind.TEXT, "What to look for", positional=True),
            Arg("limit", ArgKind.INT, "Results", optional=True, default=10),
            Arg("run-id", ArgKind.TEXT, "Only this run's chunks", optional=True),
        ),
        passthrough,
    ),
    Command(
        "vector",
        "classify",
        "Propose a class for a text from labelled examples (a proposal, not a fact)",
        "vector.classify",
        (
            Arg("input", ArgKind.FILE, "Markdown or text file", positional=True, suffixes=(".md", ".txt")),
            Arg("labels", ArgKind.FILE, "YAML: labels, each with example texts", suffixes=YAML),
        ),
        passthrough,
    ),
    Command("vector", "drop-dev", "Delete every dev Qdrant collection", "vector.drop", (), no_payload),
)
