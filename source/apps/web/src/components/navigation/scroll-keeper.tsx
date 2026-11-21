"use client";
/**
 * Keeps reading position and navigation state in the URL:
 *  - same-subject navigation (change place, sort, filter, switch tab) never scrolls to the top and carries the #section;
 *  - the #section in the address follows scrolling, so a shared link opens at the same spot;
 *  - a new subject starts at the top, or at its #section when the link has one.
 */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { demoSegments, isDemoPath } from "#/lib/navigation/base";
import { country } from "#/lib/navigation/route";
import { cancelKeep, contentTop, keepScroll, keeping, scrollState, scrollTarget, scroller } from "#/lib/navigation/scroll";

const viewOf = (search: string) => new URLSearchParams(search).get("view") ?? "overview";
const isExplorer = (pathname: string) => {
  const s = demoSegments(pathname)[0];
  return isDemoPath(pathname) && !!s && !!country(s);
};

export function ScrollKeeper() {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();

  /** Same-subject links keep the scroll position and the #section. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const u = new URL(a.href);
      if (u.origin !== location.origin || !isExplorer(u.pathname) || !isExplorer(location.pathname)) return;
      if (u.pathname === location.pathname && u.search === location.search && u.hash) return; // plain in-page anchor
      if (viewOf(u.search) !== viewOf(location.search)) return; // a different subject starts fresh
      e.preventDefault();
      e.stopPropagation();
      keepScroll();
      router.push(u.pathname + u.search + (u.hash || location.hash), { scroll: false });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  /** Hold the position while the page gets shorter and taller again during loading. User input takes over at once. */
  useEffect(() => {
    const inner = document.querySelector("main")?.firstElementChild;
    if (!inner) return;
    const ro = new ResizeObserver(() => {
      const s = scroller();
      if (s && keeping()) s.scrollTop = scrollState.top;
    });
    ro.observe(inner);
    const stop = () => cancelKeep();
    for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"] as const)
      document.addEventListener(ev, stop, { passive: true });
    return () => {
      ro.disconnect();
      for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"] as const) document.removeEventListener(ev, stop);
    };
  }, []);

  /**
   * After each navigation: restore the position, or go to the #section, or go to the top. Then check the hash is real:
   * a place or tab switch carries the old #section along, and the new page may not have it. Once the page has settled
   * with no such section, the hash is removed so the address never names something that is not there.
   */
  useEffect(() => {
    const main = scroller();
    if (!main) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const kept = keeping();
    if (kept) main.scrollTop = scrollState.top;
    else if (!id) main.scrollTo({ top: 0 });
    if (!id) return;
    let tries = 0,
      stopped = false;
    const check = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (el) {
        if (!kept) el.scrollIntoView({ block: "start" });
        return;
      }
      if (tries++ < 15)
        setTimeout(check, 100); // content may still be streaming in
      else history.replaceState(history.state, "", location.pathname + location.search); // not on this page: drop it
    };
    check();
    return () => {
      stopped = true;
    };
  }, [path, sp]);

  /** The address follows the section you are reading. */
  useEffect(() => {
    if (!scroller()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      const main = scroller();
      if (!main || keeping()) return;
      const top = contentTop();
      const sections = [...document.querySelectorAll<HTMLElement>("main [data-section]")];
      let current = "";
      let best = -Infinity;
      for (const s of sections) {
        const t = s.getBoundingClientRect().top - top;
        if (t <= 120 && t > best) {
          best = t;
          current = s.id;
        }
      } // side-by-side panels tie: the first one wins
      if (main.scrollTop < 60) current = "";
      const want = current ? `#${current}` : "";
      if (want !== location.hash) history.replaceState(history.state, "", location.pathname + location.search + want);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 120);
    };
    const target = scrollTarget();
    target?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target?.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [path]);

  return null;
}
