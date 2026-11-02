"""Page fingerprints, traits and similarity between sites.

A fingerprint summarises how a site is built (markup skeleton, navigation labels, asset hosts and
class vocabulary, document types). Similarity suggests family membership and similar_to relations;
suggestions are written as data with a basis and score and never rewrite a structure.
"""
from __future__ import annotations

import hashlib
import json
import math
import re
from collections import Counter
from dataclasses import dataclass
from urllib.parse import urlparse

import psycopg
from bs4 import BeautifulSoup

from . import register

STRUCTURAL = ["header", "nav", "main", "footer", "aside", "section", "article", "table", "form", "ul", "ol", "iframe"]
DOC_EXTENSIONS = ("pdf", "xlsx", "xls", "csv", "docx", "doc", "zip", "json", "xml", "geojson", "kml", "shp")
SECTION_KEYWORDS = {
    "section:downloads": ("download", "downloads", "resources", "documents", "data"),
    "section:publications": ("publication", "publications", "reports", "report", "gazette", "bills", "acts"),
    "section:tenders": ("tender", "tenders", "procurement", "bids", "quotations"),
    "section:news": ("news", "press", "media", "updates", "events"),
    "section:contacts": ("contact", "contacts", "about us", "directory"),
    "section:data-portal": ("open data", "data portal", "statistics", "datasets"),
}
WEIGHTS = {"navigation": 0.3, "assets": 0.15, "classes": 0.2, "generator": 0.1, "structure": 0.15, "documents": 0.1}


def features(html: str, url: str = "") -> dict:
    soup = BeautifulSoup(html, "lxml")
    nav_labels = sorted({re.sub(r"\s+", " ", a.get_text(" ", strip=True)).lower() for nav in soup.find_all(["nav", "header"]) for a in nav.find_all("a") if a.get_text(strip=True)})
    hosts = set()
    for tag, attr in (("script", "src"), ("link", "href"), ("img", "src")):
        for el in soup.find_all(tag):
            value = el.get(attr)
            if value and value.startswith(("http://", "https://", "//")):
                hosts.add(urlparse(value if not value.startswith("//") else f"https:{value}").netloc.lower())
    classes = Counter(c for el in soup.find_all(class_=True) for c in el.get("class", []))
    class_tokens = sorted({re.split(r"[-_]", c)[0] for c, _ in classes.most_common(60) if len(c) > 2})
    generator = (soup.find("meta", attrs={"name": "generator"}) or {}).get("content", "").strip().lower() if soup.find("meta", attrs={"name": "generator"}) else ""
    documents = Counter(a["href"].rsplit(".", 1)[-1].lower().split("?")[0] for a in soup.find_all("a", href=True) if "." in a["href"] and a["href"].rsplit(".", 1)[-1].lower().split("?")[0] in DOC_EXTENSIONS)
    structure = {t: len(soup.find_all(t)) for t in STRUCTURAL}
    return {"navigation": nav_labels, "assets": sorted(hosts), "classes": class_tokens, "generator": generator, "structure": structure, "documents": dict(documents)}


