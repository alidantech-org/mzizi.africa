"""IEBC constituency offices: the published list of physical locations, read into candidate places and, where the evidence allows, identified occupancies.

Source: "Physical Locations of Constituency Offices in Kenya (290 Constituencies)", a PDF the Independent Electoral and Boundaries
Commission publishes on its own site. Each row names a county, a constituency, an office location (address text), a landmark and an
estimated distance. Nothing in it is a coordinate, and nothing in it names a building beyond what the row says.

Steps (each reports what it could not do rather than guessing):

1. `parse_pdf` reads rows by word position, using the column header of each county block (the PDF's tables are not ruled).
2. `match_rows` scores each constituency name against the constituency units of its county with rapidfuzz, then against the wards of
   that county only to explain a miss. A match needs a high score and a clear lead over the runner-up; a ward hint is never a link.
3. `load_offices` preserves the PDF, registers its document and capture, and for every row writes a candidate place (a site with
   address text, no point), an attribution with the page and row as locator, and a verification. A row linked to a unit also gets an
   occupancy of the matching IEBC constituency election office institution and resolves its placement expectation
   (`expected` -> `identified`) - only when the verification is `verified`. Unlinked rows keep an unlinked place and a verification
   `under_review`. A generated expectation is never evidence of a building: the place and occupancy come from the document.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import psycopg
from rapidfuzz import fuzz

from .. import pipeline, register
from ..files import LocalDirectoryStore

AGENT_ID = "00000000-0000-4000-8000-0000000000a3"
TOOL = "mzizi-data constituency-offices"
TOOL_VERSION = "0.1.0"
ACCEPT = 90.0  # minimum similarity (0-100) for a constituency name
LEAD = 6.0  # a match must beat the runner-up by this much, or it is ambiguous
WARD_ACCEPT = 95.0
VERIFY_AT = 95.0  # similarity needed for the agent to verify the link (the rest go to review)
HEADER_WORDS = ("Constituency", "Office", "Most", "Estimated")
IEBC_SITE = "https://www.iebc.or.ke"


def _norm(text: str) -> str:
    text = text.lower().replace("&", " and ")
    text = re.sub(r"\b(county|constituency|sub[- ]?county|city)\b", " ", text)
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text).split())


def _score(a: str, b: str) -> float:
    a, b = _norm(a), _norm(b)
    if not a or not b:
        return 0.0
    return max(fuzz.ratio(a, b), fuzz.token_sort_ratio(a, b), fuzz.ratio(a.replace(" ", ""), b.replace(" ", "")))


@dataclass
class OfficeRow:
    county: str
    constituency: str
    location: str
    landmark: str
    distance: str
    page: int
    order: int  # position among the rows of the page


def parse_pdf(path: str | Path) -> list[OfficeRow]:
    """Rows by word position. A county line is `<name> County`; the header line fixes the four column starts for its block;
    a line with nothing in the first column continues the previous row."""
    import pdfplumber

    rows: list[OfficeRow] = []
    with pdfplumber.open(str(path)) as pdf:
        for number, page in enumerate(pdf.pages, start=1):
            lines: dict[int, list[dict]] = {}
            for w in page.extract_words():
                lines.setdefault(round(w["top"] / 2.5), []).append(w)
            county: str | None = None
            bounds: list[float] | None = None
            current: dict[str, Any] | None = None
            order = 0

            def flush() -> None:
                nonlocal current, order
                if current and current["constituency"]:
                    order += 1
                    rows.append(OfficeRow(county or "", " ".join(current["constituency"]), " ".join(current["location"]), " ".join(current["landmark"]), " ".join(current["distance"]), number, order))
                current = None

            for key in sorted(lines):
                words = sorted(lines[key], key=lambda w: w["x0"])
                text = " ".join(w["text"] for w in words)
                if text.startswith("Page:") or re.match(r"^(Physical|IEBC Constituency|in Kenya)", text) or text in ("Physical Locations of", "in Kenya"):
                    continue
                if words[0]["text"] == "Constituency" and any(w["text"] == "Estimated" for w in words):
                    flush()
                    starts = [next(w["x0"] for w in words if w["text"] == name) for name in HEADER_WORDS]
                    bounds = [s - 4 for s in starts]
                    continue
                if text.endswith(" County") and len(words) <= 4 and not (bounds and words[0]["x0"] >= bounds[1]):
                    flush()
                    county, bounds = text[: -len(" County")].strip(), None
                    continue
                if bounds is None:
                    continue
                cells: list[list[str]] = [[], [], [], []]
                for w in words:
                    column = max(i for i, b in enumerate(bounds) if w["x0"] >= b) if w["x0"] >= bounds[0] else 0
                    cells[column].append(w["text"])
                if cells[0]:
                    flush()
                    current = {"constituency": cells[0], "location": cells[1], "landmark": cells[2], "distance": cells[3]}
                elif current:
                    for i, name in enumerate(("constituency", "location", "landmark", "distance")):
                        current[name].extend(cells[i])
            flush()
    return rows


@dataclass
class Link:
    row: OfficeRow
    status: str  # matched | ambiguous | unmatched
    unit_id: str | None = None
    unit_code: str | None = None
    score: float = 0.0
    runner_up: float = 0.0
    county_code: str | None = None
    ward_hint: str | None = None
    reason: str = ""


class Geography:
    """Counties, constituencies and wards of a jurisdiction, for fuzzy matching inside a county."""

    def __init__(self, conn: psycopg.Connection, jurisdiction: str = "ke"):
        rows = conn.execute(
            """SELECT u.id::text AS id, u.code, u.name, p.code AS parent, l."order" AS level
                 FROM geography.units u JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id
                 JOIN reference.classifications l ON l.id = u.level_id LEFT JOIN geography.units p ON p.id = u.parent_id
                WHERE j.code = %s AND u.is_current AND l."order" IN (1, 2, 3)""",
            (jurisdiction,),
        ).fetchall()
        self.counties = [r for r in rows if r["level"] == 1]
        self.constituencies: dict[str, list[dict]] = {}
        self.wards: dict[str, list[dict]] = {}
        by_code = {r["code"]: r for r in rows}
        for r in rows:
            if r["level"] == 2:
                self.constituencies.setdefault(r["parent"], []).append(r)
            elif r["level"] == 3 and r["parent"] in by_code:
                self.wards.setdefault(by_code[r["parent"]]["parent"], []).append(r)

    def county(self, name: str) -> dict | None:
        # a county spelled with its twin name (Tharaka-Nithi, Nairobi City) matches the unit named by one of the words
        scored = sorted(((max(_score(name, c["name"]), fuzz.token_set_ratio(_norm(name), _norm(c["name"]))), c) for c in self.counties), key=lambda x: -x[0])
        if scored and scored[0][0] >= ACCEPT and (len(scored) < 2 or scored[0][0] - scored[1][0] >= LEAD):
            return scored[0][1]
        return None


def match_rows(geo: Geography, rows: list[OfficeRow]) -> list[Link]:
    """Score every row's constituency name inside its county. Never guesses: a weak or tied match stays unlinked."""
    taken: dict[str, int] = {}
    links: list[Link] = []
    for row in rows:
        county = geo.county(row.county)
        if county is None:
            links.append(Link(row, "unmatched", reason=f"county {row.county!r} matches no county"))
            continue
        if _norm(row.constituency) in ("office", _norm(row.county)):  # a county-level office, not a constituency
            links.append(Link(row, "county_office", county["id"], county["code"], 100.0, 0.0, county["code"], reason="county office row"))
            continue
        scored = sorted(((_score(row.constituency, c["name"]), c) for c in geo.constituencies.get(county["code"], [])), key=lambda x: -x[0])
        best = scored[0] if scored else (0.0, None)
        second = scored[1][0] if len(scored) > 1 else 0.0
        if best[1] is not None and best[0] >= ACCEPT and best[0] - second >= LEAD:
            links.append(Link(row, "matched", best[1]["id"], best[1]["code"], round(best[0], 1), round(second, 1), county["code"]))
            taken[best[1]["code"]] = taken.get(best[1]["code"], 0) + 1
            continue
        wards = sorted(((_score(row.constituency, w["name"]), w) for w in geo.wards.get(county["code"], [])), key=lambda x: -x[0])
        hint = wards[0][1]["name"] if wards and wards[0][0] >= WARD_ACCEPT else None
        status = "ambiguous" if best[1] is not None and best[0] >= ACCEPT else "unmatched"
        links.append(Link(row, status, None, None, round(best[0], 1), round(second, 1), county["code"], hint, "two constituencies score alike" if status == "ambiguous" else "no constituency of the county is close enough"))
    # two rows claiming one constituency: neither is trusted
    for link in links:
        if link.status == "matched" and taken[link.unit_code or ""] > 1:
            link.status, link.reason = "ambiguous", "another row matches the same constituency"
            link.unit_id = link.unit_code = None
    return links


