"""Observe media references from the current top-level browser document."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Literal, Protocol, runtime_checkable
from urllib.parse import urlsplit

from pydantic import TypeAdapter

from mzizi_browser.shared.models import Frozen
from mzizi_extraction.document.html_css_images import computed_background_images

if TYPE_CHECKING:
    from playwright.sync_api import Page

MAX_ELEMENTS = 20_000
MAX_LAZY_TARGETS = 6
type MediaKind = Literal["background", "selected-image", "image-source", "responsive-source"]

# Use DOM positions for selectors so duplicate IDs and generated CSS classes do not obscure the evidence.
_MEDIA_SCRIPT = r"""
async ({limit, scope, lazyLimit}) => {
    const root = scope ? document.querySelector(scope) : document.body;
    let lazy_candidates = 0, lazy_scrolled = 0;
    let uninspected_frames = 0, shadow_roots = 0;
    if (root && lazyLimit) {
        const {scrollX, scrollY} = window;
        const pending = root.querySelectorAll('img[loading=lazy], img[data-src], img[data-srcset]');
        const targets = Array.from(pending).filter(node =>
            !node.currentSrc || node.hasAttribute('data-src') || node.hasAttribute('data-srcset'));
        lazy_candidates = targets.length;
        for (const image of targets.slice(0, lazyLimit)) {
            lazy_scrolled++;
            image.scrollIntoView({block: 'center', behavior: 'instant'});
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        window.scrollTo({left: scrollX, top: scrollY, behavior: 'instant'});
    }
    const rows = [];
    const base_url = document.baseURI;
    const path = node => {
        const parts = [];
        for (; node && node !== document.body; node = node.parentElement) {
            let index = 1;
            for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
                if (sibling.localName === node.localName) index++;
            parts.unshift(CSS.escape(node.localName) + ':nth-of-type(' + index + ')');
        }
        return ['body', ...parts].join(' > ');
    };
    const absolute = url => {
        if (!url) return '';
        try { return new URL(url, base_url).href; } catch { return ''; }
    };
    // The URL token runs to ASCII whitespace. Commas inside a URL are permitted.
    const sources = value => {
        const urls = [];
        const whitespace = ' \t\n\r\f';
        let i = 0;
        while (i < value.length) {
            while (i < value.length && (value[i] === ',' || whitespace.includes(value[i]))) i++;
            const start = i;
            while (i < value.length && !whitespace.includes(value[i])) i++;
            const token = value.slice(start, i);
            let end = token.length;
            while (end && token[end - 1] === ',') end--;
            if (end) urls.push(absolute(token.slice(0, end)));
            if (end !== token.length) continue;
            let depth = 0;
            while (i < value.length) {
                const character = value[i++];
                if (character === '(') depth++;
                if (character === ')' && depth) depth--;
                if (character === ',' && !depth) break;
            }
        }
        return urls;
    };
    const clean = text => (text || '').trim().replaceAll('\n', ' ').slice(0, 160).trim();
    const itemSelector = 'article, li, tr, figure, [role=listitem], [role=row]';
    const headingSelector = 'h1, h2, h3, h4, h5, h6, figcaption, [role=heading]';
    const uniqueLink = item => {
        const links = [...item.querySelectorAll('a[href]')].filter(link => clean(link.textContent));
        return links.length && links.every(link => link.href === links[0].href) ? links[0] : null;
    };
    const context = node => {
        let link = node.closest('a[href]');
        let item = node.closest(itemSelector);
        if (!link && item) link = uniqueLink(item);
        if (!link && !item) {
            for (let parent = node.parentElement, depth = 0;
                 parent && depth < 3 && !parent.matches('main, [role=main], body');
                 parent = parent.parentElement, depth++) {
                link = uniqueLink(parent);
                if (link || parent.querySelector(headingSelector)) {
                    item = parent;
                    break;
                }
            }
        }
        const label = clean(node.getAttribute('alt')) || clean(node.getAttribute('aria-label'))
            || clean(link?.textContent) || clean(item?.querySelector(headingSelector)?.textContent)
            || clean(item?.textContent);
        return {label, link: absolute(link?.getAttribute('href'))};
    };
    const walker = root ? document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT) : null;
    let current = root;
    let scanned = 0;
    while (current && scanned < limit) {
        const node = current;
        if (node.localName === "iframe" || node.localName === "frame") uninspected_frames++;
        if (node.shadowRoot) shadow_roots++;
        scanned++;
        current = walker?.nextNode();
        const style = getComputedStyle(node);
        const values = [];
        const push = (kind, value, pseudo = '') => {
            if (value && value !== 'none') values.push({kind, value, pseudo});
        };
        push('background', style.backgroundImage);
        const visible = !!node.getClientRects().length && style.visibility === 'visible';
        if (visible) {
            for (const pseudo of ['::before', '::after']) {
                const generated = getComputedStyle(node, pseudo);
                if (generated.content !== 'none' && generated.content !== 'normal')
                    push('background', generated.backgroundImage, pseudo);
            }
        }
        if (node instanceof HTMLImageElement) {
            push('selected-image', node.currentSrc);
            for (const attribute of ['src', 'data-src']) push('image-source', absolute(node.getAttribute(attribute)));
            const picture = node.parentElement?.matches('picture') ? node.parentElement : null;
            const candidates = picture ? [...picture.querySelectorAll(':scope > source'), node] : [node];
            for (const candidate of candidates)
                for (const attribute of ['srcset', 'data-srcset'])
                    for (const url of sources(candidate.getAttribute(attribute) || '')) push('responsive-source', url);
        }
        if (values.length) rows.push({selector: path(node), visible, ...context(node), values});
    }
    const doctype = document.doctype ? new XMLSerializer().serializeToString(document.doctype) + '\n' : '';
    return {base_url, source_url: location.href, html: doctype + document.documentElement.outerHTML,
            scanned, truncated: !!current, lazy_candidates, lazy_scrolled, uninspected_frames, shadow_roots, rows};
}
"""


class _Value(Frozen):
    kind: MediaKind
    value: str
    pseudo: str


class _Element(Frozen):
    selector: str
    visible: bool
    label: str
    link: str
    values: tuple[_Value, ...]


class _Snapshot(Frozen):
    base_url: str
    source_url: str
    html: str
    scanned: int
    uninspected_frames: int = 0
    shadow_roots: int = 0
    lazy_candidates: int = 0
    lazy_scrolled: int = 0
    truncated: bool
    rows: tuple[_Element, ...]


class MediaReference(Frozen):
    url: str
    kind: MediaKind
    selector: str
    visible: bool
    label: str
    link: str


class MediaInventory(Frozen):
    source_url: str
    scanned_elements: int
    uninspected_frames: int = 0
    shadow_roots: int = 0
    lazy_candidates: int = 0
    lazy_scrolled: int = 0
    truncated: bool
    references: tuple[MediaReference, ...]


class MediaCapture(Frozen):
    inventory: MediaInventory
    html: str


@runtime_checkable
class RenderedMediaSession(Protocol):
    def capture_media(self, scope: str = "", *, scan_lazy: bool = False) -> MediaCapture: ...


def _http(url: str) -> bool:
    try:
        parsed = urlsplit(url)
        return parsed.scheme in {"https", "http"} and bool(parsed.hostname)
    except ValueError:
        return False


def capture_media(page: Page, scope: str = "", *, scan_lazy: bool = False) -> MediaCapture:
    snapshot = TypeAdapter(_Snapshot).validate_python(
        page.evaluate(
            _MEDIA_SCRIPT, {"limit": MAX_ELEMENTS, "scope": scope, "lazyLimit": MAX_LAZY_TARGETS if scan_lazy else 0}
        )
    )
    references: list[MediaReference] = []
    for element in snapshot.rows:
        seen: set[tuple[MediaKind, str, str]] = set()
        for value in element.values:
            urls = (
                computed_background_images(value.value, snapshot.base_url)
                if value.kind == "background"
                else (value.value,)
            )
            for url in urls:
                key = (value.kind, url, value.pseudo)
                if _http(url) and key not in seen:
                    seen.add(key)
                    references.append(
                        MediaReference(
                            url=url,
                            kind=value.kind,
                            selector=element.selector + value.pseudo,
                            visible=element.visible,
                            label=element.label,
                            link=element.link if _http(element.link) else "",
                        )
                    )
    inventory = MediaInventory(
        source_url=snapshot.source_url,
        scanned_elements=snapshot.scanned,
        uninspected_frames=snapshot.uninspected_frames,
        shadow_roots=snapshot.shadow_roots,
        lazy_candidates=snapshot.lazy_candidates,
        lazy_scrolled=snapshot.lazy_scrolled,
        truncated=snapshot.truncated,
        references=tuple(references),
    )
    return MediaCapture(inventory=inventory, html=snapshot.html)


def _label(text: str) -> str:
    return "".join(f"\\{character}" if character in "\\[]<>`*_&" else character for character in text)


def save_inventory(folder: Path, inventory: MediaInventory) -> str:
    """Save all candidates and summarize visible image observations in Markdown."""
    (folder / "rendered-media.json").write_text(inventory.model_dump_json(indent=2) + "\n", encoding="utf-8")
    return render_media(inventory)


def render_media(inventory: MediaInventory) -> str:
    links: list[str] = []
    if inventory.truncated:
        links.extend((f"Element scan capped at {inventory.scanned_elements:,} elements.", ""))
    for reference in inventory.references:
        if not reference.visible or reference.kind not in ("background", "selected-image"):
            continue
        label = _label(reference.label or ("CSS background" if reference.kind == "background" else "Image"))
        context = f" ([page item](<{reference.link}>))" if reference.link else ""
        links.append(f"- [{label}](<{reference.url}>){context}")
    return "\n\n## Rendered media\n\n" + "\n".join(links) + "\n" if links else ""
