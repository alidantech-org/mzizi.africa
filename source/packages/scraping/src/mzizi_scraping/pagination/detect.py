"""Finds how a page paginates from its rendered HTML: `rel=next`, labelled next controls (links or buttons), page
numbers, `load more` buttons, and infinite-scroll hints. Labels and class words come from the web vocabulary."""

from __future__ import annotations

from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

from bs4 import BeautifulSoup, Tag

from mzizi_fetch.web.vocabulary import vocabulary
from mzizi_scraping.pagination.models import Control, ControlKind, Findings

CONTROL_TAGS = ("a", "button", "li", "span", "div")


def _words(tag: Tag) -> str:
    classes = " ".join(str(c) for c in (tag.get("class") or []))
    return f"{classes} {tag.get('id') or ''} {tag.get('aria-label') or ''}".lower()


def _label(tag: Tag) -> str:
    return " ".join(
        str(tag.get("aria-label") or tag.get("title") or tag.get("value") or tag.get_text(" ", strip=True)).split()
    )


def _clickable(tag: Tag) -> Tag:
    """The element to click: the tag itself when it is a link or button, else the link or button inside it."""
    if tag.name in ("a", "button") or tag.get("role") == "button":
        return tag
    inner = tag.find(["a", "button"])
    return inner if isinstance(inner, Tag) else tag


def _disabled(tag: Tag) -> bool:
    words = vocabulary().pagination.disabled_words
    chain = [tag, *tag.parents][:3]
    return any(
        node.has_attr("disabled") or str(node.get("aria-disabled", "")).lower() == "true" or any(w in _words(node) for w in words)
        for node in chain
        if isinstance(node, Tag)
    )


def _selector(tag: Tag) -> str:
    label = tag.get("aria-label")
    if label:
        return f'{tag.name}[aria-label="{label}"]'
    if tag.get("id"):
        return f"{tag.name}#{tag['id']}"
    text = tag.get_text(" ", strip=True)
    return f'{tag.name}:has-text("{text}")' if text else tag.name


def _matches(label: str, candidates: tuple[str, ...], exact: bool) -> bool:
    lowered = label.strip().lower()
    if not lowered:
        return False
    return any(lowered == c.lower() if exact or len(c) <= 2 else c.lower() in lowered for c in candidates)


def _in_carousel(tag: Tag) -> bool:
    """A next button inside a slider moves slides, not pages."""
    words = vocabulary().pagination.carousel_words
    return any(isinstance(node, Tag) and any(w in _words(node) for w in words) for node in [tag, *list(tag.parents)[:5]])


def _control(tag: Tag, base_url: str, how: str) -> Control:
    target = _clickable(tag)
    href = str(target.get("href") or "").strip() if target.name == "a" else ""
    real = bool(href) and not href.startswith(("#", "javascript:"))
    return Control(
        kind=ControlKind.LINK if real else ControlKind.BUTTON,
        label=_label(target) or _label(tag),
        selector=_selector(target),
        url=urljoin(base_url, href) if real else "",
        enabled=not _disabled(tag),
        how=how,
    )


def _number(label: str) -> int | None:
    digits = "".join(ch for ch in label if ch.isdigit())
    return int(digits) if digits and len(digits) <= 5 else None


def _template(controls: list[tuple[int, Control]]) -> str:
    """`…?page={n}` or `…/page/{n}/` when numbered links differ from each other only in the page number."""
    links = [(n, c.url) for n, c in controls if c.url]
    if len(links) < 2:
        return ""
    (n1, u1), (n2, u2) = links[0], links[1]
    p1, p2 = urlparse(u1), urlparse(u2)
    q1, q2 = dict(parse_qsl(p1.query)), dict(parse_qsl(p2.query))
    changed = [k for k in q1 if q1[k] != q2.get(k)]
    if len(changed) == 1 and q1[changed[0]] == str(n1) and q2.get(changed[0]) == str(n2) and p1.path == p2.path:
        query = {**q1, changed[0]: "{n}"}
        return urlunparse(p1._replace(query=urlencode(query, safe="{}")))
    s1, s2 = p1.path.split("/"), p2.path.split("/")
    if p1.netloc == p2.netloc and len(s1) == len(s2):
        differing = [i for i, (a, b) in enumerate(zip(s1, s2, strict=True)) if a != b]
        if len(differing) == 1 and s1[differing[0]] == str(n1) and s2[differing[0]] == str(n2):
            s1[differing[0]] = "{n}"
            return urlunparse(p1._replace(path="/".join(s1)))
    return ""


