"""Use the existing crawl operations in scratch and upload their outputs before checkpointing."""

import csv
from mimetypes import guess_type
from pathlib import Path
from shutil import rmtree
from threading import Event

from pydantic import TypeAdapter

from mzizi_crawler.shared.engine.state import CrawlState
from mzizi_crawler.shared.requests import CrawlRequest, WatchRequest
from mzizi_crawler.shared.sitestore import PageState
from mzizi_engine.config import CrawlerConfig
from mzizi_engine.runtime.assembly.crawler_settings import configure_acquisition
from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactProvenance,
    ArtifactRecord,
    RunDecision,
    RunRecord,
    StageReceipt,
)
from mzizi_engine.runtime.runs.control import RunCancelled
from mzizi_engine.runtime.runs.ledger import RunLedger
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_engine.runtime.runtime import EngineRuntime

_SITE_STATE = TypeAdapter(dict[str, PageState])


class StageUploader:
    def __init__(
        self,
        runtime: EngineRuntime,
        store: S3RunStore,
        ledger: RunLedger,
        workspace: Path,
        crawler: CrawlerConfig,
        stop: Event,
    ) -> None:
        self.runtime, self.store, self.ledger, self.workspace = runtime, store, ledger, workspace
        self.crawler, self.stop = crawler, stop

    def upload(self, run: RunRecord, index: int) -> None:
        receipt = self.store.read_receipt(run.run_id, index)
        if receipt is None:
            receipt = self._capture(run, index)
            self.store.write_receipt(run.run_id, receipt)
        else:
            self.store.verify_receipt(run.run_id, receipt)
        if receipt.index != index:
            raise ValueError("Stage upload receipt has the wrong index")
        for record in receipt.files:
            self.ledger.record_artifact(run.run_id, record)

    def _capture(self, run: RunRecord, index: int) -> StageReceipt:
        stage = run.spec.stages[index]
        if not isinstance(stage.params, CrawlRequest):
            raise ValueError("S3 workers can stage the existing crawler operations")
        folder = self.workspace / str(index)
        out = folder / "output"
        workspace = folder / "workspace"
        captured = folder / ".captured"
        if not captured.is_file():
            if folder.exists():
                rmtree(folder)
            out.mkdir(parents=True)
            configure_acquisition(self.crawler.model_copy(update={"dev_root": workspace}))
            params = stage.params.model_copy(update={"out_dir": str(out), "resume_from": "", "resume": False})
            self.runtime.call_validated(stage.operation, params)
            if self.stop.is_set():
                raise RunCancelled("Stopped before uploading stage evidence")
            captured.touch()
        prefix = f"artifacts/stage-{index:04d}"
        provenance = _page_provenance(out / "pages.csv", prefix)
        if isinstance(stage.params, WatchRequest):
            for state_file in (workspace / "websites").rglob("state.json"):
                states = _SITE_STATE.validate_json(state_file.read_bytes())
                for page in states.values():
                    if not page.html_file:
                        continue
                    raw = f"workspace/{page.html_file}"
                    provenance[raw] = (page.url, ())
                    if page.md_file:
                        provenance[f"workspace/{page.md_file}"] = (page.url, (f"{prefix}/{raw}",))
        records: list[ArtifactRecord] = []
        for path in sorted(folder.rglob("*")):
            if path.is_symlink() or path == captured or not path.is_file():
                continue
            if self.stop.is_set():
                raise RunCancelled("Stopped during stage upload")
            relative = path.relative_to(folder).as_posix()
            url, parents = provenance.get(relative, (None, ()))
            with path.open("rb") as stream:
                records.append(
                    self.store.put(
                        run.run_id,
                        f"{prefix}/{relative}",
                        stream,
                        ArtifactProvenance(
                            media_type=guess_type(path)[0] or "application/octet-stream",
                            stage=stage.operation,
                            source_url=url,
                            derived_from=parents,
                        ),
                    )
                )
        state = CrawlState.model_validate_json((out / "state.json").read_bytes())
        captured_urls = {page.original_url for page in state.pages} | {page.final_url for page in state.pages}
        decisions = tuple(
            RunDecision(
                source_url=item.url,
                fetched=item.allowed and item.url in captured_urls,
                reason=item.reason or ("capture recorded" if item.url in captured_urls else "no page capture recorded"),
            )
            for item in state.policy_audit
        )
        return StageReceipt(index=index, files=tuple(records), decisions=decisions)


def _page_provenance(path: Path, prefix: str) -> dict[str, tuple[str | None, tuple[str, ...]]]:
    found: dict[str, tuple[str | None, tuple[str, ...]]] = {}
    if not path.is_file():
        return found
    with path.open(encoding="utf-8", newline="") as stream:
        for entry in csv.DictReader(stream):
            url = entry.get("final_url") or None
            raw = entry.get("raw_file")
            markdown = entry.get("markdown_file")
            if raw and (path.parent / raw).is_file():
                found[f"output/{raw}"] = (url, ())
                if markdown:
                    found[f"output/{markdown}"] = (url, (f"{prefix}/output/{raw}",))
    return found
