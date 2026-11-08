"""Section crawler tests: recorded pages and files, a mock transport, no live requests."""
from mzizi_data.seedroot import FIXTURES_ROOT
import io
import json
import uuid
from pathlib import Path

import httpx
import pytest

from mzizi_data import crawl, registry
from mzizi_data.crawl import CrawlConfig, SectionCrawler
from tests.helpers import UA, make_fetcher, make_site
from tests.pdfmaker import make_pdf

PAGES = FIXTURES_ROOT / "extraction" / "crawl"
PDF_A = make_pdf([{"text": [(72, 720, "Approved Budget Estimates 2023/24")]}])
PDF_TENDER = make_pdf([{"text": [(72, 720, "Tender Notice")]}])
PDF_ANNUAL = make_pdf([{"text": [(72, 720, "Annual report")]}])
XLSX = b"PK\x03\x04 xlsx-bytes"
CSV = b"unit,amount\nA,1\n"
PROV = {"method": "custom-prepared", "label": "Custom-prepared from manual research", "confidence": 0.5}
SECTIONS = [
    {"label": "publications", "file_types": ["pdf"], "paginate": {"type": "query", "param": "page", "start": 1, "max_pages": 5}, "rules": [{"kind": "exact", "pattern": "/publications", "provenance": PROV}]},
    {"label": "tenders", "file_types": ["pdf"], "rules": [{"kind": "regex", "pattern": "^/tenders/?$", "provenance": PROV}]},
]


def page(name):
    return (PAGES / name).read_bytes()


