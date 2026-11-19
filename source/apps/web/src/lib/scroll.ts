/**
 * Scroll memory for the scrolling area (<main>). Navigation inside the same subject must not send the reader back to
 * the top, even while the next place is loading and the page briefly gets shorter. Call keepScroll() right before
 * such a navigation; ScrollKeeper restores the position while the new content settles.
 */
export const scroller = () => (typeof document === "undefined" ? null : document.querySelector<HTMLElement>("main"));

export const scrollState = { top: 0, until: 0 };

export function keepScroll() {
  scrollState.top = scroller()?.scrollTop ?? 0;
  scrollState.until = Date.now() + 4000;
}
export const cancelKeep = () => { scrollState.until = 0; };
export const keeping = () => Date.now() < scrollState.until;

/** The hash for the current position, so it can travel with place and filter changes. */
export const currentHash = () => (typeof location === "undefined" ? "" : location.hash);
