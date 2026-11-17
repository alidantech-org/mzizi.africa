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
    """Find "Article 24 (1) (b)", "Chapter Four" and "Fifth Schedule" mentions in each English wording and write them as references."""
    provisions: set[str] = set()
    for path in OUT.glob("*/provisions.csv"):
        with path.open(newline="", encoding="utf-8") as handle:
            provisions.update(row["code"] for row in csv.DictReader(handle))
    total = 0
    for folder in sorted(OUT.iterdir()):
        if not folder.is_dir():
            continue
        rows: list[list[str]] = []
        with (folder / "wordings.csv").open(newline="", encoding="utf-8") as handle:
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
                            f"{version['code']}.s{start}-{hashlib.sha256(f'{code}|{end}'.encode()).hexdigest()[:10]}",
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
            folder / "references.csv",
            [
                "code",
                "wording_code",
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
    """Record what the Constitution establishes, defines or governs: the country, the counties, constituencies and kinds, as legal effects."""
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
    shorts = {"geography.features": "ftr", "reference.values": "val"}
    effects = [
        [
            f"{provision}.{relation}.{shorts[table]}.{record}",
            f"{provision}.v-2010",
            table,
            record,
            f"leg.effect.kind.{relation}",
            valid_from,
            note,
            "proposed",
            OBSERVED,
        ]
        for table, record, provision, relation, note, valid_from in rows
    ]
    write(
        REPO / "seed/data/ke/legal/effects/geography.effects.csv",
        [
            "code",
            "wording_code",
            "subject_table",
            "subject_code",
            "kind_code",
            "valid_from",
            "explanation",
            "review_status",
            "observed_at",
        ],
        effects,
    )
    return len(effects)


def lineage() -> int:
    """Say what each generated CSV was prepared from: the English capture, and the Kiswahili capture for the translations."""
    sys.path.insert(0, str(REPO / "source/packages/manifest/src"))
    from mzizi_manifest.features.data.datasets import dataset_code, is_catalogue

    seed = REPO / "seed"
    rows: list[list[str]] = []
    prepared, supports = "src.relationship.kind.prepared-from", "src.relationship.kind.supports"

    def add(product: str, capture: str, kind: str, method: str) -> None:
        role = "raw" if kind == prepared else "lookup"
        rows.append([f"{product}.{capture}", kind, product, capture, f"[{role}] {method}"])

    for path in sorted((seed / "data/ke/legal").rglob("*.csv")):
        if is_catalogue(seed, path):
            continue
        code = dataset_code(seed, path)
        name = path.stem
        if name == "translations":
            add(
                code,
                f"cap-{SW_DOC}",
                prepared,
                "Kiswahili text read from the URAIA translation and aligned to the English provision by article, clause and paragraph number.",
            )
            add(code, f"cap-{EN_DOC}", supports, "The English provision each translation belongs to.")
        elif name == "references":
            add(
                code,
                f"cap-{EN_DOC}",
                prepared,
                "Mentions of other provisions found in the English wording by pattern (Article n, Chapter, Schedule); spans count characters of the stored text.",
            )
        elif name == "geography-effects" or name == "geography.effects":
            add(
                code,
                f"cap-{EN_DOC}",
                supports,
                "Articles and Schedule 1 items that establish the country, counties and constituencies.",
            )
        else:
            add(
                code,
                f"cap-{EN_DOC}",
                prepared,
                "Provisions read from the English NCLR print: structure from the numbering, text from the page, headings from the arrangement of articles.",
            )
    ensure(
        REPO / "seed/data/ke/source/relationships.csv",
        ["code", "kind_code", "output_product_code", "input_capture_code", "method"],
        rows,
        key=0,
    )
    return len(rows)
