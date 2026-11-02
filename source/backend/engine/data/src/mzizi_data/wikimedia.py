"""Wikimedia pipeline: Wikidata identifiers, existence markers and licensed Commons files (TSK-7EC27F97DC64, TSK-A6C9B9251A15).

Official APIs only (Wikidata `wbsearchentities` / `wbgetentities`, Commons `imageinfo` with `extmetadata`); no page is scraped.
Every request goes through the collection gate (`PoliteFetcher`: identified user agent, assessment scope, rate limit, stop on a
challenge). Nothing here writes a data table:

* `wikidata_refill` is the refill handler registered with `reinforcement.register_refill("wikidata", ...)`. It finds the Wikidata
  item of a unit, party, institution or person with *context checks* (country, instance-of, citizenship, name), never by name
  alone, and reports `found`, `not_found` or `ambiguous`. The evidence is the raw Wikidata entity JSON preserved as an artifact,
  a source document (CC0) and an attribution; the value becomes a proposed claim (reinforcement.add_claim).
* `fetch_media` stores the flag, emblem, logo or portrait a promoted marker says exists, only when Commons records a free
  licence, as a raw artifact with the licence, author, credit and Commons page on its source document, linked to the entity by a
  `filesystem.attachments` row whose role is the kind of image. Files without a free licence are skipped and reported.
"""
from __future__ import annotations

import html
import json
import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any, Callable
from urllib.parse import urlencode

import psycopg

from . import pipeline, register
from .reinforcement import Finding, Unsupported

WIKIDATA_API = "https://www.wikidata.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
API_PATHS = ("/w/api.php",)  # documented API endpoints: exempt from the crawler rules in robots.txt (DEC-WIKIMEDIA-API-ACCESS)
HOSTS = ("www.wikidata.org", "commons.wikimedia.org", "upload.wikimedia.org")
SITE_CODE = "wikimedia"
KENYA = "Q114"
HUMAN = "Q5"
TOOL = "mzizi-data wikimedia"
TOOL_VERSION = "0.1.0"

# marker column -> (attachment role, Wikidata image property)
MARKERS = {"flag_marker": ("flag", "P41"), "emblem_marker": ("emblem", "P94"), "logo_marker": ("logo", "P154"), "portrait_marker": ("portrait", "P18")}
SUPPORTED = {"wikidata_id", "description", "abbreviation", *MARKERS}

# Licences Commons records as short names. Non-commercial and no-derivatives terms are not free; unrecognised terms are not stored.
FREE_LICENCE = re.compile(r"^(cc0|cc[- ]by(?![- ]?(nc|nd))([- ]sa)?\b.*|public domain|pd[- ].*|pd|attribution.*|gfdl.*|ogl.*|open government licen[cs]e.*|no restrictions)$", re.I)
NOT_FREE = re.compile(r"(\bnc\b|non[- ]?commercial|\bnd\b|no[- ]?deriv|fair use|non[- ]?free|all rights reserved|copyrighted)", re.I)


def is_free_licence(short_name: str | None, usage_terms: str | None = None, copyrighted: str | None = None) -> bool:
    """True only for a recorded free licence or public-domain status."""
    name = (short_name or "").strip()
    if not name or NOT_FREE.search(name) or NOT_FREE.search(usage_terms or ""):
        return False
    if (copyrighted or "").lower() == "false":  # Commons says the file is in the public domain
        return True
    return bool(FREE_LICENCE.match(name))


# ---- text ---------------------------------------------------------------------------------------------------------

def norm(text: str) -> str:
    text = text.replace("\u2013", " ").replace("\u2014", " ").replace("\u2010", " ").replace("\u2011", " ")
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    text = re.sub(r"[^a-z0-9 ]+", " ", text.replace("-", " "))
    words = [w for w in text.split() if w not in {"county", "constituency", "the"}]
    return " ".join(words)


def tokens(text: str) -> set[str]:
    return set(re.sub(r"[^a-z0-9 ]+", " ", unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()).split())


def strip_html(value: str | None) -> str | None:
    if not value:
        return None
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", value))).strip() or None


# ---- entity helpers (Wikidata JSON) -------------------------------------------------------------------------------

