"""Builds the slug registry rows (`source.slugs`) for the development database.

Places take the last segment of their feature code as the slug and the code without that segment as the parent, so the
canonical path follows the electoral chain (county, constituency, ward) and no two siblings collide. Sub-counties hang under
their county; provinces ended in 2013. People, parties, institutions, elections (under a slug for their kind), projects,
tenders, content and events get a clean slug from their name, with a numeric suffix only on a collision among siblings.
"""

from __future__ import annotations

import csv
import re
import unicodedata

from dev_seed.common import DATA, SEED, Row, write_csv


def _slug(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = text.lower().replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def _read(path) -> list[Row]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


class _Registry:
    def __init__(self) -> None:
        self.rows: list[Row] = []
        self._taken: set[tuple[str, str, str, str]] = set()

    def add(self, namespace: str, text: str, table: str, subject: str, parent: str = "", ended: str = "", language: str = "") -> str:
        base = _slug(text) or "item"
        if len(base) > 80:
            base = base[:80].rsplit("-", 1)[0]
        slug, number = base, 1
        while (namespace, parent, slug, language) in self._taken:
            number += 1
            slug = f"{base}-{number}"
        self._taken.add((namespace, parent, slug, language))
        chain = f"{parent.removeprefix('ke.slug.')}.{slug}" if parent else f"{namespace}.{slug}"
        code = f"ke.slug.{chain}" + (f".{language}" if language else "")
        row: Row = {
            "code": code,
            "country_code": "ke",
            "namespace_code": f"src.slug.namespace.{namespace}",
            "slug": slug,
            "parent_slug_code": parent,
            "language_code": language,
            "subject_table": table,
            "subject_code": subject,
            "from_year": "2013" if namespace == "place" else "",
            "to_year": ended,
            "from_to_precision": "exact" if (namespace == "place" or ended) else "",
        }
        self.rows.append(row)
        return code


def build_slugs() -> int:
    reg = _Registry()
    # places: the code path is the slug chain
    codes: dict[str, str] = {}
    for folder, ended in [("counties", ""), ("constituencies", ""), ("wards", ""), ("sub-counties", ""), ("provinces", "2013")]:
        base = SEED / "data/ke/geo" / folder
        for row in _read(base / "features.csv"):
            code = row["code"]
            if code == "ke":
                continue
            tail = code.removeprefix("ke.")
            parent_code = "ke." + tail.rsplit(".", 1)[0] if "." in tail else ""
            parent = codes.get(parent_code, "")
            codes[code] = reg.add("place", tail.rsplit(".", 1)[-1], "geography.features", code, parent, ended)
    # people who hold an office
    names = {r["individual_code"]: r["name"] for r in _read(DATA / "ke/official/names.csv") if r.get("individual_code")}
    for holder in sorted({h["individual_code"] for h in _read(DATA / "ke/governance/holders.csv")}):
        if holder in names:
            reg.add("leader", names[holder], "official.individuals", holder)
    entity_names = {r["entity_code"]: r["name"] for r in _read(DATA / "ke/official/names.csv") if r.get("entity_code")}
    for row in _read(DATA / "ke/politics/parties.csv"):
        reg.add("party", entity_names.get(row["entity_code"], row["code"].rsplit(".", 1)[-1]), "politics.parties", row["code"])
    for row in _read(DATA / "ke/governance/institutions.csv"):
        reg.add("institution", entity_names.get(row["entity_code"], row["code"].rsplit(".", 1)[-1]), "governance.institutions", row["code"])
    # elections hang under a slug for their kind: /elections/general/2022
    kinds: dict[str, str] = {}
    for row in _read(DATA / "ke/politics/elections.csv"):
        kind = row["election_kind_code"].rsplit(".", 1)[-1]
        if kind not in kinds:
            kinds[kind] = reg.add("election", kind, "reference.values", row["election_kind_code"])
        reg.add("election", row["held_on"][:4], "politics.elections", row["code"], kinds[kind])
    for row in _read(DATA / "ke/civic/projects.csv"):
        reg.add("project", row["name"], "civic.projects", row["code"])
    for row in _read(DATA / "ke/civic/procurements.csv"):
        title = row.get("title") or row.get("reference") or row["code"].rsplit(".", 1)[-1]
        reg.add("tender", title, "civic.procurements", row["code"])
    for row in _read(DATA / "ke/filesystem/contents.csv"):
        reg.add("content", row["title"], "filesystem.contents", row["code"], language=row["language_code"])
    for row in _read(DATA / "ke/event/events.csv"):
        reg.add("event", row["code"].rsplit(".", 1)[-1], "event.events", row["code"])
    header = ["code", "country_code", "namespace_code", "slug", "parent_slug_code", "language_code", "subject_table", "subject_code", "from_year", "to_year", "from_to_precision"]
    write_csv("ke/source/slugs.csv", header, reg.rows)
    return len(reg.rows)
