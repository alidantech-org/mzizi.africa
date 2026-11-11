"""Thin entry point: uv run scripts/filesystem.py sync|tree|cleanup-uploads|transition-access|live-check (see source/packages/filesystem)."""

import sys

from mzizi_filesystem.cli import main

sys.exit(main())
