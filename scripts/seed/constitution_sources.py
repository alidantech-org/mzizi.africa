"""The source records (domains, paths, documents, captures) and reference values the Constitution builder writes."""

# ruff: noqa: F403, F405
from __future__ import annotations

import csv  # noqa: F401
import hashlib
import re
import shutil  # noqa: F401
import sys  # noqa: F401
from dataclasses import dataclass  # noqa: F401
from pathlib import Path  # noqa: F401

from constitution_common import *


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
