"""The grammar of every code, and the two forms of a database row's code.

Segments are lowercase `a-z0-9` words joined by single dashes (one real name: `north-america`), separated by dots (a dot
means "narrower than"). No underscores. A database row has a *qualified* code `pg.<schema short>.<table short>.<path>` in
the repository and a *stored* code `<schema short>.<table short>.<path>` in the database; `qualify` and `strip` are the only
conversions. Seed files hold the identity path alone, because the file and the link column already say which table.
"""

from __future__ import annotations

import re

from mzizi_manifest.features.codes.glossary import Glossary, TableCode

SEGMENT = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
WORD = re.compile(r"^[a-z0-9]+$")
MAX_SEGMENTS = 16
MAX_LENGTH = 255
SPACES = ("pg", "sys", "mg")


def segments_problem(code: str) -> str | None:
    """Why `code` is not a well-formed dotted code, or None."""
    if not code or len(code) > MAX_LENGTH:
        return f"must be 1 to {MAX_LENGTH} characters"
    parts = code.split(".")
    if len(parts) > MAX_SEGMENTS:
        return f"has more than {MAX_SEGMENTS} segments"
    for part in parts:
        if not SEGMENT.match(part):
            hint = " (use a dash, not an underscore)" if "_" in part else ""
            return f"segment {part!r} must be lowercase words joined by dashes{hint}"
    return None


def stored_code(table: TableCode, path: str) -> str:
    """The code as the database stores it: `<schema short>.<table short>.<path>`."""
    return f"{table.schema_short}.{table.short}.{path}"


def qualify(stored: str, space: str = "pg") -> str:
    """The repository form of a stored code: `pg.ref.cty.ke`."""
    return f"{space}.{stored}"


def strip(qualified: str, space: str = "pg") -> str:
    """The stored form of a repository code. Refuses a code that is not in `space`."""
    prefix = f"{space}."
    if not qualified.startswith(prefix):
        raise ValueError(f"{qualified!r} is not a {space} code")
    return qualified[len(prefix) :]


def scheme_path_problem(path: str, glossary: Glossary) -> str | None:
    """A scheme's path is `<schema short>.<concept>(.<concept>)*`: it starts with the schema that owns the meaning."""
    parts = path.split(".")
    if len(parts) < 2 or parts[0] not in glossary.schema_shorts():
        return f"must start with a schema short ({', '.join(sorted(glossary.schema_shorts()))}) and name a concept"
    for part in parts[1:]:
        if not WORD.match(part):
            return f"concept {part!r} must be a single word; join the words of a real name only in a member's name"
    return None


def member_path_problem(path: str, parent_path: str) -> str | None:
    """A member's path is its parent's path plus exactly one name segment."""
    if not path.startswith(parent_path + "."):
        return f"must start with its parent's code {parent_path!r}"
    if "." in path[len(parent_path) + 1 :]:
        return f"must add exactly one segment to {parent_path!r}"
    return None