ROUTES = {
    "/": ("home.html", "text/html"),
    "/publications": ("publications-1.html", "text/html"),
    "/publications?page=2": ("publications-2.html", "text/html"),
    "/publications?page=3": ("publications-3.html", "text/html"),
    "/publications/annual-report": ("annual-report.html", "text/html"),
    "/publications/annual-report/deep": ("deep.html", "text/html"),
    "/tenders": ("tenders.html", "text/html"),
}
FILES = {
    "/downloads/a.pdf": (PDF_A, "application/pdf"),
    "/archive/a-copy.pdf": (PDF_A, "application/pdf"),
    "/downloads/b.xlsx": (XLSX, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    "/downloads/c.csv": (CSV, "text/csv"),
    "/downloads/annual.pdf": (PDF_ANNUAL, "application/pdf"),
    "/tenders/notice.pdf": (PDF_TENDER, "application/pdf"),
    "/downloads/stray.pdf": (b"%PDF-1.4 stray", "application/pdf"),
    "/downloads/never.pdf": (b"%PDF-1.4 never", "application/pdf"),
    "/downloads/too-deep.pdf": (b"%PDF-1.4 deep", "application/pdf"),
}


class Recorded:
    """Serves recorded pages and files, counts requests and can be told to answer differently."""

    def __init__(self, robots="User-agent: *\nDisallow: /private/\n", override=None, huge=True):
        self.robots, self.override, self.huge = robots, override or {}, huge
        self.requests: list[httpx.Request] = []
        # the scratch database keeps documents between tests (and a document is one per distinct bytes, across sites), so each test serves its own bytes
        self.suffix = b"\n%" + uuid.uuid4().hex.encode()

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        path = request.url.path
        key = f"{path}?{request.url.query.decode()}" if request.url.query else path
        if path == "/robots.txt":
            return httpx.Response(200, text=self.robots)
        if key in self.override:
            return self.override[key](request) if callable(self.override[key]) else httpx.Response(self.override[key], text="x")
        if key in ROUTES:
            name, ctype = ROUTES[key]
            return httpx.Response(200, content=page(name), headers={"content-type": ctype, "set-cookie": "session=secret", "etag": '"v1"'})
        if path in FILES:
            body, ctype = FILES[path]
            return httpx.Response(200, content=body + self.suffix, headers={"content-type": ctype, "last-modified": "Tue, 03 Oct 2023 10:00:00 GMT"})
        if path == "/downloads/huge.zip" and self.huge:
            return httpx.Response(200, content=b"PK", headers={"content-type": "application/zip", "content-length": str(900 * 1024 * 1024)})
        return httpx.Response(404, text="not found")

    @property
    def paths(self):
        return [r.url.path + (f"?{r.url.query.decode()}" if r.url.query else "") for r in self.requests if r.url.path != "/robots.txt"]


@pytest.fixture()
def crawler(conn, store, tmp_path):
    def make(handler=None, config=None, sections=SECTIONS, trusted=None, **kwargs):
        unique = uuid.uuid4().hex[:10]
        host = f"c{unique}.go.ke"
        code = f"ke/crawl-{unique}"
        scope = {"hosts": [host, "other-" + host], "schemes": ["https"], "fetchModes": ["http", "api"], "maxRequestsPerSecond": 0.5}
        site_id, _version = make_site(conn, store, code=code, host=host, scope=scope)
        handler = handler or Recorded()
        # the recorded pages use relative links, so the fake host is whatever the site is; absolute links to other hosts stay as recorded
        policy = {"identify": {"user_agent": UA}, "rate": {"requests_per_second": 0.2}, "limits": {"max_response_bytes": 25 * 1024 * 1024}}
        fetcher = make_fetcher(conn, handler)(site_id, policy, "http")
        cfg = config or CrawlConfig(max_pages_per_section=2, raw_dir=tmp_path / "raw")
        return SectionCrawler(conn, store, fetcher, code, sections, None, cfg, trusted=trusted, **kwargs), handler, site_id, code

    return make


def test_expands_sections_registers_documents_with_provenance(conn, crawler, tmp_path):
    c, handler, site_id, code = crawler()
    report = c.run()
    assert report.stop is None
    paths = handler.paths
    # sections reached through exact rule, regex rule match, pagination (limit 2) and one detail page; depth 3 is never fetched
    assert "/publications" in paths and "/publications?page=2" in paths and "/tenders" in paths and "/publications/annual-report" in paths
    assert "/publications?page=3" not in paths and "/publications/annual-report/deep" not in paths and "/downloads/never.pdf" not in paths
    assert all(r.headers["user-agent"] == UA for r in handler.requests)
    docs = conn.execute("SELECT d.id, d.title, d.url FROM source.documents d WHERE d.site_id = %s ORDER BY d.title", (site_id,)).fetchall()
    assert len(docs) == 6  # a.pdf (+ copy dedup), b.xlsx, c.csv, annual.pdf, notice.pdf, stray.pdf
    row = conn.execute("SELECT * FROM website.document_sightings WHERE site_id = %s AND url LIKE %s", (site_id, "%/downloads/a.pdf")).fetchone()
    assert row["section_label"] == "publications" and row["rule_index"] == 0 and row["http_status"] == 200 and row["size_bytes"] == len(PDF_A) + len(handler.suffix)
    headers = json.loads(row["headers"])
    assert headers["content-type"] == "application/pdf" and "set-cookie" not in headers
    capture = conn.execute("SELECT content_hash, retrieved_at, assessment_id, file_version_id FROM source.captures WHERE document_id = %s", (row["document_id"],)).fetchone()
    assert capture["content_hash"] == row["content_hash"] and capture["assessment_id"] and capture["file_version_id"]
    # the raw bytes are kept with a provenance file beside each
    provenance = list((tmp_path / "raw").glob("*-a.pdf.provenance.json"))
    assert provenance and json.loads(provenance[0].read_text())["section"] == "publications"
    # leading section by rule when the page is not in a section (the stray link on the home page matches no rule)
    stray = conn.execute("SELECT section_label FROM website.document_sightings WHERE site_id = %s AND url LIKE %s", (site_id, "%stray.pdf")).fetchone()
    assert stray["section_label"] is None


def test_section_visits_record_items_and_rule(conn, crawler):
    c, handler, site_id, code = crawler()
    c.run()
    visits = conn.execute("SELECT section_label, rule_index, page_url, depth, items_found FROM website.section_visits WHERE site_id = %s ORDER BY visited_at, page_url", (site_id,)).fetchall()
    by_url = {v["page_url"].split(".go.ke")[1]: v for v in visits}
    assert by_url["/publications"]["items_found"] == 3  # a.pdf, b.xlsx and huge.zip; the .exe is outside the file-type policy
    assert by_url["/publications"]["rule_index"] == 0 and by_url["/publications"]["depth"] == 1
    assert by_url["/publications?page=2"]["depth"] == 1  # pagination does not deepen
    assert by_url["/publications/annual-report"]["depth"] == 2
    assert by_url["/tenders"]["section_label"] == "tenders" and by_url["/tenders"]["rule_index"] == 0
    assert report_sections(c)["publications"]["pages"] == 3


def report_sections(c):
    return c.report.sections


def test_duplicate_bytes_are_one_document_with_every_url(conn, crawler):
    c, handler, site_id, code = crawler()
    r = c.run()
    assert r.documents_duplicate == 1
    row = conn.execute("SELECT document_id FROM website.document_sightings WHERE site_id = %s AND url LIKE %s", (site_id, "%/downloads/a.pdf")).fetchone()
    urls = conn.execute("SELECT url FROM website.document_sightings WHERE document_id = %s ORDER BY url", (row["document_id"],)).fetchall()
    assert [u["url"].split(".go.ke")[1] for u in urls] == ["/archive/a-copy.pdf", "/downloads/a.pdf"]
    assert conn.execute("SELECT count(*) AS n FROM source.captures WHERE document_id = %s", (row["document_id"],)).fetchone()["n"] == 2  # each retrieval is a capture
    objects = conn.execute("SELECT count(DISTINCT file_version_id) AS n FROM source.captures WHERE document_id = %s", (row["document_id"],)).fetchone()["n"]
    assert objects == 1  # the bytes are stored once


def test_a_second_run_does_not_fetch_known_urls_again(conn, crawler, store):
    c, handler, site_id, code = crawler()
    c.run()
    first = [p for p in handler.paths if p.startswith(("/downloads", "/archive", "/tenders/notice"))]
    assert first
    handler.requests.clear()
    c2 = SectionCrawler(conn, store, c.fetcher, code, SECTIONS, None, CrawlConfig(max_pages_per_section=2), trusted=None)
    r2 = c2.run()
    assert not [p for p in handler.paths if p.startswith(("/downloads", "/archive", "/tenders/notice")) and "huge" not in p]  # a refused-for-size file has no sighting, so it is asked about again
    assert r2.documents_known_url >= 6 and r2.documents_new == 0


def test_hosts_outside_the_policy_are_never_requested(conn, crawler):
    c, handler, site_id, code = crawler()
    r = c.run()
    hosts = {req.url.host for req in handler.requests}
    assert hosts == {c.domain_ids and next(iter(c.domain_ids))}
    reasons = {s["why"] for s in r.skipped}
    assert any("never crawled" in w for w in reasons)  # kenyalaw.org link
    assert any("neither a trusted" in w for w in reasons)  # elsewhere.example.org link


def test_size_cap_skips_without_registering(conn, crawler):
    c, handler, site_id, code = crawler(config=CrawlConfig(max_pages_per_section=2, max_file_bytes=1024 * 1024))
    # the fetcher was built with the 25 MB policy; the declared 900 MB length exceeds it, so the file is refused before download
    r = c.run()
    assert any("huge.zip" in s["url"] and "size cap" in s["why"] for s in r.skipped)
    assert conn.execute("SELECT count(*) AS n FROM website.document_sightings WHERE site_id = %s AND url LIKE %s", (site_id, "%huge.zip")).fetchone()["n"] == 0


def test_robots_disallowed_paths_are_not_requested(conn, crawler):
    handler = Recorded(robots="User-agent: *\nDisallow: /tenders\n")
    c, handler, site_id, code = crawler(handler)
    r = c.run()
    assert "/tenders" not in handler.paths and "/tenders/notice.pdf" not in handler.paths
    assert any(s["why"] == "robots.txt disallows" and s["url"].endswith("/tenders") for s in r.skipped)


@pytest.mark.parametrize("status", [401, 403, 429])
def test_stops_for_good_on_refusal(conn, crawler, status):
    handler = Recorded(override={"/publications": status})
    c, handler, site_id, code = crawler(handler)
    r = c.run()
    assert r.stop and r.stop["kind"] == str(status)
    # nothing is requested after the refusal: no other section page, no files
    after = handler.paths[handler.paths.index("/publications") + 1:]
    assert after == []


def test_stops_on_an_access_challenge(conn, crawler):
    challenge = lambda request: httpx.Response(200, text="<html><title>Just a moment...</title>Checking your browser before accessing</html>", headers={"content-type": "text/html", "server": "cloudflare", "cf-mitigated": "challenge"})
    c, handler, site_id, code = crawler(Recorded(override={"/publications": challenge}))
    r = c.run()
    assert r.stop and r.stop["kind"] == "access_challenge"
    assert handler.paths[-1] == "/publications"


def test_request_budget_is_enforced(conn, crawler):
    c, handler, site_id, code = crawler(config=CrawlConfig(max_requests=4, max_pages_per_section=2))
    r = c.run()
    assert r.requests == 4 and r.stop["kind"] == "request_budget"
    assert len(handler.paths) == 4


def test_gate_denial_is_a_skip_not_a_crash(conn, crawler):
    handler = Recorded()
    c, handler, site_id, code = crawler(handler)
    conn.execute("UPDATE website.assessments SET approved_scope = %s WHERE site_id = %s", (json.dumps({"hosts": [next(iter(c.domain_ids))], "schemes": ["https"], "paths": {"deny": ["/downloads/"]}, "fetchModes": ["http"], "maxRequestsPerSecond": 0.5}), site_id))
    r = c.run()
    assert not any(p.startswith("/downloads") for p in handler.paths)
    assert any("gate denied" in s["why"] and "denied" in s["why"] for s in r.skipped)


def test_untrusted_site_host_is_not_crawled(conn, crawler):
    c, handler, site_id, code = crawler(trusted=([".go.ke"], set()))
    hosts = c.domain_ids
    c.trusted = ([".nowhere"], set())
    r = c.run()
    assert handler.requests == [] and r.pages == 0 and any("neither a trusted" in s["why"] for s in r.skipped)


def test_redirects_go_through_the_policy_again(conn, crawler):
    handler = Recorded(override={"/tenders": lambda request: httpx.Response(302, headers={"location": "https://kenyalaw.org/tenders"})})
    c, handler, site_id, code = crawler(handler)
    r = c.run()
    assert {req.url.host for req in handler.requests} == {next(iter(c.domain_ids))}
    assert any("never crawled" in s["why"] for s in r.skipped)
