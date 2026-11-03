"""Place research: refill handlers, point and address claims, duplicate scoring, moves and closures, enrichment and coverage.

Places, occupancies and expectations keep three separate facts (PLACES_AND_PRESENCE_ASSESSMENT.md): an expectation says a presence
should exist, a place says where something physically is, an occupancy says who is there. Nothing here treats an expectation as
evidence of a building. Everything found by research arrives as an attributed *claim* first (DEC-CLAIMS-AND-CONFLICTS) and is applied to
a place only when it is corroborated or comes from a publisher the engine trusts; nothing overwrites a value already present.

* `site_documents_refill`, `wikidata_place_refill` and `nominatim_refill` are refill handlers (`reinforcement.register_refill`).
  Each searches and reports `found`, `not_found` or `ambiguous`; the evidence (raw page text, Wikidata entity, Nominatim response)
  is preserved with its licence. OpenStreetMap data is ODbL 1.0 (c) OpenStreetMap contributors; the Nominatim usage policy limits a
  client to one request a second, an identifying agent and no bulk geocoding, so requests go through the gate at no more than 0.2 a second.
* `apply_place_claims` writes a claimed address or point into a place that has none, when it is corroborated (two independent
  publishers within a short distance) or the publisher is trusted, and records the decision.
* `score_duplicate_places` scores pairs by name, address and point and flags them in `engine.match_candidates` (kind `place`); it
  never merges, and a name alone never raises a flag above a review item.
* `move_occupancy`, `close_occupancy`, `link_occupancies` end occupancies and link successors; places and old occupancies stay.
* `add_space` and `import_contact` enrich a place only from a named source; contact data is restricted unless it is an institutional
  switchboard published by the institution itself.
* `place_coverage` counts known against expected places, occupancies and contacts.
"""
from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass, field
from datetime import date
from itertools import combinations
from typing import Any, Callable

import psycopg
from psycopg.types.json import Jsonb
from rapidfuzz import fuzz

from . import pipeline, register
from .dedup import fold, token_similarity, tokens
from .reinforcement import Finding, Unsupported, add_claim

AGENT_ID = "00000000-0000-4000-8000-0000000000a3"
KENYA_BBOX = (-4.9, 5.2, 33.8, 42.0)  # lat min, lat max, lon min, lon max
NOMINATIM = "https://nominatim.openstreetmap.org/search"
OSM_SITE = "openstreetmap-nominatim"
OSM_LICENCE = "ODbL 1.0 (c) OpenStreetMap contributors"
OSM_CITATION = "OpenStreetMap contributors, data under the Open Database Licence 1.0, served by Nominatim (https://nominatim.openstreetmap.org)."
TRUST_TO_APPLY = 0.8  # a single claim from a publisher at least this trusted is applied without a second source
NEAR_METRES = 500.0  # two sources agree on a point when they are this close
TOOL_VERSION = "0.1.0"

PLACE_RULES = {"place.places": {"latitude": ["site_documents", "wikidata_place", "osm_nominatim"], "address_text": ["site_documents", "osm_nominatim"]}}
# rows worth chasing: places an institution holds as its headquarters (the national and county landmarks), not every procurement site
HEADQUARTERS_ONLY = "t.id IN (SELECT o.place_id FROM place.occupancies o JOIN reference.classifications r ON r.id = o.role_id WHERE r.code = 'place/occupancy-role/headquarters')"
PLACE_EXTRA = {("place.places", "latitude"): HEADQUARTERS_ONLY, ("place.places", "address_text"): HEADQUARTERS_ONLY}


def in_kenya(lat: float, lon: float) -> bool:
    return KENYA_BBOX[0] <= lat <= KENYA_BBOX[1] and KENYA_BBOX[2] <= lon <= KENYA_BBOX[3]


def metres(a: tuple[float, float], b: tuple[float, float]) -> float:
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371000 * math.asin(math.sqrt(h))


# ---- context of a place -------------------------------------------------------------------------------------------

def place_context(conn: psycopg.Connection, place_id: str) -> dict[str, Any] | None:
    """The place with the institution that holds it, the county it is in and the sites of that institution."""
    row = conn.execute(
        """SELECT p.id::text AS id, p.name, p.address_text, p.latitude::float AS latitude, p.longitude::float AS longitude, p.located_in_unit_id::text AS unit_id,
                  (SELECT o.subject_id::text FROM place.occupancies o WHERE o.place_id = p.id AND o.subject_kind = 'governance.institutions' ORDER BY o.created_at LIMIT 1) AS institution_id
             FROM place.places p WHERE p.id = %s""",
        (place_id,),
    ).fetchone()
    if row is None:
        return None
    inst = conn.execute("SELECT id::text AS id, code, name, wikidata_id FROM governance.institutions WHERE id = %s", (row["institution_id"],)).fetchone() if row["institution_id"] else None
    return {**row, "institution": inst}


def search_name(ctx: dict[str, Any]) -> str:
    """The name a landmark goes by in a search: the place's own name without our descriptive suffixes."""
    return re.sub(r"\s*\((?:[^)]*)\)\s*$", "", ctx["name"]).strip()


# ---- documents handler: addresses in the pages an institution published ---------------------------------------------

