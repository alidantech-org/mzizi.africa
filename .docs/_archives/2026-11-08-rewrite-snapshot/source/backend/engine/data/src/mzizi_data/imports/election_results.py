"""Election candidates and results for Kenya from the IEBC's published election books (2013 and 2017) and Wikipedia (2022 presidential).

Sources, all preserved before reading and attributed in the staged rows:
  * "4th March 2013 General Election Data" (IEBC): presidential results by constituency, then member of the National Assembly,
    woman representative, senator and governor results (`pdftotext -layout`).
  * "2017 General Election Report" (IEBC): presidential results by county (8 August and the 26 October fresh election), then member of the
    National Assembly, woman representative, senator and governor results.
Public-office facts only: name, party, seat and votes. The books also hold no ID numbers or ethnicity for candidates; nothing of the kind is read.

Rules: a candidate is linked to an existing person only when the name agrees (token-set score) AND the seat is the same
office and place, or the same county and the same party; a name alone never links. Everything else becomes a new person with a
code that includes the seat. A party is linked by abbreviation or name score; a party the register does not hold is created as an
`inactive` party from the book so the candidacy keeps its party. Winners are the highest valid vote in a seat (computed, noted in each
run's rationale); petitions and annulments are carried by the result status, never by editing votes.
"""
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass, field

NUMTOK = re.compile(r"^\d{1,3}(?:,\d{3})*$|^\d+$")


def read_text(pdf_path: str) -> list[str]:
    done = subprocess.run(["pdftotext", "-layout", pdf_path, "-"], capture_output=True)
    if done.returncode != 0:
        raise RuntimeError(f"pdftotext failed: {done.stderr.decode()[:200]}")
    return done.stdout.decode("utf-8", "replace").split("\n")


def n(token: str) -> int:
    return int(token.replace(",", ""))


def clean_name(text: str) -> str:
    """OCR in the books turns a letter I into the digit 1 inside names (MUHS1N); no other repair is attempted."""
    t = re.sub(r"(?<=[A-Z])1(?=[A-Z])|(?<=[A-Z])1\b", "I", text.strip())
    return re.sub(r"\s+", " ", t.replace(" .", ".")).strip(" .")


def title(text: str) -> str:
    out = []
    for w in text.lower().split(" "):
        out.append("-".join(p[:1].upper() + p[1:] if p else p for p in w.split("-")))
    s = " ".join(out)
    return re.sub(r"\b(Mc)([a-z])", lambda m: m.group(1) + m.group(2).upper(), re.sub(r"(?<=')([a-z])", lambda m: m.group(1), s))


@dataclass
class Rec:
    contest: str  # president | governor | senator | woman_rep | mp
    county: str | None
    county_code: str | None
    constituency: str | None
    constituency_code: str | None
    name: str  # display name, given names first
    surname: str
    others: str
    party_code: str | None
    party_abbr: str | None
    party_name: str | None
    votes: int
    page: int | None = None
    running_mate: str | None = None


# ----------------------------------------------------------------------------------------------------------- 2017 report

PARTY_CODE = re.compile(r"^(IND|\d{1,3})$")


def section(lines: list[str], head: str, nxt: str | None) -> list[str]:
    start = [i for i, l in enumerate(lines) if l.strip().startswith(head) and "...." not in l][-1]
    end = next((i for i in range(start + 1, len(lines)) if nxt and lines[i].strip().startswith(nxt) and "...." not in lines[i]), len(lines))
    return lines[start:end]