@dataclass
class OfficeLoad:
    rows: int = 0
    matched: int = 0
    county_offices: int = 0
    unlinked: list[dict[str, Any]] = field(default_factory=list)
    places_created: int = 0
    places_existing: int = 0
    occupancies: int = 0
    expectations_resolved: int = 0
    expectations_missing: list[str] = field(default_factory=list)


def _place_name(row: OfficeRow) -> str:
    return f"IEBC constituency office premises, {row.constituency.strip()} ({row.county.strip()})"[:300]


def _address(row: OfficeRow) -> str:
    parts = [row.location.strip()]
    if row.landmark.strip():
        parts.append(f"landmark: {row.landmark.strip()}")
    if row.distance.strip():
        parts.append(f"about {row.distance.strip()} from it")
    return "; ".join(parts)[:2000]


def _decide(conn: psycopg.Connection, kind: str, target_id: str, state: str, rationale: str, actor: str = AGENT_ID) -> None:
    """A verification with its decision; a state already current for the target is not repeated."""
    current = conn.execute("SELECT state::text AS state FROM source.verifications WHERE target_kind = %s AND target_id = %s AND is_current", (kind, target_id)).fetchone()
    if current and current["state"] == state:
        return
    decision = conn.execute(
        "INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id",
        (kind, target_id, {"verified": "approve", "unverified": "approve", "under_review": "request_changes", "disputed": "dispute", "rejected": "reject", "superseded": "supersede"}[state], state, rationale, actor),
    ).fetchone()["id"]
    conn.execute("UPDATE source.verifications SET is_current = false, updated_at = now() WHERE target_kind = %s AND target_id = %s AND is_current", (kind, target_id))
    conn.execute(
        "INSERT INTO source.verifications (target_kind, target_id, state, rationale, decided_by, decision_id, is_current, created_at, updated_at, version) VALUES (%s, %s, %s::source.verifications_state_enum, %s, %s, %s, true, now(), now(), 1)",
        (kind, target_id, state, rationale, actor, decision),
    )


