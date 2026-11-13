"""Web core: URLs, source policy, block policy and the HTTP client over a mock transport (no network)."""

from __future__ import annotations

import httpx
import pytest

from mzizi_fetch.web.blocks import BlockKind, BlockPolicy, Response, detect_block
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import Authorization, RobotsMode, SourcePolicy, robots_decision
from mzizi_fetch.web.urls import (
    Deduplicator,
    UrlError,
    UrlKind,
    classify,
    normalize,
    resolve,
    same_origin,
    same_site,
    validate,
)

UA = "Test/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)"


def test_normalize_is_stable_and_does_not_merge_different_resources() -> None:
    assert normalize("HTTPS://Example.ORG:443/a?b=2&a=1#frag") == "https://example.org/a?a=1&b=2"
    assert normalize("https://example.org/a?utm_source=x&id=7") == "https://example.org/a?id=7"
    assert normalize("https://example.org/a") != normalize("https://example.org/a/")
    assert normalize("https://example.org/a?x=1") != normalize("https://example.org/a?x=2")
    assert normalize("https://example.org") == "https://example.org/"


def test_resolve_scope_and_validation() -> None:
    assert resolve("https://a.org/dir/page", "../x#top") == "https://a.org/x"
    assert (
        same_site("www.a.org", "a.org")
        and not same_site("a.org", "docs.a.org")
        and same_site("a.org", "docs.a.org", True)
    )
    assert not same_origin("https://a.org/x", "http://a.org/x") and same_origin(
        "https://a.org/x", "https://a.org:443/y"
    )
    with pytest.raises(UrlError):
        validate("ftp://a.org/x")


def test_classification() -> None:
    assert classify("https://a.org/r.PDF") is UrlKind.DOCUMENT and classify("https://a.org/d.csv") is UrlKind.DOCUMENT
    assert classify("https://a.org/d.geojson") is UrlKind.DATA and classify("https://a.org/x.zip") is UrlKind.ARCHIVE
    assert classify("https://a.org/x.png") is UrlKind.IMAGE and classify("https://a.org/v", "video") is UrlKind.MEDIA
    assert classify("mailto:a@b.org") is UrlKind.MAIL and classify("https://a.org/about") is UrlKind.PAGE


def test_duplicates_are_detected_after_normalisation() -> None:
    seen = Deduplicator()
    assert seen.add("https://a.org/x?b=1&a=2") and not seen.add("https://A.org/x?a=2&b=1#f") and len(seen) == 1


def test_robots_override_needs_an_authorization_scoped_to_hosts() -> None:
    with pytest.raises(ValueError, match="authorization"):
        SourcePolicy(robots_mode=RobotsMode.OVERRIDE).validate_authorization()
    auth = Authorization(reference="SRC-1", hosts=("a.org",), rationale="owner consent on file")
    policy = SourcePolicy(robots_mode=RobotsMode.OVERRIDE, authorization=auth)
    assert robots_decision(policy, "https://a.org/x", "disallowed").allowed
    assert robots_decision(policy, "https://a.org/x", "disallowed").authorization_reference == "SRC-1"
    assert not robots_decision(policy, "https://other.org/x", "disallowed").allowed
    assert not robots_decision(SourcePolicy(), "https://a.org/x", "disallowed").allowed


def test_block_kinds_are_told_apart() -> None:
    assert detect_block(404, {}, b"").kind is BlockKind.NOT_FOUND
    assert detect_block(429, {}, b"").kind is BlockKind.RATE_LIMITED
    assert detect_block(503, {}, b"").kind is BlockKind.SERVER_ERROR
    assert detect_block(403, {}, b"<div class='g-recaptcha'></div>").kind is BlockKind.CAPTCHA
    assert detect_block(200, {"cf-mitigated": "challenge"}, b"").kind is BlockKind.CHALLENGE
    assert detect_block(0, {}, b"", "ConnectTimeout: timeout").kind is BlockKind.TIMEOUT
    assert detect_block(0, {}, b"", "ConnectError: [Errno -2] Name or service not known").kind is BlockKind.DNS
    assert detect_block(200, {}, b"<html>fine</html>") is None


def test_block_policy_decisions_are_configurable_and_recorded() -> None:
    policy = BlockPolicy(max_retries=1, stop_after=3, jitter=False, base_wait=2)
    block = detect_block(429, {"Retry-After": "7"}, b"")
    first = policy.decide("u", block, 0, {"Retry-After": "7"})
    assert first.response == "back_off" and first.wait_seconds == 7
    assert policy.decide("u", block, 1).response == "skip"
    assert policy.decide("u", block, 0).response == "stop"
    assert len(policy.decisions) == 3
    custom = BlockPolicy(responses={BlockKind.FORBIDDEN: Response.HUMAN_REVIEW})
    assert custom.decide("u", detect_block(403, {}, b""), 0).response == "human_review"