POSTAL = re.compile(r"\bP\.?\s?O\.?\s?Box\s+\d{1,6}(?:\s?[-–]\s?\d{5})?(?:\s*,?\s*[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)?)?", re.I)
STREET = re.compile(r"\b[A-Z][A-Za-z.'’-]+(?:\s[A-Z][A-Za-z.'’-]+){0,3}\s(?:Road|Rd|Street|Avenue|Ave|Lane|Drive|Plaza|Towers?|House|Building|Centre|Center|Complex|Highway)\b(?:\s*,\s*[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)?)?")


def extract_addresses(text: str) -> list[str]:
    """Postal boxes and named streets, buildings and towers found in running text, whitespace folded, in order of first appearance."""
    flat = " ".join(text.split())
    found: dict[str, None] = {}
    for pattern in (POSTAL, STREET):
        for m in pattern.finditer(flat):
            found.setdefault(m.group(0).strip(" ,.;"), None)
    return list(found)


def document_text(store, version_id: str, mime: str | None) -> str:
    data = store.get(version_id)
    if data[:5] == b"%PDF-" or (mime or "").endswith("pdf"):
        import pypdfium2 as pdfium

        pdf = pdfium.PdfDocument(data)
        return "\n".join(page.get_textpage().get_text_range() for page in pdf)
    from lxml import html

    try:
        return html.fromstring(data).text_content()
    except Exception:
        return data.decode("utf-8", "replace")


def site_documents_refill(conn: psycopg.Connection, store, limit_documents: int = 12) -> Callable[[dict], Finding]:
    """Handler `site_documents`: an address in the crawled documents of the sites linked to the institution that holds the place.

    The documents are the registry's own captures; nothing is fetched. An address is proposed only when every page that carries one
    agrees on a single value; several different values are `ambiguous`. The evidence is the capture and the matched text."""
    method_id = register.ensure_method(conn, "extracted", "address pattern search in crawled documents", "mzizi-data place-research", TOOL_VERSION)

    def handle(gap: dict) -> Finding:
        if gap["target_kind"] != "place.places" or gap["field"] != "address_text":
            raise Unsupported("site_documents refills the address of a place only")
        ctx = place_context(conn, str(gap["target_id"]))
        if ctx is None or ctx["institution"] is None:
            return Finding("not_found", detail={"reason": "the place has no institution occupying it, so no site is linked"})
        rows = conn.execute(
            """SELECT DISTINCT ON (d.id) d.id::text AS document_id, c.id::text AS capture_id, c.file_version_id::text AS version_id, d.title, d.url
                 FROM website.subjects s JOIN source.documents d ON d.site_id = s.site_id JOIN source.captures c ON c.document_id = d.id
                WHERE s.target_kind = 'governance.institutions' AND s.target_id = %s ORDER BY d.id, c.retrieved_at DESC LIMIT %s""",
            (ctx["institution"]["id"], limit_documents),
        ).fetchall()
        if not rows:
            return Finding("not_found", detail={"reason": "no crawled document is registered for the institution's sites"})
        hits: dict[str, dict] = {}
        for r in rows:
            try:
                text = document_text(store, r["version_id"], None)
            except Exception:
                continue
            for address in extract_addresses(text)[:3]:
                hits.setdefault(fold(address), {"address": address, "documents": []})["documents"].append(r)
        if not hits:
            return Finding("not_found", detail={"documents": len(rows)})
        if len(hits) > 1:
            return Finding("ambiguous", detail={"candidates": [h["address"] for h in hits.values()][:6]})
        hit = next(iter(hits.values()))
        first = hit["documents"][0]
        attribution = conn.execute(
            """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, target_field, relation, locator, confidence, attributed_by, created_at, updated_at, version)
               VALUES (%s, %s, %s, 'place.places', %s, 'address_text', 'supports', %s, 0.7, %s, now(), now(), 1) RETURNING id""",
            (first["document_id"], first["capture_id"], method_id, gap["target_id"], json.dumps({"text": hit["address"][:200], "documents": len(hit["documents"])}), AGENT_ID),
        ).fetchone()["id"]
        return Finding("found", hit["address"], str(attribution), {"documents": [d["url"] for d in hit["documents"]][:5]})

    return handle


# ---- Wikidata coordinates ---------------------------------------------------------------------------------------

def coordinate(entity: dict) -> tuple[float, float] | None:
    for statement in entity.get("claims", {}).get("P625", []):
        value = (statement.get("mainsnak", {}).get("datavalue") or {}).get("value")
        if isinstance(value, dict) and "latitude" in value and "longitude" in value:
            return float(value["latitude"]), float(value["longitude"])
    return None


