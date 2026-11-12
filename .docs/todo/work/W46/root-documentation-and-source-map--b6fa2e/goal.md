---
{id: GOAL-GRP-761C6BB6FA2E,name: Root documentation and source map goal,type: documentation,extra: {created_at: 2026-11-12T06:32:18.438Z,group: GRP-761C6BB6FA2E}}
---

# Root guidance and source map accuracy

Make the repository's two root-level guidance files serve their distinct readers. `README.md` should introduce Mzizi and orient users and contributors to the source code that exists today. `AGENTS.md` should give agents concise, actionable engineering constraints and the same verified source map without repeating a stale target architecture. Every core or source README directly referenced by these entry points must use valid paths, describe implemented behavior accurately, and mark incomplete boundaries explicitly. The user supplied the intended source hierarchy; the repository should be audited against it rather than assumed to match in every detail. Preserve useful project purpose and evidence-first design while removing obsolete target paths and old port/command instructions.