def parse_2017_mp(block: list[str]) -> list[Rec]:
    out, names, page = [], {}, None
    for ln in block:
        pg = re.match(r"\s*Page (\d+) of", ln)
        if pg:
            page = int(pg.group(1))
        t = re.split(r"\s{2,}", ln.strip())
        if len(t) >= 6 and re.fullmatch(r"\d{1,2}", t[0]) and re.fullmatch(r"\d{1,3}", t[1]):
            t = [t[0], ""] + t[1:]  # the county name is blank on some rows; the codes identify the county
        if len(t) < 7 or not (re.fullmatch(r"\d{1,2}", t[0]) and re.fullmatch(r"\d{1,3}", t[2]) and NUMTOK.match(t[-1])):
            continue
        r = t[3:-1]
        k = next((i for i in range(2, len(r)) if PARTY_CODE.match(r[i])), None)
        if k is None:
            continue
        cname, surname, others = (r[0], r[1], r[2]) if k == 3 else (None, r[0], r[1]) if k == 2 else (None, r[0], "")
        if cname:
            names[(t[0], t[2])] = clean_name(cname)
        abbr = r[k + 2] if len(r) > k + 2 else (r[k + 1] if len(r) == k + 2 and r[k + 1].isupper() and len(r[k + 1]) <= 12 else None)
        pname = r[k + 1] if len(r) > k + 2 else None
        out.append(Rec("mp", clean_name(t[1]) or None, t[0], cname and clean_name(cname), t[2], title(clean_name(f"{others} {surname}")), clean_name(surname), clean_name(others), r[k], abbr, pname, n(t[-1]), page))
    for rec in out:
        rec.constituency = rec.constituency or names.get((rec.county_code, rec.constituency_code))
    return out


def parse_2017_county_contest(block: list[str], contest: str) -> list[Rec]:
    """Woman representative, senator and governor tables: one row per candidate, the county code and name in the row. A continuation line carries a wrapped name."""
    out, page = [], None
    for i, ln in enumerate(block):
        pg = re.match(r"\s*Page (\d+) of", ln)
        if pg:
            page = int(pg.group(1))
        t = re.split(r"\s{2,}", ln.strip())
        if len(t) < 8 or not (re.fullmatch(r"\d{1,4}", t[0]) and NUMTOK.match(t[-1])):
            continue
        r = t[1:-1]
        c = next((j for j in range(len(r)) if re.fullmatch(r"\d{3}", r[j]) and j + 2 < len(r) and PARTY_CODE.match(r[j + 2]) is not None), None)
        if c is None:
            continue
        head, county_code, county, pcode = r[:c], r[c], r[c + 1], r[c + 2]
        rest = r[c + 3 :]
        if len(head) < 2:
            continue
        surname, others = head[0], head[1]
        running = " ".join(head[2:]) if contest == "governor" and len(head) > 2 else None
        # the wrapped part of the other names sits on the next line, under the other-names column
        col = ln.find(others)
        nxt = block[i + 1] if i + 1 < len(block) else ""
        cont = re.split(r"\s{2,}", nxt.strip())
        if nxt.strip() and len(cont) <= 2 and not any(re.search(r"\d", x) for x in cont) and nxt.find(cont[0]) == col and col > 0:
            others = f"{others} {cont[0]}"
        abbr = rest[-1] if rest else None
        pname = " ".join(rest[:-1]) if len(rest) > 1 else None
        out.append(Rec(contest, clean_name(county), county_code, None, None, title(clean_name(f"{others} {surname}")), clean_name(surname), clean_name(others), pcode, abbr, pname, n(t[-1]), page, running))
    return out


AUG_PRES = re.compile(r"^\s*(\d{1,2})\s+([A-Z][A-Z' /\-\.]*?(?:\s[A-Z]{1,2}){0,3}?)\s+((?:[\d,]+\s+){9,10}[\d,\-]+)\s*$")


def parse_2017_pres_aug(block: list[str]) -> list[dict]:
    rows = []
    for ln in block:
        m = re.match(r"^\s*(\d{1,2})\s+([A-Z][A-Za-z' /\-\.]+?)\s{2,}([\d,]+(?:\s+[\d,\-]+|\s+no){9,10})\s*$", ln)
        if m and int(m.group(1)) <= 48:
            nums = [x for x in re.split(r"\s+", m.group(3).strip())]
            rows.append({"no": int(m.group(1)), "county": m.group(2).strip(), "cells": nums})
    return rows


