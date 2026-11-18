"""Reads the NG-CDF project-proposal PDFs scraped under `.dev/websites/ke/go/ngcdf/` into allocation rows.

Each PDF is one constituency's proposal for one financial year: numbered lines of project name, activities, amount and
status. Every line is classified (salary and running costs, committee, bursary, emergency, capacity building or a
project) from its wording, so the system can tell staff costs from infrastructure. Nothing here is invented: the
amounts, names and statuses are the published figures.
"""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from dev_seed.common import ROOT

NGCDF = ROOT / ".dev/websites/ke/go/ngcdf"
LINE = re.compile(r"^\s*(\d{1,3})\s+(.*?)\s{2,}(.*?)\s{2,}([\d,]+\.\d{2})\s+(\S.*)?$")
SHORT = re.compile(r"^\s*(\d{1,3})\s+(.*?)\s{2,}([\d,]+\.\d{2})\s+(\S.*)?$")
HEADER = re.compile(r"CODE:\s*(\d+)\s+CONSTITUENCY:\s*([A-Z .'-]+?)\s+FINANCIAL YEAR:\s*(\d{4})\s*-\s*(\d{4})")
STATUSES = {
    "new": "new",
    "on-going": "ongoing",
    "ongoing": "ongoing",
    "completed": "completed",
    "complete": "completed",
}

# Wording that marks a non-project line of the fund's own budget; everything else is a project.
CATEGORIES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("salaries", ("salar", "gratuity", "nhif", "nssf", "staff")),
    ("committee", ("committee",)),
    ("bursary", ("bursary", "bursaries")),
    ("emergency", ("emergency",)),
    ("capacity-building", ("capacity", "training")),
    (
        "running-costs",
        ("goods and services", "office", "monitoring", "evaluation", "sports", "environment", "security"),
    ),
)


@dataclass(frozen=True)
class Allocation:
    constituency: str
    fund_code: str
    year_from: int
    year_to: int
    line: int
    name: str
    activities: str
    amount_minor_units: int
    status: str
    category: str
    source_pdf: str


def classify(name: str, activities: str) -> str:
    text = f"{name} {activities}".lower()
    for category, words in CATEGORIES:
        if any(w in name.lower() for w in words):
            return category
    if any(w in text for w in ("classroom", "school", "ablution", "dormitor", "laborator", "library", "hall")):
        return "education-infrastructure"
    if any(w in text for w in ("road", "bridge", "culvert", "drain", "footbridge", "lighting", "bus stage")):
        return "roads-and-drainage"
    if any(w in text for w in ("health", "clinic", "dispensary", "hospital", "ambulance")):
        return "health-infrastructure"
    if any(w in text for w in ("police", "chief", "dco", "administration", "office block")):
        return "security-and-administration"
    return "other-projects"


def _text(pdf: Path) -> str:
    done = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True, check=False)
    return done.stdout


def parse_pdf(pdf: Path) -> list[Allocation]:
    rows: list[Allocation] = []
    header: tuple[str, int, int] | None = None
    last: dict[str, str] | None = None
    for raw in _text(pdf).splitlines():
        found = HEADER.search(raw)
        if found:
            header = (found.group(1), int(found.group(3)), int(found.group(4)))
            constituency = found.group(2).strip().title()
            continue
        if header is None:
            continue
        match, short = LINE.match(raw), None
        if match is None:
            short = SHORT.match(raw)
        if match or short:
            number, name = (match or short).group(1), (match or short).group(2).strip()  # type: ignore[union-attr]
            activities = match.group(3).strip() if match else ""
            amount = (match or short).group(4 if match else 3)  # type: ignore[union-attr]
            status_text = ((match or short).group(5 if match else 4) or "").strip().lower()  # type: ignore[union-attr]
            status = STATUSES.get(status_text.split()[0], "new") if status_text else "new"
            last = {"name": name, "activities": activities}
            rows.append(
                Allocation(
                    constituency,
                    header[0],
                    header[1],
                    header[2],
                    int(number),
                    name,
                    activities,
                    round(float(amount.replace(",", "")) * 100),
                    status,
                    "",
                    pdf.name,
                )
            )
        elif (
            last is not None
            and raw.strip()
            and not raw.strip().startswith(("Page ", "NATIONAL", "PROJECT", "S. NO", "CODE"))
        ) and len(raw) - len(raw.lstrip()) > 4:  # a wrapped continuation of the previous line's text
            last["activities"] += " " + raw.strip()
            prior = rows[-1]
            rows[-1] = Allocation(**{**prior.__dict__, "activities": last["activities"].strip()})
    return [Allocation(**{**r.__dict__, "category": classify(r.name, r.activities)}) for r in rows]


def read_allocations() -> list[Allocation]:
    seen: dict[tuple[str, int, int], list[Allocation]] = {}
    for pdf in sorted(NGCDF.glob("*/scraped/files/pdf/*.pdf")):
        parsed = parse_pdf(pdf)
        if not parsed:
            continue
        key = (parsed[0].constituency, parsed[0].year_from, parsed[0].year_to)
        if len(parsed) > len(seen.get(key, [])):  # the same proposal is often linked twice; keep the fuller read
            seen[key] = parsed
    return [row for rows in seen.values() for row in rows]


if __name__ == "__main__":
    rows = read_allocations()
    by: dict[tuple[str, int], list[Allocation]] = {}
    for r in rows:
        by.setdefault((r.constituency, r.year_from), []).append(r)
    for (c, y), items in sorted(by.items()):
        total = sum(i.amount_minor_units for i in items) / 100
        print(f"{c:12} {y}-{y + 1}  lines={len(items):3}  total={total:>16,.2f}")
    cats: dict[str, int] = {}
    for r in rows:
        cats[r.category] = cats.get(r.category, 0) + r.amount_minor_units
    print({k: round(v / 100) for k, v in cats.items()})
