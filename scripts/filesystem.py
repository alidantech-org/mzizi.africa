"""Thin entry point: uv run scripts/filesystem.py sync|tree|cleanup-uploads|transition-access|live-check (see source/backend/engine/src/mzizi_engine/filesystem)."""

import sys

from mzizi_engine.filesystem.cli import main

sys.exit(main())
