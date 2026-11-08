"""Deterministic structure runner: discover, fetch, preserve, extract, map to candidates.

No model runs here. Every page is preserved before it is read (raw evidence first), every request
passes the collection gate through the PoliteFetcher, drift is detected against the module's
`expect` block and stops the module instead of guessing, and nothing but staging rows is written
for the data itself.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlencode, urljoin

import psycopg

from . import candidates as candidates_mod
from . import extractors, incidents, pipeline, register
from .compliance import Denied, StopRun
from .fetch import PoliteFetcher, RobotsDisallowed, TooLarge
from .files import LocalDirectoryStore
from .structure import extract, selectors
from .structure.bundle import Bundle
from .structure.effective import effective_modules, substitute

RUNNER_VERSION = "0.1.0"
MAX_PAGES_CEILING = 100


@dataclass
class SiteContext:
    conn: psycopg.Connection
    store: LocalDirectoryStore
    site_id: str
    site_code: str
    publisher_id: str
    bundle: Bundle
    fetcher: PoliteFetcher
    structure_version_id: str | None = None
    family: Bundle | None = None
    family_version_id: str | None = None
    domains: list[dict] = field(default_factory=list)
    variables: dict[str, Any] = field(default_factory=dict)
    jurisdiction_id: str | None = None
    allowed_categories: list[str] = field(default_factory=lambda: ["none_known"])


@dataclass
class ModuleReport:
    module: str
    pages: int = 0
    items: int = 0
    records: int = 0
    created: int = 0
    unchanged: int = 0
    quarantined: int = 0
    invalid: int = 0
    selector: int = -1
    status: str = "completed"
    stopped: str | None = None
    notes: list[str] = field(default_factory=list)


def _page_url(base: str, template: str, query: dict[str, Any], page_param: str | None, page: int | None) -> str:
    q = dict(query)
    if page_param and page is not None:
        q[page_param] = page
    url = urljoin(base, template)
    return f"{url}{'&' if '?' in url else '?'}{urlencode(q)}" if q else url


def _mark(ctx: SiteContext, status: str, outcome: str, detail: dict) -> None:
    incidents.record_check(ctx.conn, ctx.site_id, "drift" if outcome != "ok" else "fit", outcome, detail, ctx.structure_version_id)
    if status:
        ctx.conn.execute("UPDATE website.sites SET status = %s, updated_at = now() WHERE id = %s", (status, ctx.site_id))


def run_module(ctx: SiteContext, name: str) -> ModuleReport:
    modules = effective_modules(ctx.bundle, ctx.family)
    if name not in modules:
        raise KeyError(f"module {name!r} is not in the effective structure")
    module = substitute(modules[name], {**ctx.variables, **(ctx.bundle.manifest.get("vars") or {})})
    mappings = [m for m in ctx.bundle.mappings.values() if m["module"] == name] or [m for m in (ctx.family.mappings.values() if ctx.family else []) if m["module"] == name]
    report = ModuleReport(name)
    discover = module["discover"]
    kind = "listing" if "listing" in discover else "api"
    if kind not in discover:
        report.status, report.stopped = "unsupported", "only listing and api discovery are supported by this runner version"
        return report
    spec = discover[kind]
    pagination = spec.get("paginate") or {"type": "none"}
    if pagination["type"] == "path":
        report.status, report.stopped = "unsupported", "path pagination is not supported by this runner version"
        return report
    max_pages = min(int(pagination.get("max_pages", 5 if pagination["type"] != "none" else 1)), MAX_PAGES_CEILING)

    domain = ctx.domains[0] if ctx.domains else None
    if domain is None:
        report.status, report.stopped = "stopped", "the site has no valid primary, alias or mirror domain"
        return report
    base = f"{domain['scheme']}://{domain['hostname']}"
    expect = module.get("expect", {})
    records: list[tuple[str, dict]] = []
    first_selector, page = None, int(pagination.get("start", 1))
    url: str | None = _page_url(base, spec["url"], spec.get("query", {}), pagination.get("param") if pagination["type"] == "query" else None, page if pagination["type"] == "query" else None)

    try:
        while url and report.pages < max_pages:
            result = ctx.fetcher.get(url)
            if 300 <= result.status < 400:
                # Redirects are never followed silently: the content may have moved or the domain changed hands.
                location = result.headers.get("location", "")
                _mark(ctx, "degraded", "degraded", {"type": "redirect", "module": name, "url": url, "status": result.status, "location": location})
                report.status, report.stopped = "drift", f"{url} redirected ({result.status}) to {location or 'an unknown location'}"
                ctx.conn.commit()
                return report
            report.pages += 1
            doc = register.DocumentSpec(ctx.publisher_id, f"{ctx.site_code} {name} page {report.pages}", "official_website", url=url, jurisdiction_id=ctx.jurisdiction_id, site_id=ctx.site_id)
            _, capture_id, ref = pipeline.ingest(
                ctx.conn, ctx.store, result.body, f"{name}-page-{report.pages}.{'json' if kind == 'api' else 'html'}", doc, url=url, tool=f"mzizi-structure-runner/{RUNNER_VERSION}",
                mime_type="application/json" if kind == "api" else "text/html", http_status=result.status, site_id=ctx.site_id, domain_id=domain["id"],
                structure_version_id=ctx.structure_version_id, family_version_id=ctx.family_version_id, assessment_id=result.assessment_id,
            )
            match = extract.discover_items(result.body if kind == "api" else result.body.decode("utf-8", errors="ignore"), module)
            if first_selector is None:
                first_selector = match.selector_index
                report.selector = match.selector_index
            report.items += len(match.items)
            extracted = [extract.extract_item(item, module["extract"]["fields"]) for item in match.items]
            # fields tagged label:url become absolute against the page they were read from, so keys are unique across sites
            url_fields = [f for f, fs in module["extract"]["fields"].items() if "label:url" in (fs.get("tags") or [])]
            for rec, _ in extracted:
                for f in url_fields:
                    if isinstance(rec.get(f), str):
                        rec[f] = urljoin(url, rec[f])
            segments = [{"key": f"p{report.pages}-i{i}", "kind": "record", "locator": json.dumps({"page": report.pages, "item": i}), "content": json.dumps(rec, default=str, ensure_ascii=False)} for i, (rec, _) in enumerate(extracted)]
            diagnostics = [{"level": "info", "code": "items", "message": f"{len(match.items)} items via selector {match.selector_index}"}] + [{"level": "warning", "code": "field_error", "message": e, "locator": json.dumps({"page": report.pages, "item": i})} for i, (_, errs) in enumerate(extracted) for e in errs]
            now = datetime.now(timezone.utc)
            res, stored = pipeline.store_result(ctx.store, ref, "structure-run", RUNNER_VERSION, name, "succeeded" if match.items else "partial", segments, diagnostics, now, now, capture_id, None, {"module": name, "url": url}, ctx.structure_version_id)

            if report.pages == 1:
                problem = None
                if "min_items" in expect and len(match.items) < expect["min_items"]:
                    problem = f"expected at least {expect['min_items']} items, found {len(match.items)}"
                else:
                    for required in expect.get("required_fields", []):
                        empty = sum(1 for rec, _ in extracted if rec.get(required) in (None, ""))
                        if match.items and empty:
                            problem = f"required field {required!r} is empty in {empty} of {len(extracted)} items"
                            break
                if problem:
                    _mark(ctx, "degraded", "degraded", {"type": "structure", "module": name, "problem": problem, "url": url, "selector": match.selector_index})
                    report.status, report.stopped = "drift", problem
                    return report
                if match.selector_index > 0:
                    incidents.record_check(ctx.conn, ctx.site_id, "fit", "degraded", {"type": "fallback_selector", "module": name, "selector": match.selector_index}, ctx.structure_version_id)
                    report.notes.append(f"fallback selector {match.selector_index} was used")

            for index, (rec, _) in enumerate(extracted):
                records.append((f"p{report.pages}-i{index}", rec))
            report.records += len(extracted)
            for mapping in mappings:
                run_id = candidates_mod.create_run(ctx.conn, f"{ctx.site_code}/{name}", f"{ctx.bundle.manifest_hash()[:12]}", capture_id, str(res.id))
                stats = candidates_mod.add_candidates(
                    ctx.conn, run_id, mapping, [(f"p{report.pages}-i{i}", rec) for i, (rec, _) in enumerate(extracted)], str(res.id), ctx.allowed_categories,
                    (ctx.bundle.manifest["policy"].get("data") or {}).get("excluded_categories", []),
                )
                candidates_mod.finish_run(ctx.conn, run_id)
                report.created += stats.created
                report.unchanged += stats.unchanged
                report.quarantined += stats.quarantined
                report.invalid += stats.invalid

            ctx.conn.commit()  # each page is durable on its own: raw evidence survives a later stop
            if not match.items and pagination.get("stop_when", "empty_items") == "empty_items":
                break
            if pagination["type"] == "query":
                page += 1
                url = _page_url(base, spec["url"], spec.get("query", {}), pagination.get("param"), page)
            elif pagination["type"] == "next_link" and pagination.get("next"):
                nxt = selectors.select(result.body.decode("utf-8", errors="ignore"), pagination["next"])
                href = nxt.items[0].get("href") if nxt.items and hasattr(nxt.items[0], "get") else (nxt.items[0] if nxt.items else None)
                url = urljoin(url, href) if href else None
            else:
                url = None
        ctx.conn.commit()
    except StopRun as stop:
        ctx.conn.rollback()
        incidents.stop_collection(ctx.conn, ctx.site_id, str(stop), kind=stop.kind)
        ctx.conn.commit()
        report.status, report.stopped = "stopped", f"{stop.kind}: {stop}"
    except Denied as denied:
        ctx.conn.rollback()
        report.status, report.stopped = "denied", "; ".join(denied.reasons)
    except RobotsDisallowed as robots:
        ctx.conn.rollback()
        report.status, report.stopped = "robots", f"robots.txt disallows {robots}"
    except TooLarge as large:
        ctx.conn.rollback()
        report.status, report.stopped = "too_large", str(large)
    return report


def build_context(conn: psycopg.Connection, store: LocalDirectoryStore, site_code: str, fetcher_factory, publisher_code: str | None = None, publisher_name: str | None = None) -> SiteContext:
    """Loads the site's active structure (and its family base) from the registry and resolves its current domains."""
    from . import registry

    site = registry.site_by_code(conn, site_code)
    version_id = registry.active_version(conn, "site", site["id"])
    if version_id is None:
        raise LookupError(f"site {site_code} has no active structure version")
    bundle = registry.load_bundle(conn, store, version_id)
    family, family_version_id = None, None
    extends = bundle.manifest.get("extends")
    if extends:
        fam = conn.execute("SELECT id::text AS id FROM website.families WHERE code = %s", (extends["family"],)).fetchone()
        if not fam:
            raise LookupError(f"unknown family {extends['family']}")
        family_version_id = registry.active_version(conn, "family", fam["id"])
        if family_version_id is None:
            raise LookupError(f"family {extends['family']} has no active structure version")
        family = registry.load_bundle(conn, store, family_version_id)
    publisher = publisher_code or site_code
    publisher_id = register.ensure_publisher(conn, publisher, publisher_name or site["name"], jurisdiction_id=site["jurisdiction_id"])
    assessment = conn.execute("SELECT personal_data_categories FROM website.assessments WHERE site_id = %s AND is_current", (site["id"],)).fetchone()
    allowed = json.loads(assessment["personal_data_categories"]) if assessment else ["none_known"]
    ctx = SiteContext(conn, store, site["id"], site_code, publisher_id, bundle, None, version_id, family, family_version_id, registry.domains_in_order(conn, site["id"]), registry.subject_vars(conn, site["id"]), site["jurisdiction_id"], allowed)
    ctx.fetcher = fetcher_factory(site["id"], bundle.manifest["policy"], bundle.manifest.get("fetch", {}).get("mode", "http"))
    return ctx
