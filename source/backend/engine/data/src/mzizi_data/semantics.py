"""Document semantics (TSK-C6EB48738A4D): what is this file, and which parser should read it.

A layered classifier over files the crawler registered (or any bytes):

  1. url_pattern  - regexes over the file name and every URL the document was seen at;
  2. text_pattern - regexes over extracted text (PyMuPDF for PDF, openpyxl for xlsx, python-docx for docx, the header
                    row of a csv, member names of a zip);
  3. title_fuzzy  - rapidfuzz matching of the link title and the first lines against the document-kind catalogue.

Each layer gives per-kind scores; they combine as a noisy-or (agreement raises confidence, never above 0.99), and the
layer with the strongest single contribution is recorded as the method. Below the acceptance threshold, or when two
kinds are within a hair of each other, the document stays `unclassified`: it goes to the reinforcement gap queue
(engine.gaps) and nothing is guessed. A classified document with no parser to read it is queued as a parser gap.

The result is an attributable proposal (method, classifier version, all layer evidence kept), appended to
source.document_classifications; it never overwrites the document or the raw bytes. Dates, amounts and reference
numbers are extracted with character spans into the extracted text (and the page), so a reviewer can find the evidence.
Extracted facts are text spans only: no person is named or matched here (public-office facts arrive through the
dedicated importers).
"""
from __future__ import annotations

import io
import json
import re
import zipfile
from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import PurePosixPath
from typing import Any
from urllib.parse import unquote, urlparse

import psycopg
from psycopg.types.json import Jsonb
from rapidfuzz import fuzz

CATALOGUE_VERSION = "1.0.0"
CLASSIFIER_VERSION = f"layered-{CATALOGUE_VERSION}"
ACCEPT = 0.55  # combined score needed to accept a kind
MARGIN = 0.05  # the best kind must beat the runner-up by this much, else the document stays unclassified
PAGES_READ = 5  # pages of a PDF read for text
MAX_TEXT = 200_000


@dataclass(frozen=True)
class Kind:
    code: str
    label: str
    source_kind: str | None  # classification code in scheme source/document-kind, when one fits
    parser: str | None  # existing parser that can read it (None: a gap)
    url: tuple[str, ...]
    text: tuple[str, ...]
    titles: tuple[str, ...]


