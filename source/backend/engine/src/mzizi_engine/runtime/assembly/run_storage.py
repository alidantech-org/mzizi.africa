"""Select live or local run storage and isolate each subprocess's local scratch files."""

from collections.abc import Iterator
from contextlib import contextmanager, suppress
from fcntl import LOCK_EX, LOCK_NB, flock
from pathlib import Path
from shutil import rmtree
from uuid import UUID

from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.runtime.assembly.run_operations import local_run_root
from mzizi_engine.runtime.runs.contracts.records import RunState
from mzizi_engine.runtime.runs.ledger import RunLedger
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_filesystem import S3ObjectStore, S3Settings


def run_objects(config: EngineConfig) -> S3ObjectStore:
    source = config.require_s3()
    if source is None or config.memory_store:
        raise ConfigError("S3 runs require live S3 settings")
    return S3ObjectStore(
        S3Settings(
            endpoint=source.endpoint,
            public_endpoint=source.public_endpoint,
            bucket=source.bucket,
            access_key=source.access_key,
            secret_key=source.secret_key,
            region=source.region,
        ),
        config.filesystem.protected_prefixes if config.filesystem else (),
    )


def run_store(config: EngineConfig) -> S3RunStore | LocalRunStore:
    root = local_run_root(config)
    if config.runs.store == "s3":
        return S3RunStore(run_objects(config), root / ".s3")
    return LocalRunStore(root)


def scratch_root(config: EngineConfig) -> Path:
    return (config.runs.scratch_root or local_run_root(config)) / "worker-scratch"


@contextmanager
def scratch_space(root: Path, run_id: UUID) -> Iterator[Path]:
    root.mkdir(parents=True, exist_ok=True)
    path = root / str(run_id)
    with (root / f"{run_id}.lock").open("a") as lock:
        flock(lock, LOCK_EX | LOCK_NB)
        if path.is_symlink():
            raise ValueError("A worker scratch directory cannot be a symlink")
        path.mkdir(exist_ok=True)
        try:
            yield path
        finally:
            rmtree(path)


def sweep_scratch(root: Path, ledger: RunLedger) -> None:
    if not root.is_dir():
        return
    for directory in root.iterdir():
        if directory.is_symlink() or not directory.is_dir():
            continue
        try:
            run_id = UUID(directory.name)
        except ValueError:
            continue
        if directory.name != str(run_id):
            continue
        record = ledger.read(run_id)
        if record and record.state in {RunState.QUEUED, RunState.LEASED, RunState.WORKING}:
            continue
        with (root / f"{run_id}.lock").open("a") as lock, suppress(BlockingIOError):
            flock(lock, LOCK_EX | LOCK_NB)
            rmtree(directory)
