"""The Source part of the schema-ownership seed conversion: vocabulary, addresses, products, editions, artifacts, captures, lineage."""

# ruff: noqa: F403, F405
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urlsplit

import yaml
from ownership_plan import *
from ownership_plan import DATA, REPO, Plan, cells, digest, read, rel, table_shorts  # noqa: F401


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
            out.append(
                {"code": "src.product.kind", "title": "Kinds of product", "owner_snapshot": row["owner_snapshot"]}
            )
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
            row = {
                **row,
                "code": row["code"].replace("src.document.kind", "src.product.kind"),
                "scheme_code": "src.product.kind",
            }
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
    plan.lines.append(
        f"  reference: scheme src.document.kind renamed src.product.kind; src.dataset.category removed ({dropped} values)"
    )
    leg = read(leg_path)
    header = ["code", "scheme_code", "label", "parent_code"]
    leg += [
        {
            "code": "leg.name.kind.formal-title",
            "scheme_code": "leg.name.kind",
            "label": "Formal title",
            "parent_code": "",
        }
    ]
    for relation, label in EFFECT_KINDS.items():
        leg.append(
            {"code": f"leg.effect.kind.{relation}", "scheme_code": "leg.effect.kind", "label": label, "parent_code": ""}
        )
    plan.write(leg_path, header, cells(leg, header))


# ----------------------------------------------------------------------------------------------------------- source
@dataclass
class Source:
    """What the Source conversion leaves for the Legal conversion to use."""

    artifact_by_file: dict[str, str] = field(default_factory=dict)
    addresses: dict[tuple[str, str], str] = field(default_factory=dict)
    new_addresses: list[list[str]] = field(default_factory=list)
    address_header: list[str] = field(
        default_factory=lambda: ["code", "domain_code", "kind", "method", "path", "query", "note"]
    )
    hosts: dict[str, str] = field(default_factory=dict)


