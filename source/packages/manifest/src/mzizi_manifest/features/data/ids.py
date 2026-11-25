"""Stable row ids: a seed row never carries an id; the loader derives it from the table and the natural key."""

from __future__ import annotations

from uuid import NAMESPACE_DNS, UUID, uuid5

#: The namespace of every seed id. Changing it changes every id, so it is fixed.
SEED_NAMESPACE = uuid5(NAMESPACE_DNS, "seed.mzizi.africa")


def stable_id(table: str, code: str) -> UUID:
    """The id of the row of `schema.table` whose natural key is `code`. The same input always gives the same id."""
    return uuid5(SEED_NAMESPACE, f"{table}:{code}")
