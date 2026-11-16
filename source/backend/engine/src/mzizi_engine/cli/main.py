"""mzizi-engine: serve the operational API, list exposed operations or check settings."""

from __future__ import annotations

import argparse
import json
import sys

from mzizi_engine.runtime.assembly import build_default_runtime


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    from mzizi_engine.runtime.http.settings import Settings

    parser = argparse.ArgumentParser(prog="mzizi-engine")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("serve", help="run the API (ENGINE_HOST/ENGINE_PORT, default 127.0.0.1:8760)")
    sub.add_parser("capabilities", help="print the operations the runtime exposes")
    sub.add_parser("check", help="validate settings")
    args = parser.parse_args(argv)
    settings = Settings.from_env()
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

    uvicorn.run(create_app(settings, runtime=runtime), host=settings.host, port=settings.port)
    return 0


if __name__ == "__main__":
    sys.exit(main())