def convert_source(plan: Plan) -> Source:
    state = Source()
    gs = DATA / "global/source"
    ks = DATA / "ke/source"
    paths_csv, sources_csv, domains_csv = gs / "paths.csv", gs / "sources.csv", gs / "domains.csv"
    documents_csv, captures_csv, lineage_csv, files_yaml = (
        ks / "documents.csv",
        ks / "captures.csv",
        ks / "dataset_lineage.csv",
        ks / "_files.yaml",
    )
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
    plan.write(
        sources_csv,
        ["code", "title", "kind", "publisher_code", "description"],
        cells(website_sources, ["code", "title", "kind", "publisher_code", "description"]),
    )
    plan.lines.append(
        f"  source.sources: {len(sources)} old -> {len(website_sources)} websites kept, {len(dataset_sources)} datasets became products"
    )

    addresses_by_code = {code: key for key, code in state.addresses.items()}
    product_kinds: dict[str, set[str]] = {code: set() for code in dataset_sources}
    editions: dict[str, dict[str, str]] = {}
    artifacts: list[list[str]] = []
    new_captures: list[list[str]] = []
    for capture in captures:
        product = capture["source_code"]
        document = documents[capture["document_code"]]
        if product not in dataset_sources:
            plan.problems.append(
                f"captures.csv: {capture['code']} names source {product!r} that is not a dataset source"
            )
            continue
        product_kinds[product].add(document["kind_code"].replace("src.document.kind", "src.product.kind"))
        retrieved_on = capture["retrieved_at"][:10]
        edition_code = f"{product}.retrieved-{retrieved_on}"
        editions.setdefault(
            edition_code,
            {
                "code": edition_code,
                "product_code": product,
                "designation": f"retrieved {retrieved_on}",
                "description": "",
            },
        )
        suffix = Path(urlsplit(capture["original_url"]).path).suffix.lstrip(".").lower()
        artifacts.append(
            [
                document["code"],
                edition_code,
                document["sha256"],
                suffix,
                document["content_type"],
                document["size_bytes"],
                "",
            ]
        )
        website = ""
        address_code = capture["path_code"]
        if address_code:
            domain = addresses_by_code[address_code][0]
            website = domain_source[domain]
        new_captures.append(
            [
                capture["code"],
                website,
                address_code,
                document["code"],
                capture["original_url"],
                capture["retrieved_at"],
                capture["response_metadata"],
            ]
        )
        state.artifact_by_file[document["code"]] = document["code"]
    if len(documents) != len(artifacts):
        plan.problems.append(
            f"documents.csv has {len(documents)} documents but {len(artifacts)} artifacts were produced"
        )
    products: list[list[str]] = []
    for code, row in dataset_sources.items():
        kinds = product_kinds[code]
        if len(kinds) != 1:
            plan.problems.append(f"product {code}: ambiguous kinds {sorted(kinds)}")
            continue
        products.append([code, next(iter(kinds)), row["title"], row["publisher_code"], row["description"]])
    plan.write(gs / "products.csv", ["code", "kind_code", "title", "publisher_code", "description"], products)
    plan.write(
        gs / "editions.csv",
        ["code", "product_code", "designation", "description"],
        [[e["code"], e["product_code"], e["designation"], e["description"]] for e in editions.values()],
    )
    plan.write(
        gs / "artifacts.csv",
        ["code", "edition_code", "sha256", "format", "content_type", "size_bytes", "location"],
        artifacts,
    )
    plan.write(
        captures_csv,
        ["code", "source_code", "address_code", "artifact_code", "original_url", "retrieved_at", "response_metadata"],
        new_captures,
    )
    plan.mapping["source.documents->source.artifacts"] = {code: code for code in documents}
    plan.mapping["source.sources(dataset)->source.products"] = {code: code for code in dataset_sources}
    plan.reconcile("source.documents -> source.artifacts", len(documents), len(artifacts))
    plan.reconcile("dataset sources -> source.products", len(dataset_sources), len(products))
    plan.reconcile("source.captures", len(captures), len(new_captures))
    plan.removes.append(documents_csv)

    # lineage: output product made from input capture
    lineage = read(lineage_csv)
    renamed = {
        "provision-versions": "wordings",
        "provision-translations": "translations",
        "provision-references": "references",
        "instrument-versions": "editions",
    }

    moved = {"seed.ke.legal.bases.geography-bases": "seed.ke.legal.effects.geography-effects"}

    def new_product(code: str) -> str:
        if code in moved:
            return moved[code]
        head, _, tail = code.rpartition(".")
        return f"{head}.{renamed.get(tail, tail)}"

    lineage = [
        {**row, "old_dataset_code": row["dataset_code"], "dataset_code": new_product(row["dataset_code"])}
        for row in lineage
    ]
    relationships: list[list[str]] = []
    codes: set[str] = set()
    for row in lineage:
        code = f"{row['dataset_code']}.{row['input_capture_code']}"
        if code in codes:
            plan.problems.append(f"dataset_lineage.csv: duplicate relationship {code}")
        codes.add(code)
        method = f"[{row['role']}] {row['method']}".strip()
        relationships.append([code, LINEAGE_KIND[row["role"]], row["dataset_code"], row["input_capture_code"], method])
    plan.write(
        ks / "relationships.csv",
        ["code", "kind_code", "output_product_code", "input_capture_code", "method"],
        relationships,
    )
    plan.mapping["source.dataset_lineage->source.relationships"] = {
        f"{r['old_dataset_code']}|{r['input_capture_code']}": f"{r['dataset_code']}.{r['input_capture_code']}"
        for r in lineage
    }
    plan.reconcile("source.dataset_lineage -> source.relationships", len(lineage), len(relationships))
    plan.removes.append(lineage_csv)
    product_of_artifact = {
        a[0]: next(e["product_code"] for e in editions.values() if e["code"] == a[1]) for a in artifacts
    }
    entries = {code: {**entry, "product": product_of_artifact[code]} for code, entry in files.items()}
    header = files_yaml.read_text(encoding="utf-8").split("documents:", 1)[0]
    plan.text_writes[files_yaml] = header + yaml.safe_dump(
        {"artifacts": entries}, sort_keys=False, allow_unicode=True, width=1000
    )
    plan.removes.append(gs / "datasets.csv")
    return state