def wikidata_place_refill(conn: psycopg.Connection, wm, store, assessment_id: str | None = None) -> Callable[[dict], Finding]:
    """Handler `wikidata_place`: the coordinate location (P625) of the Wikidata item for the place or its institution's headquarters.

    A candidate must be in Kenya (country P17 = Q114), have a coordinate inside Kenya, and carry a label or alias that matches the
    place's name closely (rapidfuzz). Two candidates at different points are `ambiguous`; none is guessed."""
    from . import wikimedia

    evidence = wikimedia.Evidence(conn, store, assessment_id)

    def handle(gap: dict) -> Finding:
        if gap["target_kind"] != "place.places" or gap["field"] != "latitude":
            raise Unsupported("wikidata_place refills the point of a place only")
        ctx = place_context(conn, str(gap["target_id"]))
        if ctx is None:
            return Finding("not_found", detail={"reason": "the place no longer exists"})
        term = search_name(ctx)
        hits = wm.search(term, limit=6)
        entities = wm.entities([h["id"] for h in hits]) if hits else {}
        good = []
        for qid, entity in entities.items():
            point = coordinate(entity)
            if point is None or not in_kenya(*point) or "Q114" not in wikimedia.item_ids(entity, "P17"):
                continue
            names = wikimedia.names(entity)
            score = max((fuzz.token_sort_ratio(fold(term), fold(n)) for n in names), default=0)
            if score >= 90:
                good.append((score, qid, point, entity))
        if not good:
            return Finding("not_found", detail={"searched": term, "results": len(hits)})
        points = [g[2] for g in good]
        if any(metres(points[0], p) > NEAR_METRES for p in points[1:]):
            return Finding("ambiguous", detail={"candidates": [{"id": g[1], "point": g[2]} for g in good]})
        score, qid, point, entity = max(good)
        attribution = evidence.attribute(entity, "place.places", str(gap["target_id"]), "latitude", round(score / 100 * 0.85, 2))
        return Finding("found", {"latitude": round(point[0], 6), "longitude": round(point[1], 6), "source": f"wikidata:{qid}"}, attribution, {"qid": qid, "score": score})

    return handle


# ---- OpenStreetMap Nominatim --------------------------------------------------------------------------------------

def register_osm_site(conn: psycopg.Connection, jurisdiction: str = "ke") -> str:
    """The Nominatim search API as one site (idempotent); the database engine's `auto-assess` approves it from the trusted-hosts policy."""
    row = conn.execute("SELECT id FROM website.sites WHERE code = %s", (OSM_SITE,)).fetchone()
    if row:
        return str(row["id"])
    jurisdiction_id = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()["id"]
    site_id = conn.execute(
        "INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, description, created_at, updated_at, version) VALUES (%s, 'OpenStreetMap Nominatim search API', 'portal', 'expected', %s, %s, now(), now(), 1) RETURNING id",
        (OSM_SITE, jurisdiction_id, "Official Nominatim search API, used for the point and address of named institutional places under the ODbL; usage-policy limits are recorded in the decision DEC-PLACE-RESEARCH."),
    ).fetchone()["id"]
    conn.execute(
        "INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, status, status_reason, origin, is_apex, created_at, updated_at, version) VALUES (%s, 'nominatim.openstreetmap.org', 'https', 'primary', current_date, 'exact', 'candidate', 'Official Nominatim host; not yet probed.', 'seed_research', false, now(), now(), 1)",
        (site_id,),
    )
    return str(site_id)


def nominatim_refill(conn: psycopg.Connection, get, store, assessment_id: str | None = None) -> Callable[[dict], Finding]:
    """Handler `osm_nominatim`: one search per place, named institutional places only.

    `get(url)` is the gated fetcher (an identified agent, 0.2 requests a second, stop on a challenge). The result must name the
    place (display name and name matched with rapidfuzz), lie in Kenya, and all acceptable results must be at one spot."""
    publisher_id = register.ensure_publisher(conn, "openstreetmap", "OpenStreetMap contributors (Nominatim)", kind="repository", website_url="https://www.openstreetmap.org")
    conn.execute("UPDATE source.publishers SET reliability = COALESCE(reliability, 0.6) WHERE id = %s", (publisher_id,))
    method_id = register.ensure_method(conn, "extracted", "Nominatim search with name check", "mzizi-data place-research", TOOL_VERSION)

    def handle(gap: dict) -> Finding:
        if gap["target_kind"] != "place.places" or gap["field"] not in ("latitude", "address_text"):
            raise Unsupported("osm_nominatim refills the point or address of a place only")
        ctx = place_context(conn, str(gap["target_id"]))
        if ctx is None:
            return Finding("not_found", detail={"reason": "the place no longer exists"})
        term = search_name(ctx)
        query = f"{term}, {ctx['address_text']}" if ctx.get("address_text") else f"{term}, Kenya"
        url = f"{NOMINATIM}?" + "&".join(f"{k}={v}" for k, v in (("q", query.replace(" ", "+").replace("&", "and")), ("format", "jsonv2"), ("countrycodes", "ke"), ("limit", 5), ("addressdetails", 1)))
        result = get(url)
        if result.status != 200:
            raise RuntimeError(f"Nominatim answered {result.status}")
        rows = json.loads(result.body)
        good = []
        for r in rows:
            point = (float(r["lat"]), float(r["lon"]))
            names = [r.get("name") or "", r.get("display_name", "").split(",")[0]]
            score = max(fuzz.token_sort_ratio(fold(term), fold(n)) for n in names if n) if any(names) else 0
            if in_kenya(*point) and score >= 80:
                good.append((score, point, r))
        if not good:
            return Finding("not_found", detail={"searched": query, "results": len(rows)})
        if any(metres(good[0][1], g[1]) > NEAR_METRES for g in good[1:]):
            return Finding("ambiguous", detail={"candidates": [{"osm": f"{g[2].get('osm_type')}/{g[2].get('osm_id')}", "point": g[1]} for g in good]})
        score, point, best = max(good, key=lambda g: g[0])
        spec = register.DocumentSpec(publisher_id, f"Nominatim search: {query}"[:300], "dataset", url=url, licence=OSM_LICENCE, citation=OSM_CITATION, language="en")
        document_id, capture_id, _ref = pipeline.ingest(conn, store, result.body, "nominatim.json", spec, url=url, tool="gated-fetch", mime_type="application/json", assessment_id=assessment_id)
        field_name = gap["field"]
        confidence = round(score / 100 * 0.8, 2)
        attribution = conn.execute(
            """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, target_field, relation, locator, confidence, attributed_by, created_at, updated_at, version)
               VALUES (%s, %s, %s, 'place.places', %s, %s, 'supports', %s, %s, %s, now(), now(), 1) RETURNING id""",
            (document_id, capture_id, method_id, gap["target_id"], field_name, json.dumps({"osm": f"{best.get('osm_type')}/{best.get('osm_id')}"}), confidence, AGENT_ID),
        ).fetchone()["id"]
        if field_name == "address_text":
            return Finding("found", best["display_name"][:500], str(attribution), {"osm": best.get("osm_id")})
        return Finding("found", {"latitude": round(point[0], 6), "longitude": round(point[1], 6), "source": f"osm:{best.get('osm_type')}/{best.get('osm_id')}"}, str(attribution), {"score": score})

    return handle


