"""Office-holder lists from Wikipedia wikitext (MediaWiki `action=parse`, official API) to one `record` segment per holding.

Only public-office facts the tables publish: who held which seat, the party, the stated years. Nothing is read about private
life. Each profile knows one page layout; a row that cannot be read is skipped and counted, never guessed.

Profiles: `mps-2013`, `mps-2017` (National Assembly member lists), `senate` (elected, nominated women, youth and disability
senators for 2013, 2017 and 2022), `cabinet` (the current cabinet table), `speakers-na`, `list-ag`, `list-cj`, `list-dp`, `supreme-court`.
"""
from __future__ import annotations

import json
import re

from . import Extractor, Output, register

LINK = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]*))?\]\]")
HONORIFIC = re.compile(r"^(?:(?:hon|prof|dr|eng|rt|lady|justice|sir|mr|mrs|ms|amb|gen|maj|col|rev|sen)\.?\s+)+", re.I)


def strip_markup(text: str) -> str:
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"<ref[^>]*?/>", "", text)
    text = re.sub(r"<ref[^>]*>.*?</ref>", "", text, flags=re.S)
    text = re.sub(r"\{\{(?:refn|efn|Efn|sfn)[^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*\}\}", "", text, flags=re.S)
    for _ in range(3):
        text = re.sub(r"\{\{[^{}]*\}\}", "", text, flags=re.S)
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.I)
    text = re.sub(r"</?(small|sup|sub|span|div|center|b|i)[^>]*>", "", text, flags=re.I)
    text = text.replace("'''", "").replace("''", "")
    return text


def cell_parts(raw: str) -> dict:
    """{'text', 'links'} for one cell: attribute prefixes (rowspan="2" |) are dropped, links kept as (target, label)."""
    raw = strip_markup(raw).strip()
    probe = re.sub(r"\[\[.*?\]\]", "", raw)
    if "|" in probe and re.match(r'^[^\[\]]*=[^\[\]]*\|', raw):
        raw = raw.split("|", 1)[1]
    links = [(m.group(1).strip(), (m.group(2) or m.group(1)).strip()) for m in LINK.finditer(raw)]
    text = LINK.sub(lambda m: (m.group(2) or m.group(1)), raw)
    return {"text": re.sub(r"\s+", " ", text).strip(" . "), "links": links}


def tables(wikitext: str) -> list[dict]:
    """Every wikitable as {'heading', 'rows': [[cell, ...]]} in page order; `heading` is the nearest preceding section heading."""
    out, heading, parent = [], "", ""
    position = 0
    pattern = re.compile(r"^(={2,4})\s*(.*?)\s*\1\s*$|^\{\|", re.M)
    for match in pattern.finditer(wikitext):
        if match.group(0).startswith("{|"):
            end = wikitext.find("\n|}", match.start())
            body = wikitext[match.start(): end if end > 0 else len(wikitext)]
            rows = []
            for chunk in re.split(r"\n\|-[^\n]*", body):
                cells: list[dict] = []
                for line in chunk.split("\n"):
                    line = line.strip()
                    if not line or line[0] not in "|!" or line.startswith("|+") or line.startswith("|}"):
                        continue
                    sep = "!!" if line[0] == "!" else "||"
                    parts = line[1:].split(sep) if sep in line else [line[1:]]
                    for part in parts:
                        if line[0] == "!" and "||" in part:
                            for sub in part.split("||"):
                                cells.append(cell_parts(sub))
                        else:
                            cells.append(cell_parts(part))
                if cells:
                    rows.append(cells)
            out.append({"heading": heading, "parent": parent, "rows": rows})
        else:
            heading = strip_markup(match.group(2))
            if len(match.group(1)) == 2:
                parent = heading
    return out


def person(cell: dict) -> dict | None:
    """Display name and Wikipedia article title of the person in a cell (the first link that is not a place or party)."""
    for target, label in cell["links"]:
        if target.lower().startswith(("file:", "image:", "category:")):
            continue
        if re.search(r"constituency|county|district|party|alliance|movement|union|congress|coalition", target, re.I) and not re.search(r"\(.*(politician|judge|lawyer|person)\)", target):
            continue
        title = re.sub(r"\s*\([^)]*\)$", "", target).strip()
        return {"name": title, "wiki": target}
    text = HONORIFIC.sub("", cell["text"])
    text = re.sub(r"\(.*?\)", "", text).strip(" ,.")
    if len(text.split()) >= 2 and not re.search(r"\d", text):
        return {"name": text, "wiki": None}
    return None


