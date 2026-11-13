"""The `mzizi` Typer application: grouped commands generated from the catalog, plus status, doctor and workspace tools."""

from __future__ import annotations

import inspect
import json
import sys
from collections.abc import Callable
from pathlib import Path
from typing import Annotated

import questionary
import typer
from rich.panel import Panel
from rich.table import Table

from mzizi_engine.capabilities import build_default_registry
from mzizi_engine.devcli.catalog import COMMANDS, GROUP_HELP, Arg, ArgKind, Command
from mzizi_engine.devcli.errors import Cancelled
from mzizi_engine.devcli.ports import PORTS, PortState, all_statuses, check_requirement
from mzizi_engine.devcli.prompts import is_interactive
from mzizi_engine.devcli.runner import Session, run_command, status_table
from mzizi_engine.devcli.theme import configure_logging, err, out
from mzizi_engine.devcli.types import ArgValues, ExitCode
from mzizi_engine.devcli.workspace import Workspace

app = typer.Typer(
    name="mzizi",
    help="Run and watch Mzizi engine capabilities on local files and URLs. Run with no arguments for interactive mode.",
    no_args_is_help=False,
    rich_markup_mode="rich",
    add_completion=False,
)
_groups: dict[str, typer.Typer] = {}


def _session(ctx: typer.Context) -> Session:
    session = ctx.obj
    assert isinstance(session, Session)
    return session


@app.callback(invoke_without_command=True)
def root(
    ctx: typer.Context,
    no_input: Annotated[bool, typer.Option("--no-input", help="Never prompt; fail on missing values")] = False,
    json_output: Annotated[bool, typer.Option("--json", help="Print machine-readable results only")] = False,
    verbose: Annotated[bool, typer.Option("--verbose", "-v", help="Show debug logging")] = False,
    allow_outside_inputs: Annotated[
        bool, typer.Option("--allow-outside-inputs", help="Accept files outside .local/dev/inputs")
    ] = False,
) -> None:
    workspace = Workspace.locate()
    configure_logging(verbose=verbose, log_file=workspace.log_file if workspace.exists() else None)
    interactive = is_interactive(no_input)
    ctx.obj = Session(workspace, interactive, json_output, verbose, allow_outside_inputs)
    if ctx.invoked_subcommand is None:
        if interactive:
            raise typer.Exit(int(_menu(ctx.obj)))
        out.print(ctx.get_help())
        raise typer.Exit(0)


def _py_type(arg: Arg) -> type:
    return int if arg.kind is ArgKind.INT else bool if arg.kind is ArgKind.FLAG else str


def _make_function(command: Command) -> Callable[..., None]:
    parameters = [inspect.Parameter("ctx", inspect.Parameter.POSITIONAL_OR_KEYWORD, annotation=typer.Context)]
    annotations: dict[str, object] = {"ctx": typer.Context}
    for arg in command.args:
        name = arg.name.replace("-", "_")
        help_text = arg.help + (f" ({', '.join(arg.choices)})" if arg.choices else "")
        if arg.kind is ArgKind.FLAG:
            annotation = Annotated[bool, typer.Option(f"--{arg.name}", help=help_text)]
            default: object = False
        elif arg.positional:
            annotation = Annotated[_py_type(arg) | None, typer.Argument(help=help_text, show_default=False)]
            default = None
        else:
            annotation = Annotated[
                _py_type(arg) | None, typer.Option(f"--{arg.name}", help=help_text, show_default=False)
            ]
            default = None
        annotations[name] = annotation
        parameters.append(
            inspect.Parameter(name, inspect.Parameter.POSITIONAL_OR_KEYWORD, default=default, annotation=annotation)
        )

    def function(ctx: typer.Context, **kwargs: object) -> None:
        values: ArgValues = {arg.name: _as_value(kwargs.get(arg.name.replace("-", "_"))) for arg in command.args}
        raise typer.Exit(int(run_command(command, values, _session(ctx))))

    function.__signature__ = inspect.Signature(parameters)  # type: ignore[attr-defined]
    function.__annotations__ = annotations
    function.__name__ = f"{command.group}_{command.name}".replace("-", "_")
    function.__doc__ = command.help
    return function