def item_ids(entity: dict, prop: str) -> list[str]:
    """Item values of a property, preferred rank first, deprecated statements ignored."""
    claims = [c for c in entity.get("claims", {}).get(prop, []) if c.get("rank") != "deprecated"]
    claims.sort(key=lambda c: c.get("rank") != "preferred")
    out = []
    for c in claims:
        value = (c.get("mainsnak", {}).get("datavalue") or {}).get("value")
        if isinstance(value, dict) and "id" in value:
            out.append(value["id"])
    return out


def string_values(entity: dict, prop: str) -> list[str]:
    claims = [c for c in entity.get("claims", {}).get(prop, []) if c.get("rank") != "deprecated"]
    claims.sort(key=lambda c: c.get("rank") != "preferred")
    return [v for c in claims if isinstance((v := (c.get("mainsnak", {}).get("datavalue") or {}).get("value")), str)]


def label(entity: dict) -> str | None:
    return (entity.get("labels", {}).get("en") or {}).get("value")


def description(entity: dict) -> str | None:
    return (entity.get("descriptions", {}).get("en") or {}).get("value")


def names(entity: dict) -> set[str]:
    out = {label(entity)} if label(entity) else set()
    out |= {a["value"] for a in entity.get("aliases", {}).get("en", [])}
    return {n for n in out if n}


# ---- client -------------------------------------------------------------------------------------------------------

Getter = Callable[[str], Any]  # url -> object with .status, .body, .headers (a PoliteFetcher.get)


class Wikimedia:
    """Thin client over the Wikidata and Commons APIs; `get` is the gated fetcher (or a recorded fake in tests)."""

    def __init__(self, get: Getter):
        self.get = get
        self.cache: dict[str, dict] = {}

    def _json(self, base: str, **params: Any) -> dict:
        result = self.get(f"{base}?{urlencode({**params, 'format': 'json', 'maxlag': 5})}")
        if result.status != 200:
            raise RuntimeError(f"{base} answered {result.status}")
        data = json.loads(result.body)
        if isinstance(data, dict) and "error" in data:  # e.g. maxlag: the servers are busy; stop rather than retry around it
            raise RuntimeError(f"{base} reported {data['error'].get('code')}: {data['error'].get('info', '')[:120]}")
        return data

    def search(self, text: str, limit: int = 8) -> list[dict]:
        return self._json(WIKIDATA_API, action="wbsearchentities", search=text, language="en", uselang="en", type="item", limit=limit).get("search", [])

    def entities(self, ids: list[str]) -> dict[str, dict]:
        missing = [i for i in dict.fromkeys(ids) if i not in self.cache]
        for start in range(0, len(missing), 50):
            batch = missing[start : start + 50]
            data = self._json(WIKIDATA_API, action="wbgetentities", ids="|".join(batch), props="labels|aliases|descriptions|claims", languages="en")
            for qid, entity in data.get("entities", {}).items():
                if "missing" not in entity:
                    self.cache[qid] = entity
        return {i: self.cache[i] for i in ids if i in self.cache}

    def entity_labels(self, ids: list[str]) -> dict[str, str]:
        return {i: label(e) or "" for i, e in self.entities(ids).items()}

    def commons(self, filenames: list[str]) -> dict[str, dict]:
        """Licence, author, credit and URLs for Commons files: name -> info (absent when Commons has no such file)."""
        out: dict[str, dict] = {}
        for start in range(0, len(filenames), 20):
            batch = filenames[start : start + 20]
            data = self._json(COMMONS_API, action="query", titles="|".join(f"File:{n}" for n in batch), prop="imageinfo", iiprop="url|mime|size|extmetadata", iiextmetadatafilter="LicenseShortName|LicenseUrl|UsageTerms|Artist|Credit|AttributionRequired|Copyrighted|ImageDescription")
            for page in data.get("query", {}).get("pages", {}).values():
                info = (page.get("imageinfo") or [None])[0]
                if not info:
                    continue
                meta = {k: v.get("value") for k, v in (info.get("extmetadata") or {}).items()}
                out[page["title"].removeprefix("File:")] = {
                    "url": info["url"], "page": info.get("descriptionurl"), "mime": info.get("mime"), "size": info.get("size"),
                    "licence": strip_html(meta.get("LicenseShortName")), "licence_url": meta.get("LicenseUrl"), "usage_terms": strip_html(meta.get("UsageTerms")),
                    "author": strip_html(meta.get("Artist")), "credit": strip_html(meta.get("Credit")), "attribution_required": meta.get("AttributionRequired"), "copyrighted": meta.get("Copyrighted"),
                }
        return out


