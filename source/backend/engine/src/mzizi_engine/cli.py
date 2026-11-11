"""mzizi-engine: serve the operational API, list capabilities, check settings."""

from __future__ import annotations

import argparse
import json
import sys

from .capabilities import build_default_registry
from .config import Settings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mzizi-engine")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("serve", help="run the API (ENGINE_HOST/ENGINE_PORT, default 127.0.0.1:8760)")
    sub.add_parser("capabilities", help="print the registered capabilities")
    sub.add_parser("check", help="validate settings")
    args = parser.parse_args(argv)
    if args.command == "capabilities":
        print(json.dumps(build_default_registry().describe(), indent=2))
        return 0
    settings = Settings.from_env()
    settings.check()
    if args.command == "check":
        print(
            json.dumps({"host": settings.host, "port": settings.port, "auth": settings.auth, "store": settings.store})
        )
        return 0
    import uvicorn

    from .app import create_app

    uvicorn.run(create_app(settings), host=settings.host, port=settings.port)
    return 0


if __name__ == "__main__":
    sys.exit(main())