def parse_2017_pres_fresh(block: list[str]) -> list[dict]:
    rows = []
    for ln in block:
        m = re.match(r"^\s*([A-Z][A-Z' /\-\.]+?) COUNTY TOTAL\s+((?:[\d,]+\s+){10}[\d,]+)\s*$", ln.rstrip())
        if m:
            rows.append({"county": m.group(1).strip(), "cells": m.group(2).split()})
        nat = re.match(r"^\s*NATIONAL TOTAL\s+((?:[\d,]+\s+){10}[\d,]+)\s*$", ln.rstrip())
        if nat:
            rows.append({"county": "NATIONAL", "cells": nat.group(1).split()})
    return rows


# ----------------------------------------------------------------------------------------------------------- 2013 book

C13_CTX = re.compile(r"^\s*(\d{2})\s+([A-Z][A-Z' \-\.]+?)\s{2,}(\d{3})\s+([A-Z][A-Z' \-\.\(\)/]+?)\s*$")
C13_MP = re.compile(r"^\s{20,}(\d{3})\s+(.+?)\s{2,}(.+?)\s{2,}([\d,]+)\s*$")
C13_CNT = re.compile(r"^\s*(\d{3})\s+([A-Z][A-Z' \-\.]+?)\s+(\d{1,3})\s+(.+?)\s{2,}(.+?)\s{2,}([\d,]+)\s*$")
C13_TOTAL = re.compile(r"^\s*(?:TOTAL VALID VOTES|VOTES)\s+([\d,]+)\s*$")
C13_BARE = re.compile(r"^\s{30,}(\d{1,3}(?:,\d{3})+|\d{4,})\s*$")


def _glue(prefix: list[tuple[int, str]], col_name: int, col_party: int, row_name: str, row_party: str) -> tuple[str, str]:
    """Wrapped text sits on the lines above a row: text starting at the party column belongs to the party, the rest to the name."""
    name_p = [t for c, t in prefix if c < col_party - 2]
    party_p = [t for c, t in prefix if c >= col_party - 2]
    return " ".join(name_p + [row_name]).strip(), " ".join(party_p + [row_party]).strip()


def parse_2013(block: list[str], contest: str) -> tuple[list[Rec], dict]:
    """Candidate rows of a 2013 results section and the published total valid votes per seat (key: constituency code or county code)."""
    recs, totals, pending, ctx, page = [], {}, [], {}, None
    last_key = None
    for ln in block:
        s = ln.rstrip()
        if not s.strip():
            continue
        t = C13_TOTAL.match(s) or C13_BARE.match(s)
        if t and last_key:
            totals[last_key] = n(t.group(len(t.groups())))
            pending = []
            continue
        if re.match(r"^\s*\d{1,3}\s*$", s) or re.match(r"^\s*TOTAL VALID\s*$", s):
            if not re.match(r"^\s*TOTAL VALID", s):
                page = int(s.strip())
            pending = []
            continue
        if contest == "mp":
            c = C13_CTX.match(s)
            if c:
                ctx = {"county_code": c.group(1), "county": c.group(2).strip(), "constituency_code": c.group(3), "constituency": c.group(4).strip()}
                last_key = ctx["constituency_code"]
                continue
            m = C13_MP.match(s)
            if m:
                name, party = m.group(2).strip(), m.group(3).strip()
                cn, cp = s.find(name), s.rfind(party)
                name, party = _glue(pending, cn, cp, name, party)
                recs.append(Rec("mp", title(ctx["county"]), ctx["county_code"], title(ctx["constituency"]), ctx["constituency_code"], title(clean_name(name)), "", clean_name(name), None, None, clean_name(party), n(m.group(4)), page))
                pending = []
                continue
        else:
            m = C13_CNT.match(s)
            if m:
                name, party = m.group(4).strip(), m.group(5).strip()
                cn, cp = s.find(name), s.rfind(party)
                name, party = _glue(pending, cn, cp, name, party)
                last_key = m.group(1)
                recs.append(Rec(contest, title(m.group(2).strip()), m.group(1), None, None, title(clean_name(name)), "", clean_name(name), None, None, clean_name(party), n(m.group(6)), page))
                pending = []
                continue
        if re.search(r"\d", s):
            continue
        pending.append((len(s) - len(s.lstrip()), s.strip()))
        pending = pending[-3:]
    return recs, totals


