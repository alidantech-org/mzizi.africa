"""The Legal part of the schema-ownership seed conversion: names, editions, wordings with citations, translations, references, effects."""

# ruff: noqa: F403, F405
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlsplit

import yaml
from ownership_plan import *
from ownership_plan import DATA, REPO, Plan, cells, digest, read, rel, table_shorts  # noqa: F401
from ownership_source import Source

# ------------------------------------------------------------------------------------------------------------- legal
PDF_LOCATOR = re.compile(r"^(?P<file>\S+\.pdf) page (?P<page>\d+)$")


def convert_legal(plan: Plan, state: Source) -> None:
    legal = DATA / "ke/legal"
    ks = DATA / "ke/source"
    instruments_csv, versions_csv = legal / "instruments.csv", legal / "instrument_versions.csv"
    if not versions_csv.exists():
        plan.lines.append("  legal already converted")
        return
    shorts = table_shorts()
    files = yaml.safe_load((ks / "_files.yaml").read_text(encoding="utf-8"))
    entries = files.get("artifacts") or files["documents"]
    artifact_by_file = {Path(entry["path"]).name: code for code, entry in entries.items()}
    # instruments + names
    instruments = read(instruments_csv)
    names = [
        [f"{row['code']}.formal-title.und", row["code"], "und", row["title"], NAME_KIND, "true"] for row in instruments
    ]
    plan.write(
        instruments_csv,
        ["code", "kind_code", "issuing_unit_code", "enacted_on", "published_on"],
        cells(instruments, ["code", "kind_code", "issuing_unit_code", "enacted_on", "published_on"]),
    )
    plan.write(
        legal / "names.csv", ["code", "instrument_code", "language_code", "name", "kind_code", "is_preferred"], names
    )
    plan.reconcile(
        "legal.instruments title -> legal.names",
        len(instruments),
        len(names),
        "(language und: the title asserted none)",
    )
    # editions + edition/document relationships
    versions = read(versions_csv)
    editions = [[v["code"], v["instrument_code"], v["edition"], v["observed_at"], v["commenced_on"]] for v in versions]
    plan.write(
        legal / "editions.csv",
        ["code", "instrument_code", "designation", "observed_at", "commenced_on"],
        editions,
        keep_empty=True,
    )
    edition_sources = [
        [
            f"{v['code']}.{v['document_code']}",
            KIND_PREPARED,
            "legal.editions",
            v["code"],
            v["document_code"],
            "Edition read from this artifact.",
        ]
        for v in versions
    ]
    plan.write(
        ks / "editions.relationships.csv",
        ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"],
        edition_sources,
    )
    plan.reconcile("legal.instrument_versions -> legal.editions", len(versions), len(editions))
    plan.removes.append(versions_csv)
    plan.mapping["legal.instrument_versions->legal.editions"] = {v["code"]: v["code"] for v in versions}

    # addresses for URL locators
    known = dict(state.addresses)
    extra: list[list[str]] = []
    wording_of_provision: dict[str, str] = {}
    text_of: dict[str, str] = {}
    total = {"wordings": 0, "translations": 0, "references": 0}
    old_count = {"wordings": 0, "translations": 0, "references": 0}
    translation_text: dict[str, str] = {}
    chapters = sorted(p for p in (legal / "constitution-2010").iterdir() if p.is_dir())
    for chapter in chapters:
        pv, pt, pr = (
            chapter / "provision_versions.csv",
            chapter / "provision_translations.csv",
            chapter / "provision_references.csv",
        )
        versions_rows = read(pv)
        old_count["wordings"] += len(versions_rows)
        wordings, citations = [], []
        for row in versions_rows:
            code = row["code"]
            locator = row["locator"]
            match = PDF_LOCATOR.match(locator)
            if match:
                artifact = artifact_by_file.get(match["file"])
                if artifact is None:
                    plan.problems.append(
                        f"{rel(pv)}: {code}: locator file {match['file']!r} is not a registered original"
                    )
                    continue
                citation = [
                    code,
                    artifact,
                    "",
                    LOCATOR_PAGE,
                    json.dumps({"file": match["file"], "page": int(match["page"])}, sort_keys=True),
                    row["observed_at"],
                ]
            elif locator.startswith("http"):
                parts = urlsplit(locator)
                domain = state.hosts.get(parts.netloc)
                if domain is None:
                    plan.problems.append(f"{rel(pv)}: {code}: no domain for {parts.netloc}")
                    continue
                key = (domain, parts.path + ("?" + parts.query if parts.query else ""))
                address = known.get(key)
                if address is None:
                    slug = re.sub(r"[^a-z0-9]+", "-", parts.path.rsplit("/", 1)[-1].lower()).strip("-") or "page"
                    address = f"{domain.removesuffix('-main')}-{slug[:60]}-{digest(parts.path, size=6)}"
                    known[key] = address
                    extra.append(
                        [
                            address,
                            domain,
                            "page",
                            "GET",
                            parts.path,
                            parts.query,
                            "Page a Constitution wording was read from.",
                        ]
                    )
                citation = [
                    code,
                    "",
                    address,
                    LOCATOR_URL,
                    json.dumps({"url": locator}, sort_keys=True),
                    row["observed_at"],
                ]
            else:
                plan.problems.append(f"{rel(pv)}: {code}: locator {locator!r} is neither a PDF page nor a link")
                continue
            citations.append(citation)
            wordings.append(
                [
                    code,
                    row["instrument_code"],
                    row["provision_code"],
                    row["instrument_version_code"],
                    row["language_code"],
                    code,
                    row["observed_at"],
                    row["text"],
                ]
            )
            if row["language_code"] == "en":
                wording_of_provision.setdefault(row["provision_code"], code)
            text_of[code] = row["text"]
        plan.write(
            chapter / "wordings.csv",
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
            wordings,
            keep_empty=True,
        )
        source_dir = ks / "constitution-2010" / chapter.name
        plan.write(
            source_dir / "citations.csv",
            ["code", "artifact_code", "address_code", "locator_kind_code", "locator", "recorded_at"],
            citations,
        )
        total["wordings"] += len(wordings)
        plan.removes.append(pv)

        translations = read(pt)
        old_count["translations"] += len(translations)
        out_t, rel_t = [], []
        for row in translations:
            method = "machine" if row["kind"] == "machine-proposed" else "human"
            notes = f"Earlier classification: {row['kind']}."
            out_t.append(
                [
                    row["code"],
                    row["provision_version_code"],
                    row["language_code"],
                    row["text"],
                    method,
                    row["produced_by"],
                    row["review_status"],
                    notes,
                ]
            )
            translation_text[row["code"]] = row["text"]
            if row["document_code"]:
                rel_t.append(
                    [
                        f"{row['code']}.{row['document_code']}",
                        KIND_TRANSLATED,
                        "legal.translations",
                        row["code"],
                        row["document_code"],
                        "Translation read from this artifact.",
                    ]
                )
        plan.write(
            chapter / "translations.csv",
            ["code", "wording_code", "language_code", "text", "method", "produced_by", "review_status", "notes"],
            out_t,
            keep_empty=True,
        )
        plan.write(
            source_dir / "translations.relationships.csv",
            ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"],
            rel_t,
        )
        total["translations"] += len(out_t)
        plan.removes.append(pt)

        references = read(pr)
        old_count["references"] += len(references)
        out_r = []
        for row in references:
            origin = row["translation_code"] or row["source_version_code"]
            text = translation_text.get(origin) if row["translation_code"] else text_of.get(origin)
            start, end = int(row["span_start"]), int(row["span_end"])
            if text is not None and text[start:end] != row["span_text"]:
                plan.problems.append(f"{rel(pr)}: span {start}-{end} of {origin} does not equal span_text")
            code = f"{origin}.s{start}-{digest(row['target_provision_code'], str(end))}"
            out_r.append(
                [
                    code,
                    "" if row["translation_code"] else row["source_version_code"],
                    row["translation_code"],
                    row["target_provision_code"],
                    row["relation"],
                    row["span_start"],
                    row["span_end"],
                    row["span_text"],
                    row["method"],
                    row["review_status"],
                ]
            )
        plan.write(
            chapter / "references.csv",
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
            out_r,
            keep_empty=True,
        )
        total["references"] += len(out_r)
        plan.removes.append(pr)
    for label in ("wordings", "translations", "references"):
        plan.reconcile(f"legal provision {label}", old_count[label], total[label])
    if extra:
        plan.write(DATA / "global/source/discovered.addresses.csv", state.address_header, extra)
        plan.lines.append(f"  {len(extra)} addresses added for page links found in Legal locators")

    # bases -> effects
    bases_dir = legal / "bases"
    for path in sorted(bases_dir.glob("*.csv")) if bases_dir.exists() else []:
        rows = read(path)
        effects, seen = [], set()
        for row in rows:
            wording = wording_of_provision.get(row["provision_code"])
            if wording is None:
                plan.problems.append(f"{rel(path)}: provision {row['provision_code']} has no English wording")
                continue
            short = shorts[row["table_name"]]
            code = f"{row['provision_code']}.{row['relation']}.{short}.{row['record_code']}"
            if code in seen:
                plan.problems.append(f"{rel(path)}: duplicate effect {code}")
            seen.add(code)
            effects.append(
                [
                    code,
                    wording,
                    row["table_name"],
                    row["record_code"],
                    f"leg.effect.kind.{row['relation']}",
                    row["valid_from"],
                    row["note"],
                    "proposed",
                    OBSERVED,
                ]
            )
        out = bases_dir.parent / "effects" / path.name.replace("bases", "effects")
        plan.write(
            out,
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
        plan.reconcile(
            "legal.bases -> legal.effects",
            len(rows),
            len(effects),
            "(review_status proposed: the old rows carried none)",
        )
        plan.removes.append(path)
