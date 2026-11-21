/**
 * Scroll memory for the scrolling area (<main>). Navigation inside the same subject must not send the reader back to
 * the top, even while the next place is loading and the page briefly gets shorter. Call keepScroll() right before
 * such a navigation; ScrollKeeper restores the position while the new content settles.
 */
/**
 * From the `lg` breakpoint the app scrolls inside <main> under a fixed frame. Below it the page scrolls naturally with
 * the document, so the phone browser can collapse its address bar and the app bar sticks below it.
 */
export const isFrame = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
export const scroller = (): HTMLElement | null =>
  typeof document === "undefined" ? null : isFrame() ? document.querySelector<HTMLElement>("main") : (document.scrollingElement as HTMLElement | null);
/** What to attach scroll listeners to: <main> in the frame, the window otherwise. */
export const scrollTarget = (): HTMLElement | Window | null =>
  typeof document === "undefined" ? null : isFrame() ? document.querySelector<HTMLElement>("main") : window;
/** The bottom edge of the app bar: where visible content starts. */
export const contentTop = () => document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;

export const scrollState = { top: 0, until: 0 };

export function keepScroll() {
  scrollState.top = scroller()?.scrollTop ?? 0;
  scrollState.until = Date.now() + 4000;
}
export const cancelKeep = () => {
  scrollState.until = 0;
};
export const keeping = () => Date.now() < scrollState.until;

/** The hash for the current position, so it can travel with place and filter changes. */
export const currentHash = () => (typeof location === "undefined" ? "" : location.hash);
