"""An OCDS 1.1 release package to one `record` segment per release.

Each record keeps the release's tender, buyer, suppliers (with the address the package gives), awards and contracts in
flattened form. Contact points in the package are not copied into records (the raw package, kept unchanged, has them).
"""
from __future__ import annotations

import json

from . import Extractor, Output, register


def _date(value: str | None) -> str | None:
    return value[:10] if value else None


def run(data: bytes, profile: str | None) -> Output:
    try:
        package = json.loads(data)
        releases = package["releases"]
    except (UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": str(error)[:200]}])
    segments = []
    for index, release in enumerate(releases):
        tender, buyer = release.get("tender") or {}, release.get("buyer") or {}
        parties = {p["id"]: p for p in release.get("parties", []) if "supplier" in p.get("roles", [])}
        awards = []
        for award in release.get("awards", []):
            for supplier in award.get("suppliers", []):
                party = parties.get(supplier.get("id"), {})
                address = party.get("address") or {}
                awards.append({"awardId": award.get("id"), "supplierId": supplier.get("id"), "supplierName": supplier.get("name"), "value": (award.get("value") or {}).get("amount"), "currency": (award.get("value") or {}).get("currency"), "street": address.get("streetAddress"), "postal": address.get("postalCode")})
        contracts = [{"contractId": c.get("id"), "awardId": c.get("awardID"), "signed": _date(c.get("dateSigned")), "value": (c.get("value") or {}).get("amount")} for c in release.get("contracts", [])]
        period = tender.get("tenderPeriod") or {}
        record = {"ocid": release.get("ocid"), "title": tender.get("title"), "method": tender.get("procurementMethod"), "category": tender.get("mainProcurementCategory"), "starts": _date(period.get("startDate")), "ends": _date(period.get("endDate")), "buyerId": buyer.get("id"), "buyerName": buyer.get("name"), "awards": awards, "contracts": contracts, "releaseDate": _date(release.get("date"))}
        if not record["ocid"] or not record["title"]:
            continue
        segments.append({"key": f"r{index}", "kind": "record", "locator": json.dumps({"ocid": record["ocid"]}), "content": json.dumps(record, sort_keys=True), "confidence": 1})
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_releases", "message": "no usable releases"}])
    return Output("succeeded", segments, [{"level": "info", "code": "releases_read", "message": f"{len(segments)} of {len(releases)} releases read"}])


EXTRACTOR = register(Extractor("ocds", "0.1.0", run))
