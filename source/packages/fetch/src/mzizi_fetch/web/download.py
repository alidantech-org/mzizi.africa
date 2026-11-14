"""Safe streaming downloads into a quarantine folder.

Bodies stream to a `.part` file in chunks; nothing is held in memory or opened. A transfer is complete only when the
received size matches the declared one, and an incomplete transfer is kept as a `.part` file (with the validators
needed to resume it) and reported as a failure, never as a success. Hosts resolving to private or local addresses are
refused unless the policy allows them. Only the gap between chunks is timed out, so slow or large files may take as
long as they need.
"""

from __future__ import annotations

import hashlib
import ipaddress
import json
import os
import socket
import time
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from email.message import Message
from pathlib import Path
from urllib.parse import urljoin, urlparse

import httpx

from mzizi_fetch.models import Frozen
from mzizi_fetch.web.urls import host_of
from mzizi_fetch.web.vocabulary import vocabulary

MAX_REDIRECTS = 5
MAX_NAME = 100
STATUS_EVERY = 1.0


class DownloadError(RuntimeError):
    """A download failed; `kind` names why, and a `.part` file may remain for a later resume."""

    def __init__(self, kind: str, message: str) -> None:
        super().__init__(message)
        self.kind = kind


class DownloadPolicy(Frozen):
    allowed_hosts: tuple[str, ...] = ()  # empty: any public host
    allow_private: bool = False
    max_bytes: int = 4 * 1024 * 1024 * 1024
    chunk_size: int = 64 * 1024
    connect_timeout: float = 15.0
    idle_timeout: float = 90.0
    limit_rate: int = 0  # bytes per second; 0 is unlimited
    concurrency: int = 2
    max_files: int = 1000


class DownloadResult(Frozen):
    url: str
    final_url: str
    file: str
    size: int
    sha256: str
    declared_type: str
    detected_type: str
    flags: tuple[str, ...]
    seconds: float
    resumed: bool
    duplicate_of: str | None
    headers: dict[str, str]


class DownloadFailure(Frozen):
    url: str
    kind: str
    message: str
    partial_bytes: int


type Progress = Callable[[str, int, int | None], None]


def check_destination(url: str, policy: DownloadPolicy) -> None:
    """Refuses non-http(s) URLs, hosts outside `allowed_hosts` and hosts that resolve to non-public addresses."""
    parts = urlparse(url)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise DownloadError("refused", f"only http and https URLs are downloaded, got {url!r}")
    host = host_of(url)
    if policy.allowed_hosts and not any(host == h or host.endswith("." + h) for h in policy.allowed_hosts):
        raise DownloadError("refused", f"{host} is not in the allowed download hosts")
    if policy.allow_private:
        return
    try:
        infos = socket.getaddrinfo(parts.hostname, parts.port or 443, proto=socket.IPPROTO_TCP)
    except socket.gaierror as problem:
        raise DownloadError("dns", f"{host} did not resolve: {problem}") from problem
    for info in infos:
        address = ipaddress.ip_address(info[4][0])
        if (
            address.is_private
            or address.is_loopback
            or address.is_link_local
            or address.is_reserved
            or address.is_multicast
            or address.is_unspecified
        ):
            raise DownloadError("refused", f"{host} resolves to a non-public address ({address})")


def safe_name(raw: str) -> str:
    """A bare file name: no directories, no leading dots, only letters, digits, `.`, `_` and `-`."""
    leaf = raw.replace("\\", "/").rsplit("/", 1)[-1]
    cleaned = "".join(c if c.isalnum() or c in "._-" else "_" for c in leaf).lstrip(".")
    return (cleaned or "file")[:MAX_NAME]


def _filename(response: httpx.Response, url: str) -> str:
    disposition = response.headers.get("content-disposition", "")
    if disposition:
        message = Message()
        message["content-disposition"] = disposition
        if message.get_filename():
            return safe_name(message.get_filename() or "")
    return safe_name(urlparse(str(response.url)).path.rsplit("/", 1)[-1] or host_of(url))


def sniff(head: bytes) -> tuple[str, str]:
    """The real type of a file from its first bytes: (name, group)."""
    for signature in vocabulary().file_signatures:
        probe = head.lstrip().lower() if signature.text else head
        if probe.startswith(signature.magic_bytes.lower() if signature.text else signature.magic_bytes):
            return signature.name, signature.group
    return "unknown", "unknown"


