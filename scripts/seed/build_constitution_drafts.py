"""Draft the institutions, offices and patterns the Constitution of Kenya, 2010 establishes, for the owner to approve.

Usage: uv run python scripts/seed/build_constitution_drafts.py

Writes seed/drafts/constitution-patterns/: a data/ tree in the same layout as seed/data (so the same checks read it), a README
that says what each draft is and quotes the constitutional text it rests on, and nothing outside that folder. Drafts are not
loaded: `seed/drafts/` is outside `seed/data/`. Every statement of authority is a link to a provision already seeded from the
English text; the script refuses a provision code that does not exist. `scripts/seed/check_drafts.py` checks the drafts against
the database schemas together with the real seed.
"""

from __future__ import annotations

import csv
import shutil
from dataclasses import dataclass, field
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LEGAL = REPO / "seed/data/ke/legal/constitution-2010"
OUT = REPO / "seed/drafts/constitution-patterns"
INSTR = "ke.constitution-2010"


@dataclass(frozen=True)
class Office:
    slug: str
    name: str
    kind: str
    basis: tuple[str, ...]


@dataclass
class Body:
    slug: str
    name: str
    kind: str
    pattern: str
    basis: tuple[str, ...]
    offices: list[Office] = field(default_factory=list)
    part_of: str = ""
    note: str = ""


def commission_offices(slug: str, chair_basis: str) -> list[Office]:
    return [
        Office(f"{slug}.chairperson", "Chairperson", "chairperson", (chair_basis, "art-250")),
        Office(f"{slug}.member", "Member (commissioner)", "commissioner", ("art-250",)),
    ]


