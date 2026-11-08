"""Bounded section crawler and document registry (TSK-C6D4EC067F97).

Data extraction only: it expands the *modelled* content sections of a site (sections.yml rules) through the existing
collection gate, downloads the documents it finds there and registers every file with provenance. It does not interpret
content (that is `semantics.py`) and writes no canonical domain table.

Policy set by the product owner, enforced here and not relaxed by any option:
 - only hosts the gate has an approved scope for, and only trusted `.go.ke` hosts or exact hosts named in
   seed/system/policy/trusted-domains.json (a link to any other host is recorded as skipped, not followed);
 - the gate, robots.txt and the 0.2 requests per second limit apply to every request (the PoliteFetcher does this);
 - depth 2 (home page -> section page -> detail page; files are leaves), pagination bounded per section;
 - file types pdf, xlsx, csv, docx and zip, with a per-file size cap;
 - the run stops for good on an access challenge, 401, 403 or 429. Kenya Law is never crawled: its bot challenge
   is not bypassed, and it is not a host this crawler contacts at all.

Registry: one `source.documents` row per distinct content hash. Each retrieval is a `source.captures` row; each URL a
file was seen at is a `website.document_sightings` row (with the response headers, size and leading section), so the
same bytes seen at two URLs or on two sites are one document with two sightings. A URL already sighted is not fetched
again. Each section page expanded is a `website.section_visits` row.
"""
from __future__ import annotations

import json
import mimetypes
import re
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from urllib.parse import parse_qsl, unquote, urlencode, urljoin, urlparse, urlunparse

import httpx
import psycopg
from bs4 import BeautifulSoup

from .seedroot import SEED_ROOT
from . import register, registry
from .compliance import Denied, StopRun
from .fetch import FetchResult, PoliteFetcher, RobotsDisallowed, TooLarge
from .files import LocalDirectoryStore, sha256
from .probe_domains import POLICY_FILE, is_trusted, load_trusted
from .structure.sections import match_rule, validate_sections

FILE_TYPES = frozenset({"pdf", "xlsx", "csv", "docx", "zip"})
NEVER_CRAWL = ("kenyalaw.org",)  # bot challenge: never contacted by this crawler, never bypassed
SENSITIVE_HEADERS = {"set-cookie", "authorization", "proxy-authorization", "cookie"}
REDIRECTS = (301, 302, 303, 307, 308)
PAGE_EXTENSIONS = {"", "html", "htm", "php", "aspx", "asp", "jsp"}
SEED_FILE = SEED_ROOT / "ke" / "registry" / "ke-site-sections.json"


@dataclass
class CrawlConfig:
    max_depth: int = 2
    max_requests: int = 300  # content requests in one run (robots.txt requests are extra, one per host)
    max_pages_per_section: int = 5  # pagination pages followed per section entry point
    max_documents: int = 500  # new documents registered in one run
    max_file_bytes: int = 25 * 1024 * 1024
    file_types: frozenset[str] = FILE_TYPES
    raw_dir: Path | None = None  # also keep the raw bytes with a provenance file beside each (git-ignored area)


@dataclass
class CrawlReport:
    site: str
    requests: int = 0
    pages: int = 0
    documents_new: int = 0
    documents_duplicate: int = 0  # bytes already held (seen at another URL or on another site)
    documents_known_url: int = 0  # URL already sighted: not fetched again
    skipped: list[dict] = field(default_factory=list)
    errors: list[dict] = field(default_factory=list)
    stop: dict | None = None
    sections: dict[str, dict] = field(default_factory=dict)  # label -> {pages, items}
    statuses: dict[int, int] = field(default_factory=dict)

    def skip(self, url: str, why: str) -> None:
        self.skipped.append({"url": url, "why": why})

    def to_json(self) -> dict:
        return {
            "site": self.site, "requests": self.requests, "pages": self.pages, "documents_new": self.documents_new,
            "documents_duplicate": self.documents_duplicate, "documents_known_url": self.documents_known_url,
            "skipped": len(self.skipped), "errors": len(self.errors), "stop": self.stop, "sections": self.sections, "statuses": self.statuses,
        }


