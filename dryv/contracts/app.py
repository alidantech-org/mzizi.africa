"""Mzizi Dryv application: composes the shared group and each domain group."""

from __future__ import annotations

from dryv_author import dryv

from geography import geo
from shared import shared

app = dryv.app("mzizi").groups(shared, geo)
