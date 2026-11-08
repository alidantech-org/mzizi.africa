"""ORPP Political Parties Fund distribution tables and the annual allocation Gazette notice (text PDFs).

One `record` segment per party row: financial year, row number, party name, party code (the notice only), amount as published
(text, Kshs). Tables are told apart by their caption ("Table 1.2 Distribution of FY 2014/2015 ..." or the notice's
"during the Financial Year 2026/2027"). The checks refuse a table that does not hold together: row numbers must run 1..n
without gaps, no amount may be zero or negative, and where the document states how many parties are eligible ("forty-eight
(48)") the count must equal it. A table that fails is reported as an error diagnostic and none of its rows is emitted, so
the result is `partial` rather than silently wrong. The documents publish no totals, so a sum check is not possible.
"""
from __future__ import annotations

import io
import json
import re

import pdfplumber

from . import Extractor, Output, register

CAPTION = re.compile(r"(?:Distribution of\s+FY\s*|Financial\s+Year\s+)(\d{4})\s*/\s*(\d{2,4})", re.I)
ROW = re.compile(r"^\s*(\d{1,3})\.?\s+(?:(\d{1,3})\s+)?(\D.*?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*$")
STATED = re.compile(r"\((\d+)\)\s+political\s+parties\s+are\s+eligible", re.I)


def fiscal_year_code(start: str, end: str) -> str:
    return f"fy/ke/{start}/{end[-2:]}"


SPACED_AMOUNT = re.compile(r"(?<=\s)([\d,.](?: [\d,.]){4,})\s*$")


def unspace(line: str) -> str:
    """Some rows come out of the PDF with a space between every character of the amount ("1 3 1 , 3 1 0 , 7 9 9 . 5 1"): only that trailing run is closed up."""
    return SPACED_AMOUNT.sub(lambda m: m.group(1).replace(" ", ""), line)


def run(data: bytes, profile: str | None) -> Output:
    rows: dict[str, list[dict]] = {}
    stated: dict[str, int] = {}
    with_code: set[str] = set()
    current = None
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page_number, page in enumerate(pdf.pages, 1):
            for line in map(unspace, re.sub(r"Financial\s*\n\s*Year", "Financial Year", page.extract_text() or "").splitlines()):
                caption = CAPTION.search(line)
                if caption and ("Distribution" in line or "Financial Year" in line):
                    current = fiscal_year_code(caption.group(1), caption.group(2))
                    rows.setdefault(current, [])
                    count = STATED.search(line)
                    if count:
                        stated[current] = int(count.group(1))
                    continue
                if current and not stated.get(current):
                    count = STATED.search(line)
                    if count:
                        stated[current] = int(count.group(1))
                if current and re.match(r"^\s*S/No", line) and re.search(r"\bCode\b", line):
                    with_code.add(current)
                match = ROW.match(line) if current else None
                if not match:
                    continue
                serial, code, name, amount = match.groups()
                if current not in with_code:
                    if code:  # without a code column the second number belongs to the name, which cannot start with a digit; treat the line as noise
                        continue
                rows[current].append({"fiscalYear": current, "serial": int(serial), "partyName": re.sub(r"\s+", " ", name).strip(), "partyCode": code if current in with_code else None, "amount": amount, "page": page_number})
    segments, diagnostics = [], []
    for fy, table in rows.items():
        problems = []
        if [r["serial"] for r in table] != list(range(1, len(table) + 1)):
            problems.append(f"row numbers are not 1..{len(table)} in order")
        if any(float(r["amount"].replace(",", "")) <= 0 for r in table):
            problems.append("an amount is zero or negative")
        if fy in stated and stated[fy] != len(table):
            problems.append(f"the notice states {stated[fy]} parties but {len(table)} rows were read")
        if not table:
            problems.append("no rows read")
        if problems:
            diagnostics.append({"level": "error", "code": "table_refused", "message": f"{fy}: {'; '.join(problems)}; table not emitted"})
            continue
        for r in table:
            segments.append({"key": f"{fy}-{r['serial']}", "kind": "record", "locator": json.dumps({"page": r["page"], "fy": fy, "row": r["serial"]}), "content": json.dumps(r, sort_keys=True), "confidence": 1})
        diagnostics.append({"level": "info", "code": "table_read", "message": f"{fy}: {len(table)} rows" + (f" (stated {stated[fy]})" if fy in stated else "")})
    if not segments:
        return Output("failed", diagnostics=diagnostics + [{"level": "error", "code": "no_tables", "message": "no Political Parties Fund tables recognised"}])
    return Output("partial" if any(d["level"] == "error" for d in diagnostics) else "succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("ppf-distribution", "0.1.0", run))
