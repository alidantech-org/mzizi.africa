"""Thin entry point: uv run scripts/db.py init|reset|status|bootstrap-admin (see source/packages/database)."""

import sys

from mzizi_database.cli import main

sys.exit(main())
