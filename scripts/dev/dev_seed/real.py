"""Real published figures read from `.dev/`: the county table (area, 2009 and 2019 census, 2022 registered voters), the
Political Parties Fund allocation by party and the national key indicators of the KNBS Facts and Figures."""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass

from dev_seed.common import ROOT, slug

WIKI = ROOT / ".dev/datasets/wikipedia/counties-of-kenya.wikitext"
ORPP = ROOT / ".dev/websites/ke/or/orpp/_root/scraped/files/pdf"
KNBS = ROOT / ".dev/websites/ke/or/knbs/www/scraped/files/pdf"


@dataclass(frozen=True)
class CountyFigures:
    name: str
    area_km2: float
    population_2009: int
    population_2019: int
    registered_voters_2022: int


def _number(text: str) -> float:
    return float(text.replace(",", ""))


def read_county_figures() -> dict[str, CountyFigures]:
    """Keyed by the county slug (`mombasa`, `tana-river`)."""
    found: dict[str, CountyFigures] = {}
    lines = WIKI.read_text(encoding="utf-8").splitlines()
    for index, line in enumerate(lines):
        if (
            not line.rstrip().endswith(("|| ", "||"))
            and re.match(r"\|\s*\d{1,3}\s*\|\|", line)
            and not re.search(r"\|\|\s*[\d,]+\s*$", line)
        ):
            line = (
                f"{line} || {lines[index + 1].lstrip('|').split('||')[0].strip()}"  # a row wrapped onto the next line
            )
        if not re.match(r"\|\s*\d{1,3}\s*\|\|", line):
            continue
        link = re.search(r"\[\[(?:[^\]|]*\|)?([^\]]+?)\]\](?! County)", line.split("||")[1])
        name_match = re.search(r"\[\[([^\]|]+?)(?: County)?(?:\|([^\]]+))?\]\]", line.split("||")[1])
        numbers = re.findall(r'align="right"\s*\|\s*([\d,]+\.?\d*)', line)
        tail = re.findall(r"\|\|\s*([\d,]+)\s*(?:<|$)", line)
        if not (name_match and len(numbers) >= 3 and tail):
            continue
        name = (name_match.group(2) or name_match.group(1)).strip()
        del link
        found[slug(name).replace("murang-a", "muranga")] = CountyFigures(
            name, _number(numbers[0]), int(_number(numbers[1])), int(_number(numbers[2])), int(_number(tail[0]))
        )
    return found


@dataclass(frozen=True)
class PartyAllocation:
    number: int
    registry_code: str
    name: str
    amount_kes: int


def read_party_fund() -> list[PartyAllocation]:
    pdf = next(ORPP.glob("political-parties-fund-ppf-allocation-of-fy202627--*.pdf"))
    text = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True, check=False).stdout
    rows: list[PartyAllocation] = []
    for line in text.splitlines():
        m = re.match(r"^\s*(\d{1,2})\s+(\d{1,3})\s+(.+?)\s{2,}([\d,]+)\s*$", line)
        if m:
            rows.append(
                PartyAllocation(int(m.group(1)), m.group(2), m.group(3).strip(), int(m.group(4).replace(",", "")))
            )
    return rows


def read_key_indicators() -> dict[str, dict[int, float]]:
    """Table 1 of the 2022 Facts and Figures: national population (millions), GDP growth and others, 2017 to 2021."""
    pdf = next(KNBS.glob("2022-kenya-facts-figures--*.pdf"))
    text = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True, check=False).stdout
    wanted = {
        "Population": "population-millions",
        "Grow th of GDP": "gdp-growth-percent",
        "W ag e employ ment": "wage-employment-thousands",
    }
    result: dict[str, dict[int, float]] = {}
    for line in text.splitlines():
        for prefix, key in wanted.items():
            if line.strip().startswith(prefix) and key not in result:
                values = re.findall(r"\(?[\d,]+\.\d+\)?", line.split(")")[-1] if "(" in line[:150] else line)[-5:]
                if len(values) == 5:
                    result[key] = {
                        2017 + i: (-1 if v.startswith("(") else 1) * float(v.strip("()").replace(",", ""))
                        for i, v in enumerate(values)
                    }
    return result


if __name__ == "__main__":
    counties = read_county_figures()
    print(len(counties), list(counties.items())[:2])
    print(len(read_party_fund()), read_party_fund()[7])
    print(read_key_indicators())