# ---- matching -----------------------------------------------------------------------------------------------------

@dataclass
class Match:
    qid: str
    score: float
    reasons: list[str] = field(default_factory=list)


def search_terms(kind: str, record: dict) -> list[str]:
    name = record["name"] if "name" in record else record["display_name"]
    if kind == "geography.units":
        suffix = {"geography/level/county": " County", "geography/level/constituency": " Constituency"}.get(record.get("level_code"), "")
        return [name + suffix] if suffix and not norm(name).endswith("county") else [name]
    if kind == "political.parties":
        return [name] + ([record["abbreviation"]] if record.get("abbreviation") else [])
    return [name]


def judge(kind: str, record: dict, entity: dict, labels_of: Callable[[list[str]], dict[str, str]]) -> Match | None:
    """Accepts a candidate only with the context its kind needs. Returns None when it fails any check."""
    qid = entity["id"]
    name = record.get("name") or record.get("display_name") or ""
    reasons: list[str] = []
    instance = " ".join(labels_of(item_ids(entity, "P31")).values()).lower()
    country = KENYA in item_ids(entity, "P17") or KENYA in item_ids(entity, "P495")
    if HUMAN in item_ids(entity, "P31") and kind != "person.individuals":
        return None
    if kind == "person.individuals":
        if HUMAN not in item_ids(entity, "P31"):
            return None
        reasons.append("instance of human")
        positions = " ".join(labels_of(item_ids(entity, "P39")).values()).lower()
        if KENYA in item_ids(entity, "P27"):
            reasons.append("citizen of Kenya")
        elif "kenya" in positions:
            reasons.append("holds or held a Kenyan position")
        else:
            return None
        wanted = tokens(name)
        best = 0.0
        for candidate in names(entity):
            have = tokens(candidate)
            if len(wanted) >= 2 and len(have) >= 2 and (wanted <= have or have <= wanted) and (len(wanted & have) >= 2):
                best = max(best, 1.0 if wanted == have else 0.85)
        if not best:
            return None
        reasons.append("name tokens agree")
        return Match(qid, best, reasons)

    wanted = {norm(name)} | ({norm(record["abbreviation"])} if record.get("abbreviation") else set())
    have = {norm(n) for n in names(entity)}
    partial = False
    if not (wanted & have):
        # A county the database names by its first part ("Tharaka" for Tharaka-Nithi): the words must all be in the label,
        # and the country and instance checks below still apply.
        if kind == "geography.units" and record.get("level_code") == "geography/level/county" and any(set(norm(name).split()) < set(h.split()) for h in have):
            partial = True
        else:
            return None
    exact = norm(name) in {norm(label(entity) or "")}
    reasons.append("label matches" if exact else "label contains the name" if partial else "alias matches")

    if kind == "geography.units":
        level = record.get("level_code")
        if level == "geography/level/country":
            if "KE" not in string_values(entity, "P297") or "country" not in instance and "state" not in instance:
                return None
            reasons.append("ISO 3166-1 alpha-2 KE")
        elif level == "geography/level/county":
            if not country or "county" not in instance:
                return None
            reasons.append("instance of a county, country Kenya")
        elif level == "geography/level/constituency":
            if "constituency" not in instance:
                return None
            parent = norm(record.get("parent_name") or "")
            located = {norm(v) for v in labels_of(item_ids(entity, "P131")).values()}
            if not (country or (parent and parent in located)):
                return None
            reasons.append("instance of a constituency, located in the parent county" if parent in located else "instance of a constituency, country Kenya")
        else:
            return None
    elif kind == "political.parties":
        if "party" not in instance or not country:
            return None
        reasons.append("instance of a political party, country Kenya")
    else:  # institutions
        if not country:
            return None
        reasons.append("country Kenya")
    return Match(qid, 0.95 if exact else 0.7 if partial else 0.8, reasons)


def find_item(wm: Wikimedia, kind: str, record: dict) -> tuple[str, list[Match]]:
    """Outcome (found, not_found, ambiguous) and the accepted candidates."""
    ids: list[str] = []
    for term in search_terms(kind, record):
        ids += [hit["id"] for hit in wm.search(term)]
    if not ids:
        return "not_found", []
    entities = wm.entities(ids[:12])
    related = [i for e in entities.values() for prop in ("P31", "P39", "P131") for i in item_ids(e, prop)]
    wm.entities(related)  # one batch for every class, position and place label the checks will read
    matches = [m for e in entities.values() if (m := judge(kind, record, e, wm.entity_labels)) is not None]
    if not matches:
        return "not_found", []
    matches.sort(key=lambda m: -m.score)
    if len(matches) > 1 and matches[0].score == matches[1].score:
        return "ambiguous", matches
    return "found", matches[:1]


