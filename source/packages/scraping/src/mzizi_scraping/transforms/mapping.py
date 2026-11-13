"""Transforms that map a value through a table or to a reference by natural key."""

from __future__ import annotations

from mzizi_scraping.core import JsonValue, ScrapeError


def lookup(value: JsonValue, table: JsonValue = None) -> JsonValue:
    """Maps a value through an inline table; an unmapped value is an error, never a guess."""
    if not isinstance(table, dict):
        raise ScrapeError("lookup needs a table")
    key = value if isinstance(value, str) else str(value)
    if key not in table:
        raise ScrapeError(f"no mapping for {value!r}")
    return table[key]


def reference(value: JsonValue, spec: JsonValue = None) -> JsonValue:
    """A reference to another record by natural key, resolved to an id by the database engine at promotion."""
    if value in (None, ""):
        return None
    if not isinstance(spec, dict) or "kind" not in spec or "field" not in spec:
        raise ScrapeError("ref needs {kind: schema.table, field: property}")
    return {"$ref": {"kind": spec["kind"], "where": {str(spec["field"]): value}}}
