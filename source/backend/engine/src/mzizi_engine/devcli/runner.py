"""Run one command: check its port, ask for missing values, call the capability, record the run."""

from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from pathlib import Path

from rich.panel import Panel
from rich.syntax import Syntax
from rich.table import Table

from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry
from mzizi_engine.devcli.artifacts import DocumentSummary, write_document_artifacts
from mzizi_engine.devcli.catalog import Command
from mzizi_engine.devcli.errors import CliError, NotYetAdded, Unavailable
from mzizi_engine.devcli.ports import PLAN_DOC, PortState, PortStatus, get_port, port_status
from mzizi_engine.devcli.prompts import Prompter
from mzizi_engine.devcli.theme import err, log, out
from mzizi_engine.devcli.types import ArgValues, ExitCode
from mzizi_engine.devcli.workspace import RunStatus, Workspace

_PREVIEW_LINES = 60


@dataclass(frozen=True)
class Session:
    workspace: Workspace
    interactive: bool
    json_output: bool
    verbose: bool
    allow_outside: bool

    def prompter(self) -> Prompter:
        return Prompter(self.workspace, interactive=self.interactive, allow_outside=self.allow_outside)


def run_command(command: Command, given: ArgValues, session: Session) -> ExitCode:
    """Execute `command`; always returns an exit code and leaves a run folder and a log trail."""
    registry = build_default_registry()
    status = port_status(get_port(command.port), registry) if command.port else None
    run = session.workspace.start_run(command.path.replace(" ", "-"), command.port, given)
    log.info("run %s: %s port=%s", run.record.run_id, command.path, command.port)
    outcome: RunStatus = "failed"
    message: str | None = None
    try:
        if status is not None:
            _require_ready(command, status)
        values = _resolve(command, given, session)
        payload = (command.builder or _empty)(values, session.workspace)
        result = _call(command, registry, payload, session)
        if command.artifacts:
            summary = write_document_artifacts(run.folder, result)
            path = run.save_result(summary.model_dump(mode="json"))
            outcome = "ok"
            _render_document(command, summary, session, run.folder)
            return ExitCode.OK
        path = run.save_result(result)
        outcome = "ok"
        _render_result(command, result, session, str(path))
        return ExitCode.OK
    except NotYetAdded as exc:
        outcome, message = "not_yet_added", exc.message
        _render_problem("Not yet added", exc, "warn")
        log.warning("%s: not yet added: %s", command.path, exc.message)
        return exc.exit_code
    except Unavailable as exc:
        outcome, message = "unavailable", exc.message
        _render_problem("Needs setup", exc, "warn")
        log.warning("%s: unavailable: %s", command.path, exc.message)
        return exc.exit_code
    except CliError as exc:
        outcome = (
            "cancelled"
            if exc.exit_code is ExitCode.CANCELLED
            else ("usage" if exc.exit_code is ExitCode.USAGE else "failed")
        )
        message = exc.message
        _render_problem("Cannot run", exc, "bad")
        log.error("%s: %s", command.path, exc.message)
        return exc.exit_code
    except Exception as exc:
        message = f"{exc.__class__.__name__}: {exc}"
        log.exception("%s crashed", command.path)
        err.print(Panel(message, title="Failed", border_style="bad"))
        return ExitCode.FAILED
    finally:
        run.finish(outcome, message)


def _empty(values: ArgValues, ws: Workspace) -> dict[str, str]:
    return {}


def _require_ready(command: Command, status: PortStatus) -> None:
    port = status.port
    if status.state is PortState.NOT_YET_ADDED:
        raise NotYetAdded(
            f"`mzizi {command.path}` is in place, but capability `{port.capability}` has not been added yet.",
            hint=f"{port.reason} Planned in phase {port.phase} ({PLAN_DOC}). Check progress with `mzizi status`.",
        )
    if status.state is PortState.UNAVAILABLE:
        needs = "; ".join(f"{c.requirement.label}: {c.detail}. {c.requirement.hint}" for c in status.missing)
        raise Unavailable(f"`mzizi {command.path}` needs setup before it can run.", hint=needs)


