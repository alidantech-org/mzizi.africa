"""Scripted browser actions (YAML or JSON), run against any adapter."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated, Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.models import StepResult


class Step(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Goto(Step):
    do: Literal["goto"]
    url: str


class Click(Step):
    do: Literal["click"]
    target: str  # a CSS selector, or `text=Visible label`


class Fill(Step):
    do: Literal["fill"]
    target: str
    text: str


class Press(Step):
    do: Literal["press"]
    key: str


class Scroll(Step):
    do: Literal["scroll"]
    to: Literal["bottom", "top"] = "bottom"
    until_stable: bool = True


class Wait(Step):
    do: Literal["wait"]
    seconds: float | None = None
    target: str | None = None


class Screenshot(Step):
    do: Literal["screenshot"]
    name: str = "screenshot"
    full_page: bool = True


class SaveHtml(Step):
    do: Literal["save_html"]
    name: str = "page"


class Links(Step):
    do: Literal["links"]


type Action = Annotated[
    Goto | Click | Fill | Press | Scroll | Wait | Screenshot | SaveHtml | Links, Field(discriminator="do")
]
_ACTIONS = TypeAdapter(list[Action])


def parse_actions(text: str) -> list[Action]:
    """The parsing boundary for action scripts."""
    return _ACTIONS.validate_python(yaml.safe_load(text))


def run_actions(session: BrowserSession, steps: list[Action], out_dir: Path) -> list[StepResult]:
    """Runs the steps in order and stops at the first failure."""
    out_dir.mkdir(parents=True, exist_ok=True)
    results: list[StepResult] = []
    for index, step in enumerate(steps, start=1):
        try:
            detail = _do(session, step, out_dir, index)
        except Exception as problem:
            results.append(
                StepResult(
                    step=step.do,
                    ok=False,
                    detail=f"{type(problem).__name__}: {str(problem)[:150]}",
                    url=session.page_state().final_url,
                )
            )
            break
        results.append(StepResult(step=step.do, ok=True, detail=detail, url=session.page_state().final_url))
    return results


def _do(session: BrowserSession, step: Action, out_dir: Path, index: int) -> str:
    match step:
        case Goto():
            page = session.goto(step.url)
            return f"status {page.status}" if not page.error else page.error
        case Click():
            session.click(step.target)
            return f"clicked {step.target!r}"
        case Fill():
            session.fill(step.target, step.text)
            return f"filled {step.target!r}"
        case Press():
            session.press(step.key)
            return f"pressed {step.key}"
        case Scroll():
            return f"scrolled to height {session.scroll(step.to == 'bottom', step.until_stable)}"
        case Wait():
            if step.target:
                session.wait_for(step.target)
                return f"found {step.target!r}"
            import time

            time.sleep(step.seconds or 1.0)
            return f"waited {step.seconds or 1.0}s"
        case Screenshot():
            return str(session.screenshot(f"{index:02d}-{step.name}", step.full_page).name)
        case SaveHtml():
            path = out_dir / f"{index:02d}-{step.name}.html"
            path.write_text(session.page_state().html, encoding="utf-8")
            return path.name
        case Links():
            return f"{len(session.links())} links on the page"