def detect_pagination(html: str | bytes, base_url: str) -> Findings:
    vocab = vocabulary().pagination
    soup = BeautifulSoup(html, "lxml")
    evidence: list[str] = []
    next_control: Control | None = None
    # 1. the page declares its successor
    declared = soup.find(["link", "a"], rel=lambda r: r and "next" in (r if isinstance(r, list) else r.split()))
    if isinstance(declared, Tag) and declared.get("href"):
        next_control = _control(declared, base_url, "rel=next")
        evidence.append("rel=next")
    # 2. controls inside a pagination widget
    numbered: list[tuple[int, Control]] = []
    current: int | None = None
    last: int | None = None
    widgets = [t for t in soup.find_all(True) if any(w in _words(t) for w in vocab.container_words) and t.name in ("nav", "ul", "div", "ol", "section")]
    for widget in widgets[:4]:
        if _in_carousel(widget):
            continue
        for tag in widget.find_all(CONTROL_TAGS):
            target = _clickable(tag)
            if tag is not target and tag.name not in ("li",):
                continue
            label = _label(target) or _label(tag)
            marker = f"{_words(tag)} {_words(target)}"
            if "current" in str(tag.get("aria-label", "")).lower() or "active" in marker or "current" in marker:
                found = _number(label)
                current = found if found is not None else current
            number = _number(label)
            if number is not None and "next" not in marker.split() and not _matches(label, vocab.last, False):
                if "go to page" in label.lower() or label.strip().isdigit() or "page" in label.lower():
                    numbered.append((number, _control(tag, base_url, "number")))
            if _matches(label, vocab.last, False) and number is not None:
                last = number
            if _matches(label, vocab.next, False) and not _matches(label, vocab.last, False) and not _matches(label, vocab.previous, False) and next_control is None:
                next_control = _control(tag, base_url, "pagination widget")
                evidence.append("pagination widget")
    # 3. a labelled next control anywhere
    if next_control is None:
        for tag in soup.find_all("a", href=True):  # outside a pagination widget only real links count (buttons are sliders)
            if _in_carousel(tag):
                continue
            if _matches(_label(tag), vocab.next, True) or "next" in _words(tag).split():
                control = _control(tag, base_url, "label")
                if control.url:
                    next_control = control
                    evidence.append("next label")
                    break
    # 4. a load-more button
    load_more: Control | None = None
    candidates = [t for t in soup.find_all(["button", "a"]) if _matches(_label(t), vocab.load_more, False)]
    if len(candidates) == 1:  # several identical buttons expand individual items; one button loads the next batch
        load_more = _control(candidates[0], base_url, "load more label").model_copy(update={"kind": ControlKind.LOAD_MORE})
        evidence.append("load more")
    # 5. infinite-scroll markers
    text = str(soup).lower()
    infinite = any(w in text for w in vocab.infinite_scroll_words)
    if infinite:
        evidence.append("infinite scroll hint")
    seen: dict[int, Control] = {}
    for number, control in numbered:
        seen.setdefault(number, control)
    numbered_sorted = [seen[n] for n in sorted(seen)]
    if last is None and seen:
        last = max(seen)
    template = _template([(n, c) for n, c in sorted(seen.items())])
    if seen:
        evidence.append(f"page numbers {min(seen)}-{max(seen)}")
    return Findings(
        next=next_control,
        load_more=load_more,
        numbered=tuple(numbered_sorted),
        current=current,
        last=last,
        url_template=template,
        infinite_scroll=infinite,
        evidence=tuple(evidence),
    )