# ---- applying claims -----------------------------------------------------------------------------------------------

@dataclass
class ApplyReport:
    points: int = 0
    addresses: int = 0
    held: list[dict[str, Any]] = field(default_factory=list)


def _decide_claims(conn: psycopg.Connection, ids: list[str], why: str) -> None:
    conn.execute("UPDATE engine.claims SET review = 'accepted', reviewed_by = %s, reviewed_at = now(), review_rationale = %s, promoted_at = now() WHERE id = ANY(%s::uuid[]) AND review = 'proposed'", (AGENT_ID, why, ids))


def apply_place_claims(conn: psycopg.Connection) -> ApplyReport:
    """Write proposed point and address claims into places that lack them.

    A point is applied when two claims from independent publishers lie within `NEAR_METRES`, or a single claim comes from a publisher of
    trust at least `TRUST_TO_APPLY`. An address is applied on a single trusted claim or two publishers that agree after folding. A value
    already in the place is never overwritten, and a disagreement beyond the distance stays proposed and is reported."""
    report = ApplyReport()
    for place in conn.execute("SELECT DISTINCT target_id::text AS id FROM engine.claims WHERE target_kind = 'place.places' AND field IN ('latitude', 'address_text') AND review = 'proposed'").fetchall():
        row = conn.execute("SELECT latitude, address_text FROM place.places WHERE id = %s", (place["id"],)).fetchone()
        if row is None:
            continue
        claims = conn.execute("SELECT id::text AS id, field, value, publisher_id::text AS publisher, trust::float AS trust FROM engine.claims WHERE target_kind = 'place.places' AND target_id = %s AND review = 'proposed'", (place["id"],)).fetchall()
        points = [c for c in claims if c["field"] == "latitude" and isinstance(c["value"], dict) and in_kenya(float(c["value"]["latitude"]), float(c["value"]["longitude"]))]
        if row["latitude"] is None and points:
            chosen = None
            for a, b in combinations(points, 2):
                if a["publisher"] != b["publisher"] and metres((a["value"]["latitude"], a["value"]["longitude"]), (b["value"]["latitude"], b["value"]["longitude"])) <= NEAR_METRES:
                    chosen = (max((a, b), key=lambda c: c["trust"]), [a["id"], b["id"]], "two independent publishers agree within %d m" % NEAR_METRES)
                    break
            if chosen is None:
                far = len({round(p["value"]["latitude"], 2) for p in points}) > 1
                best = max(points, key=lambda c: c["trust"])
                if best["trust"] >= TRUST_TO_APPLY and not far:
                    chosen = (best, [best["id"]], f"single claim from a publisher of trust {best['trust']:.2f}")
            if chosen:
                claim, ids, why = chosen
                conn.execute("UPDATE place.places SET latitude = %s, longitude = %s, updated_at = now(), version = version + 1 WHERE id = %s AND latitude IS NULL", (claim["value"]["latitude"], claim["value"]["longitude"], place["id"]))
                _decide_claims(conn, ids, f"AI review (mzizi-agent): point applied; {why}.")
                report.points += 1
            else:
                report.held.append({"place": place["id"], "field": "latitude", "reason": "one untrusted source, or sources that disagree", "claims": len(points)})
        texts = [c for c in claims if c["field"] == "address_text" and isinstance(c["value"], str)]
        if row["address_text"] is None and texts:
            by_text: dict[str, list[dict]] = {}
            for c in texts:
                by_text.setdefault(fold(c["value"]), []).append(c)
            best_group = max(by_text.values(), key=lambda g: (len({c["publisher"] for c in g}), max(c["trust"] for c in g)))
            top = max(best_group, key=lambda c: c["trust"])
            if len({c["publisher"] for c in best_group}) >= 2 or (top["trust"] >= TRUST_TO_APPLY and len(by_text) == 1):
                conn.execute("UPDATE place.places SET address_text = %s, updated_at = now(), version = version + 1 WHERE id = %s AND address_text IS NULL", (top["value"][:2000], place["id"]))
                _decide_claims(conn, [c["id"] for c in best_group], "AI review (mzizi-agent): address applied; agreeing publishers or a single trusted publisher.")
                report.addresses += 1
            else:
                report.held.append({"place": place["id"], "field": "address_text", "reason": "one untrusted source, or sources that disagree", "claims": len(texts)})
    conn.commit()
    return report


