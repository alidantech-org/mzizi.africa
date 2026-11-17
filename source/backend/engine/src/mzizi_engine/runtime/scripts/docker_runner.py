"""Run bounded data transformations in an explicitly configured local Docker container."""

from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from os import read
from pathlib import Path
from selectors import EVENT_READ, DefaultSelector
from subprocess import PIPE, Popen, TimeoutExpired, run
from threading import Event
from time import monotonic
from typing import IO, cast
from uuid import UUID

from mzizi_engine.runtime.contracts.script_job import ScriptRequest, ScriptStatus

MAX_OUTPUT_BYTES = 256 * 1024
_DOCKER = ("docker", "--host", "unix:///var/run/docker.sock")
_WAIT_SECONDS = 10
_READ_BYTES = 16384


class ScriptRunnerError(RuntimeError):
    """A script could not be isolated or its container could not be reaped."""


@dataclass(frozen=True)
class ScriptResult:
    status: ScriptStatus
    stdout: bytes = b""
    stderr: bytes = b""
    exit_code: int | None = None


def _name(job_id: UUID) -> str:
    return f"mzizi-script-{job_id.hex}"


def remove_container(job_id: UUID) -> None:
    try:
        result = run(
            (*_DOCKER, "rm", "--force", "--volumes", _name(job_id)),
            capture_output=True,
            check=False,
            timeout=_WAIT_SECONDS,
        )
    except (OSError, TimeoutExpired) as error:
        raise ScriptRunnerError("Local script container cleanup did not complete") from error
    if result.returncode and b"No such container" not in result.stderr:
        raise ScriptRunnerError("Local script container cleanup failed")


def verify_image(image_id: str) -> None:
    prefix, _, digest = image_id.partition(":")
    try:
        valid = prefix == "sha256" and len(digest) == 64 and bytes.fromhex(digest).hex() == digest
    except ValueError:
        valid = False
    if not valid:
        raise ScriptRunnerError("ENGINE_SCRIPT_IMAGE_ID must contain a local image's full sha256 ID")
    try:
        result = run(
            (*_DOCKER, "image", "inspect", "--format", "{{len .Config.Volumes}}", image_id),
            capture_output=True,
            check=False,
            timeout=_WAIT_SECONDS,
        )
    except (OSError, TimeoutExpired) as error:
        raise ScriptRunnerError("Cannot inspect the configured script image") from error
    if result.returncode or result.stdout.strip() != b"0":
        raise ScriptRunnerError("The configured script image must be local and declare no volumes")


@contextmanager
def _container(job_id: UUID, image_id: str, workspace: Path, language: str) -> Iterator[str]:
    name = _name(job_id)
    interpreter = ("python3", "-I", "-B", "-u") if language == "python" else ("bash", "--noprofile", "--norc")
    args = (
        *_DOCKER,
        "create",
        "--name",
        name,
        "--pull=never",
        "--network=none",
        "--read-only",
        "--cap-drop=ALL",
        "--security-opt=no-new-privileges",
        "--user=65534:65534",
        "--ipc=none",
        "--memory=256m",
        "--memory-swap=256m",
        "--cpus=1",
        "--pids-limit=32",
        "--ulimit=nofile=64:64",
        "--no-healthcheck",
        "--log-driver=none",
        "--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
        "--workdir=/tmp",
        "--mount",
        f"type=bind,src={workspace},dst=/workspace,readonly",
        "--entrypoint=/usr/bin/env",
        image_id,
        "-i",
        "PATH=/usr/local/bin:/usr/bin:/bin",
        "HOME=/tmp",
        "LANG=C.UTF-8",
        *interpreter,
        "/workspace/program",
    )
    try:
        create = run(args, capture_output=True, check=False, timeout=_WAIT_SECONDS)
        if create.returncode:
            raise ScriptRunnerError("Docker refused to create the isolated script container")
        yield name
    except (OSError, TimeoutExpired) as error:
        raise ScriptRunnerError("Cannot start the isolated script container") from error
    finally:
        remove_container(job_id)


def _capture(
    process: Popen[bytes],
    cancelled: Event,
    timeout_seconds: int,
) -> ScriptResult:
    assert process.stdout is not None and process.stderr is not None
    stdout, stderr = bytearray(), bytearray()
    pipes: tuple[tuple[IO[bytes], bytearray], ...] = ((process.stdout, stdout), (process.stderr, stderr))
    deadline = monotonic() + timeout_seconds
    with DefaultSelector() as selector:
        for pipe, log in pipes:
            selector.register(pipe, EVENT_READ, log)
        while selector.get_map():
            if cancelled.is_set():
                return ScriptResult(ScriptStatus.CANCELLED, bytes(stdout), bytes(stderr))
            if monotonic() >= deadline:
                return ScriptResult(ScriptStatus.TIMED_OUT, bytes(stdout), bytes(stderr))
            for key, _ in selector.select(timeout=0.05):
                data = read(key.fd, _READ_BYTES)
                if not data:
                    selector.unregister(key.fileobj)
                    continue
                log = cast(bytearray, key.data)
                available = MAX_OUTPUT_BYTES - len(stdout) - len(stderr)
                log.extend(data[:available])
                if len(data) > available:
                    return ScriptResult(ScriptStatus.OUTPUT_LIMIT, bytes(stdout), bytes(stderr))
    while (code := process.poll()) is None:
        if cancelled.wait(0.05):
            return ScriptResult(ScriptStatus.CANCELLED, bytes(stdout), bytes(stderr))
        if monotonic() >= deadline:
            return ScriptResult(ScriptStatus.TIMED_OUT, bytes(stdout), bytes(stderr))
    status = ScriptStatus.SUCCEEDED if code == 0 else ScriptStatus.FAILED
    return ScriptResult(status, bytes(stdout), bytes(stderr), code)


def run_script(job_id: UUID, image_id: str, workspace: Path, request: ScriptRequest, cancelled: Event) -> ScriptResult:
    if cancelled.is_set():
        return ScriptResult(ScriptStatus.CANCELLED)
    with _container(job_id, image_id, workspace, request.language) as name:
        if cancelled.is_set():
            return ScriptResult(ScriptStatus.CANCELLED)
        with Popen((*_DOCKER, "start", "--attach", name), stdout=PIPE, stderr=PIPE) as process:
            try:
                return _capture(process, cancelled, request.timeout_seconds)
            finally:
                if process.poll() is None:
                    process.kill()