BODIES: list[Body] = [
    Body("national-executive", "The National Executive", "executive-organ", "executive-authority", ("art-130",)),
    Body(
        "the-presidency",
        "The President and Deputy President",
        "executive-organ",
        "executive-authority",
        ("art-131", "art-147"),
        [
            Office("president", "President", "head-of-state-and-government", ("art-131", "art-132")),
            Office("deputy-president", "Deputy President", "deputy-head", ("art-147",)),
        ],
        "national-executive",
    ),
    Body(
        "cabinet",
        "Cabinet",
        "executive-organ",
        "executive-authority",
        ("art-152",),
        [
            Office("cabinet-secretary", "Cabinet Secretary", "cabinet-secretary", ("art-152",)),
            Office("secretary-to-the-cabinet", "Secretary to the Cabinet", "cabinet-secretary-office", ("art-153",)),
        ],
        "national-executive",
    ),
    Body(
        "state-departments",
        "State departments",
        "executive-organ",
        "executive-authority",
        ("art-155",),
        [Office("principal-secretary", "Principal Secretary", "principal-secretary", ("art-155",))],
        "national-executive",
    ),
    Body(
        "office-of-the-attorney-general",
        "Office of the Attorney-General",
        "independent-office",
        "independent-office",
        ("art-156",),
        [Office("attorney-general", "Attorney-General", "attorney-general", ("art-156",))],
    ),
    Body(
        "office-of-the-director-of-public-prosecutions",
        "Office of the Director of Public Prosecutions",
        "independent-office",
        "independent-office",
        ("art-157",),
        [Office("director-of-public-prosecutions", "Director of Public Prosecutions", "prosecutor", ("art-157",))],
    ),
    Body("parliament", "Parliament", "legislative-chamber", "legislative-chamber", ("art-93",)),
    Body(
        "national-assembly",
        "The National Assembly",
        "legislative-chamber",
        "legislative-chamber",
        ("art-95", "art-97"),
        [
            Office(
                "speaker-of-the-national-assembly",
                "Speaker of the National Assembly",
                "presiding-officer",
                ("art-106",),
            ),
            Office("member-of-the-national-assembly", "Member of the National Assembly", "legislator", ("art-97",)),
            Office(
                "leader-of-the-majority-party",
                "Leader of the majority party",
                "party-leader-in-parliament",
                ("art-108",),
            ),
            Office(
                "leader-of-the-minority-party",
                "Leader of the minority party",
                "party-leader-in-parliament",
                ("art-108",),
            ),
        ],
        "parliament",
    ),
    Body(
        "senate",
        "The Senate",
        "legislative-chamber",
        "legislative-chamber",
        ("art-96", "art-98"),
        [
            Office("speaker-of-the-senate", "Speaker of the Senate", "presiding-officer", ("art-106",)),
            Office("member-of-the-senate", "Member of the Senate", "legislator", ("art-98",)),
        ],
        "parliament",
    ),
    Body(
        "parliamentary-service-commission",
        "Parliamentary Service Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-127",),
        commission_offices("parliamentary-service-commission", "art-127"),
    ),
    Body(
        "judiciary",
        "The Judiciary",
        "court",
        "court",
        ("art-159", "art-160"),
        [Office("chief-registrar-of-the-judiciary", "Chief Registrar of the Judiciary", "registrar", ("art-161",))],
    ),
    Body(
        "supreme-court",
        "The Supreme Court",
        "court",
        "court",
        ("art-163",),
        [
            Office("chief-justice", "Chief Justice", "chief-justice", ("art-163", "art-166")),
            Office("deputy-chief-justice", "Deputy Chief Justice", "deputy-chief-justice", ("art-163", "art-166")),
            Office("judge-of-the-supreme-court", "Judge of the Supreme Court", "judge", ("art-163",)),
        ],
        "judiciary",
    ),
    Body(
        "court-of-appeal",
        "The Court of Appeal",
        "court",
        "court",
        ("art-164",),
        [Office("judge-of-the-court-of-appeal", "Judge of the Court of Appeal", "judge", ("art-164",))],
        "judiciary",
    ),
    Body(
        "high-court",
        "The High Court",
        "court",
        "court",
        ("art-165",),
        [Office("judge-of-the-high-court", "Judge of the High Court", "judge", ("art-165",))],
        "judiciary",
    ),
    Body("subordinate-courts", "Subordinate courts", "court", "court", ("art-169",), [], "judiciary"),
    Body(
        "kadhis-courts",
        "Kadhis' courts",
        "court",
        "court",
        ("art-170",),
        [Office("chief-kadhi", "Chief Kadhi", "judge", ("art-170",))],
        "subordinate-courts",
    ),
    Body(
        "judicial-service-commission",
        "Judicial Service Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-171", "art-172"),
        commission_offices("judicial-service-commission", "art-171"),
    ),
    Body(
        "independent-electoral-and-boundaries-commission",
        "Independent Electoral and Boundaries Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-88",),
        commission_offices("independent-electoral-and-boundaries-commission", "art-88"),
    ),
    Body(
        "commission-on-revenue-allocation",
        "Commission on Revenue Allocation",
        "constitutional-commission",
        "independent-commission",
        ("art-215", "art-216"),
        commission_offices("commission-on-revenue-allocation", "art-215"),
    ),
    Body(
        "salaries-and-remuneration-commission",
        "Salaries and Remuneration Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-230",),
        commission_offices("salaries-and-remuneration-commission", "art-230"),
    ),
    Body(
        "public-service-commission",
        "The Public Service Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-233", "art-234"),
        commission_offices("public-service-commission", "art-233"),
    ),
    Body(
        "teachers-service-commission",
        "Teachers Service Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-237",),
        commission_offices("teachers-service-commission", "art-237"),
    ),
    Body(
        "national-police-service-commission",
        "National Police Service Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-246",),
        commission_offices("national-police-service-commission", "art-246"),
    ),
    Body(
        "national-land-commission",
        "National Land Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-67",),
        commission_offices("national-land-commission", "art-67"),
    ),
    Body(
        "kenya-national-human-rights-and-equality-commission",
        "Kenya National Human Rights and Equality Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-59",),
        commission_offices("kenya-national-human-rights-and-equality-commission", "art-59"),
        note="Article 59(4) requires Parliament to split it into separate commissions (human rights, gender and equality, administrative justice); those successors are established by statute.",
    ),
    Body(
        "ethics-and-anti-corruption-commission",
        "Ethics and Anti-Corruption Commission",
        "constitutional-commission",
        "independent-commission",
        ("art-79",),
        [],
        note="Article 79 requires legislation to establish it; it is a statutory body with a constitutional mandate, so its own record belongs with its Act.",
    ),
    Body(
        "office-of-the-controller-of-budget",
        "Office of the Controller of Budget",
        "independent-office",
        "independent-office",
        ("art-228",),
        [Office("controller-of-budget", "Controller of Budget", "controller", ("art-228",))],
    ),
    Body(
        "office-of-the-auditor-general",
        "Office of the Auditor-General",
        "independent-office",
        "independent-office",
        ("art-229",),
        [Office("auditor-general", "Auditor-General", "auditor", ("art-229",))],
    ),
    Body(
        "central-bank-of-kenya",
        "Central Bank of Kenya",
        "independent-office",
        "independent-office",
        ("art-231",),
        [Office("governor-of-the-central-bank", "Governor of the Central Bank", "central-bank-governor", ("art-231",))],
    ),
    Body("national-security-council", "National Security Council", "security-organ", "security-organ", ("art-240",)),
    Body("defence-forces", "Kenya Defence Forces", "security-organ", "security-organ", ("art-241",)),
    Body(
        "national-intelligence-service",
        "National Intelligence Service",
        "security-organ",
        "security-organ",
        ("art-242",),
    ),
    Body(
        "national-police-service",
        "National Police Service",
        "security-organ",
        "security-organ",
        ("art-243", "art-244"),
        [
            Office(
                "inspector-general-of-the-national-police-service",
                "Inspector-General of the National Police Service",
                "inspector-general",
                ("art-245",),
            )
        ],
    ),
]