CATALOGUE: tuple[Kind, ...] = (
    Kind("gazette_notice", "Gazette notice", "gazette", None,
         (r"gazette", r"\bgn[-_ ]?\d{2,}"),
         (r"THE\s+KENYA\s+GAZETTE", r"Published\s+by\s+Authority\s+of\s+the\s+Republic\s+of\s+Kenya", r"GAZETTE\s+NOTICE\s+NO", r"Vol(?:ume)?\.?\s+[CXVIL]+\s*[—–-]\s*No\.?\s*\d+"),
         ("Kenya Gazette", "Gazette Notice", "Special Issue Kenya Gazette Supplement")),
    Kind("act", "Act of Parliament", "statute", None,
         (r"(?<![a-z])acts?(?![a-z])[-_/ ]?(?:19|20)?\d{0,4}", r"\bcap[-_ ]?\d+", r"laws[-_ ]of[-_ ]kenya"),
         (r"AN\s+ACT\s+of\s+Parliament\s+to", r"ARRANGEMENT\s+OF\s+SECTIONS", r"Laws\s+of\s+Kenya", r"Revised\s+Edition", r"Be\s+it\s+enacted\s+by\s+the\s+Parliament\s+of\s+Kenya"),
         ("Act, 2019", "The Public Finance Management Act", "Revised Edition Laws of Kenya")),
    Kind("bill", "Bill", None, None,
         (r"(?<![a-z])bills?(?![a-z])",),
         (r"A\s+Bill\s+for\s+an\s+Act\s+of\s+Parliament", r"Memorandum\s+of\s+Objects\s+and\s+Reasons", r"\bBill,?\s+(?:19|20)\d{2}\b", r"Bills?\s+(?:No\.?\s*\d+)?\s*of\s+(?:19|20)\d{2}"),
         ("Bill, 2024", "The Finance Bill", "National Assembly Bill")),
    Kind("hansard", "Hansard", None, None,
         (r"hansard", r"official[-_ ]report"),
         (r"\bHANSARD\b", r"OFFICIAL\s+REPORT", r"NATIONAL\s+ASSEMBLY\s+DEBATES", r"THE\s+SENATE\s+DEBATES", r"The\s+Speaker\s*\(Hon\.", r"Hon\.\s+Speaker"),
         ("Hansard Report", "National Assembly Official Report", "Senate Debates Hansard")),
    Kind("budget", "Budget", "budget", "budget-table",
         (r"budget", r"estimates", r"appropriation", r"\bpbb\b", r"\bcfsp\b", r"\bcbroi?p\b", r"programme[-_ ]based"),
         (r"Budget\s+Estimates", r"Programme\s+Based\s+Budget", r"Approved\s+(?:Budget\s+)?Estimates", r"Appropriation\s+(?:Act|Bill)", r"Printed\s+Estimates", r"Medium\s+Term\s+Expenditure", r"County\s+Fiscal\s+Strategy\s+Paper", r"Citizens?\s+Budget"),
         ("Approved Budget Estimates", "County Budget Estimates", "Programme Based Budget", "Citizens Budget", "Budget Statement")),
    Kind("audit_report", "Audit report", None, None,
         (r"audit", r"\boag\b", r"auditor[-_ ]general"),
         (r"Auditor[-\s]General", r"Basis\s+for\s+(?:Qualified\s+|Adverse\s+)?Opinion", r"Report\s+of\s+the\s+Auditor", r"Unmodified\s+opinion|Unqualified\s+opinion|Qualified\s+opinion|Adverse\s+opinion|Disclaimer\s+of\s+opinion", r"Key\s+Audit\s+Matters"),
         ("Report of the Auditor-General", "Audit Report", "Audited Financial Statements Audit Opinion")),
    Kind("census_table", "Census table", "census_report", None,
         (r"census", r"\bknbs\b", r"population[-_ ]and[-_ ]housing"),
         (r"Population\s+and\s+Housing\s+Census", r"\bKNBS\b", r"Kenya\s+National\s+Bureau\s+of\s+Statistics", r"Population\s+by\s+(?:County|Sub-?County|Ward|Sex)", r"Distribution\s+of\s+Population"),
         ("Kenya Population and Housing Census", "Population by County", "Census Report Volume")),
    Kind("tender_notice", "Tender notice", "tender_notice", None,
         (r"tender", r"\brfq\b", r"\brfp\b", r"\beoi\b", r"prequalif", r"quotation", r"procurement"),
         (r"Invitation\s+(?:to|for)\s+Tender", r"Tender\s+Notice", r"Request\s+for\s+(?:Quotation|Proposals?)", r"Expression\s+of\s+Interest", r"Pre-?qualification", r"Tender\s+(?:No|Number|Ref)", r"Procuring\s+Entity"),
         ("Invitation to Tender", "Tender Notice", "Request for Quotation", "Expression of Interest", "Prequalification of Suppliers")),
    Kind("party_constitution", "Party constitution", None, None,
         (r"party[-_ ]?constitution", r"constitution[-_ ]of[-_ ].*party", r"party[-_ ]?manifesto", r"nomination[-_ ]rules"),
         (r"Constitution\s+of\s+the\s+[A-Z][\w\s]{2,60}Party", r"Political\s+Parties\s+Act", r"National\s+Delegates\s+Conference", r"Party\s+Constitution", r"Registrar\s+of\s+Political\s+Parties"),
         ("Party Constitution", "Constitution of the Party", "Party Nomination Rules")),
    Kind("financial_statement", "Financial statement", None, None,
         (r"financial[-_ ]statements?", r"\bfs[-_ ]?(?:19|20)\d{2}", r"annual[-_ ]report"),
         (r"Statement\s+of\s+Financial\s+(?:Performance|Position)", r"Statement\s+of\s+Cash\s+Flows?", r"Notes\s+to\s+the\s+Financial\s+Statements", r"\bIPSAS\b", r"Statement\s+of\s+Receipts\s+and\s+Payments"),
         ("Annual Report and Financial Statements", "Financial Statements for the Year Ended 30th June", "Statement of Financial Performance")),
)
BY_CODE = {k.code: k for k in CATALOGUE}

