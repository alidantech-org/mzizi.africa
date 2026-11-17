"""Cross-references, legal bases and lineage rows the Constitution builder writes."""

# ruff: noqa: F403, F405
from __future__ import annotations

import csv
import hashlib  # noqa: F401
import re
import shutil  # noqa: F401
import sys
from dataclasses import dataclass  # noqa: F401
from pathlib import Path  # noqa: F401

from constitution_common import *

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
