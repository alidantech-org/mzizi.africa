"""Landmark institutional places: headquarters of the national bodies and of every county government and assembly.

The seed `fixtures/seed/ke-landmark-places.json` is custom-prepared from manual research: a name and a text address for well-known
public institutions, and the county capital for each county government and assembly. It asserts no coordinates. Each place is
created with an attribution to the seed document and a verification of `unverified`, and the institution's occupancy is recorded
in the headquarters role - but the placement expectation is **not** resolved here: that waits for corroboration by claims
(`place_research.apply_place_claims`, then `resolve_corroborated_expectations`). A generated expectation is never evidence of a
building, and neither is an uncorroborated seed.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import psycopg

from . import register
from .imports.constituency_offices import _decide

SEED = Path(__file__).resolve().parents[3] / "database" / "fixtures" / "seed" / "ke-landmark-places.json"
CURATED_CODE = "mzizi-curated"
HQ_ROLE = "place/occupancy-role/headquarters"


@dataclass
class LandmarkReport:
    places_created: int = 0
    places_existing: int = 0
    occupancies: int = 0
    missing_institutions: list[str] = field(default_factory=list)
    missing_units: list[str] = field(default_factory=list)


def _curated(conn: psycopg.Connection, title: str, citation: str) -> tuple[str, str]:
    publisher = conn.execute("SELECT id::text AS id FROM source.publishers WHERE code = %s", (CURATED_CODE,)).fetchone()
    if conn.execute("SELECT 1 FROM reference.classifications WHERE code = 'source/document-kind/curated_seed'").fetchone() is None:  # created by the database engine's curated loaders; a fresh database may not have it yet
        jurisdiction = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
        conn.execute(
            """INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES ('source/document-kind/curated_seed', 'source/document-kind', 'curated seed', %s, 0, true, now(), now(), 1)""",
            (jurisdiction["id"] if jurisdiction else None,),
        )
    publisher_id = publisher["id"] if publisher else register.ensure_publisher(conn, CURATED_CODE, "Mzizi curated research", kind="repository")
    document_id = register.ensure_document(conn, register.DocumentSpec(publisher_id, title, "curated_seed", licence="Mzizi project work (no third-party licence)", citation=citation))
    method = conn.execute("SELECT id::text AS id FROM source.methods WHERE kind = 'curated' AND tool = 'engine-database curated seed' LIMIT 1").fetchone()
    method_id = method["id"] if method else register.ensure_method(conn, "curated", "curated seed or pattern", "engine-database curated seed", "0.1.0")
    return document_id, method_id


def load_landmarks(conn: psycopg.Connection, seed: Path = SEED) -> LandmarkReport:
    data = json.loads(seed.read_text())
    report = LandmarkReport()
    document_id, method_id = _curated(conn, "Landmark institutional places seed version 1", f"{data['_meta']['label']} Fixture file fixtures/seed/ke-landmark-places.json.")
    role = conn.execute("SELECT id::text AS id FROM reference.classifications WHERE code = %s", (HQ_ROLE,)).fetchone()
    if role is None:
        raise LookupError(f"{HQ_ROLE} is not seeded")
    entries: list[tuple[str, str, str, str | None]] = [(e["institution"], e["placeName"], e["address"], None) for e in data["national"]]
    for slug, county in data["counties"].items():
        town = county["town"]
        entries.append((f"ke/{slug}/government", f"County Government of {slug.replace('-', ' ').title()} headquarters, {town}", f"{town} town", f"ke/{slug}"))
        entries.append((f"ke/{slug}/assembly", f"County Assembly of {slug.replace('-', ' ').title()}, {town}", f"{town} town", f"ke/{slug}"))
    for code, name, address, unit_code in entries:
        institution = conn.execute("SELECT id::text AS id FROM governance.institutions WHERE code = %s AND is_current", (code,)).fetchone()
        if institution is None:
            report.missing_institutions.append(code)
            continue
        unit_id = None
        if unit_code:
            unit = conn.execute("SELECT id::text AS id FROM geography.units WHERE code = %s AND is_current", (unit_code,)).fetchone()
            if unit is None:
                report.missing_units.append(unit_code)
            else:
                unit_id = unit["id"]
        locator = {"seed": "ke-landmark-places@1", "institution": code}
        loc = json.dumps(locator, sort_keys=True)
        found = conn.execute("SELECT a.target_id::text AS id FROM source.attributions a WHERE a.document_id = %s AND a.target_kind = 'place.places' AND a.locator = %s", (document_id, loc)).fetchone()
        if found:
            place_id = found["id"]
            report.places_existing += 1
        else:
            # one Parliament Buildings place serves both houses: reuse a seed place of the same name and address
            twin = conn.execute("SELECT p.id::text AS id FROM place.places p JOIN source.attributions a ON a.target_id = p.id AND a.target_kind = 'place.places' AND a.document_id = %s WHERE p.name = %s AND p.address_text = %s LIMIT 1", (document_id, name, address)).fetchone()
            if twin:
                place_id = twin["id"]
                report.places_existing += 1
            else:
                place_id = str(conn.execute(
                    "INSERT INTO place.places (kind, status, name, address_text, located_in_unit_id, is_current, created_at, updated_at, version) VALUES ('site', 'in_use', %s, %s, %s, true, now(), now(), 1) RETURNING id",
                    (name[:300], address, unit_id),
                ).fetchone()["id"])
                report.places_created += 1
                _decide(conn, "place.places", place_id, "unverified", "AI review (mzizi-agent): custom-prepared seed from manual research; text address only, no coordinates. Stays unverified until a source corroborates it.")
        _attribute_curated(conn, document_id, method_id, "place.places", place_id, locator)
        occupancy = conn.execute("SELECT id::text AS id FROM place.occupancies WHERE subject_kind = 'governance.institutions' AND subject_id = %s AND place_id = %s AND role_id = %s", (institution["id"], place_id, role["id"])).fetchone()
        if occupancy is None:
            occupancy_id = str(conn.execute(
                "INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, is_current, created_at, updated_at, version) VALUES ('governance.institutions', %s, %s, %s, 'active', true, now(), now(), 1) RETURNING id",
                (institution["id"], place_id, role["id"]),
            ).fetchone()["id"])
            report.occupancies += 1
            _attribute_curated(conn, document_id, method_id, "place.occupancies", occupancy_id, locator)
            _decide(conn, "place.occupancies", occupancy_id, "unverified", "AI review (mzizi-agent): the seed names this institution at this headquarters place; not yet corroborated.")
    conn.commit()
    return report


def _attribute_curated(conn: psycopg.Connection, document_id: str, method_id: str, kind: str, target_id: str, locator: dict) -> None:
    if conn.execute("SELECT 1 FROM source.attributions WHERE document_id = %s AND target_kind = %s AND target_id = %s AND locator = %s", (document_id, kind, target_id, json.dumps(locator, sort_keys=True))).fetchone():
        return
    # a curated seed has no capture; the attribution is to the registered seed document
    conn.execute(
        """INSERT INTO source.attributions (document_id, method_id, target_kind, target_id, relation, locator, confidence, attributed_by, created_at, updated_at, version)
           VALUES (%s, %s, %s, %s, 'supports', %s, 0.6, %s, now(), now(), 1)""",
        (document_id, method_id, kind, target_id, json.dumps(locator, sort_keys=True), "00000000-0000-4000-8000-0000000000a3"),
    )
