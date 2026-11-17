"""Draft the institutions, offices and patterns the Constitution of Kenya, 2010 establishes, for the owner to approve.

Usage: uv run python scripts/seed/build_constitution_drafts.py

Writes seed/drafts/constitution-patterns/: a data/ tree in the same layout as seed/data (so the same checks read it), a README
that says what each draft is and quotes the constitutional text it rests on, and nothing outside that folder. Drafts are not
loaded: `seed/drafts/` is outside `seed/data/`. Every statement of authority is a link to a provision already seeded from the
English text; the script refuses a provision code that does not exist. `scripts/seed/check_drafts.py` checks the drafts against
the database schemas together with the real seed.
"""

# ruff: noqa: F403, F405
from __future__ import annotations

import csv
import shutil
from pathlib import Path

from constitution_bodies import *
from constitution_bodies import INSTR, LEGAL, OUT


def write(path: Path, header: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


def load_text() -> tuple[set[str], dict[str, str]]:
    provisions: set[str] = set()
    text: dict[str, str] = {}
    for path in LEGAL.glob("*/provisions.csv"):
        with path.open(newline="", encoding="utf-8") as handle:
            provisions.update(r["code"] for r in csv.DictReader(handle))
    for path in LEGAL.glob("*/wordings.csv"):
        with path.open(newline="", encoding="utf-8") as handle:
            for r in csv.DictReader(handle):
                text[r["provision_code"]] = r["text"]
    return provisions, text


def main() -> None:
    provisions, text = load_text()
    shutil.rmtree(OUT, ignore_errors=True)
    data = OUT / "data"

    def prov(short: str) -> str:
        code = f"{INSTR}.{short}"
        if code not in provisions:
            raise SystemExit(f"no provision {code}")
        return code

    write(
        data / "global/reference/gov.schemes.csv",
        ["code", "title", "owner_snapshot"],
        [
            ["ofc.entity.kind", "Kinds of official entity", "mzizi draft; for approval"],
            ["ofc.name.kind", "Kinds of official name", "mzizi draft; for approval"],
            ["gov.institution.kind", "Kinds of institution", "mzizi draft; for approval"],
            ["gov.office.kind", "Kinds of office", "mzizi draft; for approval"],
            ["gov.mandate.kind", "Kinds of mandate", "mzizi draft; for approval"],
            ["gov.relationship.kind", "Kinds of relationship between institutions", "mzizi draft; for approval"],
        ],
    )
    institution_kinds = sorted({b.kind for b in BODIES})
    office_kinds = sorted({o.kind for b in BODIES for o in b.offices})
    values = [
        ["ofc.entity.kind.state-organ", "ofc.entity.kind", "State organ or constitutional body"],
        ["ofc.name.kind.official", "ofc.name.kind", "Official name"],
    ]
    values += [
        [f"gov.institution.kind.{k}", "gov.institution.kind", k.replace("-", " ").capitalize()]
        for k in institution_kinds
    ]
    values += [[f"gov.office.kind.{k}", "gov.office.kind", k.replace("-", " ").capitalize()] for k in office_kinds]
    values += [
        ["gov.mandate.kind.constitutional", "gov.mandate.kind", "Constitutional mandate"],
        ["gov.relationship.kind.part-of", "gov.relationship.kind", "Part of"],
    ]
    write(data / "global/reference/values/gov.values.csv", ["code", "scheme_code", "label"], values)

    entities, names, institutions, offices, mandates, relations, bases = [], [], [], [], [], [], []
    for b in BODIES:
        code = f"ke.{b.slug}"
        entities.append([code, "ofc.entity.kind.state-organ", "ke"])
        names.append([code, "", "ofc.name.kind.official", "en", b.name, "true"])
        institutions.append([code, code, f"gov.institution.kind.{b.kind}"])
        articles = ", ".join(f"Article {a.split('-')[1]}" for a in b.basis)
        mandates.append(
            [
                code,
                "",
                "gov.mandate.kind.constitutional",
                f"Established or described by {articles}; its functions are those the Constitution and legislation give it.",
            ]
        )
        if b.part_of:
            relations.append([code, f"ke.{b.part_of}", "gov.relationship.kind.part-of", ""])
        for a in b.basis:
            bases.append(["governance.institutions", code, prov(a), "established-by", b.note, ""])
        bases.append(
            [
                "governance.institutions",
                code,
                prov(f"art-{PATTERNS[b.pattern][1][0].split('-')[1]}") if False else prov(PATTERNS[b.pattern][1][0]),
                "governed-by",
                f"A {b.pattern.replace('-', ' ')} (see the pattern).",
                "",
            ]
        )
        for o in b.offices:
            ocode = f"ke.{o.slug}"
            offices.append([ocode, code, f"gov.office.kind.{o.kind}"])
            for a in o.basis:
                bases.append(["governance.offices", ocode, prov(a), "established-by", "", ""])
    write(data / "ke/official/entities.csv", ["code", "kind_code", "registration_country_code"], entities)
    write(
        data / "ke/official/names.csv",
        ["entity_code", "individual_code", "name_kind_code", "language_code", "name", "is_preferred"],
        names,
    )
    write(data / "ke/governance/institutions.csv", ["code", "entity_code", "institution_kind_code"], institutions)
    write(data / "ke/governance/offices.csv", ["code", "institution_code", "office_kind_code"], offices)
    write(
        data / "ke/governance/mandates.csv",
        ["institution_code", "office_code", "mandate_kind_code", "description"],
        mandates,
    )
    write(
        data / "ke/governance/relationships.csv",
        ["subject_institution_code", "object_institution_code", "relationship_kind_code", "valid_from"],
        relations,
    )
    patterns = [[f"ke.{slug}", title] for slug, (title, _) in PATTERNS.items()]
    write(data / "ke/reference/patterns.csv", ["code", "title"], patterns)
    for slug, (_, arts) in PATTERNS.items():
        for a in arts:
            bases.append(["reference.patterns", f"ke.{slug}", prov(a), "derives-from", "", ""])
    write(
        data / "ke/legal/bases/patterns.bases.csv",
        ["table_name", "record_code", "provision_code", "relation", "note", "valid_from"],
        bases,
    )

    lines = [
        "# Draft: patterns, institutions and offices the Constitution establishes",
        "",
        "Status: **draft for the owner's approval**. Nothing here is loaded or seeded: this folder sits outside `seed/data/`. Approving means moving the files",
        "you accept into `seed/data/` (the layout is identical) and adding the new schemes and values with them.",
        "",
        "Each record rests on provisions already seeded from the English NCLR print of the Constitution; every `established-by` row in",
        "`data/ke/legal/bases/patterns.bases.csv` is a link to one of them. Check them with `uv run python scripts/seed/check_drafts.py`.",
        "",
        f"What is drafted: {len(PATTERNS)} patterns, {len(BODIES)} institutions (each with an entity and a name), {len(offices)} offices, {len(mandates)} mandates,",
        f"{len(relations)} part-of relationships and {len(bases)} legal bases. Names are the Constitution's own words for the body.",
        "",
        "What is not drafted, and why:",
        "",
        "- **County governments.** There are 47 and each has the same shape, so they are one pattern (`ke.county-government`, Articles 176 to 183) rather than 94",
        "  hand-written institutions. Once you approve the pattern, a script can create a county assembly, an executive committee, a governor, a deputy governor and a speaker per county.",
        "- **Office holders.** The Constitution creates offices, not the people in them; holders come from sources such as the IEBC and Kenya Gazette, one at a time.",
        "- **Statutory bodies.** The Ethics and Anti-Corruption Commission is required by Article 79 but created by an Act; it is listed with its constitutional mandate only.",
        "- **Authority scopes** (which county or country an office covers) wait for the county institutions.",
        "",
        "## Patterns",
        "",
    ]
    for slug, (title, arts) in PATTERNS.items():
        lines += [f"### `ke.{slug}`", "", title, ""]
        for a in arts:
            full = f"{INSTR}.{a}"
            excerpt = text.get(f"{full}.cl-1") or text.get(full) or ""
            title_row = next(
                (
                    r["title"]
                    for p in LEGAL.glob("*/provisions.csv")
                    for r in csv.DictReader(p.open(encoding="utf-8"))
                    if r["code"] == full
                ),
                "",
            )
            lines.append(
                f"- Article {a.split('-')[1]} ({title_row}): {excerpt[:170]}{'…' if len(excerpt) > 170 else ''}"
            )
        lines.append("")
    lines += ["## Institutions", "", "| Institution | Kind | Pattern | Articles | Offices |", "|---|---|---|---|---|"]
    for b in BODIES:
        article_list = ", ".join(a.split("-")[1] for a in b.basis)
        lines.append(
            f"| `ke.{b.slug}` {b.name} | {b.kind} | {b.pattern} | {article_list} | {', '.join(o.name for o in b.offices) or 'none'} |"
        )
    lines += [
        "",
        "## To decide",
        "",
        "1. Which patterns, institutions and offices to accept, drop or rename.",
        "2. The new schemes and values (`ofc.entity.kind`, `gov.institution.kind`, `gov.office.kind`, `gov.mandate.kind`, `gov.relationship.kind`).",
        "3. Whether to generate the per-county institutions from the county-government pattern.",
        "",
    ]
    (OUT / "README.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(BODIES)} institutions, {len(offices)} offices, {len(patterns)} patterns, {len(bases)} bases")


if __name__ == "__main__":
    main()
