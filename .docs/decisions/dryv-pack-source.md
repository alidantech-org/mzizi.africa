---
{id: DEC-DRYV-PACK-SOURCE,name: Decision - Dryv packs pinned to a git ref,type: decision,tags: [dryv,api]}
---

# Decision: Dryv packs pinned to a git ref

Date: 2026-11-02.

## Decision

Mzizi consumes Dryv packs (`typeorm`, `nestjs`, `class-validator`) from the Dryv repository at a pinned commit, not from a floating local checkout. The first pin is `6dba3100f02ada9dfd061e5100112c1d01760e3b`. The pin is recorded in `dryv/README.md` once the folder exists, and bumping it is a deliberate commit that regenerates output and reviews the diff.

## Why

Generated code must be reproducible by anyone and in CI. A moving local path makes generated diffs change without any change to Mzizi contracts, which breaks the cause-and-effect auditability Dryv promises. The local checkout at `/home/alidante/Projects/personal/alidantech-org/codepot/dryv` is still the development source: use `git -C` to check out the pinned ref there before generating.

## Consequences

- Generated output records the pack ref used.
- Upgrading Dryv is its own task with a regeneration review.
