"""NG-CDF public API responses (allocations and disbursements per constituency) to one `record` segment per row.

The API is the same one the NG-CDF website's own pages call. A response is `{"PAYLOAD": [{"<Kind>": "<CONSTITUENCY>"}, {...rows}]}`.
Amounts stay text with the published thousands separators; the mapping parses them. Nothing is estimated.
"""
from __future__ import annotations

import json
from datetime import datetime

from . import Extractor, Output, register


def run(data: bytes, profile: str | None) -> Output:
    try:
        payload = json.loads(data)["PAYLOAD"]
    except (UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": str(error)[:200]}])
    if not payload or not isinstance(payload[0], dict) or len(payload[0]) != 1:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": "no constituency header row"}])
    constituency = next(iter(payload[0].values()))
    segments, skipped = [], 0
    for index, row in enumerate(payload[1:]):
        amount, fy = row.get("Amount"), row.get("FY")
        if not amount or not fy:
            skipped += 1
            continue
        record = {"constituency": constituency, "amount": amount, "financialYear": fy}
        if profile == "disbursements":
            try:
                record["date"] = datetime.strptime(row["Date"], "%b %d, %Y").date().isoformat()
            except (KeyError, ValueError):
                skipped += 1
                continue
        segments.append({"key": f"row-{index}", "kind": "record", "locator": json.dumps({"row": index}), "content": json.dumps(record, sort_keys=True), "confidence": 1})
    diagnostics = [{"level": "info", "code": "rows_read", "message": f"{len(segments)} rows read for {constituency}, {skipped} skipped"}]
    if not segments:
        return Output("failed", diagnostics=diagnostics)
    return Output("succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("ngcdf-api", "0.1.0", run))