# weights: how much one layer's evidence is worth before combination
URL_WEIGHT, TEXT_STEP, TEXT_BASE, FUZZY_CAP, LINE_CAP = 0.55, 0.15, 0.45, 0.9, 0.6
_URL = {k.code: [re.compile(p, re.I) for p in k.url] for k in CATALOGUE}
_TEXT = {k.code: [re.compile(p, re.I) for p in k.text] for k in CATALOGUE}


# ---- extraction of text -----------------------------------------------------------------------------------------

@dataclass
class Extracted:
    pages: list[str] = field(default_factory=list)  # text per page (or sheet/section)
    method: str = "none"
    scanned: bool = False  # a PDF with pages but no text layer
    tables: int = 0
    note: str | None = None

    @property
    def text(self) -> str:
        return "\f".join(self.pages)[:MAX_TEXT]


def extract_text(data: bytes, name: str) -> Extracted:
    ext = PurePosixPath(name).suffix.lower().lstrip(".")
    try:
        if ext == "pdf" or data[:5] == b"%PDF-":
            return _pdf(data)
        if ext == "xlsx":
            return _xlsx(data)
        if ext == "docx":
            return _docx(data)
        if ext == "csv":
            return Extracted(["\n".join(data.decode("utf-8", errors="replace").splitlines()[:40])], "csv-header")
        if ext == "zip":
            return _zip(data)
    except Exception as error:  # a damaged file is a result, not a crash
        return Extracted([], "failed", note=f"{type(error).__name__}: {error}"[:200])
    return Extracted([], "none", note=f"no text extractor for .{ext}")


def _pdf(data: bytes) -> Extracted:
    import pymupdf  # PyMuPDF

    with pymupdf.open(stream=data, filetype="pdf") as doc:
        pages = [doc[i].get_text("text") for i in range(min(PAGES_READ, doc.page_count))]
        total = doc.page_count
    out = Extracted(pages, "pymupdf", scanned=total > 0 and sum(len(p.strip()) for p in pages) < 30)
    if not out.scanned:
        try:
            import pdfplumber

            with pdfplumber.open(io.BytesIO(data)) as pdf:
                out.tables = sum(len(pdf.pages[i].find_tables()) for i in range(min(2, len(pdf.pages))))
        except Exception:
            pass
    return out


def _xlsx(data: bytes) -> Extracted:
    from openpyxl import load_workbook

    wb = load_workbook(io.BytesIO(data), read_only=True, data_only=True)
    pages = []
    for ws in wb.worksheets[:5]:
        lines = [f"[sheet] {ws.title}"]
        for row in ws.iter_rows(min_row=1, max_row=15, values_only=True):
            cells = [str(c).strip() for c in row if c not in (None, "")]
            if cells:
                lines.append(" | ".join(cells))
        pages.append("\n".join(lines))
    return Extracted(pages, "openpyxl")


def _docx(data: bytes) -> Extracted:
    from docx import Document

    doc = Document(io.BytesIO(data))
    lines = [p.text.strip() for p in doc.paragraphs[:120] if p.text.strip()]
    for table in doc.tables[:2]:
        for row in table.rows[:3]:
            lines.append(" | ".join(c.text.strip() for c in row.cells))
    return Extracted(["\n".join(lines)], "python-docx", tables=len(doc.tables))


def _zip(data: bytes) -> Extracted:
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        names = [i.filename for i in z.infolist()][:60]
    return Extracted(["\n".join(names)], "zip-members", note=f"{len(names)} members listed")


# ---- facts ------------------------------------------------------------------------------------------------------

