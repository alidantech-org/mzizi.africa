"""Streaming downloads: integrity, partial transfers, resume, duplicates, safety."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import httpx
import pytest

from mzizi_fetch.web.download import (
    Downloader,
    DownloadError,
    DownloadPolicy,
    check_destination,
    flags_for,
    safe_name,
    sniff,
)

UA = "Test/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)"
PDF = b"%PDF-1.4\n" + bytes(range(256)) * 400


def downloader(tmp_path: Path, handler, **policy) -> Downloader:
    return Downloader(
        tmp_path,
        UA,
        DownloadPolicy(allow_private=True, chunk_size=4096, **policy),
        transport=httpx.MockTransport(handler),
    )


def serve(request: httpx.Request) -> httpx.Response:
    return httpx.Response(
        200,
        content=PDF,
        headers={
            "content-type": "application/pdf",
            "etag": '"e1"',
            "content-length": str(len(PDF)),
            "content-disposition": 'attachment; filename="../Annual Report.pdf"',
        },
    )


def test_complete_download_is_hashed_typed_private_and_recorded(tmp_path: Path) -> None:
    result = downloader(tmp_path, serve).download("https://files.test/r")
    saved = tmp_path / result.file
    assert saved.read_bytes() == PDF and result.sha256 == hashlib.sha256(PDF).hexdigest()
    assert result.detected_type == "pdf" and not result.flags and result.file.endswith("-Annual_Report.pdf")
    assert oct(saved.stat().st_mode & 0o777) == "0o600" and result.headers["etag"] == '"e1"'
    assert json.loads((tmp_path / f"{result.file}.json").read_text())["final_url"] == "https://files.test/r"
    assert not list(tmp_path.glob("*.part"))


def test_a_truncated_transfer_is_an_error_and_keeps_the_partial_file(tmp_path: Path) -> None:
    def short(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200, content=PDF[:1000], headers={"content-length": str(len(PDF)), "content-type": "application/pdf"}
        )

    # httpx's mock transport raises on a short body; either way the file must not be reported as complete
    with pytest.raises((DownloadError, httpx.HTTPError)):
        downloader(tmp_path, short).download("https://files.test/r")
    assert not [
        p for p in tmp_path.iterdir() if p.suffix == ".json" and not p.name.endswith(("status.json", "part.json"))
    ]


def test_interrupted_download_resumes_with_a_range_request(tmp_path: Path) -> None:
    seen: list[dict[str, str]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(dict(request.headers))
        if "range" in request.headers:
            start = int(request.headers["range"].split("=")[1].rstrip("-"))
            return httpx.Response(
                206,
                content=PDF[start:],
                headers={"content-length": str(len(PDF) - start), "content-type": "application/pdf"},
            )
        return httpx.Response(
            200,
            content=PDF,
            headers={"content-type": "application/pdf", "etag": '"e1"', "content-length": str(len(PDF))},
        )

    url = "https://files.test/r.pdf"
    d = downloader(tmp_path, handler)
    ident = d._ident(url)
    (tmp_path / f"{ident}.part").write_bytes(PDF[:5000])
    (tmp_path / f"{ident}.part.json").write_text(json.dumps({"etag": '"e1"', "last-modified": "", "url": url}))
    result = d.download(url)
    assert result.resumed and (tmp_path / result.file).read_bytes() == PDF
    assert seen[0]["range"] == "bytes=5000-" and seen[0]["if-range"] == '"e1"'


def test_same_content_from_two_urls_is_stored_once(tmp_path: Path) -> None:
    d = downloader(tmp_path, serve)
    first, second = d.download("https://files.test/a"), d.download("https://files.test/b")
    assert second.duplicate_of == first.file and len(list(tmp_path.glob("*.pdf"))) == 1


def test_size_limit_and_error_statuses_are_refused(tmp_path: Path) -> None:
    with pytest.raises(DownloadError) as large:
        downloader(tmp_path, serve, max_bytes=1000).download("https://files.test/r")
    assert large.value.kind == "too_large"
    with pytest.raises(DownloadError) as missing:
        downloader(tmp_path, lambda r: httpx.Response(404)).download("https://files.test/x")
    assert missing.value.kind == "http_404"


def test_download_many_collects_failures_without_raising(tmp_path: Path) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return serve(request) if request.url.path == "/ok" else httpx.Response(500)

    done, failed = downloader(tmp_path, handler, concurrency=2).download_many(
        ["https://files.test/ok", "https://files.test/bad"]
    )
    assert len(done) == 1 and failed[0].kind == "http_500"


def test_destination_checks_and_names() -> None:
    with pytest.raises(DownloadError, match="only http"):
        check_destination("file:///etc/passwd", DownloadPolicy())
    with pytest.raises(DownloadError, match="non-public"):
        check_destination("http://127.0.0.1/x", DownloadPolicy())
    with pytest.raises(DownloadError, match="allowed download hosts"):
        check_destination("https://other.org/x", DownloadPolicy(allowed_hosts=("files.test",), allow_private=True))
    assert safe_name("../../etc/passwd") == "passwd" and safe_name("..hidden") == "hidden" and safe_name("") == "file"


def test_content_type_is_detected_from_bytes_not_names() -> None:
    assert sniff(b"MZ\x90")[1] == "executable" and sniff(b"<!DOCTYPE html>")[0] == "html"
    assert "type mismatch" in flags_for("report.pdf", "application/pdf", "png", "image")[0]
    assert flags_for("sheet.xlsx", "", "zip", "archive") == ()
    assert "HTML although" in flags_for("a.pdf", "text/plain", "html", "web")[1]
