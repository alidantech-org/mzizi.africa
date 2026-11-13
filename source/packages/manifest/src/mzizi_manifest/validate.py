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

from mzizi_manifest import sections
from mzizi_manifest.bundle import Bundle
from mzizi_manifest.effective import effective_modules
from mzizi_manifest.paths import SCHEMA_ROOT, SEED_ROOT
from mzizi_scraping import extract, parse_module, transforms

SCHEMA_DIR = SCHEMA_ROOT / "site" / "v1"
CONTRACTS = SCHEMA_ROOT / "contracts"
TAG_VOCABULARY = SEED_ROOT / "global" / "reference" / "site-tags.json"

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
    for path in SCHEMA_DIR.glob("*.json"):
        schema = json.loads(path.read_text())
        registry = registry.with_resource(
            f"https://mzizi.africa/schemas/site/v1/{path.stem.replace('.schema', '')}", Resource.from_contents(schema)
        )
        registry = registry.with_resource(path.name, Resource.from_contents(schema))
    return registry


def _validator(name: str) -> Draft202012Validator:
    schema = json.loads((SCHEMA_DIR / f"{name}.schema.json").read_text())
    return Draft202012Validator(schema, registry=_registry(), format_checker=Draft202012Validator.FORMAT_CHECKER)


def vocabulary() -> set[str]:
    """Known tags as `namespace:value`, from the site-tag classification seed."""
    rows = json.loads(TAG_VOCABULARY.read_text())["rows"]
    return {row["values"]["label"] for row in rows if row["entity"] == "ClassificationRecordEntity"}


def targets() -> dict[str, dict]:
    path = CONTRACTS / "targets.json"
    return json.loads(path.read_text()) if path.exists() else {}


def _schema_errors(validator: Draft202012Validator, document: Any, where: str) -> list[str]:
    return [
        f"{where}: {'/'.join(str(p) for p in error.absolute_path) or '<root>'}: {error.message}"
        for error in sorted(validator.iter_errors(document), key=lambda e: list(e.absolute_path))
    ]


def _collect_tags(value: Any) -> list[str]:
    found: list[str] = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "tags" and isinstance(item, list):
                found.extend(t for t in item if isinstance(t, str))
            else:
                found.extend(_collect_tags(item))
    elif isinstance(value, list):
        for item in value:
            found.extend(_collect_tags(item))
    return found


def validate(bundle: Bundle, family: Bundle | None = None, run_dry: bool = True) -> Report:
    report = Report(errors=list(bundle.errors))
    if report.errors:
        return report
    manifest, vocab, known_targets = bundle.manifest, vocabulary(), targets()

    # 1. JSON Schema
    report.errors += _schema_errors(_validator("manifest"), manifest, "manifest.yml")
    for name, module in bundle.modules.items():
        report.errors += _schema_errors(_validator("module"), module, f"modules/{name}.yml")
        if module.get("module") != name:
            report.errors.append(f"modules/{name}.yml: module name {module.get('module')!r} must equal the file name")
    for name, mapping in bundle.mappings.items():
        report.errors += _schema_errors(_validator("mapping"), mapping, f"mappings/{name}.yml")
        if mapping.get("mapping") != name:
            report.errors.append(
                f"mappings/{name}.yml: mapping name {mapping.get('mapping')!r} must equal the file name"
            )
    if bundle.tags:
        report.errors += _schema_errors(_validator("tags"), bundle.tags, "tags.yml")
    if bundle.sections:
        report.errors += _schema_errors(_validator("sections"), bundle.sections, "sections.yml")
        if not report.errors:
            report.errors += sections.validate_sections(bundle.sections)
    if report.errors:
        return report

    # 2. Static checks
    extends = manifest.get("extends")
    if extends and manifest.get("kind") == "family":
        report.errors.append("manifest.yml: a family cannot extend another family (one level of inheritance only)")
    if extends and family is None:
        report.warnings.append(
            f"extends {extends['family']} but no family bundle was supplied; inherited modules were not checked"
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
        if "module" not in mapping and "extractor" not in mapping:
            report.errors.append(
                f"mappings/{name}.yml: needs a module (structure mapping) or an extractor (dataset import)"
            )
        elif "module" in mapping and mapping["module"] not in modules:
            report.errors.append(f"mappings/{name}.yml: module {mapping['module']!r} does not exist")
        target = known_targets.get(mapping["target_kind"])
        if known_targets and target is None:
            report.errors.append(f"mappings/{name}.yml: target {mapping['target_kind']!r} is not a stored table")
        elif target:
            for key in mapping["fields"]:
                if key not in target["fields"]:
                    report.errors.append(f"mappings/{name}.yml: {mapping['target_kind']} has no field {key!r}")
            for key in mapping["key"]:
                if key not in mapping["fields"]:
                    report.errors.append(f"mappings/{name}.yml: key {key!r} is not a mapped field")
            missing = [f for f in target["required"] if f not in mapping["fields"] and f not in ("isCurrent",)]
            if missing:
                report.warnings.append(
                    f"mappings/{name}.yml: required fields not mapped (supplied by the engine or defaults?): {', '.join(missing)}"
                )
        module_fields = set(modules.get(mapping.get("module", ""), {}).get("extract", {}).get("fields", {}))
        for key, spec in mapping["fields"].items():
            if "from" in spec and module_fields and spec["from"].split(".")[0] not in module_fields:
                report.errors.append(
                    f"mappings/{name}.yml: field {key!r} reads {spec['from']!r}, which module {mapping['module']!r} does not extract"
                )
            if "transform" in spec and not transforms.known(spec["transform"]):
                report.errors.append(
                    f"mappings/{name}.yml: unknown transform {transforms.split(spec['transform'])[0]!r}"
                )
    for name, module in modules.items():
        for field_name, spec in module.get("extract", {}).get("fields", {}).items():
            if "parse" in spec and not transforms.known(spec["parse"]):
                report.errors.append(
                    f"module {name}: field {field_name}: unknown transform {transforms.split(spec['parse'])[0]!r}"
                )
        if module.get("fetch", {}).get("resource") == "html" and manifest.get("fetch", {}).get("mode") == "api":
            report.warnings.append(f"module {name}: html resource in an api-mode site")

    proposed = {entry["tag"] for entry in bundle.tags.get("tags", [])} if bundle.tags else set()
    namespaces = {tag.split(":")[0] for tag in vocab}
    for tag in {
        *_collect_tags(manifest),
        *[t for m in modules.values() for t in _collect_tags(m)],
        *[t for m in bundle.mappings.values() for t in _collect_tags(m)],
    }:
        if tag in vocab or tag in proposed:
            continue
        report.errors.append(
            f"unknown tag {tag!r}"
            + (
                " (the namespace is known; add it to tags.yml to propose a new value)"
                if tag.split(":")[0] in namespaces
                else " (unknown namespace)"
            )
        )
    for tag in proposed:
        if tag.split(":")[0] not in namespaces:
            report.errors.append(f"tags.yml proposes {tag!r} in an unknown namespace")

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
        for key in ("listing", "api"):
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