def resolve_corroborated_expectations(conn: psycopg.Connection, place_ids: list[str] | None = None) -> int:
    """Identify expectations from occupancies of places that are verified, or whose point two sources agree on.

    An occupancy of a place with an accepted point claim is verified by the agent, and the expectation it matches (same subject and
    role, not yet identified) becomes `identified`. An unverified seed place with no corroborated claim resolves nothing."""
    n = 0
    rows = conn.execute(
        """SELECT o.id::text AS occupancy, o.place_id::text AS place, e.id::text AS expectation FROM place.occupancies o
             JOIN place.expectations e ON e.subject_kind = o.subject_kind AND e.subject_id = o.subject_id AND e.role_id = o.role_id AND e.is_current AND e.status <> 'identified' AND e.resolved_occupancy_id IS NULL
            WHERE o.status = 'active' AND o.valid_to IS NULL AND (%s::uuid[] IS NULL OR o.place_id = ANY(%s::uuid[]))
              AND (EXISTS (SELECT 1 FROM source.verifications v WHERE v.target_kind = 'place.places' AND v.target_id = o.place_id AND v.is_current AND v.state = 'verified')
                   OR EXISTS (SELECT 1 FROM engine.claims c WHERE c.target_kind = 'place.places' AND c.target_id = o.place_id AND c.field = 'latitude' AND c.review = 'accepted'))""",
        (place_ids, place_ids),
    ).fetchall()
    from .imports.constituency_offices import _decide

    for r in rows:
        _decide(conn, "place.places", r["place"], "verified", "AI review (mzizi-agent): a point claim for this place was accepted after corroboration; the place is verified.")
        _decide(conn, "place.occupancies", r["occupancy"], "verified", "AI review (mzizi-agent): the institution's occupancy rests on a verified place and the seed that named it.")
        conn.execute("UPDATE place.expectations SET status = 'identified', resolved_occupancy_id = %s, updated_at = now(), version = version + 1 WHERE id = %s", (r["occupancy"], r["expectation"]))
        n += 1
    conn.commit()
    return n


# ---- duplicates -------------------------------------------------------------------------------------------------------

@dataclass
class PlaceRecord:
    id: str
    name: str
    address: str | None = None
    point: tuple[float, float] | None = None
    unit: str | None = None


def score_places(a: PlaceRecord, b: PlaceRecord) -> tuple[float, dict[str, Any]] | None:
    """Score a pair on name, address and point. Returns None below the flag bar. Never a merge decision.

    The bar needs a second kind of evidence beside the name (a similar address or a point within 150 m); a name match alone is
    reported with a low score so a reviewer sees it, and a pair in different geography units is not flagged on a name alone."""
    name = token_similarity(tokens(a.name, True), tokens(b.name, True))
    address = fuzz.token_set_ratio(fold(a.address), fold(b.address)) / 100 if a.address and b.address else None
    distance = metres(a.point, b.point) if a.point and b.point else None
    near = distance is not None and distance <= 150
    far = distance is not None and distance > 2000
    parts, weights = [name], [0.5]
    if address is not None:
        parts.append(address)
        weights.append(0.3)
    if distance is not None:
        parts.append(1.0 if near else max(0.0, 1 - distance / 2000))
        weights.append(0.2)
    score = sum(p * w for p, w in zip(parts, weights)) / sum(weights)
    corroborated = (address is not None and address >= 0.85) or near
    if far:
        score *= 0.6  # same name kilometres apart: two places
    if name < 0.8 and not near:
        return None
    if not corroborated:
        score = min(score, 0.7)  # name alone: review item only
    if score < 0.65:
        return None
    return round(score, 4), {"name": round(name, 4), "address": None if address is None else round(address, 4), "distanceMetres": None if distance is None else round(distance), "nameOnly": not corroborated, "sameUnit": bool(a.unit and a.unit == b.unit)}


