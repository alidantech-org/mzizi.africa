"""Automatic site survey: crawl, profile, compare families and draft a site structure for a person to review."""

from __future__ import annotations

import json
from pathlib import Path

import yaml
from pydantic import BaseModel

from mzizi_engine.activity import open_activity
from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.web.handlers.crawl import crawl_site
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.export import read_csv
from mzizi_engine.web.requests import DraftRequest, FamilyRequest, ProfileRequest, SurveyRequest
from mzizi_manifest.bundle import from_files
from mzizi_manifest.validate import validate
from mzizi_scraping.profile import FamilyReport, PageInput, SiteProfile, build_profile, compare_profiles

DRAFT_RATE = 0.5
DRAFT_CONCURRENCY = 1


class _PageRow(BaseModel):
    final_url: str
    title: str
    raw_file: str


class _DocumentRow(BaseModel):
    normalized_url: str


def _front(markdown: str, key: str) -> str:
    for line in markdown.splitlines()[1:12]:
        if line.startswith(f"{key}: "):
            return line[len(key) + 2 :].strip().strip('"')
    return ""


def _site_profile(folder: Path) -> SiteProfile:
    """A profile built from a site folder's current pages (`pages/<path>/<slug>.html` with its Markdown front matter)."""
    pages: list[PageInput] = []
    for html in sorted((folder / "pages").rglob("*.html")):
        if "versions" in html.parts:
            continue
        markdown = html.with_suffix(".md")
        front = markdown.read_text(encoding="utf-8") if markdown.is_file() else ""
        url = _front(front, "final_url")
        if url:
            pages.append(PageInput(url=url, title=_front(front, "title"), html=html.read_text(encoding="utf-8", errors="replace")))
    documents_file = folder / "inventory" / "documents.csv"
    documents = [row["normalized_url"] for row in read_csv(documents_file)] if documents_file.is_file() else []
    return build_profile(pages, documents)


def load_profile(folder: Path) -> SiteProfile:
    """The profile of a site folder or of a crawl run folder."""
    if (folder / "pages").is_dir():
        return _site_profile(folder)
    saved = folder / "profile.json"
    if saved.is_file():
        return SiteProfile.model_validate_json(saved.read_text(encoding="utf-8"))
    rows = [_PageRow.model_validate(row, strict=False) for row in read_csv(folder / "pages.csv")]
    pages = [
        PageInput(
            url=row.final_url,
            title=row.title,
            html=(folder / row.raw_file).read_text(encoding="utf-8", errors="replace"),
        )
        for row in rows
        if (folder / row.raw_file).is_file()
    ]
    documents_file = folder / "documents.csv"
    documents = (
        [_DocumentRow.model_validate(row, strict=False).normalized_url for row in read_csv(documents_file)]
        if documents_file.is_file()
        else []
    )
    return build_profile(pages, documents)


def _markdown(profile: SiteProfile) -> str:
    lines = [
        f"# Site profile: {profile.host}",
        "",
        f"- Pages profiled: {profile.pages}",
        f"- Generator: {profile.generator or 'not declared'}",
        f"- Title suffix: {profile.title_suffix or 'none'}",
        f"- Pagination hints: {', '.join(profile.pagination_hints) or 'none seen'}",
        f"- Documents by type: {profile.document_extensions or 'none'}",
        f"- Navigation labels shared by most pages: {', '.join(profile.nav_labels) or 'none'}",
        "",
        "## Sections (first path segment)",
        "",
    ]
    lines += [f"- `/{s.segment}` — {s.pages} page(s), e.g. {s.sample_titles[0]!r}" for s in profile.sections]
    lines += ["", "## Page templates", ""]
    for template in profile.templates:
        lines.append(f"- `{template.signature}` — {template.pages} page(s), e.g. {template.example_urls[0]}")
        lines += [f"  - repeated `{b.selector}` ×{b.repeats}: {b.example_text!r}" for b in template.repeated_blocks]
    return "\n".join(lines) + "\n"


