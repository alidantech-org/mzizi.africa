"""The translation store over the one local database (`mzizix`): reads pending text and writes drafts. Every test rolls back.

Needs `DATABASE_WRITE_URL` (the root `.env`); skipped otherwise. No other database is used or created.
"""

from __future__ import annotations

import os
from collections.abc import Iterator

import pytest

from mzizi_engine.persistence.postgres.connection import Connection, connect
from mzizi_engine.persistence.postgres.translation import PostgresTextStore
from mzizi_translation import Draft, Tier

URL = os.environ.get("DATABASE_WRITE_URL")
pytestmark = pytest.mark.skipif(not URL, reason="DATABASE_WRITE_URL is not set")
EN, SW, TARGET = "ref.lng.en", "ref.lng.sw", "ref.lng.so"


@pytest.fixture
def conn() -> Iterator[Connection]:
    assert URL
    with connect(URL) as connection:
        yield connection
        connection.rollback()


def draft(key: str) -> Draft:
    return Draft(key=key, text="jibu", tier=Tier.MACHINE, engine="test", version="1")


def test_pairs_carry_the_context_of_each_text(conn: Connection) -> None:
    pairs = PostgresTextStore(conn).pairs("product.messages", EN, SW, 50)
    assert pairs and all(p.context for p in pairs)


@pytest.mark.parametrize("stream", ["product.messages", "vocabulary.labels", "identity.names/office", "legal.wordings"])
def test_a_saved_draft_is_no_longer_pending_and_rolls_back(conn: Connection, stream: str) -> None:
    store = PostgresTextStore(conn)
    before = store.pending(stream, EN, TARGET, 10)
    if not before:
        pytest.skip(f"nothing pending in {stream}")
    assert store.save(stream, EN, TARGET, [draft(before[0].key)]) == 1
    assert before[0].key not in {u.key for u in store.pending(stream, EN, TARGET, 10)}
    assert store.save(stream, EN, TARGET, [draft(before[0].key)]) == 0  # a rerun adds nothing


def test_an_unknown_stream_or_language_is_refused(conn: Connection) -> None:
    store = PostgresTextStore(conn)
    with pytest.raises(ValueError, match="unknown stream"):
        store.pending("nope", EN, SW, 1)
    with pytest.raises(ValueError, match="unknown language"):
        store.pending("product.messages", EN, "ref.lng.not-a-language", 1)
