"""The translation package's `TextStore` over PostgreSQL: which tables hold translatable text and how a translation is stored.

Each stream is one kind of stored text. A translation is a sibling row in the same table (labels, names, messages) or a row of
`legal.translations`; ids are deterministic so a rerun never duplicates. The store never commits: the operation owns the transaction. Streams: `vocabulary.labels`, `identity.names/<kind>`
(default names of that identity kind), `legal.wordings` (into `legal.translations`) and `product.messages`.
"""

from __future__ import annotations

import json
import uuid
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_translation import Draft, Pair, TextUnit

NAMESPACE = uuid.UUID("6f1c2b1e-8f0e-4c55-9e7a-2b0c5d1e7a10")


@dataclass(frozen=True)
class Binding:
    #: Rows needing a translation: key, text, context, placeholders.
    pending: str
    #: Aligned source and target texts that already exist.
    pairs: str
    #: Stores one draft (parameters: id, key, tid, text, notes, engine).
    save: str


_LANG = "JOIN identity.identities {a} ON {a}.id = {t}.language_id AND {a}.code = %({side})s"

LABELS = Binding(
    pending="""SELECT l.id::text AS key, l.text AS text, coalesce(t.code, s.code, '') AS context, '{}' AS placeholders
      FROM vocabulary.labels l JOIN identity.identities sl ON sl.id = l.language_id AND sl.code = %(source)s
      LEFT JOIN vocabulary.terms t ON t.id = l.term_id LEFT JOIN vocabulary.schemes s ON s.id = l.scheme_id
      WHERE NOT EXISTS (SELECT 1 FROM vocabulary.labels x JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s
        WHERE x.kind = l.kind AND x.term_id IS NOT DISTINCT FROM l.term_id AND x.scheme_id IS NOT DISTINCT FROM l.scheme_id)
      ORDER BY l.id LIMIT %(limit)s""",
    pairs="""SELECT l.text AS source, x.text AS target, coalesce(t.code, s.code, '') AS context FROM vocabulary.labels l
      JOIN identity.identities sl ON sl.id = l.language_id AND sl.code = %(source)s
      LEFT JOIN vocabulary.terms t ON t.id = l.term_id LEFT JOIN vocabulary.schemes s ON s.id = l.scheme_id
      JOIN vocabulary.labels x ON x.kind = l.kind AND x.term_id IS NOT DISTINCT FROM l.term_id AND x.scheme_id IS NOT DISTINCT FROM l.scheme_id
      JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s LIMIT %(limit)s""",
    save="""INSERT INTO vocabulary.labels (id, version, created_at, updated_at, kind, language_id, scheme_id, term_id, country_id, text)
      SELECT %(id)s, 1, now(), now(), l.kind, %(tid)s, l.scheme_id, l.term_id, l.country_id, %(text)s FROM vocabulary.labels l WHERE l.id = %(key)s
      ON CONFLICT DO NOTHING""",
)
NAMES = Binding(
    pending="""SELECT n.id::text AS key, n.text AS text, n.identity_kind AS context, '{}' AS placeholders
      FROM identity.names n JOIN identity.identities sl ON sl.id = n.language_id AND sl.code = %(source)s
      WHERE n.identity_kind = %(kind)s AND n.is_default AND NOT EXISTS (SELECT 1 FROM identity.names x
        JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s
        WHERE x.identity_id = n.identity_id AND x.kind = n.kind)
      ORDER BY n.id LIMIT %(limit)s""",
    pairs="""SELECT n.text AS source, x.text AS target, n.identity_kind AS context FROM identity.names n
      JOIN identity.identities sl ON sl.id = n.language_id AND sl.code = %(source)s
      JOIN identity.names x ON x.identity_id = n.identity_id AND x.kind = n.kind
      JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s WHERE n.identity_kind = %(kind)s LIMIT %(limit)s""",
    save="""INSERT INTO identity.names (id, version, created_at, updated_at, identity_id, identity_kind, language_id, text, kind, is_default, country_id, from_year, to_year)
      SELECT %(id)s, 1, now(), now(), n.identity_id, n.identity_kind, %(tid)s, %(text)s, n.kind, false, n.country_id, n.from_year, n.to_year
      FROM identity.names n WHERE n.id = %(key)s ON CONFLICT DO NOTHING""",
)
WORDINGS = Binding(
    pending="""SELECT w.id::text AS key, w.text AS text, p.designation AS context, '{}' AS placeholders
      FROM legal.wordings w JOIN identity.identities sl ON sl.id = w.language_id AND sl.code = %(source)s
      JOIN legal.provisions p ON p.id = w.provision_id
      WHERE NOT EXISTS (SELECT 1 FROM legal.translations t JOIN identity.identities tl ON tl.id = t.language_id AND tl.code = %(target)s WHERE t.wording_id = w.id)
      ORDER BY w.id LIMIT %(limit)s""",
    pairs="""SELECT w.text AS source, t.text AS target, '' AS context FROM legal.wordings w
      JOIN identity.identities sl ON sl.id = w.language_id AND sl.code = %(source)s
      JOIN legal.translations t ON t.wording_id = w.id JOIN identity.identities tl ON tl.id = t.language_id AND tl.code = %(target)s LIMIT %(limit)s""",
    save="""INSERT INTO legal.translations (id, version, created_at, updated_at, wording_id, language_id, text, method, review, notes)
      VALUES (%(id)s, 1, now(), now(), %(key)s, %(tid)s, %(text)s, 'machine', 'proposed', %(notes)s) ON CONFLICT DO NOTHING""",
)
MESSAGES = Binding(
    pending="""SELECT m.id::text AS key, m.text AS text, k.code AS context, coalesce(k.placeholders, '{}') AS placeholders
      FROM product.messages m JOIN identity.identities sl ON sl.id = m.language_id AND sl.code = %(source)s
      JOIN product.keys k ON k.id = m.key_id
      WHERE NOT EXISTS (SELECT 1 FROM product.messages x JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s
        WHERE x.key_id = m.key_id AND x.country_id IS NOT DISTINCT FROM m.country_id)
      ORDER BY m.id LIMIT %(limit)s""",
    pairs="""SELECT m.text AS source, x.text AS target, k.code AS context FROM product.messages m
      JOIN identity.identities sl ON sl.id = m.language_id AND sl.code = %(source)s JOIN product.keys k ON k.id = m.key_id
      JOIN product.messages x ON x.key_id = m.key_id JOIN identity.identities tl ON tl.id = x.language_id AND tl.code = %(target)s LIMIT %(limit)s""",
    save="""INSERT INTO product.messages (id, version, created_at, updated_at, key_id, language_id, country_id, text, origin, status, translator)
      SELECT %(id)s, 1, now(), now(), m.key_id, %(tid)s, m.country_id, %(text)s, 'machine', 'draft', %(engine)s FROM product.messages m WHERE m.id = %(key)s
      ON CONFLICT DO NOTHING""",
)


