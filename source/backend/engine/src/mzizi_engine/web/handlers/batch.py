"""Many sites at once, losing nothing: a worker pool runs one `site watch` per site in its own process.

Each site is its own folder, tab and Mongo records, and one site is never run twice at the same time, so sites do not
compete. State is saved after every pass (`.dev/batches/<name>/`), so a stopped batch resumes where it was. A pass has a
time budget that stops fetching gracefully and still saves, converts and downloads; a site that stops at its budget gets
another pass (saved pages are free), until it completes, stops growing, or reaches `max_passes`.
"""

from __future__ import annotations

import json
import queue
import signal
import subprocess
import sys
import threading
import time
from datetime import UTC, datetime
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_engine.layout import DevLayout, host_of
from mzizi_engine.sitestore import atomic_write
from mzizi_engine.web.requests import BatchRequest

RESULT_TAIL = 400
BLOCKED_WORDS = ("http_403", "http_401", "captcha", "challenge", "block_notice")


class SiteState(BaseModel):
    model_config = ConfigDict(extra="ignore")

    url: str
    passes: int = 0
    done: bool = False
    complete: bool = False
    last_new: int = -1
    pages: int = 0
    note: str = ""


class BatchReport(BaseModel):
    name: str
    folder: str
    sites: int
    done: int
    pending: tuple[str, ...] = ()


def _read_sites(path: Path) -> list[str]:
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")]


def _command(request: BatchRequest, url: str) -> list[str]:
    args = [
        "site", "watch", url, "--max-pages", str(request.max_pages), "--max-depth", str(request.max_depth),
        "--delay", str(request.delay), "--max-list-pages", str(request.max_list_pages),
        "--max-seconds", str(request.max_seconds), "--download-limit", str(request.download_limit),
    ]
    return [sys.executable, "-c", "from mzizi_engine.devcli.app import main; main()", "--no-input", "--json", *args]


def _parse(output: str) -> dict:
    """The JSON report a `site watch` prints (it starts at a line that is just `{`); empty when the run failed."""
    start = output.rfind("\n{\n")
    start = start + 1 if start != -1 else (0 if output.startswith("{\n") else -1)
    if start == -1:
        return {}
    try:
        return json.loads(output[start:])
    except json.JSONDecodeError:
        return {}


def _requeue_interrupted_downloads() -> int:
    from mzizi_engine.activity import open_activity

    activity = open_activity()
    if activity is None:
        return 0
    stuck = activity.get("download_queue", {"state": "downloading"})
    activity.put("download_queue", [{**row, "state": "queued"} for row in stuck])
    return len(stuck)


def run_batch(request: BatchRequest) -> BatchReport:
    layout = DevLayout.locate()
    folder = layout.root / "batches" / request.name
    folder.mkdir(parents=True, exist_ok=True)
    state_file, log_file = folder / "state.json", folder / "log.jsonl"
    urls = _read_sites(Path(request.file))
    states: dict[str, SiteState] = {}
    if state_file.is_file():
        for host, raw in json.loads(state_file.read_text(encoding="utf-8")).items():
            states[host] = SiteState.model_validate(raw)
    for url in urls:
        states.setdefault(host_of(url), SiteState(url=url))
    _requeue_interrupted_downloads()  # nothing is running now: files left "downloading" by a killed run go back in the queue
    lock = threading.Lock()
    stop = threading.Event()
    children: set[subprocess.Popen[str]] = set()

    def save() -> None:
        atomic_write(state_file, json.dumps({h: s.model_dump() for h, s in states.items()}, indent=1).encode("utf-8"))

    def log(entry: dict) -> None:
        with lock, log_file.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps({"at": datetime.now(UTC).isoformat(timespec="seconds"), **entry}) + "\n")

    def request_stop(*_: object) -> None:  # stop starting sites; running ones are told to finish and save
        stop.set()
        for child in list(children):
            child.terminate()

    if threading.current_thread() is threading.main_thread():
        signal.signal(signal.SIGTERM, request_stop)
        signal.signal(signal.SIGINT, request_stop)

    work: queue.Queue[str] = queue.Queue()
    for host, state in states.items():
        if not state.done and state.passes < request.max_passes:
            work.put(host)

    def run_pass(host: str) -> None:
        state = states[host]
        started = time.monotonic()
        process = subprocess.Popen(  # noqa: S603 - our own interpreter and arguments
            _command(request, state.url), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
        )
        children.add(process)
        output, _ = process.communicate()
        children.discard(process)
        passes = folder / "passes"
        passes.mkdir(exist_ok=True)
        atomic_write(passes / f"{host}-pass{state.passes + 1}.log", output.encode("utf-8", errors="replace"))
        report = _parse(output)
        seconds = int(time.monotonic() - started)
        with lock:
            state.passes += 1
            if report:
                new = int(report.get("new", 0)) + int(report.get("changed", 0))
                complete = bool(report.get("complete"))
                state.complete, state.pages, state.note = complete, int(report.get("pages_visited", 0)), ""
                # done: the whole site was reached, or a pass found nothing new (the budget is not the limit any more)
                state.done = complete or (state.passes > 1 and new == 0 and state.last_new == 0)
                stopped = str(report.get("stopped", "")).lower()
                if any(word in stopped for word in BLOCKED_WORDS):  # the site refuses us: never retried, never worked around
                    state.done, state.note = True, f"blocked by the site: {stopped[:120]}"
                state.last_new = new
            else:
                state.note = output[-RESULT_TAIL:].replace("\n", " ")
            save()
        log({
            "host": host, "pass": state.passes, "exit": process.returncode, "seconds": seconds, "done": state.done,
            **{k: report.get(k) for k in ("pages_visited", "new", "changed", "fresh", "complete", "files_hunted",
                                           "files_downloaded", "downloads_failed", "markdown_converted", "stopped")},
            "error": state.note,
        })
        if not state.done and state.passes < request.max_passes and not stop.is_set():
            work.put(host)  # another pass, after the sites not yet visited

    def worker() -> None:
        while not stop.is_set():
            try:
                host = work.get(timeout=2)
            except queue.Empty:
                if not any(c.poll() is None for c in children) and work.empty():
                    return
                continue
            try:
                run_pass(host)
            except Exception as problem:  # a failure on one site never takes the batch down
                log({"host": host, "error": f"{type(problem).__name__}: {problem}"})

    threads = [threading.Thread(target=worker, name=f"batch-{n}", daemon=True) for n in range(request.workers)]
    for thread in threads:
        thread.start()
    while any(t.is_alive() for t in threads):
        time.sleep(1)
    save()
    pending = tuple(h for h, s in states.items() if not s.done)
    return BatchReport(name=request.name, folder=str(folder), sites=len(states), done=len(states) - len(pending), pending=pending)
