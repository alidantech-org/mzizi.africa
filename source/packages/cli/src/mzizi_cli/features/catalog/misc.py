"""Commands for manifests and the filesystem. Richer filesystem work goes through `mzizi capability run filesystem.<operation>`."""

from __future__ import annotations

from mzizi_cli.features.catalog.builders import directory_payload, no_payload, passthrough
from mzizi_cli.features.catalog.models import Arg, ArgKind, Command

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
        "sync",
        "Register the seed files the manifest lists, in the folders its _folder.yaml files describe (plan only without --apply)",
        "filesystem.sync_seed",
        (
            Arg("entries", ArgKind.TEXT, "Manifest entry ids, comma separated (default: all)", optional=True),
            Arg("apply", ArgKind.FLAG, "Upload to the object store and write the registry rows"),
        ),
        passthrough,
    ),
    Command(
        "fs",
        "lineage",
        "Ancestry and derivatives of a registered file version",
        "filesystem.lineage",
        (Arg("version-id", ArgKind.TEXT, "File version id", positional=True),),
        passthrough,
    ),
    Command(
        "fs",
        "download",
        "A presigned download link for a registered file version",
        "filesystem.download",
        (Arg("version-id", ArgKind.TEXT, "File version id", positional=True),),
        passthrough,
    ),
)