def profile_run(request: ProfileRequest) -> SiteProfile:
    folder = Path(request.source)
    profile = build_profile_from(folder)
    target = out_dir(request) if request.out_dir else folder
    activity = open_activity()
    if activity is not None:
        try:
            activity.put(
                "site_profiles",
                [{"_id": f"{Path(request.source).name}", "source": request.source, **profile.model_dump(mode="json")}],
            )
        finally:
            activity.close()
    else:
        (target / "profile.json").write_text(profile.model_dump_json(indent=2), encoding="utf-8")
    (target / "PROFILE.md").write_text(_markdown(profile), encoding="utf-8")
    return profile


def build_profile_from(folder: Path) -> SiteProfile:
    (folder / "profile.json").unlink(missing_ok=True)
    return load_profile(folder)


def family_runs(request: FamilyRequest) -> FamilyReport:
    report = compare_profiles(load_profile(Path(request.left)), load_profile(Path(request.right)))
    activity = open_activity()
    if activity is not None:
        try:
            activity.put(
                "family_reports", [{"_id": f"{Path(request.left).name}|{Path(request.right).name}", **report.model_dump(mode="json")}]
            )
        finally:
            activity.close()
    else:
        (out_dir(request) / "family.json").write_text(report.model_dump_json(indent=2), encoding="utf-8")
    return report


class DraftResult(BaseModel):
    folder: str
    modules: tuple[str, ...]
    problems: tuple[str, ...]


def _slug(segment: str) -> str:
    return "".join(ch if ch.isalnum() else "_" for ch in segment.lower()).strip("_") or "home"


def draft_bundle(request: DraftRequest) -> DraftResult:
    """Writes a draft bundle: one module per section with a repeated block. Every file is a proposal for review."""
    profile = load_profile(Path(request.source))
    blocks = {url: t.repeated_blocks for t in profile.templates for url in t.example_urls}
    modules: dict[str, dict] = {}
    for section in profile.sections:
        for url in section.sample_urls:
            chosen = blocks.get(url)
            if section.segment != "(root)" and chosen:
                name = _slug(section.segment)
                modules[name] = {
                    "module": name,
                    "tags": [],
                    "discover": {
                        "listing": {
                            "url": f"/{section.segment}/",
                            "items": [{"css": b.selector, "confidence": 0.4} for b in chosen[:3]],
                        }
                    },
                    "extract": {"fields": {"title": {"from": "link_text"}, "href": {"from": "link_href"}}},
                    "expect": {"min_items": 1},
                }
                break
    manifest = {
        "schema": "mzizi.site/v1",
        "site": request.site or profile.host.replace(".", "-"),
        "fetch": {"mode": "browser" if request.browser else "http"},
        "modules": sorted(modules),
        "policy": {
            "scope": {"hosts": [profile.host], "schemes": ["https"]},
            "rate": {"requests_per_second": DRAFT_RATE, "max_concurrency": DRAFT_CONCURRENCY},
            "identify": {"user_agent": user_agent()},
            "robots": "respect",
            "auth": "none",
        },
    }
    files = {"manifest.yml": yaml.safe_dump(manifest, sort_keys=False)}
    files.update({f"modules/{name}.yml": yaml.safe_dump(doc, sort_keys=False) for name, doc in modules.items()})
    files["NOTES.md"] = (
        f"# {profile.host} (draft)\n\nGenerated from a crawl profile. Selectors are heuristics at low confidence;"
        " review each module against the live site before use. No source assessment is attached.\n\n"
        + _markdown(profile)
    )
    folder = out_dir(request) / "draft-bundle"
    for path, text in files.items():
        (folder / path).parent.mkdir(parents=True, exist_ok=True)
        (folder / path).write_text(text, encoding="utf-8")
    report = validate(from_files(str(folder), files), None, run_dry=False)
    return DraftResult(folder=str(folder), modules=tuple(sorted(modules)), problems=tuple(report.errors))


class SurveyResult(BaseModel):
    crawl_folder: str
    pages: int
    profile: SiteProfile
    draft: DraftResult


def survey_site(request: SurveyRequest) -> SurveyResult:
    """One command: crawl within policy, profile the pages, draft a bundle."""
    summary = crawl_site(request)
    folder = Path(request.out_dir)
    profile = profile_run(ProfileRequest(out_dir=request.out_dir, source=str(folder)))
    draft = draft_bundle(DraftRequest(out_dir=request.out_dir, source=str(folder)))
    return SurveyResult(crawl_folder=str(folder), pages=summary.pages, profile=profile, draft=draft)