MONTHS = {m: i for i, m in enumerate(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"], 1)}
MONTH_RE = "|".join(MONTHS) + "|" + "|".join(m[:3] for m in MONTHS) + "|sept"
DATE_PATTERNS = (
    ("dmy_text", re.compile(rf"\b(\d{{1,2}})(?:st|nd|rd|th)?(?:\s+day)?(?:\s+of)?[\s,]+({MONTH_RE})\.?,?\s+((?:19|20)\d{{2}})\b", re.I)),
    ("mdy_text", re.compile(rf"\b({MONTH_RE})\.?\s+(\d{{1,2}})(?:st|nd|rd|th)?,\s+((?:19|20)\d{{2}})\b", re.I)),
    ("iso", re.compile(r"\b((?:19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b")),
    ("dmy_numeric", re.compile(r"\b(0?[1-9]|[12]\d|3[01])[/.](0?[1-9]|1[0-2])[/.]((?:19|20)\d{2})\b")),  # day first, as written in Kenya
)
AMOUNT = re.compile(r"(?P<cur>KES|KSHS?|Sh(?:s|illings?)?|USD|US\$|\$|EUR|GBP)\.?\s*(?P<num>\d[\d,]*(?:\.\d+)?)(?:\s*(?P<mult>billion|million|thousand|bn|m|b|k)\b)?", re.I)
REFERENCES = (
    ("gazette_notice_no", re.compile(r"Gazette\s+Notice\s+No\.?\s*(\d{1,5})", re.I)),
    ("legal_notice_no", re.compile(r"Legal\s+Notice\s+No\.?\s*(\d{1,4})", re.I)),
    ("gazette_issue", re.compile(r"Vol(?:ume)?\.?\s+([CXVIL]+)\s*[—–-]\s*No\.?\s*(\d+)", re.I)),
    ("act_no", re.compile(r"\bNo\.?\s*(\d{1,3})\s+of\s+((?:19|20)\d{2})\b", re.I)),
    ("bill_year", re.compile(r"\bBill,?\s*(?:\(No\.?\s*(\d+)\)\s*)?(?:of\s+)?((?:19|20)\d{2})\b")),
    ("cap", re.compile(r"\bCap\.?\s*(\d+[A-Z]?)\b")),
    ("tender_no", re.compile(r"\b(?:Tender|RFQ|RFP|EOI)\s*(?:No\.?|Number|Ref\.?)\s*[:\-]?\s*([A-Z0-9][A-Z0-9/\-.]{4,40})", re.I)),
    ("fiscal_year", re.compile(r"\b((?:19|20)\d{2})\s*/\s*((?:20)?\d{2})\b")),
)
MULT = {"billion": Decimal(10) ** 9, "bn": Decimal(10) ** 9, "b": Decimal(10) ** 9, "million": Decimal(10) ** 6, "m": Decimal(10) ** 6, "thousand": Decimal(10) ** 3, "k": Decimal(10) ** 3}
CURRENCY = {"kes": "KES", "ksh": "KES", "kshs": "KES", "sh": "KES", "shs": "KES", "shilling": "KES", "shillings": "KES", "usd": "USD", "us$": "USD", "$": "USD", "eur": "EUR", "gbp": "GBP"}


def _iso(kind: str, g: tuple[str, ...]) -> str | None:
    try:
        if kind == "dmy_text":
            d, m, y = int(g[0]), MONTHS.get(g[1].lower()) or next(v for k, v in MONTHS.items() if k.startswith(g[1].lower()[:3])), int(g[2])
        elif kind == "mdy_text":
            m, d, y = MONTHS.get(g[0].lower()) or next(v for k, v in MONTHS.items() if k.startswith(g[0].lower()[:3])), int(g[1]), int(g[2])
        elif kind == "iso":
            y, m, d = int(g[0]), int(g[1]), int(g[2])
        else:
            d, m, y = int(g[0]), int(g[1]), int(g[2])
        return date(y, m, d).isoformat()
    except (ValueError, StopIteration):
        return None


def extract_facts(pages: list[str]) -> list[dict[str, Any]]:
    """Dates, amounts and reference numbers with spans. `start`/`end` are offsets into the "\\f"-joined text, `page` is 1-based."""
    facts: list[dict[str, Any]] = []
    offset = 0
    for page_no, text in enumerate(pages, 1):
        for kind, pattern in DATE_PATTERNS:
            for m in pattern.finditer(text):
                iso = _iso(kind, m.groups())
                if iso:
                    facts.append({"type": "date", "text": m.group(0), "value": iso, "format": kind, "start": offset + m.start(), "end": offset + m.end(), "page": page_no})
        for m in AMOUNT.finditer(text):
            try:
                value = Decimal(m.group("num").replace(",", ""))
            except InvalidOperation:
                continue
            mult = m.group("mult")
            if mult:
                value *= MULT[mult.lower()]
            facts.append({"type": "amount", "text": m.group(0), "value": str(value), "currency": CURRENCY.get(m.group("cur").lower().rstrip("."), m.group("cur").upper()), "start": offset + m.start(), "end": offset + m.end(), "page": page_no})
        for name, pattern in REFERENCES:
            for m in pattern.finditer(text):
                value = "/".join(g for g in m.groups() if g).rstrip(".-/")
                if name == "fiscal_year":  # 2023/24 or 2023/2024 only: the second year follows the first
                    a, b = int(m.group(1)), int(m.group(2))
                    if (a + 1) % 100 != b % 100:
                        continue
                facts.append({"type": "reference", "reference_kind": name, "text": m.group(0).rstrip(".-/"), "value": value, "start": offset + m.start(), "end": offset + m.start() + len(m.group(0).rstrip(".-/")), "page": page_no})
        offset += len(text) + 1
    facts.sort(key=lambda f: f["start"])
    return facts


# ---- classification ---------------------------------------------------------------------------------------------

@dataclass
class Classification:
    kind: str  # catalogue code or "unclassified"
    score: float
    method: str  # url_pattern | text_pattern | title_fuzzy | none
    version: str = CLASSIFIER_VERSION
    layers: dict[str, dict[str, float]] = field(default_factory=dict)  # layer -> kind -> score
    candidates: list[tuple[str, float]] = field(default_factory=list)
    evidence: dict[str, Any] = field(default_factory=dict)
    facts: list[dict[str, Any]] = field(default_factory=list)

    @property
    def parser(self) -> str | None:
        return BY_CODE[self.kind].parser if self.kind in BY_CODE else None


def _url_scores(names: list[str]) -> tuple[dict[str, float], dict[str, list[str]]]:
    scores: dict[str, float] = {}
    hits: dict[str, list[str]] = {}
    for kind, patterns in _URL.items():
        for p in patterns:
            for name in names:
                if p.search(name):
                    hits.setdefault(kind, []).append(p.pattern)
                    scores[kind] = min(0.8, URL_WEIGHT + 0.1 * (len(hits[kind]) - 1))
                    break
    return scores, hits


def _text_scores(text: str) -> tuple[dict[str, float], dict[str, list[str]]]:
    scores: dict[str, float] = {}
    hits: dict[str, list[str]] = {}
    head = text[:40_000]
    for kind, patterns in _TEXT.items():
        found = [p.pattern for p in patterns if p.search(head)]
        if found:
            hits[kind] = found
            scores[kind] = min(0.95, TEXT_BASE + TEXT_STEP * len(found))
    return scores, hits


def _title_candidates(title: str | None, text: str) -> list[tuple[str, float]]:
    """(candidate, cap): a link title is better evidence than a first line of the body, which the text layer has already seen."""
    lines = [ln.strip() for ln in text[:3000].splitlines() if 8 <= len(ln.strip()) <= 160]
    return ([(title, FUZZY_CAP)] if title else []) + [(ln, LINE_CAP) for ln in lines[:8]]


def _fuzzy_scores(candidates: list[tuple[str, float]]) -> tuple[dict[str, float], dict[str, tuple[str, str, float]]]:
    scores: dict[str, float] = {}
    best: dict[str, tuple[str, str, float]] = {}
    for kind in CATALOGUE:
        for cand, cap in candidates:
            for phrase in kind.titles:
                # partial_ratio finds the phrase inside a longer title; token_sort_ratio tolerates word order but not a mere subset of the words
                ratio = max(fuzz.partial_ratio(phrase.lower(), cand.lower()) if len(phrase) >= 8 and len(cand) >= 0.9 * len(phrase) else 0, fuzz.token_sort_ratio(phrase.lower(), cand.lower())) / 100
                if ratio >= 0.8 and ratio > scores.get(kind.code, 0):
                    scores[kind.code] = round(min(cap, ratio * 0.9), 4)
                    best[kind.code] = (cand[:120], phrase, ratio)
    return scores, best


def classify(data: bytes | None, names: list[str], title: str | None = None, extracted: Extracted | None = None) -> Classification:
    """Classifies one file from its bytes (optional), the file names / URLs it was seen at and its link title."""
    clean = [unquote(urlparse(n).path if "://" in n else n) for n in names if n]
    if extracted is None and data is not None:
        extracted = extract_text(data, next((PurePosixPath(n).name for n in clean if PurePosixPath(n).suffix), clean[0] if clean else ""))
    extracted = extracted or Extracted()
    text = extracted.text
    url_s, url_hits = _url_scores(clean + ([title] if title else []))
    text_s, text_hits = _text_scores(text)
    fuzzy_s, fuzzy_best = _fuzzy_scores(_title_candidates(title, text))
    layers = {"text_pattern": text_s, "url_pattern": url_s, "title_fuzzy": fuzzy_s}
    combined: dict[str, float] = {}
    for kind in BY_CODE:
        miss = 1.0
        for layer in layers.values():
            miss *= 1 - layer.get(kind, 0.0)
        if miss < 1.0:
            combined[kind] = round(min(0.99, 1 - miss), 4)
    ranked = sorted(combined.items(), key=lambda kv: -kv[1])
    evidence = {
        "names": clean[:6], "title": title, "extract": {"method": extracted.method, "chars": len(text), "scanned": extracted.scanned, "tables": extracted.tables, "note": extracted.note},
        "url_hits": url_hits, "text_hits": text_hits, "fuzzy": {k: {"candidate": v[0], "phrase": v[1], "ratio": v[2]} for k, v in fuzzy_best.items()},
    }
    facts = extract_facts(extracted.pages)
    if ranked and ranked[0][1] >= ACCEPT and (len(ranked) == 1 or ranked[0][1] - ranked[1][1] >= MARGIN):
        kind, score = ranked[0]
        method = max(layers, key=lambda name: (layers[name].get(kind, 0.0), -list(layers).index(name)))  # ties go to the earlier layer
        return Classification(kind, score, method, layers=layers, candidates=ranked[:4], evidence=evidence, facts=facts)
    if ranked:
        evidence["why_unclassified"] = "best candidate below the threshold" if ranked[0][1] < ACCEPT else "two kinds are too close to call"
    return Classification("unclassified", ranked[0][1] if ranked else 0.0, "none", layers=layers, candidates=ranked[:4], evidence=evidence, facts=facts)


# ---- persistence, routing and the gap queue ---------------------------------------------------------------------

def _queue_gap(conn: psycopg.Connection, document_id: str, field_name: str) -> bool:
    return conn.execute("""INSERT INTO engine.gaps (target_kind, target_id, field, reason, status, refill_sources) VALUES ('source.documents', %s, %s, 'missing', 'open', '[]')
        ON CONFLICT (target_kind, target_id, field) DO NOTHING""", (document_id, field_name)).rowcount > 0


def classify_document(conn: psycopg.Connection, store, document_id: str, force: bool = False) -> dict[str, Any]:
    """Classifies a registered document with the current classifier version; idempotent per (document, version)."""
    if not force:
        done = conn.execute("SELECT kind, score, method, route_status FROM source.document_classifications WHERE document_id = %s AND classifier_version = %s", (document_id, CLASSIFIER_VERSION)).fetchone()
        if done:
            return {"document_id": document_id, "kind": done["kind"], "score": float(done["score"]), "method": done["method"], "route_status": done["route_status"], "cached": True}
    doc = conn.execute("SELECT title, url, kind_id::text AS kind_id FROM source.documents WHERE id = %s", (document_id,)).fetchone()
    if not doc:
        raise KeyError(document_id)
    capture = conn.execute("SELECT file_version_id::text AS fv FROM source.captures WHERE document_id = %s AND file_version_id IS NOT NULL ORDER BY retrieved_at LIMIT 1", (document_id,)).fetchone()
    urls = [r["url"] for r in conn.execute("SELECT DISTINCT url FROM website.document_sightings WHERE document_id = %s", (document_id,)).fetchall()]
    names = urls or ([doc["url"]] if doc["url"] else [])
    data = store.get(capture["fv"]) if capture else None
    result = classify(data, names, doc["title"])
    parser = result.parser
    if result.kind == "unclassified":
        route = "gapped"
        _queue_gap(conn, document_id, "kind")
    elif parser:
        route = "routed"
    else:
        route = "unrouted"
        _queue_gap(conn, document_id, "parser")
    conn.execute(
        """INSERT INTO source.document_classifications (document_id, kind, score, method, classifier_version, route_status, route_parser, evidence, facts, classified_at, created_at, updated_at, version)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, now(), now(), now(), 1)
           ON CONFLICT (document_id, classifier_version) DO UPDATE SET kind = EXCLUDED.kind, score = EXCLUDED.score, method = EXCLUDED.method, route_status = EXCLUDED.route_status,
             route_parser = EXCLUDED.route_parser, evidence = EXCLUDED.evidence, facts = EXCLUDED.facts, classified_at = now(), updated_at = now()""",
        (document_id, result.kind, result.score, result.method, CLASSIFIER_VERSION, route, parser, json.dumps({"layers": result.layers, "candidates": result.candidates, **result.evidence}), json.dumps(result.facts)),
    )
    source_kind = BY_CODE[result.kind].source_kind if result.kind in BY_CODE else None
    if source_kind:  # refine the crawler's provisional kind; a kind a person or importer chose is left alone
        conn.execute(
            """UPDATE source.documents d SET kind_id = (SELECT id FROM reference.classifications WHERE scheme = 'source/document-kind' AND code = %s), updated_at = now()
                WHERE d.id = %s AND d.kind_id IN (SELECT id FROM reference.classifications WHERE scheme = 'source/document-kind' AND code IN ('source/document-kind/archival_record', 'source/document-kind/dataset'))""",
            (f"source/document-kind/{source_kind}", document_id),
        )
    return {"document_id": document_id, "kind": result.kind, "score": result.score, "method": result.method, "route_status": route, "parser": parser, "facts": len(result.facts), "cached": False}


def classify_pending(conn: psycopg.Connection, store, limit: int | None = None, site_code: str | None = None, log=None, force: bool = False) -> dict[str, Any]:
    """Classifies every crawled document that has no classification for the current version."""
    rows = conn.execute(
        """SELECT DISTINCT d.id::text AS id FROM source.documents d JOIN website.document_sightings s ON s.document_id = d.id
            LEFT JOIN source.document_classifications c ON c.document_id = d.id AND c.classifier_version = %s
            WHERE (c.id IS NULL OR %s) AND (%s::text IS NULL OR s.site_id = (SELECT id FROM website.sites WHERE code = %s)) LIMIT %s""",
        (CLASSIFIER_VERSION, force, site_code, site_code, limit or 1_000_000),
    ).fetchall()
    summary: dict[str, Any] = {"classified": 0, "kinds": {}, "routes": {}}
    for row in rows:
        out = classify_document(conn, store, row["id"], force=force)
        summary["classified"] += 1
        summary["kinds"][out["kind"]] = summary["kinds"].get(out["kind"], 0) + 1
        summary["routes"][out["route_status"]] = summary["routes"].get(out["route_status"], 0) + 1
        conn.commit()
        if log:
            log(f"{out['kind']:20} {out['score']:.2f} {out['method']}")
    return summary


def precision_by_kind(labels: list[dict[str, str]], predictions: dict[str, str]) -> dict[str, dict[str, Any]]:
    """labels: [{id, kind}] (the human/agent-reviewed truth); predictions: id -> kind. Precision and recall per kind."""
    truth = {item["id"]: item["kind"] for item in labels}
    out: dict[str, dict[str, Any]] = {}
    for kind in sorted({*truth.values(), *predictions.values()}):
        predicted = [i for i, k in predictions.items() if k == kind and i in truth]
        right = [i for i in predicted if truth[i] == kind]
        actual = [i for i, k in truth.items() if k == kind]
        out[kind] = {"predicted": len(predicted), "correct": len(right), "labelled": len(actual), "precision": round(len(right) / len(predicted), 3) if predicted else None, "recall": round(len([i for i in actual if predictions.get(i) == kind]) / len(actual), 3) if actual else None}
    return out