def score_duplicate_places(conn: psycopg.Connection, limit_block: int = 150) -> dict[str, int]:
    """Flag likely duplicate places in `engine.match_candidates` (kind `place`, decision `flagged`). Re-running updates scores; a rejected pair stays rejected."""
    records = [PlaceRecord(r["id"], r["name"], r["address_text"], (float(r["latitude"]), float(r["longitude"])) if r["latitude"] is not None else None, r["unit"]) for r in conn.execute(
        "SELECT id::text AS id, name, address_text, latitude, longitude, located_in_unit_id::text AS unit FROM place.places WHERE is_current AND status NOT IN ('closed', 'demolished')").fetchall()]
    blocks: dict[str, list[int]] = {}
    for i, r in enumerate(records):
        for key in {t for t in tokens(r.name, True) if len(t) >= 4}:
            blocks.setdefault(key, []).append(i)
    seen: set[tuple[int, int]] = set()
    flagged = 0
    for members in blocks.values():
        if len(members) > limit_block:
            continue  # a token this common (a county or "school") is not evidence
        for i, j in combinations(sorted(set(members)), 2):
            if (i, j) in seen:
                continue
            seen.add((i, j))
            scored = score_places(records[i], records[j])
            if scored is None:
                continue
            left, right = sorted((records[i].id, records[j].id))
            conn.execute(
                """INSERT INTO engine.match_candidates (kind, left_id, right_id, score, features, decision, decided_by, rationale) VALUES ('place', %s, %s, %s, %s, 'flagged', %s, %s)
                   ON CONFLICT (kind, left_id, right_id) DO UPDATE SET score = EXCLUDED.score, features = EXCLUDED.features, updated_at = now(), version = engine.match_candidates.version + 1 WHERE engine.match_candidates.decision <> 'rejected'""",
                (left, right, scored[0], Jsonb(scored[1]), AGENT_ID, "flagged for review: places are never merged on a name alone" if scored[1]["nameOnly"] else "flagged for review: name with a similar address or a point within 150 m"),
            )
            flagged += 1
    conn.commit()
    return {"places": len(records), "flagged": flagged}


# ---- moves and closures -----------------------------------------------------------------------------------------------

def _attribute(conn: psycopg.Connection, document_id: str, capture_id: str | None, kind: str, target_id: str, locator: dict, confidence: float = 0.8) -> None:
    method_id = register.ensure_method(conn, "extracted", "occupancy change from a named source", "mzizi-data place-research", TOOL_VERSION)
    conn.execute(
        """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, relation, locator, confidence, attributed_by, created_at, updated_at, version)
           VALUES (%s, %s, %s, %s, %s, 'supports', %s, %s, %s, now(), now(), 1)""",
        (document_id, capture_id, method_id, kind, target_id, json.dumps(locator, sort_keys=True), confidence, AGENT_ID),
    )


def move_occupancy(conn: psycopg.Connection, occupancy_id: str, new_place_id: str, on: date, document_id: str, locator: dict, capture_id: str | None = None, kind: str = "move") -> str:
    """End an occupancy as `moved` and start a new one in another place with a link; nothing is deleted. The expectation the old
    occupancy resolved follows the new one. A source is required: a move without evidence is not recorded."""
    old = conn.execute("SELECT * FROM place.occupancies WHERE id = %s", (occupancy_id,)).fetchone()
    if old is None or old["status"] != "active":
        raise ValueError("only an active occupancy can move")
    if conn.execute("SELECT 1 FROM place.places WHERE id = %s", (new_place_id,)).fetchone() is None:
        raise ValueError("the new place does not exist")
    new_id = str(conn.execute(
        """INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, valid_from, valid_from_precision, is_current, created_at, updated_at, version)
           VALUES (%s, %s, %s, %s, 'active', %s, 'exact', true, now(), now(), 1) RETURNING id""",
        (old["subject_kind"], old["subject_id"], new_place_id, old["role_id"], on),
    ).fetchone()["id"])
    conn.execute("UPDATE place.occupancies SET status = 'moved', valid_to = %s, valid_to_precision = 'exact', updated_at = now(), version = version + 1 WHERE id = %s", (on, occupancy_id))
    conn.execute("INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, valid_from, valid_from_precision, is_current, created_at, updated_at, version) VALUES (%s, %s, %s::place.occupancy_links_kind_enum, %s, 'exact', true, now(), now(), 1)", (occupancy_id, new_id, kind, on))
    conn.execute("UPDATE place.expectations SET resolved_occupancy_id = %s, updated_at = now(), version = version + 1 WHERE resolved_occupancy_id = %s", (new_id, occupancy_id))
    _attribute(conn, document_id, capture_id, "place.occupancies", new_id, locator)
    return new_id


def link_occupancies(conn: psycopg.Connection, predecessors: list[str], successors: list[str], kind: str, on: date, document_id: str, locator: dict) -> None:
    """Split (one into several) or merge (several into one) existing occupancies by links, for a source that names the change."""
    if kind not in ("split", "merge") or (kind == "split" and (len(predecessors) != 1 or len(successors) < 2)) or (kind == "merge" and (len(successors) != 1 or len(predecessors) < 2)):
        raise ValueError("a split needs one predecessor and several successors, a merge several predecessors and one successor")
    for p in predecessors:
        for s in successors:
            conn.execute("INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, valid_from, valid_from_precision, is_current, created_at, updated_at, version) VALUES (%s, %s, %s::place.occupancy_links_kind_enum, %s, 'exact', true, now(), now(), 1)", (p, s, kind, on))
    for p in predecessors:
        conn.execute("UPDATE place.occupancies SET status = 'moved', valid_to = %s, valid_to_precision = 'exact', updated_at = now(), version = version + 1 WHERE id = %s AND status = 'active'", (on, p))
    for t in [*predecessors, *successors]:
        _attribute(conn, document_id, None, "place.occupancies", t, locator)