def check_totals(recs: list[Rec], totals: dict, by: str) -> tuple[list[str], list[str]]:
    """Sums per seat against the published total valid votes; returns (passed, failed) messages."""
    sums: dict[str, int] = {}
    for r in recs:
        k = (r.constituency_code if by == "constituency" else r.county_code) or ""
        sums[k] = sums.get(k, 0) + r.votes
    passed, failed = [], []
    for k, v in sums.items():
        if k in totals:
            (passed if totals[k] == v else failed).append(f"{by} {k}: candidates add to {v:,}, published {totals[k]:,}")
        else:
            failed.append(f"{by} {k}: no published total to check against")
    return passed, failed


# ----------------------------------------------------------------------------------------------------------- 2013 MP (word positions)

WORD = re.compile(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>')


def read_words(pdf_path: str, first: int, last: int) -> list[list[tuple[float, float, float, float, str]]]:
    """Words with positions per page (`pdftotext -bbox`). The MP table's cells are vertically bottom aligned and wrapped, so a text layout loses rows."""
    done = subprocess.run(["pdftotext", "-f", str(first), "-l", str(last), "-bbox", pdf_path, "-"], capture_output=True)
    if done.returncode != 0:
        raise RuntimeError(f"pdftotext failed: {done.stderr.decode()[:200]}")
    text = done.stdout.decode("utf-8", "replace")
    pages = []
    for pg in text.split("<page ")[1:]:
        import html

        pages.append([(float(a), float(b), float(c), float(d), html.unescape(w)) for a, b, c, d, w in WORD.findall(pg)])
    return pages


def parse_2013_mp_words(pages: list[list[tuple[float, float, float, float, str]]], first_page: int, const_names: dict[int, str]) -> tuple[list[Rec], list[str], dict]:
    """Candidate rows, problems, and the published total valid votes per constituency code (a total row follows the last candidate of its seat)."""
    recs, problems, totals = [], [], {}
    last_const = last_county = None
    for pi, words in enumerate(pages):
        votes = sorted([w for w in words if re.fullmatch(r"\d{1,3}(?:,\d{3})+|\d{1,6}", w[4]) and w[2] > 700 and w[0] > 690], key=lambda w: w[3])
        nums = sorted([w for w in words if re.fullmatch(r"\d{3}", w[4]) and 340 <= w[0] <= 385], key=lambda w: w[1])
        if not votes:
            continue
        textw = [w for w in words if w[0] >= 380 and w[2] <= 700]
        if not textw:
            continue
        starts = {}
        for w in textw:
            if w[0] > 480:
                starts[round(w[0])] = starts.get(round(w[0]), 0) + 1
        party_x = max(starts, key=starts.get) if starts else 520
        rows = []
        for v in votes:
            name = [w for w in textw if w[0] < party_x - 3]
            rows.append({"y": v[3], "vote": v, "name": [], "party": []})
        for w in textw:
            tgt = next((r for r in rows if r["y"] >= w[3] - 1.5), None)
            if tgt is not None:
                (tgt["name"] if w[0] < party_x - 3 else tgt["party"]).append(w)
        for r in rows:  # top to bottom: a row with a name is a candidate; a nameless row beside the word TOTAL closes the seat
            vy = r["vote"][1]
            label = " ".join(w[4] for w in sorted(r["name"], key=lambda w: (round(w[1] / 4), w[0]))).upper()
            if not r["name"] or label.startswith("TOTAL VALID") or label == "VOTES":
                if last_const and (label.startswith("TOTAL VALID") or label == "VOTES" or any(w[4] == "TOTAL" and 240 <= w[0] <= 340 and abs(w[1] - vy) <= 16 for w in words)):
                    totals[last_const] = n(r["vote"][4])
                continue
            cands = [w for w in words if re.fullmatch(r"\d{3}", w[4]) and 190 <= w[0] <= 245]
            cc = min(cands, key=lambda w: abs(w[1] - vy), default=None)
            cty = [w for w in words if re.fullmatch(r"\d{1,3}", w[4]) and 70 <= w[0] <= 100]
            cy = min(cty, key=lambda w: abs(w[1] - vy), default=None)
            if cc and cy and abs(cc[1] - vy) <= 30:
                code, county_code = cc[4], cy[4]
            elif last_const and r["y"] < 120:
                code, county_code = last_const, last_county  # a row carried over from the previous page
            else:
                problems.append(f"page {first_page + pi}: no constituency near the row ending {r['vote'][4]}")
                continue
            last_const, last_county = code, county_code
            order = lambda ws: " ".join(w[4] for w in sorted(ws, key=lambda w: (round(w[1] / 4), w[0])))  # noqa: E731
            name, party = clean_name(order(r["name"])), clean_name(order(r["party"]))
            recs.append(Rec("mp", None, county_code, const_names.get(int(code)), code, title(name), "", name, None, None, party, n(r["vote"][4]), first_page + pi))
    return recs, problems, totals


# ----------------------------------------------------------------------------------------------------------- presidential tables

P13 = re.compile(r"^\s*(\d{3})\s+([A-Z][A-Z' \-\.\(\)/]+?)\s+((?:[\d,]+\s+){12}\d+(?:\.\d+)?%)\s*$")
P13_COUNTY = re.compile(r"^\s*([A-Z][A-Z' \-\.]+?)(?: COUNTY)?\s*-\s*CODE (\d{3})\s*$")
P13_TOTAL = re.compile(r"^\s*COUNTY TOTAL\s+((?:[\d,]+\s+){12}\d+(?:\.\d+)?%)\s*$")
PRES13 = ["Mohamed Abduba Dida", "Martha Wangari Karua", "Peter Kenneth", "Uhuru Kenyatta", "James Legilisho Kiyiapi", "Musalia Mudavadi", "Paul Kibugi Muite", "Raila Odinga"]
PRES17 = ["John Ekuru Aukot", "Mohamed Abduba Dida", "Shakhalaga Khwa Jirongo", "Japheth Kavinga Kaluyu", "Uhuru Kenyatta", "Michael Wainaina Mwaura", "Joseph William Nthiga Nyagah", "Raila Odinga"]


def parse_2013_president(block: list[str]) -> dict:
    """Constituency rows (8 candidates, valid, rejected, cast, registered, turnout) grouped under their county, and the county totals."""
    out = {"constituencies": [], "counties": []}
    county = None
    for ln in block:
        c = P13_COUNTY.match(ln)
        if c:
            county = (c.group(2), c.group(1).strip())
            continue
        t = P13_TOTAL.match(ln.rstrip())
        if t and county:
            out["counties"].append({"county_code": county[0], "county": county[1], "cells": [x.rstrip("%") for x in t.group(1).split()]})
            continue
        m = P13.match(ln.rstrip())
        if m and county:
            out["constituencies"].append({"county_code": county[0], "county": county[1], "code": m.group(1), "name": m.group(2).strip(), "cells": [x.rstrip("%") for x in m.group(3).split()]})
    return out


def nums(cells: list[str]) -> list[int]:
    return [n(c) for c in cells[:12]]
