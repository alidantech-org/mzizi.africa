"""Detached download process: `python -m mzizi_engine.web.worker URL DEST AGENT RATE ALLOW_PRIVATE`."""

from __future__ import annotations

import sys
from pathlib import Path

from mzizi_fetch.web.download import Downloader, DownloadError, DownloadPolicy


def main(argv: list[str]) -> int:
    url, destination, agent, rate, private = argv
    downloader = Downloader(
        Path(destination), agent, DownloadPolicy(limit_rate=int(rate), allow_private=private == "1")
    )
    try:
        print(downloader.download(url).model_dump_json())
        return 0
    except DownloadError as problem:
        print(f"failed [{problem.kind}]: {problem}", file=sys.stderr)
        return 1
    finally:
        downloader.close()


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
