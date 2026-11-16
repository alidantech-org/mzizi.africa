"""Commands for offline coverage and pre-download attachment selection."""

from mzizi_cli.features.catalog.builders import passthrough
from mzizi_cli.features.catalog.models import Arg, ArgKind, Command

REPLAY = Command(
    "web",
    "replay",
    "Compare saved HTML with reviewed extraction expectations",
    "scraping.replay",
    (Arg("expectations", ArgKind.FILE, "Replay suite JSON", positional=True, suffixes=(".json",)),),
    passthrough,
    run_folder=True,
    failure_field="passed",
)

SELECT_ATTACHMENTS = Command(
    "download",
    "select",
    "Rank and budget crawl attachments before download",
    "download.select",
    (
        Arg("source", ArgKind.FOLDER, "Crawl output folder", positional=True),
        Arg("rules", ArgKind.FILE, "Ranking rules YAML", suffixes=(".yaml", ".yml")),
        Arg("max-bytes", ArgKind.INT, "Maximum reserved attachment bytes"),
        Arg("max-files", ArgKind.INT, "Maximum selected attachments", optional=True, default=20),
        Arg("max-probes", ArgKind.INT, "Maximum size probes", optional=True, default=80),
        Arg("min-score", ArgKind.TEXT, "Minimum attachment score, between 0 and 1", optional=True),
        Arg("allowed-hosts", ArgKind.TEXT, "Override allowed hosts, comma separated", optional=True),
        Arg("review", ArgKind.FILE, "JSON array of reviewed useful URLs", optional=True, suffixes=(".json",)),
        Arg("apply", ArgKind.FLAG, "Download selected attachments"),
    ),
    passthrough,
    run_folder=True,
)
