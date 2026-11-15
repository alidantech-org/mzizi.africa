"""Discover same-document listing panels from control semantics and read their source markup."""

from __future__ import annotations

import hashlib
import json
from urllib.parse import unquote, urldefrag, urljoin

from bs4 import BeautifulSoup, Tag

from mzizi_scraping.core import Frozen
from mzizi_scraping.pagination.detect import detect_pagination
from mzizi_scraping.pagination.models import Findings

TAB_MARKUP = (
    '[role="tab"], [data-toggle="tab"], [data-toggle="pill"], [data-bs-toggle="tab"], '
    '[data-bs-toggle="pill"], [role="tablist"] a[href^="#"], .nav-tabs a[href^="#"]'
)
DISCLOSURE_MARKUP = (
    "button[aria-expanded][aria-controls], a[aria-expanded][aria-controls], "
    '[data-toggle="collapse"], [data-bs-toggle="collapse"], details[id] > summary'
)
TARGET_ATTRIBUTES = ("aria-controls", "data-bs-target", "data-target", "href")
PAGE_CHROME = frozenset({"nav", "header", "footer", "aside"})
CHROME_ROLES = frozenset({"navigation", "banner", "contentinfo", "complementary"})


class PanelControl(Frozen):
    target: str
    label: str
    kind: str
    selector: str
    scope: str = ""
    items: str = ""

    @property
    def panel_selector(self) -> str:
        return self.scope or (f"[id={_literal(self.target)}]" if self.target else "body")


class PanelView(Frozen):
    html: str
    signature: str
    table_rows: tuple[str, ...]
    list_items: tuple[str, ...]
    readable: bool
    active: bool
    pagination: Findings
    status_text: tuple[str, ...]