def digest(feature_set: dict) -> str:
    return hashlib.sha256(json.dumps(feature_set, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _jaccard(a, b) -> float:
    a, b = set(a), set(b)
    return 1.0 if not a and not b else len(a & b) / len(a | b)


def _cosine(a: dict, b: dict) -> float:
    keys = set(a) | set(b)
    dot = sum(a.get(k, 0) * b.get(k, 0) for k in keys)
    na, nb = math.sqrt(sum(v * v for v in a.values())), math.sqrt(sum(v * v for v in b.values()))
    return 1.0 if na == 0 and nb == 0 else (0.0 if na == 0 or nb == 0 else dot / (na * nb))


def similarity(a: dict, b: dict) -> float:
    """Weighted similarity in [0, 1] between two feature sets."""
    scores = {
        "navigation": _jaccard(a["navigation"], b["navigation"]),
        "assets": _jaccard(a["assets"], b["assets"]),
        "classes": _jaccard(a["classes"], b["classes"]),
        "generator": 1.0 if a["generator"] and a["generator"] == b["generator"] else 0.0,
        "structure": _cosine(a["structure"], b["structure"]),
        "documents": _cosine(a["documents"], b["documents"]),
    }
    return round(sum(WEIGHTS[k] * v for k, v in scores.items()), 4)


def traits(feature_set: dict) -> list[str]:
    """Namespaced traits (platform, section) suggested by a page; hints for agents and reviewers."""
    found: list[str] = []
    generator = feature_set["generator"]
    for platform in ("wordpress", "drupal", "joomla", "ckan", "dspace"):
        if platform in generator and platform != "joomla":
            found.append(f"platform:{platform}")
    labels = " | ".join(feature_set["navigation"])
    for tag, words in SECTION_KEYWORDS.items():
        if any(re.search(rf"\b{re.escape(w)}\b", labels) for w in words):
            found.append(tag)
    return sorted(found)


@dataclass
class Suggestion:
    kind: str  # membership | relation
    site_id: str
    other_id: str  # family id or site id
    score: float


def store_fingerprint(conn: psycopg.Connection, site_id: str, html: str, check_id: str | None = None) -> dict:
    feature_set = features(html)
    for kind, keys in (("markup", ("structure", "generator", "classes")), ("navigation", ("navigation",)), ("assets", ("assets",)), ("document_types", ("documents",))):
        part = {key: feature_set[key] for key in keys}
        conn.execute(
            "INSERT INTO website.fingerprints (site_id, kind, digest, features, check_id, computed_at, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, now(), now(), now(), 1)",
            (site_id, kind, digest(part), json.dumps(part), check_id),
        )
    return feature_set


def latest_features(conn: psycopg.Connection, site_id: str) -> dict | None:
    rows = conn.execute("SELECT DISTINCT ON (kind) kind, features FROM website.fingerprints WHERE site_id = %s ORDER BY kind, computed_at DESC", (site_id,)).fetchall()
    if len(rows) < 4:
        return None
    merged = {"generator": "", "classes": []}
    for row in rows:
        merged.update(json.loads(row["features"]))
    return {"navigation": [], "assets": [], "structure": {}, "documents": {}, **merged}


def suggest(conn: psycopg.Connection, site_id: str, membership_threshold: float = 0.6, relation_threshold: float = 0.5) -> list[Suggestion]:
    """Compares a site with the other fingerprinted sites. Suggests family membership (average similarity to the
    family's members) and similar_to relations. Writes traits and suggestions as data with basis 'fingerprint'."""
    mine = latest_features(conn, site_id)
    if mine is None:
        raise LookupError("the site has no fingerprint yet")
    method = register.ensure_method(conn, "inferred", "page fingerprint similarity", "mzizi-data", "0.1.0")
    out: list[Suggestion] = []
    scores: dict[str, float] = {}
    for other in conn.execute("SELECT DISTINCT site_id::text AS id FROM website.fingerprints WHERE site_id <> %s", (site_id,)).fetchall():
        theirs = latest_features(conn, other["id"])
        if theirs:
            scores[other["id"]] = similarity(mine, theirs)
    for other_id, score in scores.items():
        if score >= relation_threshold:
            exists = conn.execute("SELECT 1 FROM website.relations WHERE from_kind = 'site' AND from_id = %s AND to_kind = 'site' AND to_id = %s AND relation = 'similar_to' AND basis = 'fingerprint'", (site_id, other_id)).fetchone()
            if not exists:
                conn.execute(
                    "INSERT INTO website.relations (from_kind, from_id, to_kind, to_id, relation, score, basis, evidence, created_at, updated_at, version) VALUES ('site', %s, 'site', %s, 'similar_to', %s, 'fingerprint', %s, now(), now(), 1)",
                    (site_id, other_id, score, json.dumps({"weights": WEIGHTS})),
                )
            out.append(Suggestion("relation", site_id, other_id, score))
    families: dict[str, list[float]] = {}
    for row in conn.execute("SELECT site_id::text AS site, family_id::text AS family FROM website.members WHERE site_id <> %s", (site_id,)).fetchall():
        if row["site"] in scores:
            families.setdefault(row["family"], []).append(scores[row["site"]])
    already = {r["family_id"] for r in conn.execute("SELECT family_id::text AS family_id FROM website.members WHERE site_id = %s", (site_id,)).fetchall()}
    for family, values in families.items():
        average = round(sum(values) / len(values), 4)
        if average >= membership_threshold and family not in already:
            conn.execute("INSERT INTO website.members (site_id, family_id, role, basis, score, method_id, created_at, updated_at, version) VALUES (%s, %s, 'member', 'fingerprint', %s, %s, now(), now(), 1)", (site_id, family, average, method))
            out.append(Suggestion("membership", site_id, family, average))
    for tag in traits(mine):
        if not conn.execute("SELECT 1 FROM website.traits WHERE owner_kind = 'site' AND owner_id = %s AND tag = %s", (site_id, tag)).fetchone():
            conn.execute("INSERT INTO website.traits (owner_kind, owner_id, tag, method_id, score, observed_at, created_at, updated_at, version) VALUES ('site', %s, %s, %s, 0.6, now(), now(), now(), 1)", (site_id, tag, method))
    return out