def _attribute(conn: psycopg.Connection, document_id: str, capture_id: str, method_id: str, kind: str, target_id: str, locator: dict, confidence: float, field_name: str | None = None, relation: str = "supports") -> str:
    loc = json.dumps(locator, sort_keys=True)
    row = conn.execute(
        "SELECT id FROM source.attributions WHERE document_id = %s AND target_kind = %s AND target_id = %s AND locator = %s AND target_field IS NOT DISTINCT FROM %s AND relation = %s::source.attributions_relation_enum",
        (document_id, kind, target_id, loc, field_name, relation),
    ).fetchone()
    if row:
        return str(row["id"])
    return str(conn.execute(
        """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, target_field, relation, locator, confidence, attributed_by, created_at, updated_at, version)
           VALUES (%s, %s, %s, %s, %s, %s, %s::source.attributions_relation_enum, %s, %s, %s, now(), now(), 1) RETURNING id""",
        (document_id, capture_id, method_id, kind, target_id, field_name, relation, loc, confidence, AGENT_ID),
    ).fetchone()["id"])


def register_pdf(conn: psycopg.Connection, store: LocalDirectoryStore, pdf: Path, provenance: dict) -> tuple[str, str]:
    """Preserve the PDF and register its document and capture (once per content hash). Returns (document id, capture id)."""
    publisher_id = register.ensure_publisher(conn, "ke-iebc", "Independent Electoral and Boundaries Commission", kind="institution", website_url=IEBC_SITE)
    jurisdiction = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    spec = register.DocumentSpec(
        publisher_id, "Physical Locations of Constituency Offices in Kenya (290 Constituencies)", "official_website", url=provenance.get("url"),
        licence="Not confirmed (published by the IEBC on its own site; reuse terms unassessed)",
        citation=f"Independent Electoral and Boundaries Commission, Physical Locations of IEBC Constituency Offices in Kenya, retrieved {str(provenance.get('retrieved_at', ''))[:10]}.",
        jurisdiction_id=jurisdiction["id"] if jurisdiction else None,
    )
    existing = conn.execute("SELECT c.id::text AS capture, d.id::text AS document FROM source.captures c JOIN source.documents d ON d.id = c.document_id WHERE c.content_hash = %s AND d.title = %s ORDER BY c.created_at LIMIT 1", (provenance.get("sha256"), spec.title)).fetchone()
    if existing:
        return existing["document"], existing["capture"]
    when = None
    if provenance.get("retrieved_at"):
        when = datetime.fromisoformat(str(provenance["retrieved_at"]))
    document_id, capture_id, _ref = pipeline.ingest(conn, store, pdf.read_bytes(), pdf.name.split("-", 1)[-1], spec, url=provenance.get("url"), tool="gated-fetch", mime_type="application/pdf", http_status=provenance.get("status"), retrieved_at=when, assessment_id=provenance.get("assessment_id"))
    return document_id, capture_id


