"""The CLI applies the same site module to loopback and saved HTML."""

from __future__ import annotations

import json
from importlib.util import find_spec
from pathlib import Path

import pytest
from typer.testing import CliRunner
from web_site import Handler, page

from mzizi_engine.devcli.app import app

RECIPE = """
module: links
discover:
  listing:
    url: /js
    items:
      - {css: "#missing", confidence: 0.9}
      - {css: "#slot a", confidence: 0.5}
extract:
  fields:
    title: {from: link_text}
    href: {from: link_href}
"""


@pytest.fixture
def cli(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> tuple[CliRunner, Path]:
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path / "dev"))
    module = tmp_path / "links.yaml"
    module.write_text(RECIPE, encoding="utf-8")
    return CliRunner(), module


def invoke(runner: CliRunner, *args: str) -> dict:
    result = runner.invoke(app, ["--no-input", "--json", "--allow-outside-inputs", *args])
    assert result.exit_code == 0, result.output
    return json.loads(result.output)


@pytest.fixture
def patchright_browser() -> None:
    if find_spec("patchright") is None:
        pytest.skip("needs optional Patchright")
    from patchright.sync_api import sync_playwright

    with sync_playwright() as driver:
        if not Path(driver.chromium.executable_path).is_file():
            pytest.skip("needs Patchright's bundled Chromium")


@pytest.mark.usefixtures("patchright_browser")
def test_patchright_extracts_javascript_and_replays_saved_capture(site: str, cli: tuple[CliRunner, Path]) -> None:
    runner, module = cli
    http = invoke(runner, "scrape", "url", site + "/js", "--manifest", str(module))
    assert http["ok"] and http["records"] == []
    rendered = invoke(
        runner,
        "scrape",
        "url",
        site + "/js",
        "--manifest",
        str(module),
        "--render",
        "browser",
        "--adapter",
        "patchright",
    )
    assert rendered["ok"] and rendered["adapter"] == "patchright"
    assert rendered["selector_index"] == 1
    assert rendered["records"] == [{"fields": {"title": "js link", "href": "/found-by-js"}, "errors": []}]
    offline = invoke(runner, "scrape", "file", rendered["capture"], "--manifest", str(module))
    assert offline["records"] == rendered["records"]
    assert offline["sha256"] == rendered["sha256"]
    selected = invoke(runner, "scrape", "select", rendered["capture"], "--css", "#slot a")
    assert selected["matches"] == ["js link"]
    snapshot = invoke(runner, "browser", "snapshot", site + "/js", "--adapter", "patchright")
    assert snapshot["page"]["title"] == "Dynamic"
    crawl = invoke(
        runner,
        "web",
        "crawl",
        site + "/js",
        "--render",
        "browser",
        "--adapter",
        "patchright",
        "--max-pages",
        "1",
        "--no-sitemap",
    )
    assert crawl["pages"] == 1 and crawl["adapter"] == "patchright"


@pytest.mark.parametrize(
    "flags",
    [(), ("--render", "browser", "--adapter", "patchright")],
    ids=["http", "browser"],
)
def test_scrape_stops_on_robots_and_challenge(
    site: str, cli: tuple[CliRunner, Path], flags: tuple[str, ...], request: pytest.FixtureRequest
) -> None:
    if flags:
        request.getfixturevalue("patchright_browser")
    runner, module = cli
    Handler.site["/challenge"] = page("Access check", '<div class="g-recaptcha"></div>')
    denied = invoke(runner, "scrape", "url", site + "/private", "--manifest", str(module), *flags)
    assert not denied["ok"] and denied["reason"] == "disallowed by robots.txt"
    assert denied["capture"] == "" and denied["policy_audit"][0]["allowed"] is False
    blocked = invoke(runner, "scrape", "url", site + "/challenge", "--manifest", str(module), *flags)
    assert not blocked["ok"] and blocked["reason"].startswith("captcha:")
    assert blocked["records"] == [] and blocked["block_decisions"][0]["kind"] == "captcha"
