"""Build the seed CSVs for the Constitution of Kenya, 2010 from the downloaded PDFs and the KLRC link map.

Usage: uv run python scripts/seed/build_constitution.py

Reads (all outside git, in .dev/datasets/): the English NCLR print, the URAIA Kiswahili translation and the KLRC chapter and part
pages. Writes, under seed/data/ke/legal/constitution-2010/, one small folder per chapter (and the preamble and each schedule)
holding provisions.csv, provision_versions.csv, provision_translations.csv and provision_references.csv, plus the instrument and
its version, and the source records (domains, paths, documents, captures) the PDFs and KLRC pages need.
Run it again after a parser change; it overwrites only what it generates.
"""

from __future__ import annotations

import csv
import hashlib
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "source/packages/extraction/src"))

from mzizi_extraction.legislation import SWAHILI, Node, parse_instrument  # noqa: E402

DATASETS = REPO / ".dev/datasets"
EN_PDF = DATASETS / "kenya-constitution/en-constitutionnet-final-constitution-2010.pdf"
SW_PDF = DATASETS / "kenya-constitution/sw-uraia-katiba-ya-kenya.pdf"
KLRC = DATASETS / "klrc"
OUT = REPO / "seed/data/ke/legal/constitution-2010"
SOURCE_OUT = REPO / "seed/data/ke/source"
INSTRUMENT = "ke.constitution-2010"
VERSION = f"{INSTRUMENT}.v-2010"
OBSERVED = "2026-11-17T02:00:00+03:00"
EN_DOC = "ke-constitution-2010-en-nclr"
SW_DOC = "ke-constitution-2010-sw-uraia"
SW_DRAFT_DOC = "ke-constitution-2010-sw-proposed-draft"


@dataclass
class Row:
    code: str
    node: Node
    parent: str
    position: int
    folder: str


def slug_part(node: Node, position: int) -> str:
    d = node.designation
    if node.kind == "chapter":
        return f"ch-{d.split()[1]}"
    if node.kind == "part":
        return f"pt-{d.split()[1]}"
    if node.kind == "article":
        return f"art-{d.split()[1]}"
    if node.kind == "schedule":
        return f"sch-{d.split()[1]}"
    if node.kind == "preamble":
        return "preamble"
    if node.kind in ("item", "definition"):
        return f"{'it' if node.kind == 'item' else 'def'}-{position}"
    return f"{'cl' if node.kind == 'clause' else 'pa' if node.kind == 'paragraph' else 'sp'}-{d.strip('()').lower()}"


def flatten(root: Node) -> list[Row]:
    rows: list[Row] = []

    def visit(node: Node, parent_code: str, folder: str, container_code: str) -> None:
        for position, child in enumerate(node.children, start=1):
            part = slug_part(child, position)
            # Articles keep a short code under the instrument; their parent is the part or chapter they sit in.
            if child.kind in ("chapter", "preamble", "schedule"):
                code, child_folder = f"{INSTRUMENT}.{part}", folder
            elif child.kind == "part":
                code, child_folder = f"{container_code}.{part}", folder
            elif child.kind == "article":
                code, child_folder = f"{INSTRUMENT}.{part}", folder
            else:
                code, child_folder = f"{container_code}.{part}", folder
            if child.kind == "chapter":
                child_folder = f"chapter-{int(child.designation.split()[1]):02d}"
            elif child.kind == "preamble":
                child_folder = "preamble"
            elif child.kind == "schedule":
                child_folder = f"schedule-{child.designation.split()[1]}"
            rows.append(Row(code, child, parent_code, position, child_folder))
            visit(child, code, child_folder, code)

    visit(root, "", "", INSTRUMENT)
    return rows


def klrc_links() -> dict[int, str]:
    found: dict[int, str] = {}
    text = (KLRC / "all-links.txt").read_text(encoding="utf-8").split()
    for url in text:
        parts = url.split("/")
        if len(parts) < 6:
            continue
        match = re.match(r"^\d+-(?:article-)?(\d+)-", parts[-1])
        if match and len(parts) >= 5:
            found[int(match.group(1))] = "https://www.klrc.go.ke" + url
    return found


