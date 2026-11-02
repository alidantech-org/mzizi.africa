"""World Bank indicator API JSON ([metadata, [datapoints]]) to one `record` segment per datapoint.

Null values (years without data) are skipped and counted in a diagnostic; nothing is interpolated.
"""
from __future__ import annotations

import json

from . import Extractor, Output, register


def run(data: bytes, profile: str | None) -> Output:
    try:
        document = json.loads(data)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "invalid_json", "message": str(error)}])
    if not (isinstance(document, list) and len(document) == 2 and isinstance(document[1], list)):
        message = document[0].get("message") if isinstance(document, list) and document and isinstance(document[0], dict) else None
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": f"expected [metadata, datapoints]; got {str(message or type(document).__name__)[:200]}"}])
    meta, points = document
    segments, skipped = [], 0
    for index, point in enumerate(points):
        if point.get("value") is None:
            skipped += 1
            continue
        content = {
            "date": point["date"], "value": point["value"], "indicator": point["indicator"]["id"], "indicatorName": point["indicator"]["value"],
            "country": point["countryiso3code"], "countryName": point["country"]["value"], "obsStatus": point.get("obs_status", ""), "lastUpdated": meta.get("lastupdated"),
        }
        segments.append({"key": f"point-{index}", "kind": "record", "locator": json.dumps({"index": index, "date": point["date"]}), "content": json.dumps(content, sort_keys=True), "confidence": 1})
    diagnostics = [{"level": "info", "code": "points_read", "message": f"{len(segments)} datapoints read, {skipped} without a value skipped (last updated {meta.get('lastupdated')})"}]
    if not segments:
        return Output("failed", diagnostics=diagnostics)
    return Output("succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("worldbank-indicator", "0.1.0", run))
