"""Interactive prompts used instead of "missing argument" errors.

Prompts only run on a real terminal. Without one (pipes, CI, `--no-input`) a missing value is a clear usage error.
"""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import urlparse

import questionary

from mzizi_engine.devcli.catalog import Arg, ArgKind
from mzizi_engine.devcli.errors import Cancelled, CliError, MissingArgument
from mzizi_engine.devcli.pathsearch import build_index
from mzizi_engine.devcli.theme import err, log
from mzizi_engine.devcli.types import ArgValue
from mzizi_engine.devcli.workspace import Workspace

_MAX_ATTEMPTS = 3


def is_interactive(no_input: bool) -> bool:
    return not no_input and sys.stdin.isatty() and sys.stdout.isatty()


def _answer(value: str | int | bool | None) -> str | int | bool:
    if value is None:
        raise Cancelled("cancelled")
    return value


class Prompter:
    def __init__(self, workspace: Workspace, *, interactive: bool, allow_outside: bool) -> None:
        self.workspace = workspace
        self.interactive = interactive
        self.allow_outside = allow_outside

    def resolve(self, arg: Arg, given: ArgValue) -> ArgValue:
        if given not in (None, "", False) or arg.kind is ArgKind.FLAG:
            return self._validate(arg, given)
        if arg.optional or (arg.default is not None and not self.interactive):
            return arg.default
        if not self.interactive:
            raise MissingArgument(
                f"missing required value --{arg.name} ({arg.help})",
                hint="run on a terminal to be asked for it, or pass the option explicitly",
            )
        return self._ask(arg)

    def _validate(self, arg: Arg, value: ArgValue) -> ArgValue:
        if arg.kind in (ArgKind.FILE, ArgKind.FOLDER) and isinstance(value, str):
            return str(self._check_path(arg, value))
        if arg.kind is ArgKind.URL and isinstance(value, str):
            problem = _url_problem(value)
            if problem:
                raise CliError(f"--{arg.name}: {problem}")
            self.workspace.remember_url(value)
        if arg.kind is ArgKind.CHOICE and value not in arg.choices:
            raise CliError(f"--{arg.name} must be one of: {', '.join(arg.choices)}")
        return value

    def _check_path(self, arg: Arg, raw: str) -> Path:
        path = self._expand(raw)
        wanted_dir = arg.kind is ArgKind.FOLDER
        if not (path.is_dir() if wanted_dir else path.is_file()):
            index = build_index(self._roots(), want_dirs=wanted_dir, want_files=not wanted_dir, suffixes=arg.suffixes)
            near = index.suggest(raw)
            raise CliError(
                f"--{arg.name}: {raw!r} is not an existing {'folder' if wanted_dir else 'file'}",
                hint="did you mean: " + ", ".join(near) if near else None,
            )
        if not self.allow_outside and not self.workspace.trusted(path) and not self._confirm_outside(path):
            raise CliError(
                f"{path} is outside {self.workspace.root}",
                hint="copy it into .dev/inputs or pass --allow-outside-inputs",
            )
        return path

    def _confirm_outside(self, path: Path) -> bool:
        if not self.interactive:
            return False
        return bool(
            _answer(questionary.confirm(f"{path} is outside the dev workspace. Use it anyway?", default=False).ask())
        )

    def _expand(self, raw: str) -> Path:
        path = Path(raw).expanduser()
        if path.is_absolute() or path.exists():
            return path.resolve()
        inside = self.workspace.inputs / raw
        return inside.resolve() if inside.exists() else path.resolve()

    def _roots(self) -> list[Path]:
        return [self.workspace.inputs, self.workspace.runs, Path.cwd()]

    def _ask(self, arg: Arg) -> ArgValue:
        match arg.kind:
            case ArgKind.FILE | ArgKind.FOLDER:
                return self._ask_path(arg)
            case ArgKind.URL:
                return self._ask_url(arg)
            case ArgKind.CHOICE:
                default = str(arg.default) if arg.default is not None else None
                return str(
                    _answer(questionary.select(f"{arg.help}:", choices=list(arg.choices), default=default).ask())
                )
            case ArgKind.INT:
                text = str(
                    _answer(questionary.text(f"{arg.help}:", default=str(arg.default or ""), validate=_is_int).ask())
                )
                return int(text)
            case ArgKind.RUN:
                return self._ask_run(arg)
            case _:
                text = str(_answer(questionary.text(f"{arg.help}:", default=str(arg.default or "")).ask()))
                return text

    def _ask_run(self, arg: Arg) -> str:
        runs = [r.run_id for r in self.workspace.list_runs(15)]
        if not runs:
            return str(arg.default or "last")
        return str(_answer(questionary.select(f"{arg.help}:", choices=["last", *runs]).ask()))

    def _ask_url(self, arg: Arg) -> str:
        recent = self.workspace.recent_urls()
        for _ in range(_MAX_ATTEMPTS):
            text = str(_answer(_complete(f"{arg.help} (https://…):", recent))).strip()
            problem = _url_problem(text)
            if problem is None:
                self.workspace.remember_url(text)
                return text
            err.print(f"[warn]{problem}[/warn]")
        raise MissingArgument(f"no valid --{arg.name} given")

    def _ask_path(self, arg: Arg) -> str:
        wanted_dir = arg.kind is ArgKind.FOLDER
        with err.status("[info]Looking for files…", spinner="dots"):
            index = build_index(self._roots(), want_dirs=wanted_dir, want_files=not wanted_dir, suffixes=arg.suffixes)
        note = f"scanned {index.scanned} entries in {index.elapsed * 1000:.0f} ms" + (
            " (stopped early: type a path or narrow it down)" if index.truncated else ""
        )
        log.debug("path search for --%s: %s, %d matches", arg.name, note, len(index.candidates))
        err.print(f"[dim]{len(index.candidates)} candidates, {note}. Type to filter, or enter any path.[/dim]")
        recent_first = sorted(index.candidates, key=lambda c: -c.mtime)
        labels = [c.label for c in recent_first]
        for _ in range(_MAX_ATTEMPTS):
            text = str(_answer(_complete(f"{arg.help}:", labels, filesystem=True))).strip()
            chosen = index.resolve(text)
            path = chosen if chosen is not None else self._expand(text)
            if path.is_dir() if wanted_dir else path.is_file():
                return str(path)
            near = index.suggest(text)
            err.print(f"[warn]{text!r} not found.[/warn] " + (f"Did you mean: {', '.join(near)}" if near else ""))
        raise MissingArgument(f"no valid --{arg.name} given")


def _complete(message: str, choices: list[str], *, filesystem: bool = False) -> str | None:
    """Autocomplete over known choices; with none (questionary refuses an empty list), fall back to lazy path or free text."""
    if choices:
        answer: object = questionary.autocomplete(message, choices=choices, match_middle=True).ask()
    elif filesystem:
        err.print("[dim]Nothing matching found in the dev folders or here; type a path (Tab completes).[/dim]")
        answer = questionary.path(message).ask()
    else:
        answer = questionary.text(message).ask()
    return answer if isinstance(answer, str) else None


def _url_problem(value: str) -> str | None:
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return f"{value!r} is not an http(s) URL"
    return None


def _is_int(value: str) -> bool | str:
    return True if value.strip().lstrip("-").isdigit() else "enter a whole number"