# ---- records and evidence -----------------------------------------------------------------------------------------

RECORD_SQL = {
    "geography.units": """SELECT t.id, t.name, t.code, t.wikidata_id, lv.code AS level_code, p.name AS parent_name FROM geography.units t
        LEFT JOIN reference.classifications lv ON lv.id = t.level_id LEFT JOIN geography.units p ON p.id = t.parent_id WHERE t.id = %s""",
    "political.parties": "SELECT t.id, t.name, t.code, t.abbreviation, t.wikidata_id FROM political.parties t WHERE t.id = %s",
    "governance.institutions": "SELECT t.id, t.name, t.code, t.description, t.wikidata_id FROM governance.institutions t WHERE t.id = %s",
    "person.individuals": "SELECT t.id, t.display_name, t.code, t.wikidata_id FROM person.individuals t WHERE t.id = %s",
}


def known_wikidata_id(conn: psycopg.Connection, kind: str, record: dict) -> str | None:
    """The record's Wikidata id: the stored one, or else the winning proposed or accepted claim."""
    if record.get("wikidata_id"):
        return record["wikidata_id"]
    row = conn.execute("""SELECT c.value #>> '{}' AS qid FROM engine.claim_standings s JOIN engine.claims c ON c.id = s.winning_claim_id
        WHERE s.target_kind = %s AND s.target_id = %s AND s.field = 'wikidata_id' AND NOT s.disputed""", (kind, record["id"])).fetchone()
    return row["qid"] if row else None


class Evidence:
    """Preserves the raw Wikidata entity and writes its document and attribution."""

    def __init__(self, conn: psycopg.Connection, store, assessment_id: str | None = None):
        self.conn, self.store, self.assessment_id = conn, store, assessment_id
        self.publisher_id = register.ensure_publisher(conn, "wikidata", "Wikidata (Wikimedia Foundation)", kind="repository", website_url="https://www.wikidata.org")
        conn.execute("UPDATE source.publishers SET reliability = COALESCE(reliability, 0.6) WHERE id = %s", (self.publisher_id,))  # crowd-sourced: below official registers
        self.method_id = register.ensure_method(conn, "extracted", "wikidata match with context checks", TOOL, TOOL_VERSION)

    def attribute(self, entity: dict, kind: str, target_id: str, target_field: str, confidence: float, relation: str = "supports") -> str:
        qid = entity["id"]
        url = f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"
        title = f"Wikidata item {qid} ({label(entity) or qid})"
        spec = register.DocumentSpec(self.publisher_id, title, "dataset", url=url, licence="CC0 1.0 (Wikidata structured data)", citation=f"Wikidata, {qid}, retrieved through the Wikidata API.", language="en")
        document_id = register.ensure_document(self.conn, spec)
        capture = self.conn.execute("SELECT id FROM source.captures WHERE document_id = %s ORDER BY created_at DESC LIMIT 1", (document_id,)).fetchone()
        if capture:
            capture_id = str(capture["id"])
        else:
            _doc, capture_id, _ref = pipeline.ingest(self.conn, self.store, json.dumps(entity, sort_keys=True).encode(), f"{qid}.json", spec, url=url, tool="gated-fetch", mime_type="application/json", assessment_id=self.assessment_id)
        row = self.conn.execute("SELECT id FROM source.attributions WHERE document_id = %s AND target_kind = %s AND target_id = %s AND target_field = %s AND relation = %s", (document_id, kind, target_id, target_field, relation)).fetchone()
        if row:
            return str(row["id"])
        return str(self.conn.execute(
            """INSERT INTO source.attributions (document_id, capture_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id""", (document_id, capture_id, kind, target_id, target_field, relation, self.method_id, confidence)).fetchone()["id"])


