"""Family inheritance: the effective module set of a site bundle that extends a family bundle."""

from __future__ import annotations

import copy
from typing import Any

from .bundle import Bundle


def effective_modules(site: Bundle, family: Bundle | None) -> dict[str, dict]:
    """Family modules, minus 'remove', with 'replace' and 'add' taken from the site bundle.

    One level of inheritance only: a family may not itself extend another family (rejected by the validator).
    """
    extends = site.manifest.get("extends")
    if not extends or family is None:
        return copy.deepcopy(site.modules)
    overlay = (site.manifest.get("overlay") or {}).get("modules") or {}
    modules = {
        name: copy.deepcopy(module) for name, module in family.modules.items() if name not in overlay.get("remove", [])
    }
    for name in [*overlay.get("replace", []), *overlay.get("add", [])]:
        if name in site.modules:
            modules[name] = copy.deepcopy(site.modules[name])
    return modules


def effective_vars(site: Bundle) -> dict:
    return dict(site.manifest.get("vars") or {})


def substitute(value: Any, variables: dict) -> Any:
    """Replaces ${name} in strings with variables; an unknown variable is an error, never an empty string."""
    import re

    if isinstance(value, str):

        def repl(match: re.Match[str]) -> str:
            key = match.group(1)
            if key not in variables:
                raise KeyError(f"undefined variable ${{{key}}}")
            return str(variables[key])

        return re.sub(r"\$\{([a-z_][a-z0-9_.]*)\}", repl, value)
    if isinstance(value, list):
        return [substitute(item, variables) for item in value]
    if isinstance(value, dict):
        return {key: substitute(item, variables) for key, item in value.items()}
    return value
