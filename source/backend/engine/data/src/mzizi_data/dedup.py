"""Deduplication and profiling of people and organisations, without ever assuming that a shared name is one person.

A pair is scored from independent evidence. Names alone never merge: a pair is auto-merged only when the score is at or
above AUTO_MERGE *and* something other than the name agrees (a shared identifier, the same office, or the same place
and the same party), and nothing conflicts (different places for two people with a common name). Everything between
FLAG and the merge bar is flagged for a reviewer; below FLAG nothing is recorded. Pairs are stored in
`engine.match_candidates`; `engine.match_clusters` groups merged pairs (union-find) and names one canonical member.
Records are never deleted or rewritten.
"""
from __future__ import annotations

import re
import unicodedata
import uuid
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from itertools import combinations

import psycopg
from psycopg.types.json import Jsonb

AUTO_MERGE = 0.9
FLAG = 0.75
HONORIFICS = {"hon", "dr", "prof", "mr", "mrs", "ms", "sen", "eng", "amb", "rtd", "justice"}
NOISE = {"ltd", "limited", "co", "company", "inc", "plc", "the", "and", "of", "enterprises", "enterprise", "investments", "services", "holdings", "kenya"}


def fold(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", text.lower()) if not unicodedata.combining(c))


def tokens(name: str, drop_noise: bool = False) -> list[str]:
    out = [t for t in re.findall(r"[a-z0-9]+", fold(name.replace("'", ""))) if len(t) > 1]
    out = [t for t in out if t not in HONORIFICS]
    return [t for t in out if t not in NOISE] if drop_noise else out


def token_similarity(a: list[str], b: list[str]) -> float:
    """Order-free similarity: each token of the shorter name is matched to its best unused token of the other."""
    short, long_ = (a, b) if len(a) <= len(b) else (b, a)
    if not short:
        return 0.0
    pool, total = list(long_), 0.0
    for t in short:
        best, idx = 0.0, -1
        for i, u in enumerate(pool):
            r = 1.0 if t == u else SequenceMatcher(None, t, u).ratio()
            if r > best:
                best, idx = r, i
        if idx >= 0 and best >= 0.8:
            total += best
            pool.pop(idx)
    coverage = len(short) / max(len(long_), 1)  # a name with a token missing is weaker evidence than the full name
    return (total / len(short)) * (0.6 + 0.4 * coverage)


@dataclass
class Record:
    id: str
    name: str
    identifiers: set[str] = field(default_factory=set)
    offices: set[str] = field(default_factory=set)
    places: set[str] = field(default_factory=set)
    parties: set[str] = field(default_factory=set)


@dataclass
class Match:
    left: str
    right: str
    score: float
    features: dict
    decision: str


def score_pair(a: Record, b: Record, kind: str) -> Match | None:
    name = token_similarity(tokens(a.name, kind == "organization"), tokens(b.name, kind == "organization"))
    shared_ids = a.identifiers & b.identifiers
    if name < FLAG and not shared_ids:
        return None
    same_office, same_place, same_party = bool(a.offices & b.offices), bool(a.places & b.places), bool(a.parties & b.parties)
    conflict = bool(a.places and b.places and not (a.places & b.places))
    score = 1.0 if shared_ids else 0.8 * name + 0.1 * same_office + 0.06 * same_place + 0.04 * same_party
    if conflict:  # same name in two places: keep it visible for review, never merge
        score = max(score * 0.9, FLAG if name >= 0.95 else 0.0)
    corroborated = bool(shared_ids) or same_office or (same_place and (same_party or kind == "organization"))
    decision = "auto_merged" if score >= AUTO_MERGE and corroborated and not conflict else "flagged" if score >= FLAG else None
    if decision is None:
        return None
    left, right = sorted((a.id, b.id))
    return Match(left, right, round(min(score, 1.0), 4), {"name": round(name, 4), "sharedIdentifiers": sorted(shared_ids), "sameOffice": same_office, "samePlace": same_place, "sameParty": same_party, "placeConflict": conflict}, decision)


def find_matches(records: list[Record], kind: str) -> list[Match]:
    """Pairs are only compared inside blocks of records sharing a name token (or an identifier), so the work stays small."""
    blocks: dict[str, list[int]] = {}
    for i, r in enumerate(records):
        for key in {t for t in tokens(r.name, kind == "organization") if len(t) >= 4} | {f"id:{x}" for x in r.identifiers}:
            blocks.setdefault(key, []).append(i)
    seen: set[tuple[int, int]] = set()
    matches: list[Match] = []
    for members in blocks.values():
        if len(members) > 200:
            continue  # a token this common (a county name) is not evidence
        for i, j in combinations(sorted(set(members)), 2):
            if (i, j) in seen:
                continue
            seen.add((i, j))
            m = score_pair(records[i], records[j], kind)
            if m:
                matches.append(m)
    return matches


def clusters(ids: list[str], merged: list[tuple[str, str]]) -> dict[str, list[str]]:
    parent = {i: i for i in ids}

    def find(x: str) -> str:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b in merged:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[max(ra, rb)] = min(ra, rb)
    out: dict[str, list[str]] = {}
    for i in ids:
        out.setdefault(find(i), []).append(i)
    return {root: sorted(members) for root, members in out.items() if len(members) > 1}


def load_people(conn: psycopg.Connection) -> list[Record]:
    people = {str(r["id"]): Record(str(r["id"]), r["display_name"]) for r in conn.execute("SELECT id, display_name FROM person.individuals WHERE is_current")}
    for r in conn.execute("""SELECT h.person_id, h.office_id, i.code AS inst, o.description FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN governance.institutions i ON i.id = o.institution_id"""):
        rec = people.get(str(r["person_id"]))
        if rec:
            rec.offices.add(f"{r['office_id']}")
            m = re.search(r"Geography: (\S+)", r["description"] or "")
            if m:
                rec.places.add(m.group(1))
    for r in conn.execute("SELECT person_id, party_id FROM political.memberships"):
        rec = people.get(str(r["person_id"]))
        if rec:
            rec.parties.add(str(r["party_id"]))
    return list(people.values())


def load_organizations(conn: psycopg.Connection) -> list[Record]:
    orgs = {str(r["id"]): Record(str(r["id"]), r["official_name"]) for r in conn.execute("SELECT id, official_name FROM organization.entities WHERE is_current")}
    for r in conn.execute("""SELECT i.entity_id, i.value FROM organization.identifiers i JOIN reference.classifications c ON c.id = i.scheme_id WHERE c.code IN ('organization/identifier-scheme/kra-pin', 'organization/identifier-scheme/business-registration')"""):
        rec = orgs.get(str(r["entity_id"]))
        if rec:
            rec.identifiers.add(re.sub(r"\W", "", r["value"]).upper())
    for r in conn.execute("SELECT entity_id, geo_unit_id FROM organization.locations WHERE geo_unit_id IS NOT NULL"):
        rec = orgs.get(str(r["entity_id"]))
        if rec:
            rec.places.add(str(r["geo_unit_id"]))
    return list(orgs.values())


def run_dedup(conn: psycopg.Connection, kind: str, actor_id: str | None = None) -> dict:
    records = load_people(conn) if kind == "person" else load_organizations(conn)
    matches = find_matches(records, kind)
    for m in matches:
        conn.execute(
            """INSERT INTO engine.match_candidates (kind, left_id, right_id, score, features, decision, decided_by, rationale)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
               ON CONFLICT (kind, left_id, right_id) DO UPDATE SET score = EXCLUDED.score, features = EXCLUDED.features, updated_at = now(), version = engine.match_candidates.version + 1
                WHERE engine.match_candidates.decision <> 'rejected'""",
            (kind, m.left, m.right, m.score, Jsonb(m.features), m.decision, actor_id, "automatic: score and corroboration above the merge bar" if m.decision == "auto_merged" else "flagged for review: shared name evidence without enough corroboration"),
        )
    merged = [(r["left_id"], r["right_id"]) for r in conn.execute("SELECT left_id::text AS left_id, right_id::text AS right_id FROM engine.match_candidates WHERE kind = %s AND decision = 'auto_merged'", (kind,))]
    groups = clusters([r.id for r in records], merged)
    conn.execute("DELETE FROM engine.match_clusters WHERE kind = %s", (kind,))
    for root, members in groups.items():
        cluster_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{kind}/{root}"))
        for member in members:
            conn.execute("INSERT INTO engine.match_clusters (kind, cluster_id, member_id, is_canonical) VALUES (%s, %s, %s, %s)", (kind, cluster_id, member, member == root))
    conn.commit()
    return {"records": len(records), "pairs": len(matches), "auto_merged": sum(m.decision == "auto_merged" for m in matches), "flagged": sum(m.decision == "flagged" for m in matches), "clusters": len(groups)}


def profile_person(conn: psycopg.Connection, code: str) -> dict | None:
    """Everything the database holds about one person: names, offices with their institutions and dates, party, portrait, sources, and matches."""
    p = conn.execute("SELECT id::text AS id, code, display_name, given_name, family_name, life_status FROM person.individuals WHERE code = %s AND is_current", (code,)).fetchone()
    if not p:
        return None
    offices = conn.execute("""SELECT o.name AS office, i.name AS institution, h.status::text AS status, h.term_number, h.valid_from FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN governance.institutions i ON i.id = o.institution_id WHERE h.person_id = %s AND h.is_current""", (p["id"],)).fetchall()
    parties = conn.execute("SELECT pa.name FROM political.memberships m JOIN political.parties pa ON pa.id = m.party_id WHERE m.person_id = %s AND m.is_current", (p["id"],)).fetchall()
    sources = conn.execute("""SELECT d.title, d.url, a.target_field, a.relation::text AS relation FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE a.target_kind = 'person.individuals' AND a.target_id = %s""", (p["id"],)).fetchall()
    matches = conn.execute("""SELECT decision, score::float AS score, CASE WHEN left_id = %s THEN right_id ELSE left_id END::text AS other FROM engine.match_candidates WHERE kind = 'person' AND (left_id = %s OR right_id = %s)""", (p["id"], p["id"], p["id"])).fetchall()
    return {**p, "offices": offices, "parties": [x["name"] for x in parties], "sources": sources, "matches": matches}
