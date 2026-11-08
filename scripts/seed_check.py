"""Thin entry point: uv run scripts/seed_check.py check|lock|report|validate-structure (see source/packages/manifest)."""
import sys

from mzizi_manifest.cli import main

sys.exit(main())