def _resolve(command: Command, given: ArgValues, session: Session) -> ArgValues:
    prompter = session.prompter()
    values: ArgValues = {}
    for arg in command.args:
        values[arg.name] = prompter.resolve(arg, given.get(arg.name))
    return values


def _call(command: Command, registry: CapabilityRegistry, payload: dict[str, object], session: Session) -> object:
    if command.port is None:
        raise CliError(f"{command.path} has no capability")
    os.environ["ENGINE_INPUT_ROOT"] = str(session.workspace.inputs)
    capability = registry.get(command.port)
    started = time.monotonic()
    with err.status(f"[info]Running {command.port}…", spinner="dots") if not session.json_output else _null():
        result = capability.handler(payload)
    log.info("%s finished in %.2fs", command.port, time.monotonic() - started)
    return result


class _null:
    def __enter__(self) -> None:
        return None

    def __exit__(self, *_: object) -> None:
        return None


def _render_result(command: Command, result: object, session: Session, saved: str) -> None:
    text = json.dumps(result, indent=2, default=str)
    if session.json_output:
        out.print_json(text)
        return
    lines = text.splitlines()
    shown = "\n".join(lines[:_PREVIEW_LINES])
    suffix = f"\n… {len(lines) - _PREVIEW_LINES} more lines" if len(lines) > _PREVIEW_LINES else ""
    out.print(
        Panel(
            Syntax(shown, "json", theme="ansi_dark", word_wrap=True),
            title=f"[ok]✔ {command.path}[/ok]",
            subtitle=f"[dim]full result: {saved}[/dim]",
            border_style="green",
        )
    )
    if suffix:
        out.print(f"[dim]{suffix.strip()}[/dim]")


def _render_document(command: Command, summary: DocumentSummary, session: Session, folder: Path) -> None:
    if session.json_output:
        out.print_json(summary.model_dump_json())
        return
    table = Table(show_header=False, box=None, padding=(0, 2))
    table.add_row(
        "status", f"[ok]{summary.status}[/ok]" if summary.status == "succeeded" else f"[warn]{summary.status}[/warn]"
    )
    table.add_row("pages", str(summary.pages))
    table.add_row("blocks", ", ".join(f"{n} {k}" for k, n in summary.counts.items()) or "none")
    table.add_row("files", f"{len(summary.files)} written")
    table.add_row("folder", str(folder))
    out.print(Panel(table, title=f"[ok]✔ {command.path}[/ok]", border_style="green"))
    for diagnostic in summary.diagnostics:
        style = {"warning": "warn", "error": "bad"}.get(diagnostic.level, "dim")
        err.print(f"[{style}]{diagnostic.level:7}[/{style}] {diagnostic.code}: {diagnostic.message}")
    out.print(
        Panel(
            Syntax(summary.preview, "markdown", theme="ansi_dark", word_wrap=True),
            title="document.md (preview)",
            border_style="dim",
        )
    )


def _render_problem(title: str, exc: CliError, style: str) -> None:
    body = exc.message + (f"\n\n[dim]{exc.hint}[/dim]" if exc.hint else "")
    err.print(Panel(body, title=f"[{style}]{title}[/{style}]", border_style=style))


def status_table(statuses: list[PortStatus], *, group: str | None = None) -> Table:
    table = Table(title="Capability ports", header_style="accent", expand=False)
    for column in ("Capability", "Package", "State", "Detail"):
        table.add_column(column, overflow="fold")
    colors = {PortState.READY: "ok", PortState.UNAVAILABLE: "warn", PortState.NOT_YET_ADDED: "dim"}
    for s in statuses:
        if group and not s.port.capability.startswith(group + "."):
            continue
        detail = (
            s.port.summary
            if s.state is PortState.READY
            else "; ".join(f"{c.requirement.label} {c.detail}" for c in s.missing)
            if s.state is PortState.UNAVAILABLE
            else f"phase {s.port.phase}: {s.port.reason}"
        )
        table.add_row(
            s.port.capability, s.port.package, f"[{colors[s.state]}]{s.state.value}[/{colors[s.state]}]", detail
        )
    return table
