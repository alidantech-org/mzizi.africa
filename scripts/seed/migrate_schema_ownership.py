"""Convert the seed CSVs from the old Source/Legal/Filesystem schema to the agreed ownership target.

Run from the repository root:

    uv run python scripts/seed/migrate_schema_ownership.py            # plan: report every file and count, write nothing
    uv run python scripts/seed/migrate_schema_ownership.py --apply    # write the new files, then remove the old ones

What it converts (see `.docs/design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md` and `LEGAL_SCHEMA.md`):

- `source/paths.csv` -> `addresses.csv`; a link found in a Legal locator that is missing there is added as an address.
- `source/sources.csv` rows of kind `dataset` and `ke/source/documents.csv` -> products, editions and artifacts.
- `ke/source/captures.csv` -> captures that point at an address and an artifact; `source_code` only where a website serves it.
- `ke/source/dataset_lineage.csv` -> `relationships.csv` (output product made from input capture; the old role is kept in the
  relationship kind and in the method text).
- `ke/legal/instruments.csv` title -> `names.csv` (language `und`: the old title carried no language assertion).
- `instrument_versions.csv` -> `editions.csv` plus a relationship from each edition to its document artifact.
- `provision_versions.csv` -> `wordings.csv`; each free-text locator becomes a citation (PDF page or address).
- `provision_translations.csv` -> `translations.csv` plus a `translated-from` relationship to the document artifact.
- `provision_references.csv` -> `references.csv` (origin is the wording, or the translation when one is named).
- `legal/bases/*.csv` -> `effects` naming the English 2010 wording and the old target as `subject_table`/`subject_code`.
- reference schemes and values the new rows need, and `_files.yaml` (`documents:` becomes `artifacts:`).

Seed catalogue rows (`seed.*.csv` in `data/global/source`) are generated afterwards by `mzizi-manifest datasets`.
Rerunning after `--apply` finds no old files and reports that nothing is left to convert.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urlsplit

import yaml

REPO = Path(__file__).resolve().parents[2]
SEED = REPO / "seed"
DATA = SEED / "data"
REPORT = REPO / ".dev/reports/schema-ownership-seed-migration.json"
OBSERVED = "2026-11-17T02:00:00+03:00"

KIND_PREPARED = "src.relationship.kind.prepared-from"
KIND_BUILT = "src.relationship.kind.built-from"
KIND_SUPPORTS = "src.relationship.kind.supports"
KIND_TRANSLATED = "src.relationship.kind.translated-from"
LINEAGE_KIND = {"raw": KIND_PREPARED, "derived": KIND_BUILT, "lookup": KIND_SUPPORTS}
LOCATOR_PAGE = "src.locator.kind.page"
LOCATOR_URL = "src.locator.kind.url"
PRODUCT_KIND_DATASET = "src.product.kind.dataset"
NAME_KIND = "leg.name.kind.formal-title"
EFFECT_KINDS = {
    "established-by": "Established by",
    "governed-by": "Governed by",
    "defined-by": "Defined by",
    "limited-by": "Limited by",
    "implements": "Implements",
    "derives-from": "Derives from",
}

type Rows = list[dict[str, str]]


@dataclass
class Plan:
    """Files to write and remove, plus the reconciliation lines and problems found while converting."""

    writes: dict[Path, tuple[list[str], list[list[str]]]] = field(default_factory=dict)
    removes: list[Path] = field(default_factory=list)
    text_writes: dict[Path, str] = field(default_factory=dict)
    lines: list[str] = field(default_factory=list)
    problems: list[str] = field(default_factory=list)
    mapping: dict[str, dict[str, str]] = field(default_factory=dict)

    def write(self, path: Path, header: list[str], rows: list[list[str]], *, keep_empty: bool = False) -> None:
        if path in self.writes:
            raise ValueError(f"{path} planned twice")
        if rows or keep_empty:  # a synthetic file with no rows is not written; a converted file keeps its header
            self.writes[path] = (header, rows)

    def reconcile(self, label: str, before: int, after: int, note: str = "") -> None:
        mark = "ok" if before == after else "MISMATCH"
        self.lines.append(f"  {label}: {before} old -> {after} new {mark} {note}".rstrip())
        if before != after:
            self.problems.append(f"{label}: {before} old rows but {after} new rows")


def read(path: Path) -> Rows:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def rel(path: Path) -> str:
    return str(path.relative_to(REPO))


def cells(rows: Rows, header: list[str]) -> list[list[str]]:
    return [[row.get(name, "") for name in header] for row in rows]


def digest(*parts: str, size: int = 10) -> str:
    return hashlib.sha256("|".join(parts).encode()).hexdigest()[:size]


def table_shorts() -> dict[str, str]:
    codes = json.loads((REPO / "source/schema/seed/codes.json").read_text(encoding="utf-8"))
    return {name: spec["short"] for name, spec in codes["tables"].items()}


# ------------------------------------------------------------------------------------------------ reference vocabulary
def convert_reference(plan: Plan) -> None:
    schemes_path = DATA / "global/reference/schemes.csv"
    values_path = DATA / "global/reference/values/src.values.csv"
    leg_path = DATA / "global/reference/values/leg.values.csv"
    schemes = read(schemes_path)
    codes = {row["code"] for row in schemes}
    if "src.product.kind" in codes:
        plan.lines.append("  reference vocabulary already converted")
        return
    out = []
    for row in schemes:
        if row["code"] == "src.document.kind":
            out.append({"code": "src.product.kind", "title": "Kinds of product", "owner_snapshot": row["owner_snapshot"]})
        elif row["code"] == "src.dataset.category":
            continue
        else:
            out.append(row)
    curated = "mzizi curated"
    for code, title in (
        ("src.relationship.kind", "Kinds of source relationship"),
        ("src.locator.kind", "Kinds of citation locator"),
        ("leg.name.kind", "Kinds of legal instrument name"),
        ("leg.effect.kind", "Kinds of legal effect"),
    ):
        out.append({"code": code, "title": title, "owner_snapshot": curated})
    plan.write(schemes_path, ["code", "title", "owner_snapshot"], cells(out, ["code", "title", "owner_snapshot"]))
    values = read(values_path)
    new_values: list[dict[str, str]] = []
    dropped = 0
    for row in values:
        if row["scheme_code"] == "src.dataset.category":
            dropped += 1
            continue
        if row["scheme_code"] == "src.document.kind":
            row = {**row, "code": row["code"].replace("src.document.kind", "src.product.kind"), "scheme_code": "src.product.kind"}
        new_values.append(row)
    for scheme, member, label in (
        ("src.product.kind", "dataset", "Dataset"),
        ("src.relationship.kind", "prepared-from", "Prepared from"),
        ("src.relationship.kind", "built-from", "Built from"),
        ("src.relationship.kind", "supports", "Supports"),
        ("src.relationship.kind", "translated-from", "Translated from"),
        ("src.locator.kind", "csv-line", "CSV line"),
        ("src.locator.kind", "page", "Page"),
        ("src.locator.kind", "url", "Web address"),
    ):
        new_values.append({"code": f"{scheme}.{member}", "scheme_code": scheme, "label": label})
    plan.write(values_path, ["code", "scheme_code", "label"], cells(new_values, ["code", "scheme_code", "label"]))
    plan.lines.append(f"  reference: scheme src.document.kind renamed src.product.kind; src.dataset.category removed ({dropped} values)")
    leg = read(leg_path)
    header = ["code", "scheme_code", "label", "parent_code"]
    leg += [{"code": "leg.name.kind.formal-title", "scheme_code": "leg.name.kind", "label": "Formal title", "parent_code": ""}]
    for relation, label in EFFECT_KINDS.items():
        leg.append({"code": f"leg.effect.kind.{relation}", "scheme_code": "leg.effect.kind", "label": label, "parent_code": ""})
    plan.write(leg_path, header, cells(leg, header))


# ----------------------------------------------------------------------------------------------------------- source
@dataclass
class Source:
    """What the Source conversion leaves for the Legal conversion to use."""

    artifact_by_file: dict[str, str] = field(default_factory=dict)
    addresses: dict[tuple[str, str], str] = field(default_factory=dict)
    new_addresses: list[list[str]] = field(default_factory=list)
    address_header: list[str] = field(default_factory=lambda: ["code", "domain_code", "kind", "method", "path", "query", "note"])
    hosts: dict[str, str] = field(default_factory=dict)


def convert_source(plan: Plan) -> Source:
    state = Source()
    gs = DATA / "global/source"
    ks = DATA / "ke/source"
    paths_csv, sources_csv, domains_csv = gs / "paths.csv", gs / "sources.csv", gs / "domains.csv"
    documents_csv, captures_csv, lineage_csv, files_yaml = ks / "documents.csv", ks / "captures.csv", ks / "dataset_lineage.csv", ks / "_files.yaml"
    domains = read(domains_csv)
    state.hosts = {row["host"]: row["code"] for row in domains}
    domain_source = {row["code"]: row["source_code"] for row in domains}

    # addresses from paths
    if paths_csv.exists():
        paths = read(paths_csv)
        out: list[list[str]] = []
        seen: dict[tuple[str, str, str, str], str] = {}
        for row in paths:
            path, _, query = row["path"].partition("?")
            key = (row["domain_code"], "GET", path, query)
            if key in seen:
                plan.problems.append(f"paths.csv: {row['code']} and {seen[key]} are the same address")
            seen[key] = row["code"]
            state.addresses[(row["domain_code"], path + ("?" + query if query else ""))] = row["code"]
            out.append([row["code"], row["domain_code"], row["kind"], "GET", path, query, row["note"]])
        state.new_addresses = out
        plan.write(gs / "addresses.csv", state.address_header, out, keep_empty=True)
        plan.mapping["source.paths->source.addresses"] = {row["code"]: row["code"] for row in paths}
        plan.reconcile("source.paths -> source.addresses", len(paths), len(out))
        plan.removes.append(paths_csv)
    else:
        plan.lines.append("  source.paths already converted")
        if (gs / "addresses.csv").exists():
            for row in read(gs / "addresses.csv"):
                key_path = row["path"] + ("?" + row["query"] if row["query"] else "")
                state.addresses[(row["domain_code"], key_path)] = row["code"]

    if not documents_csv.exists():
        plan.lines.append("  source documents/datasets already converted")
        return state

    sources = read(sources_csv)
    documents = {row["code"]: row for row in read(documents_csv)}
    captures = read(captures_csv)
    files = yaml.safe_load(files_yaml.read_text(encoding="utf-8"))["documents"]
    dataset_sources = {row["code"]: row for row in sources if row["kind"] == "dataset"}
    website_sources = [row for row in sources if row["kind"] != "dataset"]
    plan.write(sources_csv, ["code", "title", "kind", "publisher_code", "description"], cells(website_sources, ["code", "title", "kind", "publisher_code", "description"]))
    plan.lines.append(f"  source.sources: {len(sources)} old -> {len(website_sources)} websites kept, {len(dataset_sources)} datasets became products")

    addresses_by_code = {code: key for key, code in state.addresses.items()}
    product_kinds: dict[str, set[str]] = {code: set() for code in dataset_sources}
    editions: dict[str, dict[str, str]] = {}
    artifacts: list[list[str]] = []
    new_captures: list[list[str]] = []
    for capture in captures:
        product = capture["source_code"]
        document = documents[capture["document_code"]]
        if product not in dataset_sources:
            plan.problems.append(f"captures.csv: {capture['code']} names source {product!r} that is not a dataset source")
            continue
        product_kinds[product].add(document["kind_code"].replace("src.document.kind", "src.product.kind"))
        retrieved_on = capture["retrieved_at"][:10]
        edition_code = f"{product}.retrieved-{retrieved_on}"
        editions.setdefault(
            edition_code,
            {"code": edition_code, "product_code": product, "designation": f"retrieved {retrieved_on}", "description": ""},
        )
        suffix = Path(urlsplit(capture["original_url"]).path).suffix.lstrip(".").lower()
        artifacts.append([document["code"], edition_code, document["sha256"], suffix, document["content_type"], document["size_bytes"], ""])
        website = ""
        address_code = capture["path_code"]
        if address_code:
            domain = addresses_by_code[address_code][0]
            website = domain_source[domain]
        new_captures.append([capture["code"], website, address_code, document["code"], capture["original_url"], capture["retrieved_at"], capture["response_metadata"]])
        state.artifact_by_file[document["code"]] = document["code"]
    if len(documents) != len(artifacts):
        plan.problems.append(f"documents.csv has {len(documents)} documents but {len(artifacts)} artifacts were produced")
    products: list[list[str]] = []
    for code, row in dataset_sources.items():
        kinds = product_kinds[code]
        if len(kinds) != 1:
            plan.problems.append(f"product {code}: ambiguous kinds {sorted(kinds)}")
            continue
        products.append([code, next(iter(kinds)), row["title"], row["publisher_code"], row["description"]])
    plan.write(gs / "products.csv", ["code", "kind_code", "title", "publisher_code", "description"], products)
    plan.write(gs / "editions.csv", ["code", "product_code", "designation", "description"], [[e["code"], e["product_code"], e["designation"], e["description"]] for e in editions.values()])
    plan.write(gs / "artifacts.csv", ["code", "edition_code", "sha256", "format", "content_type", "size_bytes", "location"], artifacts)
    plan.write(captures_csv, ["code", "source_code", "address_code", "artifact_code", "original_url", "retrieved_at", "response_metadata"], new_captures)
    plan.mapping["source.documents->source.artifacts"] = {code: code for code in documents}
    plan.mapping["source.sources(dataset)->source.products"] = {code: code for code in dataset_sources}
    plan.reconcile("source.documents -> source.artifacts", len(documents), len(artifacts))
    plan.reconcile("dataset sources -> source.products", len(dataset_sources), len(products))
    plan.reconcile("source.captures", len(captures), len(new_captures))
    plan.removes.append(documents_csv)

    # lineage: output product made from input capture
    lineage = read(lineage_csv)
    renamed = {"provision-versions": "wordings", "provision-translations": "translations", "provision-references": "references", "instrument-versions": "editions"}

    moved = {"seed.ke.legal.bases.geography-bases": "seed.ke.legal.effects.geography-effects"}

    def new_product(code: str) -> str:
        if code in moved:
            return moved[code]
        head, _, tail = code.rpartition(".")
        return f"{head}.{renamed.get(tail, tail)}"

    lineage = [{**row, "old_dataset_code": row["dataset_code"], "dataset_code": new_product(row["dataset_code"])} for row in lineage]
    relationships: list[list[str]] = []
    codes: set[str] = set()
    for row in lineage:
        code = f"{row['dataset_code']}.{row['input_capture_code']}"
        if code in codes:
            plan.problems.append(f"dataset_lineage.csv: duplicate relationship {code}")
        codes.add(code)
        method = f"[{row['role']}] {row['method']}".strip()
        relationships.append([code, LINEAGE_KIND[row["role"]], row["dataset_code"], row["input_capture_code"], method])
    plan.write(ks / "relationships.csv", ["code", "kind_code", "output_product_code", "input_capture_code", "method"], relationships)
    plan.mapping["source.dataset_lineage->source.relationships"] = {f"{r['old_dataset_code']}|{r['input_capture_code']}": f"{r['dataset_code']}.{r['input_capture_code']}" for r in lineage}
    plan.reconcile("source.dataset_lineage -> source.relationships", len(lineage), len(relationships))
    plan.removes.append(lineage_csv)
    product_of_artifact = {a[0]: next(e["product_code"] for e in editions.values() if e["code"] == a[1]) for a in artifacts}
    entries = {code: {**entry, "product": product_of_artifact[code]} for code, entry in files.items()}
    header = files_yaml.read_text(encoding="utf-8").split("documents:", 1)[0]
    plan.text_writes[files_yaml] = header + yaml.safe_dump({"artifacts": entries}, sort_keys=False, allow_unicode=True, width=1000)
    plan.removes.append(gs / "datasets.csv")
    return state


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
    plan.write(instruments_csv, ["code", "kind_code", "issuing_unit_code", "enacted_on", "published_on"], cells(instruments, ["code", "kind_code", "issuing_unit_code", "enacted_on", "published_on"]))
    plan.write(legal / "names.csv", ["code", "instrument_code", "language_code", "name", "kind_code", "is_preferred"], names)
    plan.reconcile("legal.instruments title -> legal.names", len(instruments), len(names), "(language und: the title asserted none)")
    # editions + edition/document relationships
    versions = read(versions_csv)
    editions = [[v["code"], v["instrument_code"], v["edition"], v["observed_at"], v["commenced_on"]] for v in versions]
    plan.write(legal / "editions.csv", ["code", "instrument_code", "designation", "observed_at", "commenced_on"], editions, keep_empty=True)
    edition_sources = [
        [f"{v['code']}.{v['document_code']}", KIND_PREPARED, "legal.editions", v["code"], v["document_code"], "Edition read from this artifact."]
        for v in versions
    ]
    plan.write(ks / "editions.relationships.csv", ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"], edition_sources)
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
        pv, pt, pr = chapter / "provision_versions.csv", chapter / "provision_translations.csv", chapter / "provision_references.csv"
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
                    plan.problems.append(f"{rel(pv)}: {code}: locator file {match['file']!r} is not a registered original")
                    continue
                citation = [code, artifact, "", LOCATOR_PAGE, json.dumps({"file": match["file"], "page": int(match["page"])}, sort_keys=True), row["observed_at"]]
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
                    extra.append([address, domain, "page", "GET", parts.path, parts.query, "Page a Constitution wording was read from."])
                citation = [code, "", address, LOCATOR_URL, json.dumps({"url": locator}, sort_keys=True), row["observed_at"]]
            else:
                plan.problems.append(f"{rel(pv)}: {code}: locator {locator!r} is neither a PDF page nor a link")
                continue
            citations.append(citation)
            wordings.append([code, row["instrument_code"], row["provision_code"], row["instrument_version_code"], row["language_code"], code, row["observed_at"], row["text"]])
            if row["language_code"] == "en":
                wording_of_provision.setdefault(row["provision_code"], code)
            text_of[code] = row["text"]
        plan.write(chapter / "wordings.csv", ["code", "instrument_code", "provision_code", "edition_code", "language_code", "citation_code", "observed_at", "text"], wordings, keep_empty=True)
        source_dir = ks / "constitution-2010" / chapter.name
        plan.write(source_dir / "citations.csv", ["code", "artifact_code", "address_code", "locator_kind_code", "locator", "recorded_at"], citations)
        total["wordings"] += len(wordings)
        plan.removes.append(pv)

        translations = read(pt)
        old_count["translations"] += len(translations)
        out_t, rel_t = [], []
        for row in translations:
            method = "machine" if row["kind"] == "machine-proposed" else "human"
            notes = f"Earlier classification: {row['kind']}."
            out_t.append([row["code"], row["provision_version_code"], row["language_code"], row["text"], method, row["produced_by"], row["review_status"], notes])
            translation_text[row["code"]] = row["text"]
            if row["document_code"]:
                rel_t.append([f"{row['code']}.{row['document_code']}", KIND_TRANSLATED, "legal.translations", row["code"], row["document_code"], "Translation read from this artifact."])
        plan.write(chapter / "translations.csv", ["code", "wording_code", "language_code", "text", "method", "produced_by", "review_status", "notes"], out_t, keep_empty=True)
        plan.write(source_dir / "translations.relationships.csv", ["code", "kind_code", "subject_table", "subject_code", "input_artifact_code", "method"], rel_t)
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
            out_r.append([code, "" if row["translation_code"] else row["source_version_code"], row["translation_code"], row["target_provision_code"], row["relation"], row["span_start"], row["span_end"], row["span_text"], row["method"], row["review_status"]])
        plan.write(chapter / "references.csv", ["code", "wording_code", "translation_code", "target_provision_code", "relation", "span_start", "span_end", "span_text", "method", "review_status"], out_r, keep_empty=True)
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
            effects.append([code, wording, row["table_name"], row["record_code"], f"leg.effect.kind.{row['relation']}", row["valid_from"], row["note"], "proposed", OBSERVED])
        out = bases_dir.parent / "effects" / path.name.replace("bases", "effects")
        plan.write(out, ["code", "wording_code", "subject_table", "subject_code", "kind_code", "valid_from", "explanation", "review_status", "observed_at"], effects)
        plan.reconcile("legal.bases -> legal.effects", len(rows), len(effects), "(review_status proposed: the old rows carried none)")
        plan.removes.append(path)


def check_products(plan: Plan) -> None:
    """Every relationship's output product must be the product of a seed CSV that exists after the conversion."""
    def product(file: Path) -> str:
        parts = list(file.relative_to(DATA).with_suffix("").parts)
        parts[-1] = parts[-1].replace(".", "-").replace("_", "-")
        return "seed." + ".".join(parts)

    files = {p for p in DATA.rglob("*.csv") if p not in plan.removes} | set(plan.writes)
    known = {product(p) for p in files if not (p.parent == DATA / "global/source" and p.name.startswith("seed."))}
    path = DATA / "ke/source/relationships.csv"
    for row in plan.writes.get(path, ([], []))[1]:
        if row[2] not in known:
            plan.problems.append(f"relationships.csv: {row[0]}: output product {row[2]} is not a seed file after conversion")


