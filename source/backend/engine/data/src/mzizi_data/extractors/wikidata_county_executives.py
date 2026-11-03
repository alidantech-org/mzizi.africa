"""Wikidata answers for the county executive positions to one `record` segment per (county, office, person).

Input is the bundle `{"files": {name: raw position answer}, "labels": {item id: English label}}` built by the importer from
the raw API answers. A person who held the same position in two terms yields one record spanning them (earliest start, latest end;
a term without an end date keeps the whole record open). Dates keep the precision Wikidata states; none is invented.
"""
from __future__ import annotations

import json
import re

from . import Extractor, Output, register

START, END, PARTY, REASON = "P580", "P582", "P102", "P1534"
PRECISION = {11: "exact", 10: "month", 9: "year"}


def item_ids(entity: dict, prop: str) -> list[str]:
    return [c["mainsnak"]["datavalue"]["value"]["id"] for c in entity.get("claims", {}).get(prop, []) if c.get("mainsnak", {}).get("datavalue")]


def _time(claim: dict, prop: str):
    for q in claim.get("qualifiers", {}).get(prop, []):
        v = (q.get("datavalue") or {}).get("value")
        if isinstance(v, dict) and v.get("time"):
            m = re.match(r"\+(\d{4})-(\d\d)-(\d\d)", v["time"])
            if m and m.group(1) != "0000":
                y, mo, d = m.groups()
                return f"{y}-{mo if mo != '00' else '01'}-{d if d != '00' else '01'}", PRECISION.get(v.get("precision"), "year")
    return None, None


def _qual_ids(claim: dict, prop: str) -> list[str]:
    return [q["datavalue"]["value"]["id"] for q in claim.get("qualifiers", {}).get(prop, []) if (q.get("datavalue") or {}).get("value", {}).get("id")]


def run(data: bytes, profile: str | None) -> Output:
    try:
        bundle = json.loads(data)
        files, labels = bundle["files"], bundle.get("labels", {})
    except (UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError) as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unexpected_shape", "message": str(error)[:200]}])
    merged: dict[tuple, dict] = {}
    skipped = 0
    for name in sorted(files):
        raw = files[name]
        if not raw.get("position"):
            continue
        qid = raw["position"]["id"]
        qids = {qid, *raw["position"].get("alsoIds", [])}
        for pid, entity in raw.get("entities", {}).items():
            label = (entity.get("labels", {}).get("en") or {}).get("value")
            if "Q5" not in item_ids(entity, "P31") or not label:
                skipped += 1
                continue
            for claim in entity.get("claims", {}).get("P39", []):
                if (claim.get("mainsnak", {}).get("datavalue") or {}).get("value", {}).get("id") not in qids:
                    continue
                vf, vfp = _time(claim, START)
                vt, vtp = _time(claim, END)
                party_ids = _qual_ids(claim, PARTY) or item_ids(entity, PARTY)
                reason_ids = _qual_ids(claim, REASON)
                key = (raw["county"], raw["kind"], pid)
                rec = merged.setdefault(key, {"county": raw["county"], "kind": raw["kind"], "wikidata": pid, "name": label, "from": None, "fromPrecision": None, "to": None, "toPrecision": None, "open": False, "party": None, "reason": None, "life": "deceased" if entity.get("claims", {}).get("P570") else "unknown", "positionId": qid, "retrievedAt": raw.get("retrieved_at")})
                if vf and (rec["from"] is None or vf < rec["from"]):
                    rec["from"], rec["fromPrecision"] = vf, vfp
                if vt is None:
                    rec["open"] = True
                elif rec["to"] is None or vt > rec["to"]:
                    rec["to"], rec["toPrecision"] = vt, vtp
                if party_ids and not rec["party"]:
                    rec["party"] = labels.get(party_ids[0])
                if reason_ids and not rec["reason"]:
                    rec["reason"] = labels.get(reason_ids[0])
    segments = []
    for key, rec in sorted(merged.items()):
        if rec["open"]:
            rec["to"], rec["toPrecision"] = None, None
        segments.append({"key": "/".join(key), "kind": "record", "locator": json.dumps({"file": key[0], "kind": key[1], "item": key[2]}), "content": json.dumps(rec, sort_keys=True), "confidence": 0.8})
    diagnostics = [{"level": "info", "code": "rows_read", "message": f"{len(segments)} holder records, {skipped} non-person or unnamed items skipped"}]
    return Output("succeeded" if segments else "failed", segments, diagnostics)


EXTRACTOR = register(Extractor("wikidata-county-executives", "0.1.0", run))