# ---- sections ---------------------------------------------------------------------------------------------------

def load_seed_sections(family_code: str, seed_file: Path = SEED_FILE) -> list[dict]:
    data = json.loads(seed_file.read_text())
    sections = (data.get("families") or {}).get(family_code)
    if sections is None:
        raise LookupError(f"no seeded sections for family {family_code!r} (known: {', '.join(sorted(data.get('families') or {}))})")
    return sections


def sections_for_site(conn: psycopg.Connection, store: LocalDirectoryStore, site_code: str, seed_family: str | None = None) -> tuple[list[dict], str | None, str]:
    """The sections to crawl, the structure version they came from (if any) and where they came from.

    Order: the site's own active structure, its family's active structure, then the custom-prepared seed for the family
    (an unverified hypothesis, labelled as such in the fixture). `seed_family` forces the seed.
    """
    site = registry.site_by_code(conn, site_code)
    families = [r["code"] for r in conn.execute("SELECT f.code FROM website.members m JOIN website.families f ON f.id = m.family_id WHERE m.site_id = %s ORDER BY f.code", (site["id"],)).fetchall()]
    if not seed_family:
        owners = [("site", site["id"], f"site structure of {site_code}")]
        owners += [("family", r["id"], f"family structure of {r['code']}") for r in conn.execute("SELECT f.id::text AS id, f.code FROM website.members m JOIN website.families f ON f.id = m.family_id WHERE m.site_id = %s ORDER BY f.code", (site["id"],)).fetchall()]
        for owner_kind, owner_id, origin in owners:
            version_id = registry.active_version(conn, owner_kind, owner_id)
            if version_id:
                sections = (registry.load_bundle(conn, store, version_id).sections or {}).get("sections") or []
                if sections:
                    return sections, version_id, origin
    for code in [seed_family] if seed_family else families:
        try:
            return load_seed_sections(code), None, f"seed sections of family {code} (custom-prepared, unverified)"
        except LookupError:
            continue
    raise LookupError(f"no sections for {site_code}: no structure with sections.yml and no seeded family sections (pass seed_family)")


# ---- URL handling -----------------------------------------------------------------------------------------------

def normalize(url: str) -> str:
    p = urlparse(url)
    return urlunparse((p.scheme.lower(), p.netloc.lower(), p.path or "/", "", p.query, ""))


def extension(url: str) -> str:
    return PurePosixPath(urlparse(url).path).suffix.lower().lstrip(".")


WPDM_DOWNLOAD = re.compile(r"(?:^|&)wpdmdl=\d+")
GENERIC_LINK_TEXT = {"", "download", "downloads", "read more", "view", "click here", "pdf", "open", "link"}


def is_download_link(url: str, file_types: frozenset[str] | set[str]) -> bool:
    """A link to a file: a known extension, or a WordPress Download Manager package download (`?wpdmdl=<id>`), which names no extension."""
    return extension(url) in file_types or bool(WPDM_DOWNLOAD.search(urlparse(url).query))


def disposition_name(headers: dict) -> str | None:
    """The file name a server states in Content-Disposition (RFC 6266), when it states one."""
    value = next((v for k, v in headers.items() if k.lower() == "content-disposition"), "")
    match = re.search(r"filename\*?=(?:UTF-8'')?\"?([^\";]+)\"?", value, re.I)
    return re.sub(r"[^\w.\-() ]+", "_", unquote(match.group(1)))[:150] if match else None


def file_name(url: str, fallback: str = "index") -> str:
    name = PurePosixPath(urlparse(url).path).name
    return re.sub(r"[^\w.\-() ]+", "_", name)[:150] or fallback


def with_page(url: str, param: str, number: int) -> str:
    p = urlparse(url)
    query = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if k != param] + [(param, str(number))]
    return urlunparse((p.scheme, p.netloc, p.path, p.params, urlencode(query), ""))


