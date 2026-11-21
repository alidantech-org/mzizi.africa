---
{id: RULE-WEB-LOADING-STATES,name: Loading states and paint-first pages,type: rule,tags: [web,loading,performance,agent-guidance]}
---

# Loading states: paint first, then fill

These rules bind every contributor and every AI agent working on `source/apps/web`. A screen is never blank and never jumps while it loads. **Every new UI feature must follow this pattern; a feature without it is not finished.**

## The pattern

1. **The frame paints at once.** The root layout wraps the data-loading shell in `<Suspense fallback={<ShellSkeleton />}>`. The skeleton has the real shell's structure and outer sizes. The sidebar width comes from the cookie through the first-paint script (`--side-w`, `data-side`), so the real shell replaces the skeleton without moving.
2. **Every route segment has a `loading.tsx`.** It shows `PageSkeleton` (or a skeleton shaped like that segment) inside the app frame. A new page adds its own `loading.tsx` when its layout differs from the default.
3. **Placeholders hold the size of what replaces them.** Give a skeleton the height and width of the content it stands for (a chart's height, a list's row height), so nothing shifts when data arrives. Never swap a spinner or the word "Loading…" for a region of a page.
4. **Stream by region.** Wrap each independently loaded region (a chart, a map, a table) in its own `<Suspense fallback={...}>`, so the page heading and the fast regions appear first. Do not make the whole page wait for its slowest read.
5. **Lists in popovers and dialogs** show `SkeletonRows` while their server read is under way, with the loading text kept as an accessible label (`aria-busy`, `aria-label` from copy).
6. **Server reads, not client effects.** A skeleton covers a server render that is still running. It does not hide a client-side fetch; product data is not fetched from client effects (see `AGENTS.md`).

## The parts

- `src/components/ui/skeleton.tsx`: `Skeleton`, `SkeletonHeader`, `SkeletonPanel`, `PageSkeleton`, `SkeletonRows`. Server-safe, no hooks.
- `src/components/layout/shell-skeleton.tsx`: the app frame.
- `.shimmer` in `src/app/(app)/real.css`: one barely visible block with a faint sweep. It stops under `prefers-reduced-motion` and under the "Reduce motion" preference.

## Look

Placeholders are quiet: a flat block of about 5% ink with a sweep of the same strength. No accent colours, no borders, no text-shaped detail. Use few blocks: a heading block and one or two content blocks per region is enough. Do not draw cards, icons or lines of text inside a skeleton.

## Checklist for a new feature

- [ ] The route has a `loading.tsx` (or inherits one that fits).
- [ ] Each slow region is inside its own `Suspense` with a sized skeleton.
- [ ] Skeleton sizes match the loaded content.
- [ ] Any list that loads on the server shows `SkeletonRows`.
- [ ] Nothing uses a spinner or "Loading…" text for a page region.
- [ ] Checked with a slow API (and with Reduce motion on).
