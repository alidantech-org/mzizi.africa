"""Parse image references carried by inline CSS on an HTML element."""

from __future__ import annotations

from collections.abc import Sequence
from urllib.parse import quote, urljoin, urlsplit

from tinycss2 import parse_component_value_list, parse_declaration_list  # type: ignore[import-untyped]
from tinycss2.ast import Declaration, FunctionBlock, StringToken, URLToken  # type: ignore[import-untyped]

BACKGROUND_PROPERTIES = frozenset({"background", "background-image"})
IMAGE_SCHEMES = frozenset({"http", "https"})
URL_SAFE = ":/?#[]@!$&'*+,;=%"


def inline_background_images(style: str, base_url: str) -> tuple[str, ...]:
    backgrounds = [
        declaration
        for declaration in parse_declaration_list(style, skip_comments=True, skip_whitespace=True)
        if isinstance(declaration, Declaration) and declaration.lower_name in BACKGROUND_PROPERTIES
    ]
    if not backgrounds:
        return ()
    active = next((d for d in reversed(backgrounds) if d.important), backgrounds[-1])
    return _background_urls(active.value, base_url)


def computed_background_images(value: str, base_url: str) -> tuple[str, ...]:
    """Resolve CSSOM background-image values, including image-set alternatives."""
    return _background_urls(parse_component_value_list(value, skip_comments=True), base_url)


def _background_urls(tokens: Sequence[object], base_url: str, *, image_set: bool = False) -> tuple[str, ...]:
    urls: list[str] = []
    for token in tokens:
        value: str = ""
        if isinstance(token, URLToken) or (image_set and isinstance(token, StringToken)):
            value = token.value
        elif isinstance(token, FunctionBlock) and token.lower_name == "url":
            args = [argument for argument in token.arguments if argument.type not in {"whitespace", "comment"}]
            if len(args) == 1 and isinstance(args[0], StringToken):
                value = args[0].value
        elif isinstance(token, FunctionBlock) and token.lower_name in {"image-set", "-webkit-image-set"}:
            urls.extend(_background_urls(token.arguments, base_url, image_set=True))
        if value.strip() and not value.startswith("#"):
            try:
                asset = quote(urljoin(base_url, value), safe=URL_SAFE)
                if urlsplit(asset).scheme in IMAGE_SCHEMES:
                    urls.append(asset)
            except ValueError:  # A malformed CSS URL does not invalidate the document.
                continue
    return tuple(dict.fromkeys(urls))
