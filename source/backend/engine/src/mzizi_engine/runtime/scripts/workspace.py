"""Own one local script worker and its restricted, durable request and result records."""

from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime
from fcntl import LOCK_EX, LOCK_NB, flock
from hashlib import sha256
from os import fsync, replace
from pathlib import Path
from shutil import rmtree
from tempfile import NamedTemporaryFile, TemporaryDirectory
from threading import Event, Lock
from uuid import UUID, uuid4

from mzizi_engine.runtime.contracts.script_job import ScriptJob, ScriptRecord, ScriptRequest, ScriptStatus
from mzizi_engine.runtime.runs.artifacts import ArtifactAccess, ArtifactReader, ArtifactReadError
from mzizi_engine.runtime.scripts.docker_runner import (
    ScriptResult,
    ScriptRunnerError,
    remove_container,
    run_script,
    verify_image,
)

MAX_INPUT_BYTES = 16 * 1024 * 1024


class ScriptWorkspace:
    def __init__(
        self,
        root: Path,
        image_id: str,
        reader: ArtifactReader,
        *,
        run: Callable[[UUID, str, Path, ScriptRequest, Event], ScriptResult] = run_script,
        remove: Callable[[UUID], None] = remove_container,
        verify: Callable[[str], None] = verify_image,
    ) -> None:
        verify(image_id)
        self._root, self._image, self._reader = root, image_id, reader
        self._run, self._remove = run, remove
        self._guard = Lock()
        self._active: tuple[UUID, Event] | None = None
        self._stopping = False
        root.mkdir(parents=True, exist_ok=True, mode=0o700)
        root.chmod(0o700)
        self._lease = (root / ".lock").open("a")
        try:
            flock(self._lease, LOCK_EX | LOCK_NB)
            self._recover()
        except BaseException:
            self._lease.close()
            raise
        self._worker = ThreadPoolExecutor(max_workers=1, thread_name_prefix="script-workspace")

    def _path(self, job_id: UUID) -> Path:
        return self._root / f"{job_id}.json"

    def _persist(self, path: Path, data: bytes) -> None:
        with NamedTemporaryFile(mode="wb", dir=self._root, delete=False) as file:
            temporary = Path(file.name)
            try:
                file.write(data)
                file.flush()
                fsync(file.fileno())
                replace(temporary, path)
            finally:
                temporary.unlink(missing_ok=True)

    def _write(self, record: ScriptRecord) -> None:
        self._persist(self._path(record.job.id), record.model_dump_json().encode())

    def _read(self, job_id: UUID, access: ArtifactAccess) -> ScriptRecord:
        try:
            record = ScriptRecord.model_validate_json(self._path(job_id).read_bytes())
        except FileNotFoundError as error:
            raise ArtifactReadError(404, "Script job not found") from error
        if not access.service and (access.account_id is None or record.account_id != access.account_id):
            raise ArtifactReadError(403, "Script job access refused")
        return record

    def _recover(self) -> None:
        for path in self._root.glob("*.json"):
            record = ScriptRecord.model_validate_json(path.read_bytes())
            if record.job.status in (ScriptStatus.RUNNING, ScriptStatus.INTERRUPTED):
                self._remove(record.job.id)
                self._write(
                    record.model_copy(
                        update={
                            "job": record.job.model_copy(
                                update={
                                    "status": ScriptStatus.FAILED,
                                    "finished_at": datetime.now(UTC),
                                    "error": "The engine restarted before the script finished",
                                }
                            )
                        }
                    )
                )

        for workspace in self._root.glob("work-*"):
            if workspace.is_dir() and not workspace.is_symlink():
                rmtree(workspace)

    def submit(self, request: ScriptRequest, access: ArtifactAccess) -> ScriptJob:
        with self._guard:
            if self._stopping:
                raise ArtifactReadError(503, "Script workspace is unavailable")
            if self._active is not None:
                raise ArtifactReadError(409, "This engine already has a running script")
            job = ScriptJob(
                id=uuid4(),
                status=ScriptStatus.RUNNING,
                request=request,
                script_sha256=sha256(request.script.encode()).hexdigest(),
                image_id=self._image,
                started_at=datetime.now(UTC),
            )
            record = ScriptRecord(account_id=access.account_id, job=job)
            self._write(record)
            cancel = Event()
            self._active = (job.id, cancel)
            self._worker.submit(self._execute, record, access, cancel)
            return job

    def get(self, job_id: UUID, access: ArtifactAccess) -> ScriptJob:
        return self._read(job_id, access).job

    def cancel(self, job_id: UUID, access: ArtifactAccess) -> ScriptJob:
        with self._guard:
            record = self._read(job_id, access)
            if self._active is None or self._active[0] != job_id:
                return record.job
            self._active[1].set()
            job = record.job.model_copy(update={"cancel_requested": True})
            self._write(record.model_copy(update={"job": job}))
            return job

    def _execute(self, record: ScriptRecord, access: ArtifactAccess, cancelled: Event) -> None:
        job = record.job
        result = ScriptResult(ScriptStatus.FAILED)
        error: str | None = None
        try:
            with TemporaryDirectory(prefix="work-", dir=self._root) as directory:
                workspace = Path(directory)
                workspace.chmod(0o755)
                (workspace / "program").write_text(job.request.script, encoding="utf-8")
                (workspace / "program").chmod(0o444)
                remaining = MAX_INPUT_BYTES
                for index, ref in enumerate(job.request.inputs):
                    if cancelled.is_set():
                        break
                    _, data = self._reader.read(ref, access, max_bytes=remaining)
                    path = workspace / f"input-{index}"
                    path.write_bytes(data)
                    path.chmod(0o444)
                    remaining -= len(data)
                result = self._run(job.id, self._image, workspace, job.request, cancelled)
        except ArtifactReadError as problem:
            error = str(problem)
        except (ScriptRunnerError, OSError):
            result = ScriptResult(ScriptStatus.INTERRUPTED)
            error = "The isolated runner failed. Restart the engine to recover this workspace."
        except Exception:
            error = "The script job could not be completed"
        with self._guard:
            try:
                current = self._read(job.id, access)
                final = current.job.model_copy(
                    update={
                        "status": result.status,
                        "finished_at": datetime.now(UTC),
                        "exit_code": result.exit_code,
                        "stdout": result.stdout.decode("utf-8", errors="replace"),
                        "stderr": result.stderr.decode("utf-8", errors="replace"),
                        "stdout_sha256": sha256(result.stdout).hexdigest(),
                        "stderr_sha256": sha256(result.stderr).hexdigest(),
                        "error": error,
                    }
                )
                self._persist(self._root / f"{job.id}.stdout", result.stdout)
                self._persist(self._root / f"{job.id}.stderr", result.stderr)
                self._write(current.model_copy(update={"job": final}))
                self._stopping = self._stopping or result.status is ScriptStatus.INTERRUPTED
            except Exception:
                self._stopping = True
                raise
            finally:
                self._active = None

    def close(self) -> None:
        with self._guard:
            self._stopping = True
            if self._active is not None:
                self._active[1].set()
        try:
            self._worker.shutdown(wait=True)
        finally:
            self._lease.close()
