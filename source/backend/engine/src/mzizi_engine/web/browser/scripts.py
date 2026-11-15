"""Scripts and timing constants used by both Playwright-compatible browser adapters."""

from __future__ import annotations

import base64
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Page

SCREENSHOT_TIMEOUT_MS = 10_000
CLICK_TIMEOUT_MS = 4_000
POPUP_LOAD_MS = 5_000
READY_SCRIPT = """
async ({quiet, max, roots, busy, minText, moving}) => {
  const start = performance.now();
  const visible = el => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && parseFloat(style.opacity || '1') > 0.05;
  };
  const rootEmpty = () => roots.some(sel => {
    const el = document.querySelector(sel);
    return el && el.textContent.trim().length === 0 && el.children.length < 2;
  });
  const loaderShown = () => busy.some(sel => { try { return [...document.querySelectorAll(sel)].some(visible); } catch (e) { return false; } });
  const thin = () => (document.body ? document.body.innerText.trim().length : 0) < minText && document.querySelectorAll('script[src]').length > 0;
  if (document.fonts && document.fonts.ready) { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]); }
  return await new Promise(resolve => {
    let last = performance.now();
    // content changes only: animations and class toggles (carousels, tickers) must not keep the page "busy" forever
    // sliders, tickers and carousels change forever by design: their changes do not mean the page is still loading
    const isMoving = node => { const el = node && (node.nodeType === 1 ? node : node.parentElement); return !!el && moving.some(w => { const c = el.closest('[class],[id]'); return c && ((c.className && String(c.className).toLowerCase().includes(w)) || (c.id && c.id.toLowerCase().includes(w))); }); };
    const observer = new MutationObserver(records => { if (records.some(r => !isMoving(r.target))) { last = performance.now(); } });
    observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true});
    const tick = () => {
      const now = performance.now();
      const settled = now - last >= quiet && document.readyState === 'complete' && !rootEmpty() && !loaderShown() && !thin();
      if (settled) { observer.disconnect(); resolve({state: 'stable', ms: Math.round(now - start)}); return; }
      if (now - start >= max) { observer.disconnect(); resolve({state: 'timeout', ms: Math.round(now - start)}); return; }
      setTimeout(tick, 100);
    };
    tick();
  });
}
"""
BLANK_LINKS_SCRIPT = "els => els.map(e => e.href).filter(h => h)"
SCROLL_PAUSE = 0.4
MAX_SCROLLS = 40
LINKS_SCRIPT = "els => els.map(e => e.href).filter(h => h)"
IMAGES_SCRIPT = "els => els.map(e => e.currentSrc || e.src).filter(s => s)"
SCROLL_HEIGHT = "document.body.scrollHeight"


def screenshot(context: BrowserContext, page: Page, path: Path, full_page: bool) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        page.screenshot(path=str(path), full_page=full_page, timeout=SCREENSHOT_TIMEOUT_MS)
    except Exception:  # An unpainted window can stall the regular capture.
        cdp = context.new_cdp_session(page)
        try:
            shot = cdp.send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": full_page})
        finally:
            cdp.detach()
        path.write_bytes(base64.b64decode(shot["data"]))
    return path
