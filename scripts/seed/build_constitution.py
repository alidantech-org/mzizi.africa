"""Build the seed CSVs for the Constitution of Kenya, 2010 from the downloaded PDFs and the KLRC link map.

Usage: uv run python scripts/seed/build_constitution.py

Reads (all outside git, in .dev/datasets/): the English NCLR print, the URAIA Kiswahili translation and the KLRC chapter and part
pages. Writes, under seed/data/ke/legal/constitution-2010/, one small folder per chapter (and the preamble and each schedule)
holding provisions.csv, wordings.csv, translations.csv and references.csv (and, under seed/data/ke/source/constitution-2010/, the
citations and translation relationships), plus the instrument, its name and its edition, the legal effects, and the source records
(domains, addresses, products, editions, artifacts, captures) the PDFs and KLRC pages need.
Run it again after a parser change; it overwrites only what it generates.
"""

# ruff: noqa: F403, F405
from __future__ import annotations

import json
import re
import shutil
from urllib.parse import urlsplit

from constitution_common import *
from constitution_links import *
from constitution_sources import *

from mzizi_extraction.legislation import SWAHILI, parse_instrument


PDF_FILES = {EN_PDF.name: EN_DOC, SW_PDF.name: SW_DOC}


def citation(code: str, locator: str, page: int) -> list[str]:
    """The exact citation behind a wording: a PDF page of the NCLR print, or the KLRC page it was read from."""
    if locator.startswith("http"):
        parts = urlsplit(locator)
        address = re.search(r"/(\d+)-[^/]*$", parts.path)
        if not address:
            raise ValueError(f"{code}: cannot find the page identity in {locator}")
        return [
            code,
            "",
            f"klrc-{address.group(1)}",
            "src.locator.kind.url",
            json.dumps({"url": locator}, sort_keys=True),
            OBSERVED,
        ]
    name = locator.split(" page ")[0]
    return [
        code,
        PDF_FILES[name],
        "",
        "src.locator.kind.page",
        json.dumps({"file": name, "page": page}, sort_keys=True),
        OBSERVED,
    ]


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
        prov, vers, trans, cites, trans_rel = [], [], [], [], []
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
            vers.append([vcode, INSTRUMENT, r.code, VERSION, "en", vcode, OBSERVED, text])
            cites.append(citation(vcode, locator, n.page))
            twin = sw_rows.get(r.code)
            sw_text = (twin.node.text.strip() or twin.node.title.strip()) if twin else ""
            if sw_text:
                tcode = f"{vcode}.sw-uraia"
                trans.append(
                    [
                        tcode,
                        vcode,
                        "sw",
                        sw_text,
                        "human",
                        '{"basis": "URAIA translation of the NCLR print of 27 August 2010", "alignment": "same article, clause and paragraph numbers"}',
                        "proposed",
                        "Earlier classification: unofficial.",
                    ]
                )
                trans_rel.append(
                    [
                        f"{tcode}.{SW_DOC}",
                        "src.relationship.kind.translated-from",
                        "legal.translations",
                        tcode,
                        SW_DOC,
                        "Translation read from this artifact.",
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
            base / "wordings.csv",
            [
                "code",
                "instrument_code",
                "provision_code",
                "edition_code",
                "language_code",
                "citation_code",
                "observed_at",
                "text",
            ],
            vers,
        )
        write(
            base / "translations.csv",
            ["code", "wording_code", "language_code", "text", "method", "produced_by", "review_status", "notes"],
            trans,
        )
        source_base = SOURCE_OUT / "constitution-2010" / folder
        write(
            source_base / "citations.csv",
            ["code", "artifact_code", "address_code", "locator_kind_code", "locator", "recorded_at"],
            cites,
        )
        if trans_rel:
            write(
                source_base / "translations.relationships.csv",
                ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"],
                trans_rel,
            )
    write(
        OUT.parent / "instruments.csv",
        ["code", "kind_code", "issuing_unit_code", "enacted_on", "published_on"],
        [[INSTRUMENT, "leg.instrument.kind.constitution", "ke", "2010-08-27", "2010-08-27"]],
    )
    write(
        OUT.parent / "names.csv",
        ["code", "instrument_code", "language_code", "name", "kind_code", "is_preferred"],
        [
            [
                f"{INSTRUMENT}.formal-title.und",
                INSTRUMENT,
                "und",
                "The Constitution of Kenya, 2010",
                "leg.name.kind.formal-title",
                "true",
            ]
        ],
    )
    write(
        OUT.parent / "editions.csv",
        ["code", "instrument_code", "designation", "observed_at", "commenced_on"],
        [[VERSION, INSTRUMENT, "2010, National Council for Law Reporting print", OBSERVED, "2010-08-27"]],
    )
    write(
        SOURCE_OUT / "editions.relationships.csv",
        ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"],
        [
            [
                f"{VERSION}.{EN_DOC}",
                "src.relationship.kind.prepared-from",
                "legal.editions",
                VERSION,
                EN_DOC,
                "Edition read from this artifact.",
            ]
        ],
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