def wikidata_refill(conn: psycopg.Connection, wm: Wikimedia, store, assessment_id: str | None = None) -> Callable[[dict], Finding]:
    """The handler registered for the source `wikidata`. It searches and reports; the framework records the claim."""
    evidence = Evidence(conn, store, assessment_id)

    def handle(gap: dict) -> Finding:
        kind, fld = gap["target_kind"], gap["field"]
        if fld not in SUPPORTED or kind not in RECORD_SQL or (fld in MARKERS and fld not in {c for c in _columns(conn, kind)}) or (fld in {"description", "abbreviation"} and fld not in _columns(conn, kind)):
            raise Unsupported(f"wikidata cannot refill {kind}.{fld}")
        record = conn.execute(RECORD_SQL[kind], (gap["target_id"],)).fetchone()
        if record is None:
            return Finding("not_found", detail={"reason": "the record no longer exists"})
        if fld == "wikidata_id":
            outcome, matches = find_item(wm, kind, record)
            if outcome == "not_found":
                return Finding("not_found", detail={"searched": search_terms(kind, record)})
            if outcome == "ambiguous":
                return Finding("ambiguous", detail={"candidates": [{"id": m.qid, "score": m.score} for m in matches]})
            match = matches[0]
            attribution = evidence.attribute(wm.cache[match.qid], kind, str(record["id"]), fld, match.score)
            return Finding("found", match.qid, attribution, {"checks": match.reasons, "score": match.score})
        qid = known_wikidata_id(conn, kind, record)
        if not qid:
            return Finding("not_found", detail={"reason": "no Wikidata id yet; refill wikidata_id first"})
        entity = wm.entities([qid]).get(qid)
        if not entity:
            return Finding("not_found", detail={"reason": f"{qid} is not on Wikidata any more"})
        if fld in MARKERS:
            if item_ids(entity, "P31")[:1] == [HUMAN] and fld != "portrait_marker":
                return Finding("not_found", detail={"reason": "a person has no flag, emblem or logo here"})
            files = string_values(entity, MARKERS[fld][1])
            if not files:  # absence on Wikidata is not proof that none exists: never write `none` from it
                return Finding("not_found", detail={"reason": f"{qid} has no {MARKERS[fld][1]} statement"})
            return Finding("found", "has", evidence.attribute(entity, kind, str(record["id"]), fld, 0.9), {"qid": qid, "files": files[:3]})
        if fld == "description":
            text = description(entity)
            return Finding("found", text, evidence.attribute(entity, kind, str(record["id"]), fld, 0.7), {"qid": qid}) if text else Finding("not_found", detail={"qid": qid})
        short = string_values(entity, "P1813") or [a for a in (v["value"] for v in entity.get("aliases", {}).get("en", [])) if a.isupper() and 2 <= len(a) <= 12]
        return Finding("found", short[0], evidence.attribute(entity, kind, str(record["id"]), fld, 0.8), {"qid": qid}) if short else Finding("not_found", detail={"qid": qid})

    return handle


