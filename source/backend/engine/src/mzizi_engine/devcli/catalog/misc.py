"""Commands for manifests, the filesystem, the dev services and the workspace."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import directory_payload, no_payload, passthrough
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command

RUN = Arg("run", ArgKind.RUN, "Run folder name, or `last`", default="last")
YAML = (".yaml", ".yml")

COMMANDS: tuple[Command, ...] = (
    Command("manifest", "check", "Validate the seed manifest and lock", "manifest.check_seeds", (), no_payload),
    Command(
        "manifest",
        "validate-structure",
        "Validate a site-structure bundle",
        "manifest.validate_structure",
        (Arg("directory", ArgKind.FOLDER, "Folder holding the structure bundle", positional=True),),
        directory_payload,
    ),
    Command(
        "manifest",
        "explain",
        "Show the resolved manifest",
        "manifest.explain",
        (Arg("manifest", ArgKind.FILE, "Manifest file", positional=True, suffixes=YAML),),
        passthrough,
    ),
    Command(
        "fs",
        "hash",
        "Hash a file and show its dedup key",
        "filesystem.hash",
        (Arg("path", ArgKind.FILE, "File to hash", positional=True),),
        passthrough,
    ),
    Command(
        "fs",
        "put",
        "Plan or run an upload of a folder",
        "filesystem.put",
        (
            Arg("path", ArgKind.FOLDER, "Folder to upload", positional=True),
            Arg("dry-run", ArgKind.FLAG, "Only show the plan"),
        ),
        passthrough,
    ),
    Command("mongo", "test", "Check the Mongo sandbox works", "mongo.test", (), no_payload),
    Command("mongo", "load", "Load a run's records into Mongo", "mongo.load", (RUN,), passthrough),
    Command(
        "mongo",
        "find",
        "Query dev documents",
        "mongo.find",
        (Arg("query", ArgKind.TEXT, "JSON filter", default="{}"),),
        passthrough,
    ),
    Command("mongo", "drop-dev", "Drop the dev Mongo database", "mongo.drop", (), no_payload),
    Command("vector", "test", "Check the vector sandbox works", "vector.test", (), no_payload),
    Command("vector", "index", "Embed and index a run's Markdown", "vector.index", (RUN,), passthrough),
    Command(
        "vector",
        "search",
        "Semantic search over indexed chunks",
        "vector.search",
        (Arg("query", ArgKind.TEXT, "What to look for", positional=True),),
        passthrough,
    ),
    Command(
        "vector",
        "classify",
        "Propose a class for a text or file",
        "vector.classify",
        (Arg("input", ArgKind.FILE, "Text or Markdown file", positional=True),),
        passthrough,
    ),
    Command("vector", "drop-dev", "Delete dev vector collections", "vector.drop", (), no_payload),
    Command(
        "dev",
        "serve",
        "Serve saved fixtures over loopback HTTP",
        "devservice.serve",
        (Arg("dir", ArgKind.FOLDER, "Fixture folder", positional=True),),
        passthrough,
    ),
    Command(
        "dev",
        "services",
        "Start, stop or inspect the dev containers",
        "devservice.compose",
        (
            Arg(
                "action",
                ArgKind.CHOICE,
                "What to do",
                choices=("up", "down", "status"),
                positional=True,
                default="status",
            ),
        ),
        passthrough,
    ),
)
