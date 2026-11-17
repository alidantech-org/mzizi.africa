"""Bind crawler coverage replay to the operator-configured engine input workspace."""

from pathlib import Path

from pydantic import Field

from mzizi_crawler import CrawlerOrchestrator, ReplayReport, ReplaySuite
from mzizi_engine.config import EngineConfig
from mzizi_engine.runtime.contracts.base import Frozen


class WorkspaceReplayRequest(Frozen):
    expectations: str = Field(min_length=1)


def _workspace_file(root: Path, base: Path, reference: str) -> Path:
    name = Path(reference)
    if name.is_absolute():
        raise ValueError("Replay requires a relative workspace reference")
    target = (base / name).resolve()
    if root not in target.parents or target.is_dir():
        raise ValueError("Replay reference must identify a file inside the engine input workspace")
    if target.exists() and not target.is_file():
        raise ValueError("Replay reference must identify a regular file")
    return target


def replay_workspace(request: WorkspaceReplayRequest) -> ReplayReport:
    root = EngineConfig.load().crawler.input_root
    if root is None:
        raise ValueError("Set ENGINE_INPUT_ROOT to the operator-controlled replay workspace")
    manifest = _workspace_file(root, root, request.expectations)
    suite = ReplaySuite.model_validate_json(manifest.read_bytes())

    def locate(reference: str) -> str:
        return str(_workspace_file(root, manifest.parent, reference))

    # Resolve every reference before reading any capture bytes.
    views = tuple(
        view.model_copy(update={"html": locate(view.html), "media": locate(view.media) if view.media else ""})
        for view in suite.views
    )
    pdfs = tuple(pdf.model_copy(update={"pdf": locate(pdf.pdf)}) for pdf in suite.pdfs)
    scoped = ReplaySuite(version=suite.version, views=views, pdfs=pdfs)
    return CrawlerOrchestrator.replay.evaluate_replay(scoped, manifest.parent)
