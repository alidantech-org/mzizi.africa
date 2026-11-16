"""Validation of a structure bundle: JSON Schema, static checks, secret lint and dry run.

Technical validity says nothing about legal approval: a valid bundle is still refused by the
collection gate unless its source has a current approved assessment.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from referencing import Registry, Resource

from mzizi_crawler.shared.bundles.bundle import Bundle
from mzizi_crawler.shared.bundles.effective import effective_modules
from mzizi_crawler.shared.scraping import extract, parse_module, transforms
from mzizi_manifest.features.database.tables import load_tables
from mzizi_manifest.shared.paths import SCHEMA_ROOT

SCHEMA_FOLDERS = ("sources", "engine")
#: Which schema file validates which part of a bundle.
SCHEMA_FILES = {
    "manifest": "sources/source.schema.json",
    "module": "sources/module.schema.json",
    "mapping": "engine/mapping.schema.json",
}

SECRET_PATTERNS = [
    (
        re.compile(r"(?i)\b(password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|bearer)\b\s*[:=]\s*\S+"),
        "credential-like key",
    ),
    (re.compile(r"(?i)\bauthorization\s*:\s*\S+"), "authorization header"),
    (re.compile(r"(?i)\b(set-)?cookie\s*:\s*\S+"), "cookie"),
    (re.compile(r"\b(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,})\b"), "JWT-like token"),
    (re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"), "cloud access key"),
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"), "private key"),
]


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    dry_run: dict[str, dict] = field(default_factory=dict)

    @property
    def ok(self) -> bool:
        return not self.errors

    def to_json(self) -> dict:
        return {"ok": self.ok, "errors": self.errors, "warnings": self.warnings, "dryRun": self.dry_run}


def _registry() -> Registry:
    registry: Registry = Registry()
    for folder in SCHEMA_FOLDERS:
        for path in (SCHEMA_ROOT / folder).glob("*.schema.json"):
            schema = json.loads(path.read_text())
            registry = registry.with_resource(schema["$id"], Resource.from_contents(schema))
    return registry


def _validator(name: str) -> Draft202012Validator:
    schema = json.loads((SCHEMA_ROOT / SCHEMA_FILES[name]).read_text())
    return Draft202012Validator(schema, registry=_registry(), format_checker=Draft202012Validator.FORMAT_CHECKER)


def _rank_validator() -> Draft202012Validator:
    """Ranking rules are the `rank` block of a website source; a standalone rules file has the same shape."""
    website = json.loads((SCHEMA_ROOT / "sources" / "website.schema.json").read_text())
    return Draft202012Validator(website["properties"]["rank"], registry=_registry())


def targets() -> dict[str, dict]:
    """Every stored table as `schema.table`, with its column names and the columns an author must supply."""
    return {
        name: {"fields": list(table.columns), "required": [c.name for c in table.columns.values() if c.required]}
        for name, table in load_tables().items()
    }


def _schema_errors(validator: Draft202012Validator, document: Any, where: str) -> list[str]:
    return [
        f"{where}: {'/'.join(str(p) for p in error.absolute_path) or '<root>'}: {error.message}"
        for error in sorted(validator.iter_errors(document), key=lambda e: list(e.absolute_path))
    ]


def validate_ranking(document: object) -> list[str]:
    """Validate a standalone ranking rules file, including that every target exists in the targets contract."""
    problems = _schema_errors(_rank_validator(), document, "ranking.yml")
    if problems or not isinstance(document, dict):
        return problems
    known = targets()
    return [
        f"ranking.yml: unknown target {r.get('target')!r}"
        for r in document.get("rules", [])
        if r.get("target") not in known
    ]


def module_errors(document: object, where: str) -> list[str]:
    """Validate a standalone site module using the same schema as a bundle."""
    return _schema_errors(_validator("module"), document, where)


def input_names(mapping: dict) -> list[str]:
    """The names a mapping reads: an input is a plain name or an object with a `name` and the expected column."""
    return [item["name"] if isinstance(item, dict) else item for item in mapping.get("inputs", [])]


def _mapping_problems(where: str, mapping: dict, known: dict[str, dict]) -> list[str]:
    """Check a mapping's tables, columns, references and inputs against the generated database schemas."""
    problems: list[str] = []
    names = input_names(mapping)
    inputs, aliases = set(names), {y.get("as") for y in mapping.get("yields", [])}
    problems.extend(
        f"{where}: input {name!r} is listed twice" for name in sorted({n for n in names if names.count(n) > 1})
    )
    for item in mapping.get("yields", []):
        table = known.get(item.get("table", ""))
        if table is None:
            problems.append(f"{where}: {item.get('table')!r} is not a stored table")
            continue
        columns, fields = set(table["fields"]), item.get("fields", {})
        for column in [*fields, *item.get("key", [])]:
            if column not in columns:
                problems.append(f"{where}: {item['table']} has no column {column!r}")
        for column in item.get("key", []):
            if column not in fields:
                problems.append(f"{where}: key {column!r} of {item['as']!r} is not a mapped field")
        for column, spec in fields.items():
            if "from" in spec and spec["from"] not in inputs:
                problems.append(f"{where}: field {column!r} reads {spec['from']!r}, which is not in inputs")
            if "ref" in spec and spec["ref"].split(".")[0] not in aliases:
                problems.append(
                    f"{where}: field {column!r} references {spec['ref']!r}, which is not a yield of this mapping"
                )
            lookup = spec.get("lookup")
            if lookup:
                target = known.get(lookup.get("table", ""))
                if target is None or lookup.get("by") not in target["fields"]:
                    problems.append(f"{where}: lookup {lookup.get('table')}.{lookup.get('by')} is not a stored column")
                if "from" in lookup and lookup["from"] not in inputs:
                    problems.append(f"{where}: lookup reads {lookup['from']!r}, which is not in inputs")
            if "transform" in spec and not transforms.known(spec["transform"]):
                problems.append(f"{where}: unknown transform {transforms.split(spec['transform'])[0]!r}")
    return problems


