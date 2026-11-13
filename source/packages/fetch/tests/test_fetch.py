"""Polite fetching with a mocked transport: gate, identity, rate limit, robots, challenge handling."""

from __future__ import annotations

import httpx
import pytest

from mzizi_fetch import (
    Decision,
    Denied,
    IdentityMissing,
    PoliteFetcher,
    StopRun,
    effective_limits,
    parse_policy,
    resolve_user_agent,
)

UA = "TestBot/1.0 (+https://mzizi.africa/bot; contact@mzizi.africa)"


def fetcher(handler, allow=True, sleeps=None, rps=2.0, challenge_check=None):
    clock = {"t": 0.0}

    def sleep(seconds):
        clock["t"] += seconds
        if sleeps is not None:
            sleeps.append(seconds)

    gate = (
        (lambda request: Decision(allowed=True, assessment_id="a-1", requests_per_second=rps))
        if allow
        else (lambda request: Decision(allowed=False, reasons=["no approved assessment"]))
    )
    return PoliteFetcher(
        user_agent=UA,
        limits=effective_limits(parse_policy({"rate": {"requests_per_second": rps}})),
        gate=gate,
        site_id="site",
        client=httpx.Client(transport=httpx.MockTransport(handler)),
        sleep=sleep,
        clock=lambda: clock["t"],
        challenge_check=challenge_check,
    )


def ok_handler(request: httpx.Request) -> httpx.Response:
    if request.url.path == "/robots.txt":
        return httpx.Response(404)
    assert request.headers["user-agent"] == UA
    return httpx.Response(200, content=b"<html>hello</html>", headers={"content-type": "text/html"})


def test_an_allowed_fetch_sends_the_identified_user_agent_and_returns_the_body():
    result = fetcher(ok_handler).get("https://example.org/page")
    assert result.status == 200 and result.body == b"<html>hello</html>" and result.assessment_id == "a-1"


def test_a_gate_denial_stops_the_request_before_any_network_call():
    calls = []
    with pytest.raises(Denied) as denied:
        fetcher(lambda r: calls.append(r) or httpx.Response(200), allow=False).get("https://example.org/page")
    assert "no approved assessment" in denied.value.reasons and calls == []


def test_requests_to_one_host_are_spaced_by_the_rate_limit():
    sleeps: list[float] = []
    f = fetcher(ok_handler, sleeps=sleeps, rps=1.0)
    f.get("https://example.org/a")
    f.get("https://example.org/b")
    assert any(s > 0 for s in sleeps)


def test_an_access_challenge_stops_the_run_and_nothing_retries_around_it():
    seen = []

    def handler(request):
        seen.append(request.url.path)
        if request.url.path == "/robots.txt":
            return httpx.Response(404)
        return httpx.Response(403, content=b"<html>Just a moment... verify you are human</html>")

    f = fetcher(handler)
    with pytest.raises(StopRun):
        f.get("https://example.org/page")
    assert f.tripped is not None and seen.count("/page") == 1


def test_a_placeholder_or_missing_contact_user_agent_is_refused():
    for value in ("", "bot", "Bot (+https://example.com; me@example.com)", "Bot/1.0 localhost"):
        with pytest.raises(IdentityMissing):
            resolve_user_agent(None, value)
    assert resolve_user_agent(None, UA) == UA


def test_an_injected_challenge_check_stops_a_200_response():
    def handler(request):
        if request.url.path == "/robots.txt":
            return httpx.Response(404)
        return httpx.Response(200, content=b"<html>please verify</html>")

    f = fetcher(handler, challenge_check=lambda status, headers, head: "marker" if b"verify" in head else None)
    with pytest.raises(StopRun):
        f.get("https://example.org/page")
    assert f.tripped is not None and f.tripped.kind == "access_challenge"