def close_occupancy(conn: psycopg.Connection, occupancy_id: str, on: date, document_id: str, locator: dict, capture_id: str | None = None) -> None:
    """Confirm an occupancy closed. The place stays; an expectation it resolved becomes `ceased` and loses the resolving link."""
    done = conn.execute("UPDATE place.occupancies SET status = 'closed', valid_to = %s, valid_to_precision = 'exact', updated_at = now(), version = version + 1 WHERE id = %s AND status = 'active' RETURNING id", (on, occupancy_id)).fetchone()
    if done is None:
        raise ValueError("only an active occupancy can be closed")
    conn.execute("UPDATE place.expectations SET status = 'ceased', resolved_occupancy_id = NULL, updated_at = now(), version = version + 1 WHERE resolved_occupancy_id = %s", (occupancy_id,))
    _attribute(conn, document_id, capture_id, "place.occupancies", occupancy_id, locator)


# ---- enrichment -------------------------------------------------------------------------------------------------------

SPACE_PARENTS = {"structure": {"site"}, "wing": {"structure", "floor"}, "floor": {"structure", "wing"}, "unit": {"structure", "floor", "wing"}, "room": {"structure", "floor", "wing", "unit"}, "service_point": {"site", "structure", "floor", "wing", "unit"}}


def building_type(conn: psycopg.Connection, slug: str) -> str:
    code = f"place/building-type/{slug}"
    row = conn.execute("SELECT id::text AS id FROM reference.classifications WHERE code = %s", (code,)).fetchone()
    if row:
        return row["id"]
    jurisdiction = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    return str(conn.execute(
        """INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES (%s, 'place/building-type', %s, %s, 0, true, now(), now(), 1) RETURNING id""",
        (code, slug.replace("-", " "), jurisdiction["id"] if jurisdiction else None),
    ).fetchone()["id"])


def add_space(conn: psycopg.Connection, parent_id: str, kind: str, name: str, document_id: str, quote: str, locator: dict, capture_id: str | None = None, building: str | None = None) -> str:
    """Add a structure, floor, wing, room, unit or service point under a place - only when a source names it.

    `quote` is the text of the source that names the space; the name must appear in it, or nothing is written. The parent kind must
    be one the tree allows. A building type is a classification the source also names. Existing equal spaces are reused."""
    if kind not in SPACE_PARENTS:
        raise ValueError(f"{kind} is not a space kind")
    if fold(name) not in fold(quote):
        raise ValueError("the source quote does not name the space")
    parent = conn.execute("SELECT kind::text AS kind, located_in_unit_id FROM place.places WHERE id = %s", (parent_id,)).fetchone()
    if parent is None or parent["kind"] not in SPACE_PARENTS[kind]:
        raise ValueError(f"a {kind} cannot sit in a {parent['kind'] if parent else 'missing place'}")
    existing = conn.execute("SELECT id::text AS id FROM place.places WHERE parent_id = %s AND kind = %s::place.places_kind_enum AND lower(name) = lower(%s)", (parent_id, kind, name)).fetchone()
    if existing:
        return existing["id"]
    type_id = building_type(conn, building) if building and kind == "structure" else None
    new_id = str(conn.execute(
        """INSERT INTO place.places (kind, status, name, parent_id, located_in_unit_id, building_type_id, is_current, created_at, updated_at, version)
           VALUES (%s::place.places_kind_enum, 'in_use', %s, %s, %s, %s, true, now(), now(), 1) RETURNING id""",
        (kind, name[:300], parent_id, parent["located_in_unit_id"], type_id),
    ).fetchone()["id"])
    _attribute(conn, document_id, capture_id, "place.places", new_id, {**locator, "quote": quote[:300]}, 0.8)
    return new_id


PERSONAL_LOCAL = re.compile(r"^[a-z]+[._-][a-z]+\d*$", re.I)  # firstname.lastname style addresses identify a person


def import_contact(
    conn: psycopg.Connection, scope_kind: str, scope_id: str, channel: str, value: str, document_id: str, locator: dict, label: str | None = None,
    switchboard: bool = False, published_by_institution: bool = False, capture_id: str | None = None,
) -> tuple[str, str]:
    """Add a contact point at exactly one scope (a place, an institution, an entity). Returns (id, visibility).

    Visibility is `restricted` unless the contact is a switchboard or general enquiries line published by the institution itself, on a
    non-person scope, and (for an email) not in a personal `first.last` form. A person scope is always restricted. The contact is
    never copied to other scopes; `resolveContact` finds it by falling back through the chain of the same subject."""
    if scope_kind.startswith("person."):
        visibility = "restricted"
    else:
        looks_personal = channel == "email" and bool(PERSONAL_LOCAL.match(value.split("@")[0]))
        visibility = "public" if switchboard and published_by_institution and not looks_personal else "restricted"
    existing = conn.execute("SELECT id::text AS id, visibility::text AS visibility FROM contact.points WHERE scope_kind = %s AND scope_id = %s AND channel = %s::contact.points_channel_enum AND value = %s AND is_current", (scope_kind, scope_id, channel, value[:500])).fetchone()
    if existing:
        return existing["id"], existing["visibility"]
    new_id = str(conn.execute(
        """INSERT INTO contact.points (scope_kind, scope_id, channel, label, value, visibility, is_current, created_at, updated_at, version)
           VALUES (%s, %s, %s::contact.points_channel_enum, %s, %s, %s::contact.points_visibility_enum, true, now(), now(), 1) RETURNING id""",
        (scope_kind, scope_id, channel, label, value[:500], visibility),
    ).fetchone()["id"])
    _attribute(conn, document_id, capture_id, "contact.points", new_id, locator, 0.8)
    return new_id, visibility