def apply(plan: Plan) -> None:
    def atomic(path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        temp = path.with_suffix(path.suffix + ".tmp")
        temp.write_text(content, encoding="utf-8", newline="")
        temp.replace(path)

    for path, (header, rows) in plan.writes.items():
        import io

        buffer = io.StringIO()
        writer = csv.writer(buffer, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)
        atomic(path, buffer.getvalue())
    for path, text in plan.text_writes.items():
        atomic(path, text)
    for path in plan.removes:
        path.unlink(missing_ok=True)
    bases = DATA / "ke/legal/bases"
    if bases.exists() and not any(bases.iterdir()):
        bases.rmdir()
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(plan.mapping, indent=1, sort_keys=True), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--apply", action="store_true", help="write the new files and remove the old ones")
    args = parser.parse_args()
    plan = Plan()
    plan.lines.append("reference vocabulary")
    convert_reference(plan)
    plan.lines.append("source")
    state = convert_source(plan)
    plan.lines.append("legal")
    convert_legal(plan, state)
    check_products(plan)
    print("\n".join(plan.lines))
    print(f"\nwrite {len(plan.writes)} files, remove {len(plan.removes)} files")
    for path in sorted(plan.writes):
        header, rows = plan.writes[path]
        print(f"  write  {rel(path)}  [{', '.join(header)}]  {len(rows)} rows")
    for path in plan.removes:
        print(f"  remove {rel(path)}")
    if plan.problems:
        print(f"\n{len(plan.problems)} problems; nothing written:", file=sys.stderr)
        for problem in plan.problems[:60]:
            print(f"  {problem}", file=sys.stderr)
        return 1
    if args.apply:
        apply(plan)
        print(f"\napplied; identity mapping written to {rel(REPORT)}")
    else:
        print("\nplan only; rerun with --apply to write")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