def years(text: str) -> tuple[str | None, str | None]:
    match = re.search(r"\(?\s*(\d{4})\s*[–—-]\s*(\d{2,4})?\s*\)?", text)
    if not match:
        return None, None
    start, end = match.group(1), match.group(2)
    if end and len(end) == 2:
        end = start[:2] + end
    return start, end


def party(cell: dict) -> dict:
    target = cell["links"][0][0] if cell["links"] else None
    return {"party": cell["text"] or None, "partyTarget": re.sub(r"\s*\|.*$", "", target).strip() if target else None}


def record(profile: str, index: int, **fields) -> dict:
    body = {"profile": profile, **{k: v for k, v in fields.items() if v is not None}}
    return {"key": f"{profile}-{index}", "kind": "record", "locator": json.dumps({"row": index}), "content": json.dumps(body, sort_keys=True), "confidence": 0.7}


CABINET_OFFICES = [
    ("defence", "defence"), ("interior", "interior"), ("treasury", "treasury"), ("investments", "trade"), ("cooperatives", "cooperatives"),
    ("roads", "roads"), ("information", "ict"), ("energy", "energy"), ("health", "health"), ("education", "education"), ("agriculture", "agriculture"),
    ("lands", "lands"), ("environment", "environment"), ("water", "water"), ("mining", "mining"), ("youth", "sports"), ("tourism", "tourism"),
    ("public service", "public-service"), ("labour", "labour"), ("gender", "gender"), ("east africa", "eac"), ("foreign", "foreign-affairs"),
]


def _members(rows: list[list[dict]], profile: str, seat: str, columns: dict, period: str, start_year: str, end_year: str, **extra) -> tuple[list[dict], int]:
    """Rows to records using fixed column offsets counted from the end of the row (county and number cells vary)."""
    out, skipped, carry = [], 0, None
    carry_county = [None]
    for row in rows:
        if not row or all(not c["text"] and not c["links"] for c in row):
            continue
        if any(c["text"].lower() in ("constituency", "county", "member", "senator", "name", "#") for c in row) and not any(c["links"] for c in row):
            continue
        n = len(row)
        pick = lambda k: row[k] if -n <= k < n else None  # noqa: E731
        who_cell = pick(columns["person"])
        area_cell = pick(columns["area"]) if "area" in columns else None
        party_cell = pick(columns["party"]) if "party" in columns else None
        # a rowspan continuation row (member and party only) inherits the area of the row above
        if "area" in columns and n < columns["min"]:
            area_cell = carry
            who_cell = row[0]
            party_cell = row[1] if n > 1 else None
        who = person(who_cell) if who_cell else None
        if not who:
            skipped += 1
            continue
        if area_cell is not None:
            carry = area_cell
        county = None
        if n >= 5 and row[0]["links"]:
            county = row[0]["links"][0][0]
            carry_county[0] = county
        elif n == 4 and seat == "constituency":
            county = carry_county[0]
        a, b = years(who_cell["text"])
        out.append(dict(profile=profile, seat=seat, period=period, displayName=who["name"], wiki=who["wiki"], area=(area_cell["text"] if area_cell else None), areaTarget=(area_cell["links"][0][0] if area_cell and area_cell["links"] else None), county=(county or (carry_county[0] if seat == "constituency" else None)), validFrom=a or start_year, validTo=b or end_year, **(party(party_cell) if party_cell else {}), **extra))
    return out, skipped


def run_curated(data: bytes) -> Output:
    body = json.loads(data)
    segments = []
    for i, h in enumerate(body["holders"]):
        segments.append({"key": f"curated-{i}", "kind": "record", "locator": json.dumps({"row": i}), "content": json.dumps({**h, "wiki": None}, sort_keys=True), "confidence": 0.5})
    return Output("succeeded", segments, [{"level": "info", "code": "rows_read", "message": f"{len(segments)} curated holdings"}])


