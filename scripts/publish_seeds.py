"""Thin entry point: uv run scripts/publish_seeds.py [--apply --store s3] (see source/packages/filesystem)."""
import sys

from mzizi_filesystem.cli import main

sys.exit(main())