def _as_value(raw: object) -> str | int | bool | None:
    return raw if isinstance(raw, str | int | bool) or raw is None else str(raw)


def _group(name: str) -> typer.Typer:
    if name not in _groups:
        _groups[name] = typer.Typer(help=GROUP_HELP.get(name, name), no_args_is_help=True, rich_markup_mode="rich")
        app.add_typer(_groups[name], name=name)
    return _groups[name]


for _command in COMMANDS:
    _group(_command.group).command(_command.name, help=_command.help)(_make_function(_command))


@app.command("status", help="Show every capability port: ready, needs setup, or not yet added")
def status(
    ctx: typer.Context,
    group: Annotated[str | None, typer.Option("--group", "-g", help="Only one group, e.g. fetch")] = None,
    probe: Annotated[bool, typer.Option("--probe", help="Also test that dev services are reachable")] = False,
) -> None:
    session = _session(ctx)
    statuses = all_statuses(probe=probe)
    if session.json_output:
        rows = [
            {
                "capability": s.port.capability,
                "package": s.port.package,
                "state": s.state.value,
                "phase": s.port.phase,
                "reason": s.port.reason,
                "missing": [c.requirement.label for c in s.missing],
            }
            for s in statuses
        ]
        out.print_json(json.dumps(rows))
        return
    out.print(status_table(statuses, group=group))
    counts = {state: sum(1 for s in statuses if s.state is state) for state in PortState}
    out.print(
        f"[ok]{counts[PortState.READY]} ready[/ok]  [warn]{counts[PortState.UNAVAILABLE]} need setup[/warn]  [dim]{counts[PortState.NOT_YET_ADDED]} not yet added[/dim]"
    )


@app.command("doctor", help="Check the tools, libraries and services the ports need")
def doctor(
    ctx: typer.Context, probe: Annotated[bool, typer.Option("--probe", help="Test service reachability")] = True
) -> None:
    needs: dict[tuple[str, str, str], list[str]] = {}
    for port in PORTS:
        for requirement in port.requires:
            needs.setdefault((requirement.kind.value, requirement.label, requirement.hint), []).append(port.capability)
    table = Table(title="Environment", header_style="accent")
    for column in ("Kind", "Need", "State", "Used by", "Fix"):
        table.add_column(column, overflow="fold")
    requirements = {(r.kind.value, r.label, r.hint): r for p in PORTS for r in p.requires}
    for key, users in sorted(needs.items()):
        check = check_requirement(requirements[key], probe=probe)
        mark = "[ok]ok[/ok]" if check.satisfied else "[warn]missing[/warn]"
        table.add_row(
            key[0],
            key[1],
            f"{mark} {check.detail}",
            ", ".join(sorted(users)[:3]) + ("…" if len(users) > 3 else ""),
            "" if check.satisfied else key[2],
        )
    out.print(table)


capability = typer.Typer(help="Inspect and call registered engine capabilities directly", no_args_is_help=True)
app.add_typer(capability, name="capability")


@capability.command("list", help="List capabilities registered in the engine")
def capability_list() -> None:
    table = Table(title="Registered capabilities", header_style="accent")
    for column in ("Name", "Version", "Package", "CPU", "Description"):
        table.add_column(column, overflow="fold")
    for item in build_default_registry().describe():
        table.add_row(
            item["name"], item["version"], item["package"], "yes" if item["cpu_bound"] else "", item["description"]
        )
    out.print(table)


