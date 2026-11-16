"""`mzizi`: a small command line over the engine runtime. It lists what the runtime exposes and runs one operation.

It builds the default runtime, starts it, calls it and stops it. Nothing else lives here yet: the richer developer
commands return as capabilities are connected to the runtime.
"""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer

from mzizi_cli.features.operations.parse import parse_payload
from mzizi_cli.features.operations.render import operations_json, operations_table, result_json
from mzizi_cli.features.terminal.theme import err, out
from mzizi_cli.shared.exit_codes import ExitCode
from mzizi_engine.runtime import EngineRuntime
from mzizi_engine.runtime.assembly import build_default_runtime

app = typer.Typer(help="Call the Mzizi engine runtime from the command line.", no_args_is_help=True)


def open_runtime() -> EngineRuntime:
    runtime = build_default_runtime()
    runtime.start()
    return runtime


@app.command("capabilities", help="List the operations the runtime exposes")
def capabilities(
    as_json: Annotated[bool, typer.Option("--json", help="Print JSON instead of a table")] = False,
) -> None:
    runtime = open_runtime()
    try:
        items = runtime.operations.describe()
    finally:
        runtime.stop()
    if as_json:
        out.print_json(operations_json(items))
    else:
        out.print(operations_table(items))


@app.command("run", help="Run one operation with a JSON object payload")
def run(
    name: Annotated[str, typer.Argument(help="Operation name, see `mzizi capabilities`")],
    payload: Annotated[Path | None, typer.Option("--payload", help="JSON file with the payload object")] = None,
) -> None:
    body = {}
    if payload is not None:
        try:
            body = parse_payload(payload.read_text(encoding="utf-8"))
        except (OSError, ValueError) as problem:
            err.print(f"[bad]{problem}[/bad]")
            raise typer.Exit(int(ExitCode.USAGE)) from problem
    runtime = open_runtime()
    try:
        if name not in runtime.operations.names():
            err.print(f"[bad]unknown operation {name!r}[/bad]. Known: {', '.join(runtime.operations.names())}")
            raise typer.Exit(int(ExitCode.USAGE))
        try:
            result = runtime.call(name, body)
        except Exception as problem:
            err.print(f"[bad]{name} failed: {problem}[/bad]")
            raise typer.Exit(int(ExitCode.FAILED)) from problem
    finally:
        runtime.stop()
    out.print_json(result_json(result))


@app.command("health", help="Show the runtime state")
def health() -> None:
    runtime = open_runtime()
    try:
        report = runtime.health()
    finally:
        runtime.stop()
    out.print_json(report.model_dump_json())


def main() -> None:
    app()
