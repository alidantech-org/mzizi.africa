"""County leader records already read from Wikipedia wikitext and county site text (see imports/county_leaders.py) to one `record` segment each.

The bundle is `{"records": [{county, kind, name, sources: [{source, url, confidence}], confidence}]}`; the source URLs stay in each segment so the
attribution can name them. No name is invented: this extractor only validates shape and passes records on."""
from __future__ import annotations

import json

from . import Extractor, Output, register


def run(data: bytes, profile: str | None) -> Output:
    try:
        records = json.loads(data)["records"]
    except (UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": str(error)[:200]}])
    segments = []
    for r in records:
        if not r.get("name") or not r.get("county") or not r.get("kind"):
            continue
        segments.append({"key": f"{r['county']}/{r['kind']}/{r['name'].lower().replace(' ', '-')}", "kind": "record", "locator": json.dumps({"urls": [s["url"] for s in r.get("sources", [])]}), "content": json.dumps(r, sort_keys=True), "confidence": r.get("confidence", 0.5)})
    return Output("succeeded" if segments else "failed", segments, [{"level": "info", "code": "rows_read", "message": f"{len(segments)} leader records"}])


EXTRACTOR = register(Extractor("county-leaders-web", "0.1.0", run))