def _literal(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def _target(node: Tag, url: str) -> tuple[str, str] | None:
    for attribute in TARGET_ATTRIBUTES:
        value = node.get(attribute)
        if not isinstance(value, str) or not value.strip() or any(ord(c) < 32 for c in value):
            continue
        if attribute == "aria-controls":
            target = value.strip()
        elif attribute == "href":
            base, fragment = _link(url, value)
            target = unquote(fragment) if base == urldefrag(url).url else ""
        else:
            target = value.removeprefix("#") if value.startswith("#") else ""
        if target and not any(c.isspace() for c in target):
            return target, f"{node.name}[{attribute}={_literal(value)}]"
    return None


def _link(url: str, href: str) -> tuple[str, str]:
    try:
        target, fragment = urldefrag(urljoin(url, href))
    except ValueError:
        return "", ""
    return target, fragment


def _safe_trigger(node: Tag, url: str) -> bool:
    if node.has_attr("download") or node.has_attr("disabled") or node.get("aria-disabled") == "true":
        return False
    if node.name == "button" and node.find_parent("form") is not None and node.get("type") != "button":
        return False
    href = node.get("href")
    return not isinstance(href, str) or not href or _link(url, href)[0] == urldefrag(url).url


def _in_page_chrome(node: Tag) -> bool:
    return any(
        isinstance(parent, Tag) and (parent.name in PAGE_CHROME or str(parent.get("role")) in CHROME_ROLES)
        for parent in (node, *node.parents)
    )


def discover_panels(html: str | bytes, url: str) -> tuple[PanelControl, ...]:
    soup = BeautifulSoup(html, "lxml")
    tabs = soup.select(TAB_MARKUP)
    disclosures = soup.select(DISCLOSURE_MARKUP)
    found: dict[str, PanelControl] = {}
    for kind, nodes in (("tab", tabs), ("disclosure", disclosures)):
        for node in nodes:
            if not _safe_trigger(node, url):
                continue
            resolved = _target(node, url)
            if node.name == "summary" and isinstance(node.parent, Tag):
                detail_id = str(node.parent.get("id") or "")
                if detail_id and not any(ord(c) < 32 for c in detail_id):
                    resolved = detail_id, f"details[id={_literal(detail_id)}] > summary"
            if resolved is None:
                continue
            target, selector = resolved
            panel = soup.find(id=target)
            if kind == "disclosure" and (_in_page_chrome(node) or (isinstance(panel, Tag) and _in_page_chrome(panel))):
                continue
            label = str(node.get("aria-label") or node.get_text(" ", strip=True) or target)
            # Static extraction still works when a site duplicates a control or a selector is ambiguous.
            if len(soup.select(selector)) != 1:
                selector = ""
            found.setdefault(target, PanelControl(target=target, label=label, kind=kind, selector=selector))
    return tuple(found.values())


def listing_control(html: str | bytes, url: str) -> PanelControl | None:
    soup = BeautifulSoup(html, "lxml")
    root = soup.select_one("main, [role=main]") or soup.body
    if root is None or not detect_pagination(str(root), url).paginated:
        return None
    root_id = str(root.get("id") or "")
    return PanelControl(target=root_id, label="Listing", kind="listing", selector="")


def _active(node: Tag, control: PanelControl, soup: BeautifulSoup) -> bool:
    if control.kind == "listing":
        return True
    trigger = soup.select_one(control.selector) if control.selector else None
    if isinstance(trigger, Tag) and trigger.get("aria-selected") is not None:
        return trigger.get("aria-selected") == "true"
    if isinstance(trigger, Tag) and trigger.get("aria-expanded") is not None:
        return trigger.get("aria-expanded") == "true"
    if node.name == "details":
        return node.has_attr("open")
    classes = node.get("class") or []
    return (
        not node.has_attr("hidden")
        and node.get("aria-hidden") != "true"
        and ("active" in classes or "show" in classes or "in" in classes)
    )


def _row_keys(node: Tag) -> tuple[str, ...]:
    data: list[str] = []
    for row in node.find_all("tr"):
        cells = row.find_all("td", recursive=False)
        if not cells or (len(cells) == 1 and cells[0].has_attr("colspan")):
            continue
        values = [cell.get_text(" ", strip=True) for cell in cells]
        links = [str(a["href"]) for a in row.find_all("a", href=True)]
        if any(values) or links:
            data.append(hashlib.sha256(json.dumps((values, links), ensure_ascii=False).encode()).hexdigest())
    return tuple(data)


def _list_keys(node: BeautifulSoup, selector: str) -> tuple[str, ...]:
    keys: list[str] = []
    for item in node.select(selector or 'li, [role="listitem"]'):
        text = item.get_text(" ", strip=True)
        links = tuple(str(anchor["href"]) for anchor in item.find_all("a", href=True))
        if text or links:
            keys.append(hashlib.sha256(json.dumps((text, links), ensure_ascii=False).encode()).hexdigest())
    return tuple(keys)


def read_panel(html: str | bytes, control: PanelControl, url: str) -> PanelView | None:
    soup = BeautifulSoup(html, "lxml")
    if control.scope:
        matches = soup.select(control.scope, limit=2)
        panel = matches[0] if len(matches) == 1 else None
    elif control.target:
        panels = soup.find_all(id=control.target, limit=2)
        panel = panels[0] if len(panels) == 1 else None
    else:
        panel = soup.select_one("main, [role=main]") or soup.body
    if panel is None:
        return None
    active = _active(panel, control, soup)
    pagination = detect_pagination(str(panel), url)
    # Use the panel's children so the extraction backend can see content of initially hidden panels.
    content = panel.decode_contents()
    clean = BeautifulSoup(content, "lxml")
    status = tuple(node.get_text(" ", strip=True) for node in clean.select('[role="status"],[aria-live="polite"]'))
    for node in clean.select('script,style,template,noscript,summary,button,nav,[role="status"],[role="progressbar"]'):
        node.decompose()
    tables = _row_keys(clean)
    items = _list_keys(clean, control.items)
    text = clean.get_text(" ", strip=True)
    links = [str(node["href"]) for node in clean.find_all("a", href=True) if not str(node["href"]).startswith("#")]
    # A table shell, loading indicator, or empty disclosure does not establish a captured listing.
    readable = bool(tables or links or (text and clean.find("table") is None)) and panel.get("aria-busy") != "true"
    signature = hashlib.sha256(
        json.dumps((tables, items) if tables or items else (text, *links), ensure_ascii=False).encode()
    ).hexdigest()
    return PanelView(
        html=content,
        signature=signature,
        table_rows=tables,
        list_items=items,
        readable=readable,
        active=active,
        pagination=pagination,
        status_text=status,
    )