def page_number(url: str, param: str) -> int | None:
    value = dict(parse_qsl(urlparse(url).query)).get(param)
    return int(value) if value and value.isdigit() else None


def extract_links(html: bytes, base: str) -> list[tuple[str, str, bool]]:
    """(absolute url, link text, is a next-page link) for each anchor."""
    soup = BeautifulSoup(html, "lxml")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        absolute = urljoin(base, href)
        if urlparse(absolute).scheme not in ("http", "https"):
            continue
        text = a.get_text(" ", strip=True)
        is_next = "next" in [str(r).lower() for r in (a.get("rel") or [])] or text.lower() in ("next", "next »", "»", "›", "older")
        links.append((absolute, text, is_next))
    # WordPress Download Manager buttons are `<a href="#" onclick="location.href='…?wpdmdl=<id>'">`: the file link is in the handler
    for tag in soup.find_all(attrs={"onclick": True}):
        match = re.search(r"location\.href\s*=\s*['\"]([^'\"]*[?&]wpdmdl=\d+[^'\"]*)['\"]", str(tag["onclick"]))
        if match and urlparse(urljoin(base, match.group(1))).scheme in ("http", "https"):
            links.append((urljoin(base, match.group(1)), tag.get_text(" ", strip=True), False))
    for tag in soup.find_all(attrs={"data-downloadurl": True}):  # Download Manager variant: the link is in a data attribute
        value = str(tag["data-downloadurl"]).strip()
        if WPDM_DOWNLOAD.search(urlparse(value).query) and urlparse(urljoin(base, value)).scheme in ("http", "https"):
            links.append((urljoin(base, value), tag.get_text(" ", strip=True), False))
    return links


@dataclass
class _Task:
    url: str
    depth: int
    label: str | None = None
    rule_index: int | None = None
    page_no: int = 1
    referrer: str | None = None
    text: str | None = None


# ---- crawler ----------------------------------------------------------------------------------------------------