def _columns(conn: psycopg.Connection, kind: str) -> set[str]:
    schema, table = kind.split(".")
    return {r["column_name"] for r in conn.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = %s AND table_name = %s", (schema, table))}


# ---- media files --------------------------------------------------------------------------------------------------

@dataclass
class MediaReport:
    stored: list[dict] = field(default_factory=list)
    skipped: list[dict] = field(default_factory=list)


def fetch_media(conn: psycopg.Connection, wm: Wikimedia, store, assessment_id: str | None = None, only: str | None = None, limit: int | None = None) -> MediaReport:
    """Stores the images that promoted `has` markers announce, only with a recorded free licence."""
    report = MediaReport()
    publisher_id = register.ensure_publisher(conn, "wikimedia-commons", "Wikimedia Commons", kind="repository", website_url="https://commons.wikimedia.org")
    conn.execute("UPDATE source.publishers SET reliability = COALESCE(reliability, 0.7) WHERE id = %s", (publisher_id,))
    method_id = register.ensure_method(conn, "extracted", "commons file with recorded licence", TOOL, TOOL_VERSION)
    done = 0
    for kind in RECORD_SQL:
        columns = _columns(conn, kind)
        for marker, (role, prop) in MARKERS.items():
            if marker not in columns or (only and only != role):
                continue
            name_column = "display_name" if kind == "person.individuals" else "name"
            rows = conn.execute(f"""SELECT t.id, t.wikidata_id, t.{name_column} AS name FROM {kind} t
                WHERE t.{marker}::text = 'has' AND t.wikidata_id IS NOT NULL AND NOT EXISTS
                (SELECT 1 FROM filesystem.attachments a WHERE a.target_kind = %s AND a.target_id = t.id AND a.role = %s) ORDER BY t.{name_column}""", (kind, role)).fetchall()
            for row in rows:
                if limit is not None and done >= limit:
                    return report
                entity = wm.entities([row["wikidata_id"]]).get(row["wikidata_id"])
                files = string_values(entity, prop) if entity else []
                if not files:
                    report.skipped.append({"kind": kind, "id": str(row["id"]), "name": row["name"], "role": role, "reason": "Wikidata no longer lists an image"})
                    continue
                filename = files[0].replace("_", " ")
                info = wm.commons([filename]).get(filename)
                if not info:
                    report.skipped.append({"kind": kind, "id": str(row["id"]), "name": row["name"], "role": role, "file": filename, "reason": "Commons has no such file"})
                    continue
                if not is_free_licence(info["licence"], info["usage_terms"], info["copyrighted"]):
                    report.skipped.append({"kind": kind, "id": str(row["id"]), "name": row["name"], "role": role, "file": filename, "reason": f"no recorded free licence ({info['licence'] or 'none recorded'})", "page": info["page"]})
                    continue
                result = wm.get(info["url"])
                if result.status != 200 or not (result.headers.get("content-type", "") or info["mime"] or "").startswith(("image/", "application/")):
                    report.skipped.append({"kind": kind, "id": str(row["id"]), "name": row["name"], "role": role, "file": filename, "reason": f"download answered {result.status}"})
                    continue
                attribution_text = "; ".join(p for p in (f"Author: {info['author']}" if info["author"] else None, f"Credit: {info['credit']}" if info["credit"] else None, f"Licence: {info['licence']}" + (f" ({info['licence_url']})" if info["licence_url"] else ""), f"Source: {info['page']}", "Attribution required" if str(info["attribution_required"]).lower() == "true" else None) if p)
                spec = register.DocumentSpec(publisher_id, f"Commons file {filename} ({role} of {row['name']})", "archival_record", url=info["page"], licence=info["licence"], citation=attribution_text[:1000], language="en")
                document_id, capture_id, ref = pipeline.ingest(conn, store, result.body, filename.replace(" ", "_"), spec, url=info["url"], tool="gated-fetch", mime_type=info["mime"], assessment_id=getattr(result, "assessment_id", None) or assessment_id)
                conn.execute(
                    """INSERT INTO source.attributions (document_id, capture_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version)
                       VALUES (%s, %s, %s, %s, %s, 'derived_from', %s, 0.9, now(), now(), 1)""", (document_id, capture_id, kind, row["id"], role, method_id))
                conn.execute("INSERT INTO filesystem.attachments (file_id, target_kind, target_id, role, position, created_at, updated_at, version) VALUES (%s, %s, %s, %s, 0, now(), now(), 1)", (ref.file_id, kind, row["id"], role))
                conn.commit()
                done += 1
                report.stored.append({"kind": kind, "id": str(row["id"]), "name": row["name"], "role": role, "file": filename, "licence": info["licence"], "author": info["author"]})
    return report


# ---- site registration --------------------------------------------------------------------------------------------

def register_site(conn: psycopg.Connection, jurisdiction: str = "ke") -> str:
    """The Wikimedia hosts as one site (idempotent). Assessing and approving it is the database engine's `auto-assess`."""
    row = conn.execute("SELECT id FROM website.sites WHERE code = %s", (SITE_CODE,)).fetchone()
    if row:
        return str(row["id"])
    jurisdiction_id = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()["id"]
    site_id = conn.execute(
        "INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, description, created_at, updated_at, version) VALUES (%s, 'Wikimedia: Wikidata and Commons APIs', 'portal', 'expected', %s, %s, now(), now(), 1) RETURNING id",
        (SITE_CODE, jurisdiction_id, "Official Wikidata and Wikimedia Commons APIs and the upload host, used for identifiers, flags, emblems, logos and portraits with recorded licences."),
    ).fetchone()["id"]
    for index, host in enumerate(HOSTS):
        conn.execute(
            "INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, status, status_reason, origin, is_apex, created_at, updated_at, version) VALUES (%s, %s, 'https', %s, current_date, 'exact', 'candidate', 'Official Wikimedia API host; not yet probed.', 'seed_research', false, now(), now(), 1)",
            (site_id, host, "primary" if index == 0 else "alias"),
        )
    return str(site_id)