def load_offices(conn: psycopg.Connection, store: LocalDirectoryStore, pdf: str | Path, jurisdiction: str = "ke", write: bool = True) -> OfficeLoad:
    pdf = Path(pdf)
    provenance = json.loads(Path(str(pdf) + ".provenance.json").read_text()) if Path(str(pdf) + ".provenance.json").exists() else {}
    geo = Geography(conn, jurisdiction)
    rows = parse_pdf(pdf)
    links = match_rows(geo, rows)
    report = OfficeLoad(rows=len(rows), matched=sum(link.status == "matched" for link in links))
    report.county_offices = sum(link.status == "county_office" for link in links)
    report.unlinked = [{"county": l.row.county, "constituency": l.row.constituency, "page": l.row.page, "status": l.status, "score": l.score, "runnerUp": l.runner_up, "wardHint": l.ward_hint, "reason": l.reason} for l in links if l.status != "matched"]
    if not write:
        return report
    document_id, capture_id = register_pdf(conn, store, pdf, provenance)
    method_id = register.ensure_method(conn, "extracted", "IEBC constituency offices table reader", TOOL, TOOL_VERSION)
    workplace = conn.execute("SELECT id::text AS id FROM reference.classifications WHERE code = 'place/occupancy-role/official-workplace'").fetchone()
    for link in links:
        row = link.row
        locator = {"page": row.page, "row": row.order, "county": row.county.strip(), "constituency": row.constituency.strip()}
        loc = json.dumps(locator, sort_keys=True)
        found = conn.execute("SELECT a.target_id::text AS id FROM source.attributions a WHERE a.document_id = %s AND a.target_kind = 'place.places' AND a.locator = %s", (document_id, loc)).fetchone()
        if found:
            place_id = found["id"]
            report.places_existing += 1
        else:
            place_id = str(conn.execute(
                """INSERT INTO place.places (kind, status, name, address_text, located_in_unit_id, is_current, created_at, updated_at, version)
                   VALUES ('site', 'in_use', %s, %s, %s, true, now(), now(), 1) RETURNING id""",
                (_place_name(row), _address(row), link.unit_id),
            ).fetchone()["id"])
            report.places_created += 1
        confidence = round(min(link.score, 100.0) / 100 * 0.9, 2) if link.status in ("matched", "county_office") else 0.5
        _attribute(conn, document_id, capture_id, method_id, "place.places", place_id, locator, confidence)
        if link.status not in ("matched", "county_office"):
            _decide(conn, "place.places", place_id, "under_review", f"AI review (mzizi-agent): the IEBC list gives an office location for {row.constituency.strip()} ({row.county.strip()}) but the constituency {link.reason or 'could not be linked'}; best score {link.score}, runner-up {link.runner_up}. The place stays unlinked and no expectation is resolved.")
            continue
        strong = link.score >= VERIFY_AT
        _decide(
            conn, "place.places", place_id, "verified" if strong else "under_review",
            f"AI review (mzizi-agent): published by the IEBC itself (page {row.page}); " + (f"constituency {row.constituency.strip()!r} matched {link.unit_code} with similarity {link.score} (runner-up {link.runner_up}) inside {row.county.strip()} county." if link.status == "matched" else f"the row is the county-level IEBC office of {link.unit_code}.")
            + ("" if strong else " The score is below the verification bar: held for review."),
        )
        if not strong:
            continue
        institution = conn.execute(
            """SELECT i.id::text AS id, e.id::text AS expectation, e.role_id::text AS role, e.status::text AS status, e.resolved_occupancy_id::text AS resolved
                 FROM governance.institutions i JOIN place.expectations e ON e.subject_kind = 'governance.institutions' AND e.subject_id = i.id AND e.is_current
                WHERE i.code LIKE %s AND i.scope_geo_unit_id = %s AND i.is_current ORDER BY e.created_at LIMIT 1""",
            ("ke/electoral-commission/constituency/%" if link.status == "matched" else "ke/electoral-commission/county/%", link.unit_id),
        ).fetchone()
        if institution is None:
            report.expectations_missing.append(link.unit_code or "")
            continue
        occupancy = conn.execute("SELECT id::text AS id FROM place.occupancies WHERE subject_kind = 'governance.institutions' AND subject_id = %s AND place_id = %s AND role_id = %s", (institution["id"], place_id, institution["role"])).fetchone()
        if occupancy is None:
            occupancy_id = str(conn.execute(
                """INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, is_current, created_at, updated_at, version)
                   VALUES ('governance.institutions', %s, %s, %s, 'active', true, now(), now(), 1) RETURNING id""",
                (institution["id"], place_id, institution["role"]),
            ).fetchone()["id"])
            report.occupancies += 1
        else:
            occupancy_id = occupancy["id"]
        _attribute(conn, document_id, capture_id, method_id, "place.occupancies", occupancy_id, locator, confidence)
        _decide(conn, "place.occupancies", occupancy_id, "verified", f"AI review (mzizi-agent): the IEBC list places its constituency office for {link.unit_code} at this location; the place is verified and the institution is the one scoped to that constituency.")
        if institution["status"] != "identified" or institution["resolved"] != occupancy_id:
            conn.execute("UPDATE place.expectations SET status = 'identified', resolved_occupancy_id = %s, updated_at = now(), version = version + 1 WHERE id = %s", (occupancy_id, institution["expectation"]))
            report.expectations_resolved += 1
    conn.commit()
    return report
