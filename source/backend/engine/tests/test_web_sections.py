"""Exercise the sections capability on HTTP and on actual local browser interactions."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from typer.testing import CliRunner
from web_site import Handler, page

from mzizi_cli.orchestrator.app import app
from mzizi_engine.web.browser.adapter import discover_chrome
from mzizi_engine.web.handlers.sections import SectionsReport

STATIC = """
<nav><button data-toggle="collapse" data-target="#menu">Menu</button>
<div id="menu"><a href="/other">Other</a></div></nav>
<ul class="nav-tabs"><li><a href="#current" data-toggle="tab">Current</a></li>
<li><a href="#previous" data-toggle="tab">Previous</a></li></ul>
<div id="current" class="tab-pane active"><table><tr><th>Title</th><th>Source</th></tr>
<tr><td>Current record</td><td><a href="/report.pdf"><i></i></a></td></tr></table></div>
<div id="previous" class="tab-pane" hidden><table><tr><th>Title</th><th>Source</th></tr>
<tr><td>Earlier record</td><td>None</td></tr></table></div>
"""

DYNAMIC = """
<div role="tablist"><button type="button" role="tab" aria-controls="async" aria-selected="false" id="open">
Results</button></div>
<section role="tabpanel" id="async" hidden><span role="status">Loading</span></section>
<script>
const open = document.getElementById('open');
const panel = document.getElementById('async');
let current = 1;
function show() {
  panel.innerHTML = '<table><tr><th>Record</th><th>Value</th></tr><tr><td>Record ' + current +
    '</td><td>Available</td></tr></table><nav class="pagination"><button type="button" aria-label="Next page"' +
    (current === 3 ? ' disabled' : '') + '>Next</button></nav>';
  panel.querySelector('button').onclick = () => { current++; setTimeout(show, 80); };
}
open.onclick = () => {
  open.setAttribute('aria-selected', 'true'); panel.hidden = false; setTimeout(show, 80);
};
</script>
"""


def _run(root: Path, url: str, *flags: str) -> tuple[SectionsReport, Path]:
    result = CliRunner().invoke(app, ["--no-input", "--json", "web", "sections", url, *flags])
    assert result.exit_code == 0, result.output
    report = SectionsReport.model_validate(json.loads(result.output))
    runs = list(root.glob("runs/*/*-web-sections"))
    assert len(runs) == 1
    return report, runs[0]


def test_static_hidden_tabs_keep_evidence_and_ignore_navigation(
    site: str, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path))
    Handler.site["/sections-static"] = page("Tabbed source", STATIC)
    report, run = _run(tmp_path, site + "/sections-static", "--render", "http")
    assert report.complete and report.discovered_sections == 2
    assert [s.label for s in report.sections] == ["Current", "Previous"]
    assert [s.initial_table_rows for s in report.sections] == [1, 1]
    assert report.sections[0].views[0].references[0].url == site + "/report.pdf"
    assert report.sections[1].source_url.endswith("#previous")
    markdown = (run / "sections.md").read_text()
    assert "Earlier record" in markdown and "Current record" in markdown
    assert "[report.pdf]" in markdown and "Other" not in markdown
    assert not list(run.rglob("*.pdf"))


def test_section_budget_reports_incomplete(site: str, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path))
    Handler.site["/sections-static"] = page("Tabbed source", STATIC)
    report, _ = _run(tmp_path, site + "/sections-static", "--render", "http", "--max-sections", "1")
    assert not report.complete and report.discovered_sections == 2 and len(report.sections) == 1
    assert report.reason == "section limit reached"


@pytest.mark.skipif(discover_chrome() is None, reason="needs installed Chrome")
@pytest.mark.parametrize(("limit", "reason", "rows"), [(5, "continuation_disabled", 3), (2, "view_limit_reached", 2)])
def test_browser_waits_for_async_tab_and_walks_next(
    site: str, monkeypatch: pytest.MonkeyPatch, tmp_path: Path, limit: int, reason: str, rows: int
) -> None:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path))
    Handler.site["/sections-dynamic"] = page("Tabbed source", DYNAMIC)
    report, run = _run(
        tmp_path,
        site + "/sections-dynamic",
        "--render",
        "auto",
        "--adapter",
        "playwright",
        "--headless",
        "--max-view-steps",
        str(limit),
    )
    (section,) = report.sections
    assert report.complete == (limit == 5)
    assert section.initial_table_rows == 0 and section.browser_distinct_table_rows == rows
    assert section.stop_reason.value == reason
    markdown = (run / "sections.md").read_text()
    assert all(f"Record {number}" in markdown for number in range(1, rows + 1))


@pytest.mark.skipif(discover_chrome() is None, reason="needs installed Chrome")
def test_browser_load_more_keeps_one_cumulative_markdown(
    site: str, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path))
    report, run = _run(tmp_path, site + "/loadmore", "--render", "auto", "--adapter", "playwright", "--headless")
    (section,) = report.sections
    assert report.complete and section.captured_distinct_list_items == 6
    assert section.stop_reason.value == "no_next_control" and len(section.preferred_markdown) == 1
    markdown = (run / "sections.md").read_text()
    assert all(markdown.count(f"row {i}") == 1 for i in range(1, 7))


@pytest.mark.skipif(discover_chrome() is None, reason="needs installed Chrome")
def test_browser_marks_repeated_content_as_partial(site: str, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path))
    cycle = DYNAMIC.replace("current++;", "current = current === 2 ? 1 : 2;")
    Handler.site["/sections-cycle"] = page("Repeated listing", cycle)
    report, _ = _run(tmp_path, site + "/sections-cycle", "--adapter", "playwright", "--headless")
    (section,) = report.sections
    assert not report.complete and section.stop_reason.value == "repeated_content"
    assert section.captured_distinct_table_rows == 2
