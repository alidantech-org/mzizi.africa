"""Build the seed CSVs for the Constitution of Kenya, 2010 from the downloaded PDFs and the KLRC link map.

Usage: uv run python scripts/seed/build_constitution.py

Reads (all outside git, in .dev/datasets/): the English NCLR print, the URAIA Kiswahili translation and the KLRC chapter and part
pages. Writes, under seed/data/ke/legal/constitution-2010/, one small folder per chapter (and the preamble and each schedule)
holding provisions.csv, provision_versions.csv, provision_translations.csv and provision_references.csv, plus the instrument and
its version, and the source records (domains, paths, documents, captures) the PDFs and KLRC pages need.
Run it again after a parser change; it overwrites only what it generates.
"""

# ruff: noqa: F403, F405
from __future__ import annotations

import shutil

from constitution_common import *
from constitution_links import *
from constitution_sources import *

from mzizi_extraction.legislation import SWAHILI, parse_instrument


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
                "language_code",
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
                "language_code",
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
