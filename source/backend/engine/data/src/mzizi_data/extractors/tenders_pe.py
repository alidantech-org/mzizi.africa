"""A page of the tenders.go.ke procuring-entity directory (`/api/pe/all-pe`) to one `record` segment per entity.

Everything the page publishes about an entity is kept in the raw artifact; the record carries what the model uses:
name, county, city, address, website and the entity's published phone, email and KRA PIN (public bodies only).
"""
from __future__ import annotations

import json

from . import Extractor, Output, register


def run(data: bytes, profile: str | None) -> Output:
    try:
        page = json.loads(data)
        rows = page["data"]
    except (UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": str(error)[:200]}])
    segments = []
    for index, row in enumerate(rows):
        if not row.get("name") or row.get("id") is None:
            continue
        county = (row.get("county") or {}).get("name") if isinstance(row.get("county"), dict) else None
        record = {"id": row["id"], "name": row["name"], "peTypeId": row.get("pe_type_id"), "county": county, "countyId": row.get("county_id"), "city": row.get("city"), "address": row.get("physical_address"), "website": row.get("org_url"), "phone": row.get("telephone"), "email": row.get("email"), "pin": row.get("pin"), "status": row.get("status")}
        segments.append({"key": f"pe-{row['id']}", "kind": "record", "locator": json.dumps({"id": row["id"]}), "content": json.dumps(record, sort_keys=True), "confidence": 1})
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_entities", "message": "no entities on the page"}])
    return Output("succeeded", segments, [{"level": "info", "code": "entities_read", "message": f"{len(segments)} entities read"}])


EXTRACTOR = register(Extractor("tenders-pe", "0.1.0", run))
