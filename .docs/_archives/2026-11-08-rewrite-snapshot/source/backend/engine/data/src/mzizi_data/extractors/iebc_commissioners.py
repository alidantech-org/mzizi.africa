"""The IEBC "Commissioners" page: one `record` segment per commissioner (name and role as published; nothing else is read)."""
from __future__ import annotations

import json
import re

from lxml import html

from . import Extractor, Output, register
from .parliament_members import clean_name

ROLE = re.compile(r"(.+?)\s+(Vice Chairperson|Chairperson|Commissioner)\s+Read more")


def run(data: bytes, profile: str | None) -> Output:
    tree = html.fromstring(data)
    for tag in tree.xpath("//script|//style"):
        tag.drop_tree()
    text = " ".join(tree.text_content().split())
    start = text.find("Commissioners ")
    segments = []
    for index, match in enumerate(ROLE.finditer(text[start:] if start >= 0 else text)):
        raw, role = match.group(1).strip(), match.group(2)
        raw = raw.split("Commissioners ")[-1]
        name = clean_name(raw)
        if not name["display"]:
            continue
        segments.append({"key": f"row-{index}", "kind": "record", "locator": json.dumps({"row": index}), "content": json.dumps({"nameRaw": raw, "displayName": name["display"], "givenName": name["given"], "familyName": name["family"], "role": role}, sort_keys=True), "confidence": 1})
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_commissioners", "message": "no commissioner entries recognised"}])
    return Output("succeeded", segments, [{"level": "info", "code": "commissioners_read", "message": f"{len(segments)} commissioners read"}])


EXTRACTOR = register(Extractor("iebc-commissioners", "0.1.0", run))