# ---- coverage ---------------------------------------------------------------------------------------------------------

def place_coverage(conn: psycopg.Connection) -> dict[str, Any]:
    """Known against expected: places, occupancies, expectations by status and by institution family, contacts by scope and visibility."""
    one = lambda sql: conn.execute(sql).fetchone()  # noqa: E731
    places = one("""SELECT count(*) AS total, count(*) FILTER (WHERE latitude IS NOT NULL) AS with_point, count(*) FILTER (WHERE address_text IS NOT NULL) AS with_address,
        count(*) FILTER (WHERE located_in_unit_id IS NOT NULL) AS in_a_unit, count(*) FILTER (WHERE kind <> 'site') AS spaces, count(*) FILTER (WHERE building_type_id IS NOT NULL) AS with_building_type FROM place.places WHERE is_current""")
    occupancies = one("SELECT count(*) AS total, count(*) FILTER (WHERE status = 'active') AS active, count(*) FILTER (WHERE status = 'moved') AS moved, count(*) FILTER (WHERE status = 'closed') AS closed FROM place.occupancies")
    expectations = conn.execute("SELECT status::text AS status, count(*) AS n FROM place.expectations WHERE is_current GROUP BY 1 ORDER BY 1").fetchall()
    by_family = conn.execute(
        """SELECT CASE WHEN i.code LIKE 'ke/electoral-commission/constituency/%%' THEN 'IEBC constituency offices' WHEN i.code LIKE 'ke/electoral-commission/county/%%' THEN 'IEBC county offices'
                        WHEN i.code LIKE 'ke/ngcdf/constituency/%%' THEN 'NG-CDF constituency offices' WHEN i.code LIKE 'ke/%%/government' OR i.code LIKE 'ke/%%/assembly' THEN 'county governments and assemblies'
                        WHEN e.subject_kind = 'governance.offices' THEN 'seats and posts' ELSE 'other institutions' END AS family,
                  e.status::text AS status, count(*) AS n
             FROM place.expectations e LEFT JOIN governance.institutions i ON e.subject_kind = 'governance.institutions' AND i.id = e.subject_id WHERE e.is_current GROUP BY 1, 2 ORDER BY 1, 2"""
    ).fetchall()
    contacts = conn.execute("SELECT split_part(scope_kind, '.', 1) || '.' || split_part(scope_kind, '.', 2) AS scope, visibility::text AS visibility, count(*) AS n FROM contact.points WHERE is_current GROUP BY 1, 2 ORDER BY 1, 2").fetchall()
    flagged = one("SELECT count(*) AS n FROM engine.match_candidates WHERE kind = 'place' AND decision = 'flagged'")["n"]
    claims = conn.execute("SELECT field, review, count(*) AS n FROM engine.claims WHERE target_kind = 'place.places' GROUP BY 1, 2 ORDER BY 1, 2").fetchall()
    return {"places": places, "occupancies": occupancies, "expectations": expectations, "byFamily": by_family, "contacts": contacts, "duplicateFlags": flagged, "placeClaims": claims}


def coverage_markdown(report: dict[str, Any]) -> str:
    p, o = report["places"], report["occupancies"]
    lines = [
        "| Measure | Count |", "|---|---:|",
        f"| Places (current) | {p['total']} |", f"| Places with a point | {p['with_point']} |", f"| Places with address text | {p['with_address']} |", f"| Places linked to a geography unit | {p['in_a_unit']} |",
        f"| Structures, floors, wings, rooms (non-site places) | {p['spaces']} |", f"| Places with a building type | {p['with_building_type']} |",
        f"| Occupancies | {o['total']} (active {o['active']}, moved {o['moved']}, closed {o['closed']}) |",
        f"| Duplicate-place flags awaiting review | {report['duplicateFlags']} |", "", "| Expectations by status | Count |", "|---|---:|",
    ]
    lines += [f"| {r['status']} | {r['n']} |" for r in report["expectations"]]
    lines += ["", "| Family | Status | Count |", "|---|---|---:|"] + [f"| {r['family']} | {r['status']} | {r['n']} |" for r in report["byFamily"]]
    lines += ["", "| Contact scope | Visibility | Count |", "|---|---|---:|"] + [f"| {r['scope']} | {r['visibility']} | {r['n']} |" for r in report["contacts"]]
    if report["placeClaims"]:
        lines += ["", "| Place claim | Review | Count |", "|---|---|---:|"] + [f"| {r['field']} | {r['review']} | {r['n']} |" for r in report["placeClaims"]]
    return "\n".join(lines)
