"""Apply reviewed structural vocabulary from the root seed registry to mzizi_new."""
from __future__ import annotations

import json
from pathlib import Path

from ..connection import assert_rewrite_session

SEED_PATH = "global/reference/foundation-baseline.json"
COUNTRY_SEED_PATH = "global/reference/african-countries-au-un-2026-11-11.json"
SEED_ROOT = Path(__file__).resolve().parents[6] / "seed"


def apply_reference_seed(conn, path: Path | None = None) -> dict[str, int]:
    assert_rewrite_session(conn)
    data = json.loads((path or SEED_ROOT / SEED_PATH).read_text(encoding="utf-8"))
    if data.get("schema_version") != 1 or data.get("review") != "structure_only":
        raise ValueError("unsupported or unreviewed reference seed")
    counts = {"schemes": 0, "values": 0, "topics": 0}
    with conn.transaction():
        for row in data["schemes"]:
            current = conn.execute("SELECT name,description,owner,country_id FROM reference.schemes WHERE code=%s", (row["code"],)).fetchone()
            if current and (current["name"], current["description"], current["owner"], current["country_id"]) != (row["name"], row["description"], row["owner"], None):
                raise ValueError(f"reference scheme conflict: {row['code']}")
            result = conn.execute(
                "INSERT INTO reference.schemes(code,name,description,owner) VALUES (%s,%s,%s,%s) "
                "ON CONFLICT(code) DO NOTHING RETURNING id",
                (row["code"], row["name"], row["description"], row["owner"]),
            ).fetchone()
            counts["schemes"] += bool(result)
        scheme_ids = {r["code"]: r["id"] for r in conn.execute("SELECT id,code FROM reference.schemes")}
        for row in data["values"]:
            current = conn.execute("SELECT scheme_id,label,description FROM reference.values WHERE code=%s", (row["code"],)).fetchone()
            if current and (current["scheme_id"], current["label"], current["description"]) != (scheme_ids[row["scheme"]], row["label"], row["description"]):
                raise ValueError(f"reference value conflict: {row['code']}")
            result = conn.execute(
                "INSERT INTO reference.values(code,scheme_id,label,description) VALUES (%s,%s,%s,%s) "
                "ON CONFLICT(code) DO NOTHING RETURNING id",
                (row["code"], scheme_ids[row["scheme"]], row["label"], row["description"]),
            ).fetchone()
            counts["values"] += bool(result)
        for row in data["topics"]:
            current = conn.execute("SELECT name,description FROM reference.topics WHERE code=%s", (row["code"],)).fetchone()
            if current and (current["name"], current["description"]) != (row["name"], row["description"]):
                raise ValueError(f"reference topic conflict: {row['code']}")
            result = conn.execute(
                "INSERT INTO reference.topics(code,name,description) VALUES (%s,%s,%s) "
                "ON CONFLICT(code) DO NOTHING RETURNING id",
                (row["code"], row["name"], row["description"]),
            ).fetchone()
            counts["topics"] += bool(result)
    return counts


def apply_country_seed(conn, path: Path | None = None) -> int:
    """Apply the 55-source reconciliation only after exact AU and UN page versions are registered and pinned."""
    assert_rewrite_session(conn)
    data = json.loads((path or SEED_ROOT / COUNTRY_SEED_PATH).read_text(encoding="utf-8"))
    if data.get("schema_version") != 1 or len(data.get("rows", [])) != 55:
        raise ValueError("expected the reviewed 55-row AU/UN reconciliation")
    sources = {s["path"].rsplit("/", 1)[-1]: s for s in data["source_artifacts"]}
    if set(sources) != {"au-member-states-2026-11-11.html", "un-m49-overview-2026-11-11.html"}:
        raise ValueError("country source set changed")
    version_ids = {}
    for filename, item in sources.items():
        local = SEED_ROOT / item["path"]
        import hashlib
        if hashlib.sha256(local.read_bytes()).hexdigest() != item["sha256"]:
            raise ValueError(f"source snapshot hash changed: {filename}")
        entry = "global.reference.au-members-source" if filename.startswith("au-") else "global.reference.un-m49-source"
        row = conn.execute(
            "SELECT id FROM filesystem.file_versions WHERE sha256=%s AND pinned=true "
            "AND provenance->>'manifest_entry'=%s ORDER BY created_at DESC LIMIT 1",
            (item["sha256"], entry),
        ).fetchone()
        if not row:
            raise ValueError(f"official source snapshot is not registered and pinned: {filename}")
        version_ids[filename] = row["id"]
    added = 0
    with conn.transaction():
        for row in data["rows"]:
            current = conn.execute("SELECT name,iso_alpha2,recognition_status,source_file_version_id FROM reference.countries WHERE code=%s", (row["code"],)).fetchone()
            wanted = (row["name"], row["iso_alpha2"], row["recognition_status"], version_ids["au-member-states-2026-11-11.html"])
            if current:
                if (current["name"], current["iso_alpha2"], current["recognition_status"], current["source_file_version_id"]) != wanted:
                    raise ValueError(f"country identity conflict: {row['code']}")
                continue
            conn.execute("INSERT INTO reference.countries(code,name,iso_alpha2,recognition_status,source_file_version_id) VALUES (%s,%s,%s,%s,%s)", (row["code"], *wanted))
            added += 1
    return added