PATTERNS: dict[str, tuple[str, tuple[str, ...]]] = {
    "independent-commission": (
        "An independent commission: members, appointment, removal and functions common to Chapter Fifteen",
        ("art-248", "art-249", "art-250", "art-251", "art-252", "art-253", "art-254"),
    ),
    "independent-office": (
        "An independent office established by the Constitution",
        ("art-248", "art-249", "art-250", "art-251", "art-252", "art-253", "art-254"),
    ),
    "executive-authority": (
        "Executive authority of the Republic: the President, Deputy President and Cabinet",
        ("art-129", "art-130", "art-131", "art-152"),
    ),
    "legislative-chamber": ("A House of Parliament", ("art-93", "art-94", "art-95", "art-96")),
    "court": ("A court in the system of courts", ("art-159", "art-162", "art-163", "art-164", "art-165", "art-169")),
    "county-government": (
        "A county government: a county assembly and a county executive committee",
        ("art-176", "art-177", "art-178", "art-179", "art-183"),
    ),
    "security-organ": ("A national security organ", ("art-239", "art-240", "art-241", "art-242", "art-243")),
    "public-service-body": ("A body of the public service", ("art-232", "art-233", "art-235", "art-237")),
    "state-officer": (
        "A State officer: oath, conduct and limits on activities",
        ("art-74", "art-75", "art-76", "art-77"),
    ),
    "electoral-unit": ("An electoral unit: a constituency or ward", ("art-89", "art-177")),
    "devolved-unit": ("A county as a unit of devolved government", ("art-6", "art-176", "art-188")),
}


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
    for path in LEGAL.glob("*/provision_versions.csv"):
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
        ["entity_code", "individual_code", "name_kind_code", "language_tag", "name", "is_preferred"],
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
        arts = ", ".join(a.split("-")[1] for a in b.basis)
        lines.append(
            f"| `ke.{b.slug}` {b.name} | {b.kind} | {b.pattern} | {arts} | {', '.join(o.name for o in b.offices) or 'none'} |"
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
