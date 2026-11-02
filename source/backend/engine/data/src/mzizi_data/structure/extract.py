"""Field extraction from a discovered item, shared by the dry-run validator and the runner."""
from __future__ import annotations

import re
from typing import Any

from . import selectors, transforms

TOKENS = {"link_text", "link_href", "item_text"}


def _token(item: Any, token: str) -> Any:
    if token == "item_text":
        return item.get_text(" ", strip=True) if hasattr(item, "get_text") else (item if isinstance(item, str) else None)
    anchor = item if getattr(item, "name", None) == "a" else (item.find("a") if hasattr(item, "find") else None)
    if token == "link_text":
        return anchor.get_text(" ", strip=True) if anchor else None
    return anchor.get("href") if anchor else None


def extract_item(item: Any, fields: dict[str, dict]) -> tuple[dict[str, Any], list[str]]:
    """Extracts every field of a module from one item; later fields may refer to earlier ones by name."""
    record: dict[str, Any] = {}
    errors: list[str] = []
    for name, spec in fields.items():
        try:
            if "const" in spec:
                value: Any = spec["const"]
            else:
                source = spec.get("from")
                if isinstance(source, str) and source in TOKENS:
                    value = _token(item, source)
                elif isinstance(source, str) and source in record:
                    value = record[source]
                elif isinstance(source, str) and source.startswith("$"):
                    found = selectors._jsonpath(item, source)
                    value = found[0] if found else None
                elif isinstance(source, (dict, list)):
                    match = selectors.select(item, source)
                    value = match.items[0] if match.items else None
                elif isinstance(source, str) and isinstance(item, dict):
                    value = item.get(source)
                else:
                    value = None
                if "regex" in spec and value is not None:
                    found_match = re.search(spec["regex"], str(value))
                    value = (found_match.group(1) if found_match and found_match.groups() else found_match.group(0)) if found_match else None
            if "parse" in spec and value is not None:
                value = transforms.apply(spec["parse"], value)
            record[name] = value
        except Exception as error:  # a bad value is reported on the field, never guessed
            record[name] = None
            errors.append(f"{name}: {error}")
    return record, errors


def discover_items(content: str | bytes | Any, module: dict) -> selectors.Match:
    discover = module.get("discover", {})
    for key in ("listing", "api"):
        if key in discover:
            return selectors.select(content, discover[key]["items"])
    return selectors.Match(-1, [])
