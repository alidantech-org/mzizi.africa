"""URL handling: parsing, normalisation, canonical keys, scope and classification. No regular expressions."""

from __future__ import annotations

import ipaddress
from enum import StrEnum
from urllib.parse import parse_qsl, urldefrag, urlencode, urljoin, urlparse, urlunparse

from mzizi_fetch.web.vocabulary import vocabulary

DEFAULT_PORTS = {"http": 80, "https": 443}


class UrlKind(StrEnum):
    PAGE = "page"
    DOCUMENT = "document"
    DATA = "data"
    ARCHIVE = "archive"
    PROGRAM = "program"
    IMAGE = "image"
    MEDIA = "media"
    EMBED = "embed"
    MAIL = "mail"
    PHONE = "phone"


FILE_KINDS = frozenset({UrlKind.DOCUMENT, UrlKind.DATA, UrlKind.ARCHIVE, UrlKind.PROGRAM})


class UrlError(ValueError):
    pass


def validate(url: str) -> str:
    """The URL if it is an absolute http(s) URL with a host; otherwise `UrlError`."""
    parts = urlparse(url.strip())
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise UrlError(f"not an absolute http(s) URL: {url!r}")
    return url.strip()


def resolve(base: str, href: str) -> str:
    """`href` resolved against `base`, fragment removed."""
    return urldefrag(urljoin(base, href.strip()))[0]


def normalize(url: str, *, sort_query: bool = True, drop_tracking: bool = True) -> str:
    """Canonical comparison form: lower-case scheme and host, default port, fragment and tracking parameters removed.

    Query parameters keep their values and, optionally, are sorted. Paths are never altered (`/a` and `/a/` differ).
    """
    parts = urlparse(urldefrag(url.strip())[0])
    host = (parts.hostname or "").lower()
    if ":" in host:
        host = f"[{host}]"
    port = f":{parts.port}" if parts.port and parts.port != DEFAULT_PORTS.get(parts.scheme.lower()) else ""
    pairs = parse_qsl(parts.query, keep_blank_values=True)
    if drop_tracking:
        pairs = [(k, v) for k, v in pairs if k.lower() not in vocabulary().tracking_parameters]
    if sort_query:
        pairs = sorted(pairs)
    return urlunparse((parts.scheme.lower(), f"{host}{port}", parts.path or "/", parts.params, urlencode(pairs), ""))


def host_of(url: str) -> str:
    return (urlparse(url).hostname or "").lower()


def origin_of(url: str) -> str:
    parts = urlparse(normalize(url))
    return f"{parts.scheme}://{parts.netloc}"


def site_key(host: str) -> str:
    return host[4:] if host.startswith("www.") else host


def same_origin(a: str, b: str) -> bool:
    return origin_of(a) == origin_of(b)


def same_site(start_host: str, host: str, include_subdomains: bool = False) -> bool:
    """Same registrable site by name: `www.` is ignored; subdomains count only when asked for."""
    a, b = site_key(start_host.lower()), site_key(host.lower())
    return a == b or (include_subdomains and b.endswith("." + a))


def is_ip_literal(host: str) -> bool:
    try:
        ipaddress.ip_address(host.strip("[]"))
    except ValueError:
        return False
    return True


def path_of(url: str) -> str:
    parts = urlparse(url)
    return (parts.path or "/") + (f"?{parts.query}" if parts.query else "")


def extension_of(url: str) -> str:
    name = urlparse(url).path.rsplit("/", 1)[-1]
    return name.rsplit(".", 1)[-1].lower() if "." in name else ""


def classify(url: str, tag: str = "a") -> UrlKind:
    scheme = urlparse(url).scheme
    if scheme == "mailto":
        return UrlKind.MAIL
    if scheme == "tel":
        return UrlKind.PHONE
    words, extension = vocabulary(), extension_of(url)
    if extension in words.url_kinds.image or tag == "img":
        return UrlKind.IMAGE
    if extension in words.url_kinds.media or tag in words.media_tags:
        return UrlKind.MEDIA
    for kind, extensions in (
        (UrlKind.DOCUMENT, words.url_kinds.document),
        (UrlKind.DATA, words.url_kinds.data),
        (UrlKind.ARCHIVE, words.url_kinds.archive),
        (UrlKind.PROGRAM, words.url_kinds.program),
    ):
        if extension in extensions:
            return kind
    return UrlKind.EMBED if tag in words.embed_tags else UrlKind.PAGE


def is_file(kind: UrlKind) -> bool:
    return kind in FILE_KINDS


class Deduplicator:
    """Remembers normalised URLs; `add` is True the first time a resource is seen."""

    def __init__(self) -> None:
        self._seen: set[str] = set()

    def add(self, url: str) -> bool:
        key = normalize(url)
        if key in self._seen:
            return False
        self._seen.add(key)
        return True

    def keys(self) -> set[str]:
        return set(self._seen)

    def __contains__(self, url: str) -> bool:
        return normalize(url) in self._seen

    def __len__(self) -> int:
        return len(self._seen)


def is_api_url(url: str) -> bool:
    """A data endpoint (`/api/...`, `/wp-json/...`): worth keeping as data, never crawled as a page."""
    from urllib.parse import urlsplit

    from mzizi_fetch.web.vocabulary import vocabulary

    segments = {part.lower() for part in urlsplit(url).path.split("/") if part}
    return bool(segments & set(vocabulary().api_path_segments))
