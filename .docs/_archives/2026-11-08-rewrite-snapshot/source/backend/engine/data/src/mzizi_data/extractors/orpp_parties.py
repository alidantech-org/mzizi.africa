"""ORPP registers of political parties (text PDFs): one `record` segment per party row.

Two layouts are read, told apart by their header row: the *fully registered* register (certificate serial, number, name,
abbreviation, date of issue, symbol, colours, postal address, head office, slogan, changes) and the *provisionally
registered* register (code, name, abbreviation, symbol, slogan, colours, date of registration, status, email). Cells are
kept as published (whitespace collapsed); nothing is guessed. A row whose cells cannot be read is reported, not skipped
silently. The symbol image of each row is located (page and box in PDF points) so the importer can crop it.
"""
from __future__ import annotations

import io
import json
import re
from datetime import date

import pdfplumber

from . import Extractor, Output, register

MONTHS = {m: i for i, m in enumerate(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"], 1)}
DATE = re.compile(r"(\d{1,2})(?:st|nd|rd|th)?[\s,]+([A-Za-z]+)[\s,]+(\d{4})")


def parse_date(text: str | None) -> str | None:
    """'19th March 2012' to '2012-03-19'; anything else is None (the raw text is kept in the record)."""
    match = DATE.search(text or "")
    if not match:
        return None
    month = MONTHS.get(match.group(2).lower())
    if not month:
        return None
    try:
        return date(int(match.group(3)), month, int(match.group(1))).isoformat()
    except ValueError:
        return None


def clean(cell) -> str | None:
    text = re.sub(r"\s+", " ", cell or "").strip()
    return text or None


def _join_broken(text: str | None) -> str | None:
    return re.sub(r"-\s+(?=\d)", "-", text) if text else text


def _layout(header: list) -> str | None:
    joined = " ".join(clean(c) or "" for c in header).lower()
    if "certificate" in joined and "abbrev" in joined:
        return "full"
    if "codes" in joined and "abbrev" in joined:
        return "provisional"
    return None


def run(data: bytes, profile: str | None) -> Output:
    segments: list[dict] = []
    diagnostics: list[dict] = []
    layout = None
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page_number, page in enumerate(pdf.pages, 1):
            for table in page.find_tables():
                rows = table.extract()
                if not rows:
                    continue
                for index, row in enumerate(rows):
                    found = _layout(row)
                    if found:
                        layout = found
                        break
                if layout is None:
                    continue
                geometry = table.rows
                for index, row in enumerate(rows):
                    first = clean(row[0]) if row else None
                    lead = re.match(r"(\d+)\.(?:\s|$)", first or "")
                    if not lead:
                        continue
                    serial = int(lead.group(1))
                    cells = [clean(c) for c in row]
                    if first and first != lead.group(0).strip():
                        # a number cell that also holds a stray fragment (a certificate code wrapped into it): keep the fragment for the code column
                        fragment = first[lead.end():].strip()
                        if fragment and not (cells[1] or "").strip():
                            cells[1] = fragment
                    box = geometry[index].bbox if index < len(geometry) else None
                    symbol_box = None
                    if box:
                        symbol_col = 5 if layout == "full" else 4
                        cell = geometry[index].cells[symbol_col] if symbol_col < len(geometry[index].cells) else None
                        if cell:
                            inside = [im for im in page.images if cell[0] - 2 <= im["x0"] and im["x1"] <= cell[2] + 2 and cell[1] - 2 <= im["top"] and im["bottom"] <= cell[3] + 2 and im["width"] > 8 and im["height"] > 8]
                            if inside:
                                symbol_box = [min(im["x0"] for im in inside), min(im["top"] for im in inside), max(im["x1"] for im in inside), max(im["bottom"] for im in inside)]
                    if layout == "full":
                        # the cell holds the row number's wrapped digits and the certificate number ("3 047 8" is row 38, certificate 047)
                        found = re.findall(r"\b\d{3,4}\b", cells[1] or "")
                        number = found[-1] if found else None
                        record = {
                            "register": "full", "serial": serial, "certificateNumber": number,
                            "name": cells[2], "abbreviation": cells[3], "issueDateText": cells[4], "issueDate": parse_date(cells[4]),
                            "symbolDescription": cells[5], "colours": cells[6], "postalAddress": _join_broken(cells[7]), "headOffice": cells[8], "slogan": cells[9], "changes": cells[10] if len(cells) > 10 else None,
                            "status": "active",
                        }
                    else:
                        record = {
                            "register": "provisional", "serial": serial, "partyCode": cells[1], "name": cells[2], "abbreviation": cells[3], "symbolDescription": cells[4], "slogan": cells[5], "colours": cells[6],
                            "issueDateText": cells[7], "issueDate": parse_date(cells[7]), "statusText": cells[8], "email": cells[9] if len(cells) > 9 else None, "status": "provisional",
                        }
                    if not record.get("name"):
                        diagnostics.append({"level": "warning", "code": "row_without_name", "message": f"page {page_number} row {serial} has no party name; skipped"})
                        continue
                    record["page"] = page_number
                    record["symbolBox"] = symbol_box
                    segments.append({"key": f"{layout}-{serial}", "kind": "record", "locator": json.dumps({"page": page_number, "row": serial}), "content": json.dumps(record, sort_keys=True), "confidence": 1})
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_party_rows", "message": "no register rows recognised"}])
    serials = [json.loads(s["content"])["serial"] for s in segments]
    if serials != list(range(1, len(serials) + 1)):
        diagnostics.append({"level": "warning", "code": "serial_gap", "message": f"row numbers are not 1..{len(serials)} in order; a row may be missing or split"})
    diagnostics.append({"level": "info", "code": "party_rows_read", "message": f"{len(segments)} {layout} register rows read"})
    return Output("partial" if any(d["level"] == "warning" for d in diagnostics) else "succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("orpp-parties", "0.1.0", run))
