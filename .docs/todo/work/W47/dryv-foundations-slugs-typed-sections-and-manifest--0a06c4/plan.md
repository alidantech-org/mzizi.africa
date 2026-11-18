---
{id: GRP-D6BCF80A06C4,name: "Dryv foundations: slugs, typed sections and manifest",type: documentation,extra: {created_at: 2026-11-18T20:41:21.179Z}}
---

# Plan

Order: slug registry first (already authored and compiling), then typed sections starting with the statistics and indicator documents, then the manifest and gates. Each step is authored in contracts, checked with typecheck, doctor and compile, regenerated with the known app module overwrite restored, and reviewed as a diff before it is committed on develop.

Safeguards: the Dryv repository contains uncommitted owner changes that are never committed or reverted by this work; seed schemes and values are added only with the owner approving each file; generated migrations are immutable once released; every step records its findings in the plan note dryv-typed-sections-manifest-and-slugs.

Risks: a pack may not emit correct union or nested types for every language, regeneration rewrites many files, and the SubjectTable synchronisation needs generated tables. Each risk has a check in the task checklists and an owner question in the plan note.