class SectionCrawler:
    def __init__(self, conn: psycopg.Connection, store: LocalDirectoryStore, fetcher: PoliteFetcher, site_code: str, sections: list[dict], structure_version_id: str | None = None, config: CrawlConfig | None = None, trusted: tuple[list[str], set[str]] | None = None, log=None):
        self.conn, self.store, self.fetcher = conn, store, fetcher
        self.cfg = config or CrawlConfig()
        errors = validate_sections({"sections": sections})
        if errors:
            raise ValueError("invalid sections: " + "; ".join(errors))
        self.sections = sections
        self.site = registry.site_by_code(conn, site_code)
        self.version_id = structure_version_id
        self.trusted = trusted or load_trusted(POLICY_FILE)
        self.report = CrawlReport(site_code)
        self.log = log or (lambda message: None)
        self.domain_ids = {d["hostname"]: d["id"] for d in registry.domains_in_order(conn, self.site["id"])}
        self.hosts = set(self.domain_ids)
        self._rule_index = {(s["label"], r["pattern"]): i for s in sections for i, r in enumerate(s["rules"])}
        self._seen: set[str] = set()
        self._publisher: str | None = None

    # -- host and URL policy --
    def host_ok(self, url: str, for_page: bool) -> str | None:
        """None when the crawler may request `url`; otherwise the reason it may not."""
        host = (urlparse(url).hostname or "").lower()
        if any(host == n or host.endswith("." + n) for n in NEVER_CRAWL):
            return "host is never crawled (its access challenge is not bypassed)"
        if not is_trusted(host, *self.trusted):
            return "host is neither a trusted .go.ke host nor a named exact host"
        if for_page and host not in self.hosts:
            return "page is on a host that is not a domain of this site"
        return None

    def _rule_for(self, path: str) -> tuple[str, int | None] | None:
        m = match_rule(self.sections, path)
        return (m["label"], self._rule_index.get((m["label"], m["rule"]["pattern"]))) if m else None

    def _pager(self, label: str | None) -> dict:
        return next((s.get("paginate") or {} for s in self.sections if s["label"] == label), {}) if label else {}

    def _page_limit(self, label: str | None) -> int:
        return min(self.cfg.max_pages_per_section, self._pager(label).get("max_pages") or self.cfg.max_pages_per_section)

    # -- fetching through the gate --
    def _get(self, url: str) -> FetchResult | None:
        for _hop in range(4):
            reason = self.host_ok(url, for_page=False)
            if reason:
                self.report.skip(url, reason)
                return None
            if self.report.requests >= self.cfg.max_requests:
                self.report.stop = self.report.stop or {"kind": "request_budget", "message": f"{self.cfg.max_requests} requests used"}
                return None
            self.report.requests += 1
            try:
                result = self.fetcher.get(url)
            except StopRun as stop:
                self.report.stop = {"kind": stop.kind, "message": str(stop)[:300], "url": url}
                self.log(f"STOP {stop.kind}: {stop}")
                return None
            except Denied as denied:
                self.report.skip(url, "gate denied: " + "; ".join(denied.reasons)[:200])
                return None
            except RobotsDisallowed:
                self.report.skip(url, "robots.txt disallows")
                return None
            except TooLarge as error:
                self.report.skip(url, f"size cap: {error}")
                return None
            except (httpx.HTTPError, OSError) as error:
                self.report.errors.append({"url": url, "error": f"{type(error).__name__}: {error}"[:200]})
                return None
            self.report.statuses[result.status] = self.report.statuses.get(result.status, 0) + 1
            if result.status in REDIRECTS:
                location = next((v for k, v in result.headers.items() if k.lower() == "location"), None)
                if not location:
                    return result
                url = urljoin(url, location)  # the next hop goes through the host policy and the gate again
                continue
            result.url = url
            return result
        self.report.skip(url, "too many redirects")
        return None

    # -- registry --
    def publisher(self) -> str:
        if not self._publisher:
            self._publisher = register.ensure_publisher(self.conn, self.site["code"], self.site["name"], "institution", self.site["jurisdiction_id"])
        return self._publisher

    def known_url(self, url: str) -> bool:
        return self.conn.execute("SELECT 1 FROM website.document_sightings WHERE url = %s LIMIT 1", (url[:1000],)).fetchone() is not None

    def register_file(self, task: _Task, result: FetchResult) -> str:
        """Registers one downloaded file; returns `new` (first time these bytes were seen) or `duplicate`."""
        body, url = result.body, result.url
        digest = sha256(body)
        headers = {k.lower(): v for k, v in result.headers.items() if k.lower() not in SENSITIVE_HEADERS}
        now = datetime.now(timezone.utc)
        mime = (headers.get("content-type") or mimetypes.guess_type(url)[0] or "application/octet-stream").split(";")[0].strip()
        name = disposition_name(headers) or file_name(url)
        held = self.conn.execute("SELECT document_id::text AS document_id, file_version_id::text AS fv FROM source.captures WHERE content_hash = %s ORDER BY retrieved_at LIMIT 1", (digest,)).fetchone()
        if held:
            document_id, file_version_id, outcome = held["document_id"], held["fv"], "duplicate"
        else:
            title = (task.text if (task.text or "").strip().lower() not in GENERIC_LINK_TEXT else name).strip()[:300] or name
            kind = "dataset" if extension(url) in ("csv", "xlsx") else "archival_record"  # provisional; semantics.py decides what it is
            document_id = register.ensure_document(self.conn, register.DocumentSpec(self.publisher(), title, kind, url[:1000], jurisdiction_id=self.site["jurisdiction_id"], site_id=self.site["id"]))
            ref = self.store.put(body, f"{digest[:12]}-{name}", f"/crawl/{self.site['code'].replace('/', '-')}", mime_type=mime, note=f"crawled from {url}"[:500])
            file_version_id, outcome = ref.version_id, "new"
            if self.cfg.raw_dir:
                self._write_raw(body, digest, url, task, headers, now, result.assessment_id, name)
        capture_id = register.record_capture(self.conn, document_id, file_version_id, digest, url[:1000], "mzizi-data crawl-sections", result.status, now, self.site["id"], self.domain_ids.get(urlparse(url).hostname or ""), self.version_id, None, result.assessment_id)
        self.conn.execute(
            """INSERT INTO website.document_sightings (site_id, document_id, capture_id, structure_version_id, url, page_url, content_hash, size_bytes, http_status, headers, section_label, rule_index, depth, seen_at, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now(), now(), 1)
               ON CONFLICT (url, content_hash) DO UPDATE SET seen_at = EXCLUDED.seen_at, capture_id = EXCLUDED.capture_id, updated_at = now()""",
            (self.site["id"], document_id, capture_id, self.version_id, url[:1000], task.referrer[:1000] if task.referrer else None, digest, len(body), result.status, json.dumps(headers), task.label, task.rule_index, task.depth, now),
        )
        return outcome

    def _write_raw(self, body: bytes, digest: str, url: str, task: _Task, headers: dict, now: datetime, assessment_id: str | None, name: str | None = None) -> None:
        target = Path(self.cfg.raw_dir)  # type: ignore[arg-type]
        target.mkdir(parents=True, exist_ok=True)
        saved = target / f"{digest[:12]}-{name or file_name(url)}"
        if not saved.exists():
            saved.write_bytes(body)
        saved.with_name(saved.name + ".provenance.json").write_text(json.dumps({
            "url": url, "site": self.site["code"], "sha256": digest, "bytes": len(body), "headers": headers, "retrieved_at": now.isoformat(),
            "section": task.label, "rule_index": task.rule_index, "page": task.referrer, "depth": task.depth, "assessment_id": assessment_id, "user_agent": self.fetcher.user_agent,
        }, indent=2))

    def record_visit(self, task: _Task, found: int) -> None:
        self.conn.execute(
            """INSERT INTO website.section_visits (site_id, structure_version_id, section_label, rule_index, page_url, depth, visited_at, items_found, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, now(), %s, now(), now(), 1)""",
            (self.site["id"], self.version_id, task.label, task.rule_index, task.url[:1000], task.depth, found),
        )

    # -- the crawl --
    def run(self) -> CrawlReport:
        queue: deque[_Task] = deque()
        primary = next(iter(self.domain_ids), None)
        if not primary:
            self.report.skip("", "the site has no usable domain")
            return self.report
        base = f"https://{primary}"
        queue.append(_Task(base + "/", 0))
        for section in self.sections:
            for i, rule in enumerate(section["rules"]):
                if rule["kind"] == "exact":
                    queue.append(_Task(base + rule["pattern"], 1, section["label"], i))
        while queue and not self.report.stop:
            task = queue.popleft()
            key = normalize(task.url)
            if key in self._seen:
                continue
            self._seen.add(key)
            reason = self.host_ok(task.url, for_page=True)
            if reason:
                self.report.skip(task.url, reason)
                continue
            result = self._get(task.url)
            if result is None:
                continue
            if result.status != 200:
                self.report.skip(task.url, f"answered {result.status}")
                continue
            ctype = next((v for k, v in result.headers.items() if k.lower() == "content-type"), "")
            if ctype and "html" not in ctype.lower():
                self.report.skip(task.url, f"not an HTML page ({ctype.split(';')[0]})")
                continue
            self.report.pages += 1
            self._expand_page(task, result, queue)
            self.conn.commit()
        self.conn.commit()
        return self.report

    def _expand_page(self, task: _Task, page: FetchResult, queue: deque[_Task]) -> None:
        docs: dict[str, tuple[str, str]] = {}
        children: list[_Task] = []
        here = urlparse(task.url).path.rstrip("/")
        pager = self._pager(task.label)
        next_numbered = False
        for url, text, is_next in extract_links(page.body, page.url):
            ext = extension(url)
            if is_download_link(url, self.cfg.file_types):
                docs.setdefault(normalize(url), (url, text))
                continue
            if ext not in PAGE_EXTENSIONS or (urlparse(url).hostname or "").lower() not in self.hosts:
                continue  # another file type outside the policy, or another site
            path = urlparse(url).path or "/"
            if task.label:
                numbered = bool(pager.get("param")) and page_number(url, pager["param"]) is not None and path.rstrip("/") == here
                if is_next or numbered:
                    if task.page_no < self._page_limit(task.label):
                        children.append(_Task(url, task.depth, task.label, task.rule_index, task.page_no + 1, page.url))
                        next_numbered = next_numbered or numbered
                    continue
                if task.depth < self.cfg.max_depth and path.startswith(here + "/"):
                    children.append(_Task(url, task.depth + 1, task.label, task.rule_index, 1, page.url))
                    continue
            if task.depth < self.cfg.max_depth:
                match = self._rule_for(path)
                if match:
                    children.append(_Task(url, task.depth + 1, match[0], match[1], 1, page.url))
        # a pagination hint with no visible next link: try the next numbered page once this one yielded something
        if pager.get("param") and docs and not any(c.page_no > task.page_no for c in children) and task.page_no < self._page_limit(task.label):
            current = page_number(task.url, pager["param"]) or pager.get("start", 1)
            children.append(_Task(with_page(task.url, pager["param"], current + 1), task.depth, task.label, task.rule_index, task.page_no + 1, page.url))
        for url, text in docs.values():
            label, rule_index = task.label, task.rule_index
            if label is None:
                label, rule_index = self._rule_for(urlparse(url).path or "/") or (None, None)
            self._take_document(_Task(url, task.depth, label, rule_index, 1, page.url, text))
            if self.report.stop or self.report.documents_new >= self.cfg.max_documents:
                break
        if task.label:
            self.record_visit(task, len(docs))
            stats = self.report.sections.setdefault(task.label, {"pages": 0, "items": 0})
            stats["pages"] += 1
            stats["items"] += len(docs)
        queue.extendleft(reversed(children))  # depth-first keeps a section's pages together

    def _take_document(self, task: _Task) -> None:
        reason = self.host_ok(task.url, for_page=False)
        if reason:
            self.report.skip(task.url, reason)
            return
        if self.known_url(task.url):
            self.report.documents_known_url += 1
            return
        result = self._get(task.url)
        if result is None:
            return
        if result.status != 200:
            self.report.skip(task.url, f"answered {result.status}")
            return
        if len(result.body) > self.cfg.max_file_bytes:
            self.report.skip(task.url, f"size cap: {len(result.body)} bytes")
            return
        if extension(task.url) not in self.cfg.file_types and "html" in next((v for k, v in result.headers.items() if k.lower() == "content-type"), "").lower():
            self.report.skip(task.url, "download link answered with a web page, not a file")
            return
        if self.register_file(task, result) == "new":
            self.report.documents_new += 1
        else:
            self.report.documents_duplicate += 1
        self.conn.commit()


def crawl_site(conn: psycopg.Connection, store: LocalDirectoryStore, make_fetcher, site_code: str, config: CrawlConfig | None = None, seed_family: str | None = None, log=None) -> CrawlReport:
    """Crawls one site's modelled sections. `make_fetcher(conn, site_id, policy)` is `fetch.live_fetcher` in production."""
    cfg = config or CrawlConfig()
    sections, version_id, origin = sections_for_site(conn, store, site_code, seed_family)
    site = registry.site_by_code(conn, site_code)
    fetcher = make_fetcher(conn, site["id"], {"rate": {"requests_per_second": 0.2}, "limits": {"max_response_bytes": cfg.max_file_bytes}})
    if log:
        log(f"{site_code}: sections from {origin}")
    return SectionCrawler(conn, store, fetcher, site_code, sections, version_id, cfg, log=log).run()