def client(handler, **options) -> WebClient:
    sleeps: list[float] = []
    web = WebClient(
        UA,
        options.pop("policy", SourcePolicy(requests_per_second=100)),
        ("a.org",),
        transport=httpx.MockTransport(handler),
        sleep=sleeps.append,
        **options,
    )
    web.slept = sleeps  # type: ignore[attr-defined]
    return web


def robots_then(page):
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/robots.txt":
            return httpx.Response(200, text="User-agent: *\nDisallow: /private\n")
        return page(request)

    return handler


def test_client_get_head_redirect_and_provenance() -> None:
    def page(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/old":
            return httpx.Response(301, headers={"location": "/new"})
        return httpx.Response(200, headers={"content-type": "text/html", "content-length": "5"}, text="hello")

    web = client(robots_then(page))
    response = web.get("https://a.org/old")
    assert (
        response.status == 200
        and response.final_url == "https://a.org/new"
        and response.redirects == ("https://a.org/new",)
    )
    assert response.content_type == "text/html" and response.content_length == 5
    assert web.head("https://a.org/new").status == 200
    assert [p.method for p in web.provenance] == ["GET", "HEAD"] and web.provenance[0].user_agent == UA


def test_client_respects_robots_scope_and_budget() -> None:
    web = client(
        robots_then(lambda r: httpx.Response(200, text="ok")),
        policy=SourcePolicy(max_requests=2, requests_per_second=100, excluded_paths=("/skip",)),
    )
    assert web.get("https://a.org/private/x").refused.reason == "disallowed by robots.txt"
    assert web.get("https://elsewhere.org/").refused.reason.startswith("host elsewhere.org is outside")
    assert web.get("https://a.org/skip/1").refused.reason == "path is excluded"
    assert web.get("https://a.org/ok").usable and web.get("https://a.org/ok2").usable
    assert web.get("https://a.org/ok3").refused.reason.startswith("request budget")
    assert any(not d.allowed for d in web.audit)


def test_conditional_requests_reuse_cached_bodies(tmp_path) -> None:
    calls: list[dict[str, str]] = []

    def page(request: httpx.Request) -> httpx.Response:
        calls.append(dict(request.headers))
        if request.headers.get("if-none-match") == '"v1"':
            return httpx.Response(304)
        return httpx.Response(200, headers={"etag": '"v1"', "content-type": "text/html"}, text="body")

    web = client(robots_then(page), cache_dir=tmp_path)
    assert web.get("https://a.org/p").body == b"body"
    again = web.get("https://a.org/p")
    assert again.from_cache and again.body == b"body" and calls[1]["if-none-match"] == '"v1"'


def test_retries_back_off_with_retry_after_then_succeed() -> None:
    attempts = {"n": 0}

    def page(request: httpx.Request) -> httpx.Response:
        attempts["n"] += 1
        return (
            httpx.Response(429, headers={"retry-after": "3"}) if attempts["n"] < 3 else httpx.Response(200, text="ok")
        )

    web = client(robots_then(page), blocks=BlockPolicy(max_retries=3, jitter=False))
    response = web.get("https://a.org/p")
    assert response.status == 200 and [s for s in web.slept if s >= 1] == [3.0, 3.0] and web.provenance[0].attempts == 3


def test_persistent_block_is_skipped_and_recorded_not_raised() -> None:
    web = client(
        robots_then(lambda r: httpx.Response(403, text="<div class='g-recaptcha'></div>")),
        blocks=BlockPolicy(jitter=False),
    )
    response = web.get("https://a.org/p")
    assert (
        response.block.kind is BlockKind.CAPTCHA
        and response.decision.response == "human_review"
        and not response.usable
    )


def test_rate_limit_spacing_is_applied_and_concurrent_fetch_keeps_order() -> None:
    web = client(
        robots_then(lambda r: httpx.Response(200, text=r.url.path)),
        policy=SourcePolicy(requests_per_second=1, max_concurrency=3),
    )
    results = web.get_many(["https://a.org/1", "https://a.org/2", "https://a.org/3"])
    assert [r.text for r in results] == ["/1", "/2", "/3"] and sum(web.slept) > 0


def test_vocabulary_is_data_and_its_schema_is_in_sync() -> None:
    import json
    from pathlib import Path

    from mzizi_fetch.web.vocabulary import DEFAULT_PATH, Vocabulary, parse_vocabulary, vocabulary

    assert vocabulary().version == 1 and "pdf" in vocabulary().url_kinds.document
    schema = Path(DEFAULT_PATH).parent / "vocabulary.schema.json"
    assert json.loads(schema.read_text()) == json.loads(json.dumps(Vocabulary.model_json_schema(), sort_keys=True))
    assert parse_vocabulary(DEFAULT_PATH.read_text()).file_signatures[0].magic_bytes == b"%PDF"