def flags_for(name: str, declared: str, detected: str, group: str) -> tuple[str, ...]:
    words = vocabulary()
    flags: list[str] = []
    if group in words.risky_groups and detected != "zip":
        flags.append(f"{group}: do not open or run without inspection")
    extension = name.rsplit(".", 1)[-1].lower() if "." in name else ""
    expected = {detected}
    if detected == "zip":
        expected |= set(words.zip_based_extensions)
    if detected == "jpg":
        expected |= set(words.jpeg_extensions)
    if group != "unknown" and extension not in expected and detected != "gzip":
        flags.append(f"type mismatch: named .{extension or '(none)'}, content looks like {detected}")
    if group == "web" and not declared.startswith("text/html"):
        flags.append("content is HTML although a file was expected (login or error page?)")
    return tuple(flags)


class Downloader:
    def __init__(
        self,
        destination: Path,
        user_agent: str,
        policy: DownloadPolicy | None = None,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        self.destination = destination
        self.policy = policy or DownloadPolicy()
        self.destination.mkdir(parents=True, exist_ok=True)
        timeout = httpx.Timeout(
            connect=self.policy.connect_timeout,
            read=self.policy.idle_timeout,
            write=self.policy.idle_timeout,
            pool=self.policy.connect_timeout,
        )
        self.client = httpx.Client(
            follow_redirects=False, timeout=timeout, headers={"User-Agent": user_agent}, transport=transport
        )
        self._count = 0

    def _ident(self, url: str) -> str:
        return hashlib.sha256(url.encode()).hexdigest()[:12]

    def _known_hashes(self) -> dict[str, str]:
        found: dict[str, str] = {}
        for sidecar in self.destination.glob("*.json"):
            if sidecar.name.endswith(".status.json") or sidecar.name.endswith(".part.json"):
                continue
            try:
                data = json.loads(sidecar.read_text(encoding="utf-8"))
                found[data["sha256"]] = data["file"]
            except (OSError, ValueError, KeyError):
                continue
        return found

    def download(self, url: str, on_progress: Progress | None = None) -> DownloadResult:
        if self._count >= self.policy.max_files:
            raise DownloadError("limit", f"download limit of {self.policy.max_files} files reached")
        self._count += 1
        ident = self._ident(url)
        part, meta = self.destination / f"{ident}.part", self.destination / f"{ident}.part.json"
        status = self.destination / f"{ident}.status.json"
        started = time.monotonic()
        current = url
        for _ in range(MAX_REDIRECTS + 1):
            check_destination(current, self.policy)
            offset = part.stat().st_size if part.exists() else 0
            request_headers: dict[str, str] = {}
            if offset:
                validators = json.loads(meta.read_text()) if meta.exists() else {}
                request_headers["Range"] = f"bytes={offset}-"
                if validators.get("etag") or validators.get("last-modified"):
                    request_headers["If-Range"] = validators.get("etag") or validators["last-modified"]
            try:
                with self.client.stream("GET", current, headers=request_headers) as response:
                    if response.is_redirect and response.headers.get("location"):
                        current = urljoin(current, response.headers["location"])
                        continue
                    return self._finish(url, current, response, part, meta, status, offset, started, on_progress)
            except httpx.HTTPError as problem:
                raise DownloadError("transport", f"{type(problem).__name__}: {str(problem)[:150]}") from problem
        raise DownloadError("redirects", "too many redirects")

    def _finish(
        self,
        url: str,
        current: str,
        response: httpx.Response,
        part: Path,
        meta: Path,
        status: Path,
        offset: int,
        started: float,
        on_progress: Progress | None,
    ) -> DownloadResult:
        if response.status_code == 416 and part.exists():
            part.unlink()
            meta.unlink(missing_ok=True)
            raise DownloadError("restart", "the server could not resume; retry to download from the start")
        if response.status_code >= 400:
            raise DownloadError(f"http_{response.status_code}", f"HTTP {response.status_code} for {current}")
        resumed = response.status_code == 206 and offset > 0
        if not resumed:
            offset = 0
        header = response.headers.get("content-length", "")
        expected = int(header) + offset if header.isdigit() else None
        if response.headers.get("content-encoding", "identity").lower() not in ("", "identity"):
            expected = None  # Content-Length counts the compressed bytes; the decoded body cannot be compared with it
        if expected is not None and expected > self.policy.max_bytes:
            raise DownloadError("too_large", f"{expected} bytes exceeds the {self.policy.max_bytes} byte limit")
        meta.write_text(
            json.dumps(
                {
                    "etag": response.headers.get("etag", ""),
                    "last-modified": response.headers.get("last-modified", ""),
                    "url": url,
                }
            )
        )
        digest = hashlib.sha256()
        if resumed:
            with part.open("rb") as existing:
                for block in iter(lambda: existing.read(1024 * 1024), b""):
                    digest.update(block)
        received, last, head = offset, 0.0, b""
        with part.open("ab" if resumed else "wb") as handle:
            for chunk in response.iter_bytes(self.policy.chunk_size):
                received += len(chunk)
                if received > self.policy.max_bytes:
                    raise DownloadError("too_large", f"download exceeded {self.policy.max_bytes} bytes")
                handle.write(chunk)
                digest.update(chunk)
                head = head or chunk[:512]
                if self.policy.limit_rate:
                    time.sleep(len(chunk) / self.policy.limit_rate)
                if time.monotonic() - last >= STATUS_EVERY:
                    last = time.monotonic()
                    status.write_text(
                        json.dumps({"url": url, "received": received, "total": expected, "state": "downloading"})
                    )
                    if on_progress:
                        on_progress(url, received, expected)
        if expected is not None and received != expected:
            status.write_text(json.dumps({"url": url, "received": received, "total": expected, "state": "incomplete"}))
            raise DownloadError(
                "incomplete", f"received {received} of {expected} bytes; kept as a partial file for resume"
            )
        sha = digest.hexdigest()
        if not head:
            head = part.read_bytes()[:512]
        detected, group = sniff(head)
        declared = response.headers.get("content-type", "").split(";")[0].strip().lower()
        name = _filename(response, url)
        duplicate = self._known_hashes().get(sha)
        if duplicate:
            part.unlink()
            final = self.destination / duplicate
        else:
            final = self.destination / f"{sha[:12]}-{name}"
            if final.resolve().parent != self.destination.resolve():
                raise DownloadError("refused", "the file name resolves outside the download folder")
            os.replace(part, final)
            final.chmod(0o600)
        meta.unlink(missing_ok=True)
        result = DownloadResult(
            url=url,
            final_url=current,
            file=final.name,
            size=received,
            sha256=sha,
            declared_type=declared,
            detected_type=detected,
            flags=flags_for(name, declared, detected, group),
            seconds=round(time.monotonic() - started, 1),
            resumed=resumed,
            duplicate_of=duplicate,
            headers={k: v for k, v in response.headers.items()},
        )
        if not duplicate:
            (self.destination / f"{final.name}.json").write_text(result.model_dump_json(indent=2), encoding="utf-8")
        status.write_text(
            json.dumps({"url": url, "received": received, "total": received, "state": "done", "file": final.name})
        )
        if on_progress:
            on_progress(url, received, received)
        return result

    def download_many(
        self, urls: list[str], on_progress: Progress | None = None
    ) -> tuple[list[DownloadResult], list[DownloadFailure]]:
        """Downloads concurrently; failures are collected, never raised, and keep their partial files."""

        def one(url: str) -> DownloadResult | DownloadFailure:
            try:
                return self.download(url, on_progress)
            except DownloadError as problem:
                ident = self._ident(url)
                part = self.destination / f"{ident}.part"
                return DownloadFailure(
                    url=url,
                    kind=problem.kind,
                    message=str(problem),
                    partial_bytes=part.stat().st_size if part.exists() else 0,
                )

        with ThreadPoolExecutor(max_workers=max(1, self.policy.concurrency)) as pool:
            outcomes = list(pool.map(one, urls))
        return [o for o in outcomes if isinstance(o, DownloadResult)], [
            o for o in outcomes if isinstance(o, DownloadFailure)
        ]

    def status(self) -> list[dict[str, object]]:
        return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(self.destination.glob("*.status.json"))]

    def close(self) -> None:
        self.client.close()