def _binding(stream: str) -> tuple[Binding, str]:
    """The binding for a stream, and the identity kind when the stream names one (`identity.names/office`)."""
    base, _, kind = stream.partition("/")
    table = {
        "vocabulary.labels": LABELS,
        "identity.names": NAMES,
        "legal.wordings": WORDINGS,
        "product.messages": MESSAGES,
    }
    if base not in table or (base == "identity.names") != bool(kind):
        raise ValueError(
            f"unknown stream {stream!r}; use vocabulary.labels, identity.names/<kind>, legal.wordings or product.messages"
        )
    return table[base], kind


class PostgresTextStore:
    def __init__(self, conn: Connection) -> None:
        self._conn = conn

    def _language(self, code: str) -> str:
        row = self._conn.execute(
            "SELECT id::text AS id FROM identity.identities WHERE code = %s AND kind = 'language'", (code,)
        ).fetchone()
        if row is None:
            raise ValueError(f"unknown language {code!r}; use an identity code such as ref.lng.xx")
        return str(row["id"])

    def pending(self, stream: str, source_language: str, target_language: str, limit: int) -> list[TextUnit]:
        binding, kind = _binding(stream)
        self._language(source_language), self._language(target_language)
        rows = self._conn.execute(
            binding.pending, {"source": source_language, "target": target_language, "limit": limit, "kind": kind}
        ).fetchall()
        return [
            TextUnit(
                key=str(r["key"]), text=str(r["text"]), context=str(r["context"]), protected=_array(r["placeholders"])
            )
            for r in rows
        ]

    def pairs(self, stream: str, source_language: str, target_language: str, limit: int) -> list[Pair]:
        binding, kind = _binding(stream)
        rows = self._conn.execute(
            binding.pairs, {"source": source_language, "target": target_language, "limit": limit, "kind": kind}
        ).fetchall()
        return [Pair(source=str(r["source"]), target=str(r["target"]), context=str(r["context"])) for r in rows]

    def save(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> int:
        binding, _ = _binding(stream)
        target = self._language(target_language)
        saved = 0
        for d in drafts:
            notes = f"{d.tier.value}: {d.engine} {d.version}" + (
                f"; check: {', '.join(f.value for f in d.flags)}" if d.flags else ""
            )
            params = {
                "id": str(uuid.uuid5(NAMESPACE, f"translation:{stream}:{d.key}:{target_language}")),
                "key": d.key,
                "tid": target,
                "text": d.text,
                "notes": notes[:500],
                "engine": f"{d.engine} {d.version}"[:255],
            }
            saved += self._conn.execute(binding.save, params).rowcount
        return saved


def _array(value: object) -> tuple[str, ...]:
    """Placeholders arrive as a Postgres text array (a list) or the literal `{}`."""
    return tuple(str(v) for v in value) if isinstance(value, list) else ()


class LedgerProvenance:
    """Appends one JSON line per saved draft (stream, key, tier, engine, version, flags, target, time). A stand-in until the
    source catalogue can take the same facts as `source.evidence` rows (method `modelled`, `matched` or `extracted`)."""

    def __init__(self, path: Path) -> None:
        self._path = path

    def record(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> None:
        at = datetime.now(UTC).isoformat()
        self._path.parent.mkdir(parents=True, exist_ok=True)
        with self._path.open("a", encoding="utf-8") as handle:
            for d in drafts:
                handle.write(
                    json.dumps(
                        {
                            "stream": stream,
                            "key": d.key,
                            "from": source_language,
                            "to": target_language,
                            "tier": d.tier.value,
                            "engine": d.engine,
                            "version": d.version,
                            "flags": [f.value for f in d.flags],
                            "at": at,
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                )