def run(data: bytes, profile: str | None) -> Output:
    if profile == "curated":
        return run_curated(data)
    try:
        page = json.loads(data)["parse"]
        wikitext = page["wikitext"]["*"]
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_wikitext", "message": str(error)[:200]}])
    revid = page.get("revid")
    records: list[dict] = []
    skipped = 0
    tabs = tables(wikitext)

    if profile in ("mps-2013", "mps-2017"):
        period, s, e = ("2013-2017", "2013", "2017") if profile == "mps-2013" else ("2017-2022", "2017", "2022")
        for t in tabs:
            h = t["heading"].lower()
            if "constituen" in h:
                r, k = _members(t["rows"], profile, "constituency", {"area": -3, "person": -2, "party": -1, "min": 3}, period, s, e)
            elif "women" in h or "woman" in h:
                r, k = _members(t["rows"], profile, "woman", {"area": -3, "person": -2, "party": -1, "min": 3}, period, s, e)
            elif "nominated" in h:
                r, k = _members(t["rows"], profile, "nominated", {"person": -2, "party": -1}, period, s, e)
            else:
                continue
            records += r
            skipped += k
    elif profile == "senate":
        for t in tabs:
            h = (t["parent"] + " " + t["heading"]).lower()
            if not t["rows"]:
                continue
            period = None
            for key in ("2022", "2017", "2013"):
                if key in h:
                    period = {"2022": ("2022-2027", "2022", None), "2017": ("2017-2022", "2017", "2022"), "2013": ("2013-2017", "2013", "2017")}[key]
            if "elected senators" in h:
                pass
            head = " ".join(c["text"].lower() for c in t["rows"][0])
            if "county" in head and "senator" in head and period:
                r, k = _members(t["rows"], "senate", "county-senator", {"area": -4, "person": -3, "party": -2, "min": 5}, *period)
                for rec in r:
                    rec["profile"] = "senate"
                records += r
                skipped += k
        # nominated senators sit under "Women senators", youth and disability headings
        for t in tabs:
            h = (t["parent"] + " " + t["heading"]).lower()
            head = " ".join(c["text"].lower() for c in t["rows"][0]) if t["rows"] else ""
            if not (("women" in h or "youth" in h or "disabilit" in h) and "senat" in h) or "summary" in h:
                continue
            kind = "nominated-senator-youth" if "youth" in h else "nominated-senator-pwd" if "disabilit" in h else "nominated-senator-women"
            if "2013" in h or kind != "nominated-senator-women":
                period = ("2013-2017", "2013", "2017")  # these tables list the first modern Senate (TNA and ODM nominees)
            else:
                continue  # the 2022 women table has no year in its heading: read below from its bold caption
            r, k = _members(t["rows"], "senate", kind, {"person": -2, "party": -1}, *period)
            records += r
            skipped += k
        # the 2022 women table sits under a bold line, not a heading
        text = wikitext
        i = text.find("Women Nominated to the senate 2022-2027")
        if i >= 0:
            sub = tables("\n==Women nominated 2022 senators==\n" + text[i: i + 4000])
            if sub:
                r, k = _members(sub[0]["rows"], "senate", "nominated-senator-women", {"person": -2, "party": -1}, "2022-2027", "2022", None)
                records += [x for x in r if x["period"] == "2022-2027"]
    elif profile == "cabinet":
        rows = []
        for t in tabs:
            if t["rows"] and any("cabinet secretary" in c["text"].lower() for c in t["rows"][0]) or (t["rows"] and "office" in t["rows"][0][0]["text"].lower()):
                rows = t["rows"][1:]
                break
        last = None
        for index, row in enumerate(rows):
            office = row[0]["text"].lower()
            who = person(row[1]) if len(row) > 1 else None
            if who is None and len(row) == 1 and last:
                who = last  # rowspan: the same person holds this docket as well
            if who is None:
                skipped += 1
                continue
            last = who
            if office.startswith("president"):
                code, seat = "ke/presidency/president", "president"
            elif office.startswith("deputy president"):
                code, seat = "ke/presidency/deputy-president", "deputy-president"
            elif office.startswith("attorney"):
                code, seat = "ke/office-of-the-attorney-general/attorney-general", "attorney-general"
            elif office.startswith("secretary to the cabinet") or office.startswith("prime"):
                skipped += 1
                continue
            else:
                slug = next((s for k, s in CABINET_OFFICES if k in office), None)
                if not slug:
                    skipped += 1
                    continue
                code, seat = f"ke/ministry/{slug}/cabinet-secretary", "cabinet-secretary"
            records.append(dict(profile="cabinet", seat=seat, officeCode=code, officeLabel=row[0]["text"], displayName=who["name"], wiki=who["wiki"], period="current", validFrom=None, validTo=None))
    elif profile == "list-ag":
        i = wikitext.find("Attorneys General of Kenya (since 1963)")
        for m in re.finditer(r"^\*\s*\[\[([^\]|]+)(?:\|([^\]]*))?\]\]\s*\((\d{4})\s*[–-]\s*(\d{4})?\)", wikitext[i:], re.M):
            records.append(dict(profile="list-ag", seat="attorney-general", officeCode="ke/office-of-the-attorney-general/attorney-general", displayName=re.sub(r"\s*\([^)]*\)$", "", m.group(1)), wiki=m.group(1), validFrom=m.group(3), validTo=m.group(4), period="historic"))
    elif profile == "supreme-court":
        for section, current in (("===Current justices===", True), ("===Former justices===", False)):
            i = wikitext.find(section)
            j = wikitext.find("\n==", i + 5)
            for line in wikitext[i:j].split("\n"):
                m = LINK.search(line)
                if not line.startswith("*") or not m:
                    continue
                name = re.sub(r"\s*\([^)]*\)$", "", m.group(1))
                label = (m.group(2) or m.group(1)).strip()
                text = strip_markup(line)
                if "Deputy Chief Justice" in text and current:
                    code, seat = "ke/judiciary/supreme-court/deputy-chief-justice", "deputy-chief-justice"
                elif "Chief Justice" in text and current and "Retired" not in text:
                    code, seat = "ke/judiciary/chief-justice", "chief-justice"
                elif "Retired Chief Justice" in text:
                    code, seat = "ke/judiciary/chief-justice", "chief-justice"
                elif "Deputy Chief Justice" in text:
                    code, seat = "ke/judiciary/supreme-court/deputy-chief-justice", "deputy-chief-justice"
                else:
                    code, seat = "ke/judiciary/supreme-court/judge", "supreme-court-judge"
                span = re.search(r"from (\d{4}) until his death in (\d{4})", text)
                records.append(dict(profile="supreme-court", seat=seat, officeCode=code, displayName=name if len(name.split()) > 1 else label, wiki=m.group(1), period="current" if current else "former", validFrom=span.group(1) if span else None, validTo=span.group(2) if span else None, note=re.sub(r"\s+", " ", text)[:200]))
        # people listed twice (as Chief Justice and as a justice) keep both holdings
    elif profile in ("list-cj", "list-dp", "speakers-na"):
        for t in tabs:
            if profile == "list-dp" and "vice" in t["heading"].lower():
                continue
            for index, row in enumerate(t["rows"]):
                who, who_i = None, None
                for i, c in enumerate(row):
                    who = person(c)
                    if who:
                        who_i = i
                        break
                if not who:
                    continue
                rest = " ".join(c["text"] for c in row[who_i + 1:])
                found = re.findall(r"\b(1[89]\d\d|20\d\d)\b", rest)
                if not found:
                    continue
                first = found[0]
                last = found[1] if len(found) > 1 and not re.search(r"present|incumbent", rest, re.I) else None
                if profile == "list-dp":
                    code, seat = "ke/presidency/deputy-president", "deputy-president"
                elif profile == "list-cj":
                    code, seat = "ke/judiciary/chief-justice", "chief-justice"
                else:
                    code, seat = "ke/national-assembly/speaker", "speaker-na"
                if int(first) < (2010 if profile != "speakers-na" else 2008):
                    continue
                extra = party(row[-1]) if profile == "speakers-na" and len(row) > 2 else {}
                records.append(dict(profile=profile, seat=seat, officeCode=code, displayName=who["name"], wiki=who["wiki"], validFrom=first, validTo=last if last != first else None, period="historic", **extra))
    else:
        return Output("failed", diagnostics=[{"level": "error", "code": "unknown_profile", "message": f"profile {profile!r}"}])

    segments = [record(profile or "x", i, **{k: v for k, v in rec.items() if k != "profile"}) for i, rec in enumerate(records)]
    for s in segments:
        body = json.loads(s["content"])
        body["revision"] = revid
        s["content"] = json.dumps(body, sort_keys=True)
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_rows", "message": f"no holders recognised for profile {profile}"}])
    return Output("succeeded", segments, [{"level": "info", "code": "rows_read", "message": f"{len(segments)} holdings read, {skipped} rows skipped (revision {revid})"}])


EXTRACTOR = register(Extractor("wikipedia-office-holders", "0.1.0", run))
