"""Commands for offline coverage and pre-download attachment selection."""

from pathlib import Path

from mzizi_cli.features.catalog.builders import passthrough
from mzizi_cli.features.catalog.models import Arg, ArgKind, Command
from mzizi_cli.shared.errors import CliError
from mzizi_cli.shared.types import ArgValues
from mzizi_cli.shared.workspace import Workspace
from mzizi_engine.jsonvalue import Payload


def replay_payload(values: ArgValues, workspace: Workspace) -> Payload:
    value = values.get("expectations")
    if not isinstance(value, str):
        raise CliError("A replay suite file is required")
    source = Path(value).resolve()
    try:
        reference = source.relative_to(workspace.inputs.resolve())
    except ValueError as error:
        raise CliError("Place the replay suite and its captures under .dev/inputs") from error
    return {"expectations": reference.as_posix()}


REPLAY = Command(
    "web",
    "replay",
    "Compare saved HTML with reviewed extraction expectations",
    "scraping.replay",
    (Arg("expectations", ArgKind.FILE, "Replay suite JSON", positional=True, suffixes=(".json",)),),
    replay_payload,
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
