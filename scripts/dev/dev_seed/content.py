"""Explanatory texts (filesystem.contents) for every body, ministry, arm, level, the Constitution and general knowledge,
with tags and the logo media their front matter points at. Text is markdown; media is referenced as `media:<code>` and
resolved by the API."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

from dev_seed.gov_data import BASES, BODIES, MINISTRIES, Body
from dev_seed.store import Tables

PAGES_DIR = Path(__file__).parent / "pages"


@dataclass(frozen=True)
class Page:
    slug: str
    category: str
    classification: str
    title: str
    summary: str
    subject: tuple[str, str]
    tags: tuple[str, ...]
    body: str


def load_pages() -> list[Page]:
    """Every `pages/*.md`: a small header (slug, category, classification, title, summary, subject, tags), then the text."""
    pages: list[Page] = []
    for path in sorted(PAGES_DIR.glob("*.md")):
        _, header, body = path.read_text(encoding="utf-8").split("---\n", 2)
        meta: dict[str, str] = {}
        for line in header.strip().splitlines():
            key, _, value = line.partition(": ")
            meta[key.rstrip(":")] = value
        pages.append(
            Page(
                meta["slug"],
                meta["category"],
                meta["classification"],
                meta["title"],
                meta["summary"],
                (meta.get("subject_table", ""), meta.get("subject_code", "")),
                tuple(x.strip() for x in meta.get("tags", "").split(",") if x.strip()),
                body,
            )
        )
    return pages


BASIS_WORDS = {b[0]: b[1] for b in BASES}
SWAHILI = {
    "arm/executive": (
        "Serikali Kuu (Utendaji)",
        "# Serikali Kuu\n\nSerikali Kuu inatekeleza sheria. Kitaifa inaongozwa na **Rais**, **Naibu Rais** na **Baraza la Mawaziri**. Kaunti inaongozwa na **Gavana** na **Naibu Gavana**.\n",
    ),
    "arm/legislature": (
        "Bunge (Utungaji sheria)",
        "# Bunge\n\nBunge linatunga sheria na kusimamia serikali. Lina nyumba mbili: **Bunge la Kitaifa** na **Seneti**. Kila kaunti ina **bunge la kaunti**.\n",
    ),
    "arm/judiciary": (
        "Idara ya Mahakama",
        "# Idara ya Mahakama\n\nMahakama hutatua migogoro na kulinda haki. Kutoka juu: Mahakama ya Juu, Mahakama ya Rufaa, Mahakama Kuu na mahakama za mahakimu.\n",
    ),
    "explainer/devolution": (
        "Ugatuzi ni nini?",
        "# Ugatuzi ni nini?\n\nUgatuzi ni kupeleka madaraka na pesa kutoka mji mkuu hadi **kaunti 47**. Ulianza baada ya uchaguzi wa Machi 2013. Kaunti hushughulikia afya, barabara za kaunti, kilimo na elimu ya awali.\n",
    ),
    "level/ward": (
        "Wadi",
        "# Wadi\n\nKenya ina **wadi 1,450**. Kila wadi huchagua **Mwakilishi wa Wadi (MCA)**, kiongozi wa karibu zaidi nawe.\n",
    ),
}


def _basis_text(body: Body) -> str:
    if body.articles and body.basis == "constitution":
        return (
            "The Constitution of Kenya, 2010 creates it ("
            + ", ".join(f"Article {a}" for a in body.articles)
            + ")."
            + (f" The {body.act} sets out how it works." if body.act else "")
        )
    if body.act:
        return f"It was created by the {body.act}."
    return f"Its legal basis is {BASIS_WORDS[body.basis].lower()}."


def _institution_page(body: Body, parent_name: str) -> tuple[str, str]:
    functions = "\n".join(f"- {f}" for f in body.functions)
    lines = [
        "---",
        f"image: media:ke.media.logo.{body.slug}",
        "---",
        f"# {body.name}",
        "",
        body.purpose,
        "",
        "## What it does",
        functions or "- Its functions are not yet recorded.",
        "",
        "## What created it",
        _basis_text(body) + (f" It started work in {body.since}." if body.since else ""),
    ]
    if parent_name:
        lines += ["", "## Where it fits", f"It is part of {parent_name}."]
    if body.note:
        lines += ["", "## Good to know", body.note]
    return "\n".join(lines) + "\n", body.purpose


def build_content(t: Tables) -> None:
    names = {b.slug: b.name for b in BODIES}
    tag_codes: set[str] = set()

    def add(
        slug_: str,
        category: str,
        classification: str,
        title: str,
        summary: str,
        body: str,
        table: str,
        subject: str,
        tags: tuple[str, ...],
        language: str = "en",
        dev: bool = True,
    ) -> None:
        code = f"ke.content.{slug_.replace('/', '.')}" + ("" if language == "en" else f".{language}")
        row = {
            "code": code,
            "slug": slug_,
            "language_code": language,
            "title": title,
            "summary": summary,
            "category_code": f"fil.content.category.{category}",
            "classification_code": f"fil.content.classification.{classification}",
            "body": body
            + (
                "\n*Development text: written for the interface and not yet checked against an official source.*\n"
                if dev
                else ""
            ),
            "is_development_text": "true" if dev else "false",
        }
        # general knowledge is about the country
        row["subject_table"], row["subject_code"] = (table, subject) if table else ("geography.features", "ke")
        t.add("ke/filesystem/contents.csv", row)
        for tag in dict.fromkeys(tags):
            tag_codes.add(tag)
            t.add("ke/filesystem/content_tags.csv", {"content_code": code, "tag_code": f"ke.tag.{tag}"})

    for body in BODIES:
        text, summary = _institution_page(body, names.get(body.parent, ""))
        add(
            f"institution/{body.slug}",
            "institution",
            "overview",
            body.name,
            summary,
            text,
            "governance.institutions",
            f"ke.institution.{body.slug}",
            (body.arm, body.kind, body.basis),
        )
        t.add(
            "ke/filesystem/media.csv",
            {
                "code": f"ke.media.logo.{body.slug}",
                "kind_code": "fil.media.kind.logo",
                "subject_table": "governance.institutions",
                "subject_code": f"ke.institution.{body.slug}",
                "title": f"{body.name} (placeholder emblem)",
                "alt_text": f"Placeholder emblem for {body.name}",
                "position": "1",
                "external_url": f"https://api.dicebear.com/9.x/shapes/svg?seed={quote(body.slug)}",
                "platform_code": "fil.media.platform.dicebear",
            },
        )
    for key, name, departments in MINISTRIES:
        deps = "\n".join(f"- {d}" for d in departments) or "- It has no separate state departments."
        text = f"---\nimage: media:ke.media.logo.{key}\n---\n# {name}\n\nA ministry is led by a **Cabinet Secretary**, who is nominated by the President and approved by the National Assembly. Each **state department** inside it is led by a **Principal Secretary**.\n\n## State departments\n{deps}\n\n## Where it fits\nIt is part of the Cabinet.\n"
        add(
            f"institution/{key}",
            "institution",
            "overview",
            name,
            "A ministry in the Cabinet, led by a Cabinet Secretary.",
            text,
            "governance.institutions",
            f"ke.institution.{key}",
            ("executive", "ministry", "constitution"),
        )
        t.add(
            "ke/filesystem/media.csv",
            {
                "code": f"ke.media.logo.{key}",
                "kind_code": "fil.media.kind.logo",
                "subject_table": "governance.institutions",
                "subject_code": f"ke.institution.{key}",
                "title": f"{name} (placeholder emblem)",
                "alt_text": f"Placeholder emblem for {name}",
                "position": "1",
                "external_url": f"https://api.dicebear.com/9.x/shapes/svg?seed={quote(key)}",
                "platform_code": "fil.media.platform.dicebear",
            },
        )
    for page in load_pages():
        add(
            page.slug,
            page.category,
            page.classification,
            page.title,
            page.summary,
            page.body,
            page.subject[0],
            page.subject[1],
            page.tags,
        )
        if page.slug in SWAHILI:
            sw_title, sw_body = SWAHILI[page.slug]
            add(
                page.slug,
                page.category,
                page.classification,
                sw_title,
                page.summary,
                sw_body,
                page.subject[0],
                page.subject[1],
                page.tags,
                "sw",
            )
    for person, name in (("william-ruto", "William Ruto"), ("kithure-kindiki", "Kithure Kindiki")):
        t.add(
            "ke/filesystem/media.csv",
            {
                "code": f"ke.media.portrait.{person}",
                "kind_code": "fil.media.kind.portrait",
                "subject_table": "official.individuals",
                "subject_code": f"ke.person.{person}",
                "title": name,
                "alt_text": f"Placeholder portrait of {name}",
                "position": "1",
                "external_url": f"https://api.dicebear.com/9.x/initials/svg?seed={quote(name)}&backgroundType=gradientLinear&radius=50",
                "platform_code": "fil.media.platform.dicebear",
            },
        )
    for tag in sorted(tag_codes):
        t.add("ke/filesystem/tags.csv", {"code": f"ke.tag.{tag}", "title": tag.replace("-", " ").capitalize()})