def validate(bundle: Bundle, family: Bundle | None = None, run_dry: bool = True) -> Report:
    report = Report(errors=list(bundle.errors))
    if report.errors:
        return report
    manifest, known_targets = bundle.manifest, targets()

    # 1. JSON Schema
    report.errors += _schema_errors(_validator("manifest"), manifest, "manifest.yml")
    for name, module in bundle.modules.items():
        report.errors += module_errors(module, f"modules/{name}.yml")
        if module.get("module") != name:
            report.errors.append(f"modules/{name}.yml: module name {module.get('module')!r} must equal the file name")
    for name, mapping in bundle.mappings.items():
        report.errors += _schema_errors(_validator("mapping"), mapping, f"mappings/{name}.yml")
        if str(mapping.get("code", "")).rsplit(".", 1)[-1] != name:
            report.errors.append(
                f"mappings/{name}.yml: the last segment of mapping code {mapping.get('code')!r} must equal the file name"
            )
    report.errors += validate_ranking(bundle.ranking or manifest.get("rank") or {"rules": []})
    if report.errors:
        return report

    # 2. Static checks
    extends = manifest.get("extends")
    if extends and manifest.get("abstract"):
        report.errors.append("manifest.yml: an abstract family cannot extend another (one level of inheritance only)")
    if extends and family is None:
        report.warnings.append(
            f"extends {extends} but no family bundle was supplied; inherited modules were not checked"
        )
    modules = effective_modules(bundle, family)
    for name in manifest["modules"]:
        if name not in modules:
            report.errors.append(f"manifest.yml: module {name!r} is listed but no module file defines it")
    for name in bundle.modules:
        if name not in manifest["modules"] and name not in ((manifest.get("overlay") or {}).get("modules") or {}).get(
            "add", []
        ):
            report.warnings.append(f"modules/{name}.yml is not listed in the manifest")
    overlay = (manifest.get("overlay") or {}).get("modules") or {}
    for name in [*overlay.get("replace", []), *overlay.get("add", [])]:
        if name not in bundle.modules:
            report.errors.append(f"overlay names module {name!r} but modules/{name}.yml does not exist")
    for name, mapping in bundle.mappings.items():
        report.errors += _mapping_problems(f"mappings/{name}.yml", mapping, known_targets)
    for name, module in modules.items():
        named = module.get("mapping")
        if named and named not in {mapping.get("code") for mapping in bundle.mappings.values()}:
            report.warnings.append(
                f"module {name}: mapping {named!r} is not in this bundle (resolved by code elsewhere)"
            )
        in_bundle = next((m for m in bundle.mappings.values() if m.get("code") == named), None)
        if named and in_bundle is not None:
            missing = [f for f in input_names(in_bundle) if f not in module.get("extract", {}).get("fields", {})]
            if missing:
                report.errors.append(
                    f"module {name}: mapping {named!r} reads fields it does not extract: {', '.join(missing)}"
                )
    for name, module in modules.items():
        for field_name, spec in module.get("extract", {}).get("fields", {}).items():
            if "parse" in spec and not transforms.known(spec["parse"]):
                report.errors.append(
                    f"module {name}: field {field_name}: unknown transform {transforms.split(spec['parse'])[0]!r}"
                )
        if module.get("fetch", {}).get("resource") == "html" and manifest.get("kind") == "api":
            report.warnings.append(f"module {name}: html resource in an api source")
        endpoint = module.get("discover", {}).get("endpoint", {}).get("name")
        if endpoint and endpoint not in (manifest.get("api") or {}).get("endpoints", {}):
            report.errors.append(f"module {name}: endpoint {endpoint!r} is not declared in the source's api.endpoints")

    # 3. Secrets, notes, scope
    for path, text in bundle.files.items():
        if path == "NOTES.md":
            continue
        for pattern, label in SECRET_PATTERNS:
            if pattern.search(text):
                report.errors.append(
                    f"{path}: contains a {label}; structure bundles never hold secrets, cookies or tokens"
                )
    if len(bundle.notes.strip()) < 80:
        report.errors.append("NOTES.md is missing or too short: record findings, gaps and limitations")
    scope = manifest["policy"]["scope"]
    for name, module in modules.items():
        for key in ("listing",):
            url = module.get("discover", {}).get(key, {}).get("url", "")
            allow = scope.get("paths", {}).get("allow")
            if url.startswith("/") and allow and not any(url.startswith(prefix) for prefix in allow):
                report.errors.append(f"module {name}: {key} url {url} is outside policy.scope.paths.allow")
            if url.startswith("/") and any(url.startswith(prefix) for prefix in scope.get("paths", {}).get("deny", [])):
                report.errors.append(f"module {name}: {key} url {url} is in policy.scope.paths.deny")
    if "assessment" not in manifest["policy"]:
        report.warnings.append(
            "policy.assessment is not set: the collection gate will deny this recipe until an assessment is linked"
        )

    # 4. Dry run against saved examples
    if run_dry and not report.errors:
        for name, module in modules.items():
            example = next((text for fn, text in bundle.examples.items() if Path(fn).stem == name), None)
            if example is None:
                report.warnings.append(f"module {name}: no example in examples/, dry run skipped")
                continue
            try:
                spec = parse_module(module)
                match = extract.discover_items(example, spec)
            except Exception as error:  # an invalid selector is a validation error, not a crash
                report.errors.append(f"module {name}: selector error: {str(error).splitlines()[0][:200]}")
                continue
            records = [extract.extract_item(item, spec.extract.fields) for item in match.items]
            expect = module.get("expect", {})
            result = {
                "items": len(match.items),
                "selector": match.selector_index,
                "fieldErrors": sum(len(r.errors) for r in records),
            }
            report.dry_run[name] = result
            if "min_items" in expect and len(match.items) < expect["min_items"]:
                report.errors.append(
                    f"module {name}: dry run found {len(match.items)} items, expected at least {expect['min_items']}"
                )
            if "max_items" in expect and len(match.items) > expect["max_items"]:
                report.errors.append(
                    f"module {name}: dry run found {len(match.items)} items, expected at most {expect['max_items']}"
                )
            for required in expect.get("required_fields", []):
                empty = sum(1 for r in records if r.record.get(required) in (None, ""))
                if empty:
                    report.errors.append(
                        f"module {name}: required field {required!r} is empty in {empty} of {len(records)} items"
                    )
            if records and result["fieldErrors"]:
                report.warnings.append(f"module {name}: {result['fieldErrors']} field errors in the dry run")
    return report