@capability.command("run", help="Call a registered capability with a JSON payload file")
def capability_run(
    ctx: typer.Context,
    name: Annotated[str | None, typer.Argument(help="Capability name", show_default=False)] = None,
    payload: Annotated[Path | None, typer.Option("--payload", help="JSON file with the payload")] = None,
) -> None:
    session = _session(ctx)
    registry = build_default_registry()
    if name is None:
        if not session.interactive:
            err.print("[bad]capability name required[/bad]")
            raise typer.Exit(int(ExitCode.USAGE))
        name = str(questionary.select("Capability:", choices=registry.names()).ask())
    if name not in registry.names():
        err.print(f"[bad]unknown capability {name!r}[/bad]. Known: {', '.join(registry.names())}")
        raise typer.Exit(int(ExitCode.USAGE))
    body = json.loads(payload.read_text(encoding="utf-8")) if payload else {}
    out.print_json(json.dumps(registry.get(name).handler(body), default=str))


dev = _group("dev")


@dev.command("init", help="Create the git-ignored .local/dev workspace")
def dev_init(ctx: typer.Context) -> None:
    ws = _session(ctx).workspace
    created = ws.init()
    out.print(
        Panel(
            f"{ws.root}\n" + ("\n".join(f"+ {p.name}" for p in created) or "already complete"),
            title="[ok]workspace[/ok]",
            border_style="green",
        )
    )


@dev.command("runs", help="List recent runs")
def dev_runs(ctx: typer.Context, limit: Annotated[int, typer.Option("--limit", "-n")] = 15) -> None:
    runs = _session(ctx).workspace.list_runs(limit)
    table = Table(title="Recent runs", header_style="accent")
    for column in ("Run", "Command", "Status", "Message"):
        table.add_column(column, overflow="fold")
    colors = {
        "ok": "ok",
        "failed": "bad",
        "not_yet_added": "dim",
        "unavailable": "warn",
        "usage": "warn",
        "cancelled": "dim",
    }
    for r in runs:
        color = colors.get(r.status or "", "dim")
        table.add_row(r.run_id, r.command, f"[{color}]{r.status or 'running'}[/{color}]", r.message or "")
    out.print(table if runs else "[dim]no runs yet[/dim]")


@dev.command("show", help="Show a run's record and result")
def dev_show(ctx: typer.Context, run: Annotated[str, typer.Argument(help="Run name or `last`")] = "last") -> None:
    folder = _session(ctx).workspace.run_folder(run)
    if folder is None:
        err.print(f"[bad]no run {run!r}[/bad]")
        raise typer.Exit(int(ExitCode.FAILED))
    for name in ("run.json", "result.json"):
        file = folder / name
        if file.exists():
            out.print(Panel(file.read_text(encoding="utf-8"), title=f"{folder.name}/{name}"))


@dev.command("clean", help="Delete old run folders, keeping the newest")
def dev_clean(ctx: typer.Context, keep: Annotated[int, typer.Option("--keep", help="Runs to keep")] = 20) -> None:
    out.print(f"[ok]removed {_session(ctx).workspace.clean_runs(keep)} run folder(s)[/ok]")


def _menu(session: Session) -> ExitCode:
    statuses = {s.port.capability: s for s in all_statuses()}
    glyph = {PortState.READY: "●", PortState.UNAVAILABLE: "◐", PortState.NOT_YET_ADDED: "○"}
    groups = sorted({c.group for c in COMMANDS})
    try:
        group = questionary.select("Group:", choices=groups).ask()
        if group is None:
            raise Cancelled("cancelled")
        choices = [
            questionary.Choice(f"{glyph[statuses[c.port].state] if c.port else '●'} {c.name} - {c.help}", value=c)
            for c in COMMANDS
            if c.group == group
        ]
        command = questionary.select("Command:", choices=choices).ask()
        if command is None:
            raise Cancelled("cancelled")
    except Cancelled:
        return ExitCode.CANCELLED
    return run_command(command, {}, session)


def main() -> None:
    try:
        app()
    except KeyboardInterrupt:
        err.print("[dim]cancelled[/dim]")
        sys.exit(int(ExitCode.CANCELLED))


if __name__ == "__main__":
    main()
