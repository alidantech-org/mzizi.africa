"""Leadership pages of county government sites (.go.ke), fetched through the gate: home page plus a few links that look like
governor / deputy governor / executive / county secretary pages. Raw HTML is kept per county; `leaders()` reads titles and names
conservatively from the visible text. A county whose site is unreachable, refused or challenged is skipped and reported."""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

LINK = re.compile(r"governor|deputy|executive|cabinet|\bcec\b|county-secretary|secretary|leadership|about|management|speaker|clerk", re.I)
NAME = r"((?:(?:Hon|Dr|Prof|Eng|Amb|Mr|Mrs|Ms|Sen|Rev|CPA)\.?[ ]+)*[A-Z][A-Za-z'\-]+(?:[ ]+[A-Z][A-Za-z'\-]+){1,3})"
TITLES = {
    "deputy-governor": re.compile(r"(?:Deputy\s+Governor)\W{0,4}(?:H\.?E\.?\s+)?" + NAME),
    "county-secretary": re.compile(r"(?:County\s+Secretary)\W{0,4}(?:H\.?E\.?\s+)?" + NAME),
    "speaker": re.compile(r"(?:Speaker(?:\s+of\s+the\s+County\s+Assembly)?)\W{0,4}" + NAME),
    "cec-member": re.compile(r"(?:CECM|CEC\s+Member|County\s+Executive(?:\s+Committee)?\s+Member)[^A-Za-z]{0,6}(?:for|of)?\s*[A-Za-z,&\s]{0,60}?[:\-–]\s*" + NAME),
}
STOP = {"Public", "Service", "Services", "Works", "Work", "Officer", "Officers", "Chief", "Leads", "Launch", "Majority", "Leader", "Head", "And", "Assembly", "Built", "Environment", "Green", "Manifesto", "Box", "Health", "Education", "Water", "Finance", "Gender", "Trade", "Devolution", "Infrastructure", "Nairobi", "Welcome", "Mayor", "Minority", "Whip", "Chair", "Chairperson", "Board", "Director", "Hon", "Sub", "Ward", "Administrator", "Administration", "Planning", "Lands", "Housing", "Urban", "Agriculture", "Livestock", "Fisheries", "Roads", "Transport", "Youth", "Sports", "Culture", "Social", "Tourism", "Energy", "Management", "Disaster", "Emergency", "News", "Latest", "Press", "Media", "Statement", "The", "County", "Government", "Office", "Governor", "Deputy", "Secretary", "Executive", "Committee", "Member", "Services", "Department", "Home", "About", "Contact", "Read", "More", "Our", "Message"}


def fetch_county(get, county: str, host: str, out: Path, max_links: int = 6) -> list[str]:
    folder = out / county
    folder.mkdir(parents=True, exist_ok=True)
    got = []
    home = get(f"https://{host}/")
    (folder / "index.html").write_bytes(home.body)
    got.append("index.html")
    if home.status != 200:
        return got
    soup = BeautifulSoup(home.body, "lxml")
    links = []
    for a in soup.find_all("a", href=True):
        url = urljoin(f"https://{host}/", a["href"]).split("#")[0]
        if urlparse(url).hostname == host and LINK.search(a.get_text(" ") + " " + url) and url not in links and not url.lower().endswith((".pdf", ".jpg", ".png", ".docx", ".xlsx")):
            links.append(url)
    for i, url in enumerate(links[:max_links]):
        res = get(url)
        if res.status == 200:
            name = f"p{i}.html"
            (folder / name).write_bytes(res.body)
            (folder / (name + ".url")).write_text(url)
            got.append(name)
    return got


def leaders(folder: Path) -> list[dict]:
    found: dict[tuple, dict] = {}
    for page in sorted(folder.glob("*.html")):
        text = BeautifulSoup(page.read_bytes(), "lxml").get_text("\n")
        text = re.sub(r"[ \t ]+", " ", text)
        for kind, rx in TITLES.items():
            for m in rx.finditer(text):
                name = re.sub(r"\s+", " ", m.group(1)).strip()
                core = re.sub(r"^(?:(?:Hon|Dr|Prof|Eng|Amb|Mr|Mrs|Ms|Sen|Rev|CPA)\.?\s+)+", "", name)
                parts = core.split()
                if len(parts) < 2 or len(parts) > 4 or any(p in STOP or not re.fullmatch(r"[A-Z][a-z'\-]+(?:[A-Z][a-z]+)?", p) for p in parts) or any(p.upper() == p and len(p) > 3 for p in parts):
                    continue
                found.setdefault((kind, core.lower()), {"kind": kind, "name": core, "page": page.name})
    return list(found.values())
