"""mzizi-engine: serve the operational API, list exposed operations or check settings."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from uuid import UUID

from mzizi_engine.runtime.assembly import build_default_runtime


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    from mzizi_engine.config import EngineConfig

    parser = argparse.ArgumentParser(prog="mzizi-engine")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("serve", help="run the API (ENGINE_HOST/ENGINE_PORT, default 127.0.0.1:8800)")
    sub.add_parser("capabilities", help="print the operations the runtime exposes")
    sub.add_parser("check", help="validate settings")
    worker = sub.add_parser("worker", help="execute a leased run")
    worker.add_argument("--run", type=UUID, required=True)
    worker.add_argument("--lease", type=UUID)
    run_job = sub.add_parser("run-job", help="run a job spec now, in this terminal, and print what each stage produced")
    run_job.add_argument("spec", type=Path)
    submit = sub.add_parser("submit-run", help="queue a run from a job spec")
    submit.add_argument("spec", type=Path)
    sub.add_parser("supervise", help="admit and supervise queued runs")
    for command in ("show-run", "cancel-run"):
        status = sub.add_parser(command, help="inspect or cancel a queued or active run")
        status.add_argument("run_id", type=UUID)
    seal_parser = sub.add_parser("seal-run", help="verify and seal a completed run")
    seal_parser.add_argument("run_id", type=UUID)
    plan = sub.add_parser("plan-release", help="verify a sealed bundle and plan filesystem placement")
    plan.add_argument("run_id", type=UUID)
    plan.add_argument("placements", type=Path)
    release = sub.add_parser("release-run", help="promote a sealed run with a recorded approval")
    release.add_argument("run_id", type=UUID)
    release.add_argument("placements", type=Path)
    release.add_argument("--approval", type=Path, required=True)
    sub.add_parser("sweep-runs", help="remove expired temporary run objects and logs")
    publish = sub.add_parser("publish-schemas", help="upload source/schema files to the public object-store prefix")
    publish.add_argument("--dry-run", action="store_true", help="list what would be uploaded without connecting")
    publish.add_argument(
        "--prune", action="store_true", help="delete public schema objects no schema file produces any more"
    )
    seed = sub.add_parser("seed", help="load the seed CSVs into PostgreSQL (a dry run unless --apply)")
    seed.add_argument("--apply", action="store_true", help="write the changes; without it the run is rolled back")
    seed.add_argument("--root", type=Path, default=None, help="folder holding data/ (default: seed/)")
    files = sub.add_parser(
        "register-files",
        help="store the downloaded source files and seed CSVs and link their records (dry run unless --apply)",
    )
    files.add_argument("--apply", action="store_true", help="write to the object store and the database")
    files.add_argument("--root", type=Path, default=None, help="folder holding data/ (default: seed/)")
    args = parser.parse_args(argv)
    config = EngineConfig.load()
    if args.command == "register-files":
        from mzizi_engine.runtime.assembly.filesystem_operations import sync_source_files

        outcome = sync_source_files({"apply": args.apply, **({"seed_root": str(args.root)} if args.root else {})})
        print(json.dumps(outcome, indent=2))
        return 0 if outcome.get("ok") else 1
    if args.command == "seed":
        from mzizi_engine.persistence.postgres.connection import connect
        from mzizi_engine.persistence.postgres.seed_loader import load_seed, summarise
        from mzizi_manifest.shared.paths import SEED_ROOT

        with connect(config.require_postgres().url) as conn:
            outcome = load_seed(conn, args.root or SEED_ROOT, apply=args.apply)
        for problem in outcome.problems:
            print(f"error: {problem}", file=sys.stderr)
        if outcome.ok:
            print(summarise(outcome))
        return 0 if outcome.ok else 1
    if args.command == "publish-schemas":
        from mzizi_engine.runtime.assembly.schemas import publish_schemas

        results = publish_schemas(config, dry_run=args.dry_run, prune=args.prune)
        for item in results:
            print(item.model_dump_json())
        return 0 if all(item.public_matches is not False for item in results) else 1
    if args.command in ("seal-run", "plan-release", "release-run", "sweep-runs"):
        from mzizi_engine.runtime.assembly.release import ReleaseManifest, plan_release, release_run, seal, sweep
        from mzizi_engine.runtime.runs.contracts.records import ReleaseApproval

        if args.command == "sweep-runs":
            print(json.dumps({"swept": sweep(config)}))
        elif args.command == "seal-run":
            print(seal(args.run_id, config).model_dump_json())
        else:
            placements = ReleaseManifest.model_validate_json(args.placements.read_bytes())
            if args.command == "plan-release":
                print(plan_release(args.run_id, placements, config).model_dump_json())
            else:
                approval = ReleaseApproval.model_validate_json(args.approval.read_bytes())
                print(release_run(args.run_id, placements, approval, config).model_dump_json())
        return 0
    if args.command == "run-job":
        from mzizi_engine.runtime.assembly.run_operations import run_job_spec

        result = run_job_spec(args.spec.read_bytes(), config=config)
        for index, output in enumerate(result.outputs, start=1):
            print(f"stage {index}: " + json.dumps({k: v for k, v in output.items() if k not in ("changes", "files")}))
        print(f"run {result.record.run_id}: {result.record.state}")
        return 0 if result.record.state == "completed" else 1
    if args.command in ("worker", "submit-run", "supervise", "show-run", "cancel-run"):
        from mzizi_engine.runtime.assembly.workers import (
            execute_worker,
            read_worker_run,
            submit_worker_run,
            supervise_workers,
        )

        if args.command == "worker":
            return execute_worker(args.run, args.lease, config)
        if args.command == "supervise":
            supervise_workers(config)
            return 0
        if args.command == "submit-run":
            record = submit_worker_run(args.spec.read_bytes(), config)
        else:
            found = read_worker_run(args.run_id, config, cancel=args.command == "cancel-run")
            if found is None:
                parser.error("run not found")
            record = found
        print(
            json.dumps(
                {
                    "run_id": str(record.run_id),
                    "state": record.state,
                    "attempts": record.attempts,
                    "stages_completed": record.stages_completed,
                }
            )
        )
        return 0
    settings = config.server
    runtime = build_default_runtime(settings)
    if args.command == "capabilities":
        print(json.dumps([info.model_dump(mode="json") for info in runtime.operations.describe()], indent=2))
        return 0
    settings.check()
    if args.command == "check":
        print(
            json.dumps({"host": settings.host, "port": settings.port, "auth": settings.auth, "store": settings.store})
        )
        return 0
    import uvicorn

    from mzizi_engine.runtime.http.app import create_app

    from mzizi_engine.runtime.http.logging import log_config

    uvicorn.run(
        create_app(settings, runtime=runtime), host=settings.host, port=settings.port, log_config=log_config()
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