def write(path: Path, header: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


def ensure(path: Path, header: list[str], rows: list[list[str]], key: int = 0) -> None:
    """Add or replace rows by their first cell, keeping the rest of the file as it is."""
    existing: list[list[str]] = []
    if path.exists():
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.reader(handle)
            old_header = next(reader)
            existing = [dict(zip(old_header, r, strict=False)) for r in reader]  # type: ignore[misc]
            existing = [[r.get(h, "") for h in header] for r in existing]  # type: ignore[attr-defined]
    keep = [r for r in existing if r[key] not in {n[key] for n in rows}]
    write(path, header, keep + rows)


def sources() -> None:
    """Publishers, sources, domains, paths, documents and captures for the PDFs and the KLRC pages."""
    glob = REPO / "seed/data/global/source"
    ensure(
        glob / "publishers.csv",
        ["code", "name", "kind_code", "country_code"],
        [
            ["nclr", "National Council for Law Reporting (Kenya Law)", "src.publisher.kind.government-agency", "ke"],
            ["klrc", "Kenya Law Reform Commission", "src.publisher.kind.government-agency", "ke"],
            [
                "constitutionnet",
                "ConstitutionNet (International IDEA)",
                "src.publisher.kind.international-organisation",
                "",
            ],
            ["uraia", "URAIA Trust", "src.publisher.kind.non-profit", "ke"],
            [
                "ke-attorney-general",
                "Office of the Attorney General of Kenya",
                "src.publisher.kind.government-agency",
                "ke",
            ],
        ],
    )
    ensure(
        glob / "sources.csv",
        ["code", "title", "kind", "publisher_code", "description"],
        [
            [
                "klrc-constitution",
                "Kenya Law Reform Commission: the Constitution of Kenya",
                "website",
                "klrc",
                "klrc.go.ke publishes the Constitution as one page per chapter, part and article.",
            ],
            [
                "constitutionnet",
                "ConstitutionNet",
                "website",
                "constitutionnet",
                "constitutionnet.org hosts copies of constitutions, including the NCLR print and the Kiswahili proposed constitution.",
            ],
            [
                "uraia",
                "URAIA Trust",
                "website",
                "uraia",
                "uraia.or.ke publishes a Kiswahili translation of the Constitution.",
            ],
            [
                EN_DOC,
                "Constitution of Kenya, 2010, English (National Council for Law Reporting print)",
                "dataset",
                "nclr",
                "LAWS OF KENYA, The Constitution of Kenya, 2010, published by the National Council for Law Reporting with the authority of the Attorney General. The English text governs (Article 259).",
            ],
            [
                SW_DOC,
                "Katiba ya Kenya, 2010, Kiswahili translation (URAIA)",
                "dataset",
                "uraia",
                "A Kiswahili translation made from the NCLR print of 27 August 2010. Not the gazetted text; the English version governs.",
            ],
            [
                SW_DRAFT_DOC,
                "Katiba Inayopendekezwa ya Kenya, 6 May 2010 (Kiswahili proposed constitution)",
                "dataset",
                "ke-attorney-general",
                "The Kiswahili proposed constitution published before the August 2010 referendum. A draft, not the final text.",
            ],
        ],
    )
    ensure(
        glob / "domains.csv",
        ["code", "host", "source_code"],
        [
            ["klrc-main", "www.klrc.go.ke", "klrc-constitution"],
            ["constitutionnet-main", "constitutionnet.org", "constitutionnet"],
            ["uraia-main", "uraia.or.ke", "uraia"],
        ],
    )
    paths: list[list[str]] = []
    seen: set[str] = set()
    for url in sorted((KLRC / "all-links.txt").read_text(encoding="utf-8").split(), key=lambda u: (u.count("/"), u)):
        ident = re.search(r"/(\d+)-[^/]*$", url)
        if ident and ident.group(1) not in seen:
            seen.add(ident.group(1))
            paths.append(
                [
                    f"klrc-{ident.group(1)}",
                    "klrc-main",
                    url,
                    "page",
                    url.rsplit("/", 1)[-1].split("-", 1)[-1].replace("-", " "),
                ]
            )
    paths += [
        [
            "constitutionnet-en-pdf",
            "constitutionnet-main",
            "/sites/default/files/final_constitution_of_kenya_2010.pdf",
            "file",
            "The English NCLR print as a PDF.",
        ],
        [
            "constitutionnet-sw-draft-pdf",
            "constitutionnet-main",
            "/sites/default/files/kenya_swahili_constitution_of_2010.pdf",
            "file",
            "The Kiswahili proposed constitution of 6 May 2010.",
        ],
        [
            "uraia-sw-pdf",
            "uraia-main",
            "/wp-content/uploads/2026/09/Katiba-ya-Kenya.pdf",
            "file",
            "The URAIA Kiswahili translation.",
        ],
    ]
    ensure(glob / "paths.csv", ["code", "domain_code", "path", "kind", "note"], paths)
    files = [
        (
            EN_DOC,
            EN_PDF,
            "nclr",
            "constitutionnet-en-pdf",
            "http://constitutionnet.org/sites/default/files/final_constitution_of_kenya_2010.pdf",
            "Laws of Kenya: the Constitution of Kenya, 2010, National Council for Law Reporting with the authority of the Attorney General",
            "Kenya Law publishes laws for public use; reuse with credit to the National Council for Law Reporting.",
        ),
        (
            SW_DOC,
            SW_PDF,
            "uraia",
            "uraia-sw-pdf",
            "https://uraia.or.ke/wp-content/uploads/2026/09/Katiba-ya-Kenya.pdf",
            "URAIA Trust, Katiba ya Kenya (Kiswahili translation of the NCLR print of 27 August 2010)",
            "Published by URAIA for public use; an unofficial translation, the English text governs.",
        ),
        (
            SW_DRAFT_DOC,
            DATASETS / "kenya-constitution/sw-constitutionnet-katiba-inayopendekezwa-2010-05-06.pdf",
            "ke-attorney-general",
            "constitutionnet-sw-draft-pdf",
            "https://constitutionnet.org/sites/default/files/kenya_swahili_constitution_of_2010.pdf",
            "Republic of Kenya, Katiba Inayopendekezwa ya Kenya, 6 May 2010, via ConstitutionNet",
            "A pre-referendum draft published for public use; not the final text.",
        ),
    ]
    docs, caps, entries = [], [], []
    import datetime

    for code, path, pub, pcode, url, credit, rights in files:
        data = path.read_bytes()
        docs.append(
            [
                code,
                f"{credit.split(',')[0] if False else code}",
                "src.document.kind.legal-text",
                hashlib.sha256(data).hexdigest(),
                "application/pdf",
                str(len(data)),
                pub,
            ]
        )
        when = datetime.datetime.fromtimestamp(path.stat().st_mtime).astimezone().isoformat(timespec="seconds")
        caps.append([f"cap-{code}", code, pcode, code, url, when, '{"fetched_with": "curl", "headers_kept": false}'])
        entries.append((code, path, credit, rights))
    titles = {
        EN_DOC: "The Constitution of Kenya, 2010 (English, NCLR print)",
        SW_DOC: "Katiba ya Kenya, 2010 (Kiswahili, URAIA translation)",
        SW_DRAFT_DOC: "Katiba Inayopendekezwa ya Kenya, 6 May 2010 (Kiswahili draft)",
    }
    for d in docs:
        d[1] = titles[d[0]]
    ke = REPO / "seed/data/ke/source"
    ensure(
        ke / "documents.csv",
        ["code", "title", "kind_code", "sha256", "content_type", "size_bytes", "publisher_code"],
        docs,
    )
    ensure(
        ke / "captures.csv",
        ["code", "source_code", "path_code", "document_code", "original_url", "retrieved_at", "response_metadata"],
        caps,
    )
    lines = (ke / "_files.yaml").read_text(encoding="utf-8").rstrip("\n").split("\n")
    have = {text.strip().rstrip(":") for text in lines}
    for code, path, credit, rights in entries:
        if code in have:
            continue
        lines += [
            f"  {code}:",
            f"    path: {path.relative_to(REPO)}",
            f'    credit: "{credit}"',
            f'    rights: "{rights}"',
        ]
    (ke / "_files.yaml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def reference_values() -> None:
    ref = REPO / "seed/data/global/reference"
    ensure(
        ref / "schemes.csv",
        ["code", "title", "owner_snapshot"],
        [["leg.instrument.kind", "Kinds of legal instrument", "mzizi curated"]],
    )
    ensure(
        ref / "values/leg.values.csv",
        ["code", "scheme_code", "label", "parent_code"],
        [
            ["leg.instrument.kind.constitution", "leg.instrument.kind", "Constitution", ""],
            ["leg.instrument.kind.act", "leg.instrument.kind", "Act of Parliament", ""],
            ["leg.instrument.kind.regulation", "leg.instrument.kind", "Regulation", ""],
        ],
    )
    ensure(
        ref / "values/src.values.csv",
        ["code", "scheme_code", "label"],
        [
            ["src.document.kind.legal-text", "src.document.kind", "Legal text"],
            ["src.dataset.category.legal", "src.dataset.category", "Legal"],
        ],
    )


ARTICLE_HEAD = re.compile(r"\bArticles?\s+(?=\d)")
ITEM = re.compile(r"(\d+)(?:\s*\((\d+)\))?(?:\s*\(([a-z])\))?")
SEPARATOR = re.compile(r"\s*(?:,\s*(?:and|or)?|\band\b|\bor\b|\bto\b|–|—)\s*")
CHAPTER_REF = re.compile(
    r"\bChapter\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen)\b"
)
SCHEDULE_REF = re.compile(r"\b(First|Second|Third|Fourth|Fifth|Sixth)\s+Schedule\b")
WORDS = {
    w: i
    for i, w in enumerate(
        [
            "",
            "One",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
            "Seven",
            "Eight",
            "Nine",
            "Ten",
            "Eleven",
            "Twelve",
            "Thirteen",
            "Fourteen",
            "Fifteen",
            "Sixteen",
            "Seventeen",
            "Eighteen",
        ]
    )
}
ORDINALS = {"First": 1, "Second": 2, "Third": 3, "Fourth": 4, "Fifth": 5, "Sixth": 6}
RELATIONS = [
    ("subject to", "subject-to"),
    ("in accordance with", "in-accordance-with"),
    ("read with", "read-with"),
    ("as defined in", "as-defined-in"),
    ("defined in", "as-defined-in"),
    ("under", "under"),
]


def relation_before(text: str, start: int) -> str:
    before = text[max(0, start - 24) : start].lower()
    for phrase, relation in RELATIONS:
        if before.rstrip().endswith(phrase) or phrase in before[-len(phrase) - 3 :]:
            return relation
    return "refers-to"


def references() -> int:
    """Find "Article 24 (1) (b)", "Chapter Four" and "Fifth Schedule" mentions in each English wording and write them as links."""
    provisions: set[str] = set()
    for path in OUT.glob("*/provisions.csv"):
        with path.open(newline="", encoding="utf-8") as handle:
            provisions.update(row["code"] for row in csv.DictReader(handle))
    total = 0
    for folder in sorted(OUT.iterdir()):
        if not folder.is_dir():
            continue
        rows: list[list[str]] = []
        with (folder / "provision_versions.csv").open(newline="", encoding="utf-8") as handle:
            for version in csv.DictReader(handle):
                text, own = version["text"], version["provision_code"]
                found: list[tuple[int, int, str, str]] = []
                for head in ARTICLE_HEAD.finditer(text):
                    plural = head.group(0).strip().endswith("s")
                    position = head.end()
                    while True:
                        item = ITEM.match(text, position)
                        if not item:
                            break
                        code = f"{INSTRUMENT}.art-{item.group(1)}"
                        if item.group(2):
                            code += f".cl-{item.group(2)}"
                        if item.group(3):
                            code += f".pa-{item.group(3)}"
                        while code not in provisions and "." in code.removeprefix(INSTRUMENT + "."):
                            code = code.rsplit(".", 1)[0]
                        if code in provisions:
                            start = head.start() if position == head.end() else position
                            found.append((start, item.end(), code, relation_before(text, head.start())))
                        position = item.end()
                        if not plural:
                            break
                        sep = SEPARATOR.match(text, position)
                        if not sep or not ITEM.match(text, sep.end()):
                            break
                        position = sep.end()
                for match in CHAPTER_REF.finditer(text):
                    code = f"{INSTRUMENT}.ch-{WORDS[match.group(1)]}"
                    if code in provisions:
                        found.append((match.start(), match.end(), code, relation_before(text, match.start())))
                for match in SCHEDULE_REF.finditer(text):
                    code = f"{INSTRUMENT}.sch-{ORDINALS[match.group(1)]}"
                    if code in provisions:
                        found.append((match.start(), match.end(), code, relation_before(text, match.start())))
                seen: set[int] = set()
                for start, end, code, relation in sorted(found):
                    if start in seen or code == own or code.startswith(own + "."):
                        continue
                    seen.add(start)
                    rows.append(
                        [
                            version["code"],
                            "",
                            code,
                            relation,
                            str(start),
                            str(end),
                            text[start:end],
                            "parser",
                            "proposed",
                        ]
                    )
        write(
            folder / "provision_references.csv",
            [
                "source_version_code",
                "translation_code",
                "target_provision_code",
                "relation",
                "span_start",
                "span_end",
                "span_text",
                "method",
                "review_status",
            ],
            rows,
        )
        total += len(rows)
    return total


def bases() -> int:
    """Link what the Constitution creates or governs to the provision that does it: the country, the counties, constituencies and kinds."""
    ids: dict[str, str] = {}
    with (REPO / "seed/data/ke/geo/counties/identifiers.csv").open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["identifier_scheme_code"].endswith("ke-iebc-pcode"):
                ids[row["feature_code"]] = row["external_id"]
    rows: list[list[str]] = [
        ["geography.features", "ke", f"{INSTRUMENT}.art-4", "established-by", "Declaration of the Republic.", ""],
        ["geography.features", "ke", f"{INSTRUMENT}.art-5", "defined-by", "The territory of Kenya.", ""],
    ]
    for county, pcode in sorted(ids.items(), key=lambda kv: kv[1]):
        number = int(pcode.split("-")[1])
        rows.append(
            [
                "geography.features",
                county,
                f"{INSTRUMENT}.sch-1.it-{number}",
                "established-by",
                f"County {number:03d} of the First Schedule.",
                "2013-03-04",
            ]
        )
        rows.append(
            [
                "geography.features",
                county,
                f"{INSTRUMENT}.art-6",
                "governed-by",
                "Devolution and access to services.",
                "2013-03-04",
            ]
        )
    with (REPO / "seed/data/ke/geo/constituencies/features.csv").open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                [
                    "geography.features",
                    row["code"],
                    f"{INSTRUMENT}.art-89",
                    "established-by",
                    "The 290 constituencies; delimited by the IEBC.",
                    "2013-03-04",
                ]
            )
    for value, art, note in [
        ("geo.feature.kind.country", "art-4", "The Republic."),
        ("geo.feature.kind.county", "art-6", "Counties of the devolved government."),
        ("geo.feature.kind.constituency", "art-89", "Constituencies for the National Assembly."),
        ("geo.feature.kind.ward", "art-177", "Wards, whose elected members sit in the county assemblies."),
    ]:
        rows.append(["reference.values", value, f"{INSTRUMENT}.{art}", "defined-by", note, ""])
    write(
        REPO / "seed/data/ke/legal/bases/geography.bases.csv",
        ["table_name", "record_code", "provision_code", "relation", "note", "valid_from"],
        rows,
    )
    return len(rows)


def lineage() -> int:
    """Say what each generated CSV was prepared from: the English capture, and the Kiswahili capture for the translations."""
    sys.path.insert(0, str(REPO / "source/packages/manifest/src"))
    from mzizi_manifest.features.data.datasets import dataset_code

    seed = REPO / "seed"
    rows: list[list[str]] = []
    for path in sorted((seed / "data/ke/legal").rglob("*.csv")):
        code = dataset_code(seed, path)
        name = path.stem
        if name == "provision_translations":
            rows.append(
                [
                    code,
                    f"cap-{SW_DOC}",
                    "raw",
                    "Kiswahili text read from the URAIA translation and aligned to the English provision by article, clause and paragraph number.",
                ]
            )
            rows.append([code, f"cap-{EN_DOC}", "lookup", "The English provision each translation belongs to."])
        elif name == "provision_references":
            rows.append(
                [
                    code,
                    f"cap-{EN_DOC}",
                    "raw",
                    "Mentions of other provisions found in the English wording by pattern (Article n, Chapter, Schedule); spans count characters of the stored text.",
                ]
            )
        elif name == "geography.bases":
            rows.append(
                [
                    code,
                    f"cap-{EN_DOC}",
                    "lookup",
                    "Articles and Schedule 1 items that establish the country, counties and constituencies.",
                ]
            )
        else:
            rows.append(
                [
                    code,
                    f"cap-{EN_DOC}",
                    "raw",
                    "Provisions read from the English NCLR print: structure from the numbering, text from the page, headings from the arrangement of articles.",
                ]
            )
    ensure(
        REPO / "seed/data/ke/source/dataset_lineage.csv",
        ["dataset_code", "input_capture_code", "role", "method"],
        [r for r in rows],
        key=0,
    )
    return len(rows)


def main() -> None:
    english = parse_instrument(str(EN_PDF), 11, 194, title="The Constitution of Kenya, 2010", toc_pages=(1, 11))
    swahili = parse_instrument(str(SW_PDF), 19, 259, title="Katiba ya Kenya, 2010", layout=SWAHILI)
    en_rows = flatten(english.root)
    sw_rows = {r.code: r for r in flatten(swahili.root)}
    links = klrc_links()
    shutil.rmtree(OUT, ignore_errors=True)
    by_folder: dict[str, list[Row]] = {}
    for row in en_rows:
        by_folder.setdefault(row.folder, []).append(row)
    translated = missing = 0
    for folder, items in by_folder.items():
        prov, vers, trans = [], [], []
        for r in items:
            n = r.node
            prov.append(
                [
                    r.code,
                    INSTRUMENT,
                    r.parent if r.parent != INSTRUMENT else "",
                    n.kind,
                    n.designation,
                    n.title if n.kind != "article" or n.title else "",
                    str(r.position),
                ]
            )
            body = n.text.strip()
            heading = n.title.strip() if n.kind in ("chapter", "part", "article", "schedule", "preamble") else ""
            text = body or heading
            if not text:
                continue
            article = next((c.split("art-")[1].split(".")[0] for c in [r.code] if "art-" in c), None)
            locator = links.get(int(article), "") if article else ""
            if not locator:
                locator = f"{EN_PDF.name} page {n.page}"
            vcode = f"{r.code}.v-2010"
            vers.append([vcode, INSTRUMENT, VERSION, r.code, "en", locator, OBSERVED, text])
            twin = sw_rows.get(r.code)
            sw_text = (twin.node.text.strip() or twin.node.title.strip()) if twin else ""
            if sw_text:
                trans.append(
                    [
                        f"{vcode}.sw-uraia",
                        vcode,
                        "sw",
                        sw_text,
                        "unofficial",
                        "proposed",
                        SW_DOC,
                        '{"basis": "URAIA translation of the NCLR print of 27 August 2010", "alignment": "same article, clause and paragraph numbers"}',
                    ]
                )
                translated += 1
            else:
                missing += 1
        base = OUT / folder
        write(
            base / "provisions.csv",
            ["code", "instrument_code", "parent_code", "kind", "designation", "title", "position"],
            prov,
        )
        write(
            base / "provision_versions.csv",
            [
                "code",
                "instrument_code",
                "instrument_version_code",
                "provision_code",
                "language_tag",
                "locator",
                "observed_at",
                "text",
            ],
            vers,
        )
        write(
            base / "provision_translations.csv",
            [
                "code",
                "provision_version_code",
                "language_tag",
                "text",
                "kind",
                "review_status",
                "document_code",
                "produced_by",
            ],
            trans,
        )
    write(
        OUT.parent / "instruments.csv",
        ["code", "title", "kind_code", "issuing_unit_code", "enacted_on", "published_on"],
        [
            [
                INSTRUMENT,
                "The Constitution of Kenya, 2010",
                "leg.instrument.kind.constitution",
                "ke",
                "2010-08-27",
                "2010-08-27",
            ]
        ],
    )
    write(
        OUT.parent / "instrument_versions.csv",
        ["code", "instrument_code", "edition", "document_code", "observed_at", "commenced_on"],
        [[VERSION, INSTRUMENT, "2010, National Council for Law Reporting print", EN_DOC, OBSERVED, "2010-08-27"]],
    )
    sources()
    reference_values()
    refs = references()
    lineage()
    linked = bases()
    print(
        f"english: {english.articles} articles, {len(en_rows)} provisions; swahili articles {swahili.articles}; translated {translated}, no translation {missing}"
    )
    print(f"references found: {refs}; legal bases: {linked}")
    print(f"klrc article links: {len(links)} of 264")


if __name__ == "__main__":
    main()
