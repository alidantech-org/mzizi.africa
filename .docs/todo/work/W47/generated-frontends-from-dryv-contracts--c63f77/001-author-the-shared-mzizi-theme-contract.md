---
{id: TSK-3977B5D078D4,name: Author the shared Mzizi theme contract,type: task,status: in-progress,priority: medium,created_at: 2026-11-17T07:26:09.791Z,updated_at: 2026-11-17T07:30:21.095Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:29:04.531Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3977B5D078D4/1794900544533-start,started_at: 2026-11-17T07:29:05.557Z}]}}}
---

# Author the shared Mzizi theme contract

## Goal

Make one Dryv Theme contract the single source of truth for Mzizi's colours, typography, radii, spacing and shadows, so the web and mobile apps later receive identical design tokens from generation instead of hand-copied CSS and Dart. This task only authors and validates the contract; applications selecting it and the packs that render it come in later tasks.

## Context

Dryv implements Themes (decision 0017, `reference/ir/themes.md` in the Dryv repository): typed DTCG-style tokens, eight closed semantic roles and named modes for colour scheme. The TypeScript author exposes `theme`, `token` and `themeMode`. The palette to preserve comes from `source/apps/www/src/app/globals.css`: oat `#F2ECE0`, cream `#FBF7EF`, sand `#E9DEC6`, ink `#2B231C`, ink-soft `#7A6B5C`, line `#E0D5C2`, clay `#B4542F`, calabash `#C68A2E`, raffia `#6B7A4B`, indigo `#2F4C6E`, radii 12/20/30/42 and the display, body and mono font stacks. The landing page must keep working, so it is not edited here. Contracts live under `dryv/contracts/`; project rules are in `AGENTS.md` and `dryv/README.md`.

## Acceptance checklist

- [x] A theme contract exists under `dryv/contracts/` with foundation tokens for every www colour, radius, font stack and shadow.
- [x] All eight semantic roles are bound, and a dark colour-scheme mode overrides the surface and content roles.
- [ ] `bun run typecheck` and the Dryv doctor and compile checks pass for the contract.
- [x] The README of the contracts folder documents where the theme lives and that www is the palette's origin.
- [x] `task validate` passes.
