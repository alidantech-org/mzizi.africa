---
{id: TSK-67FD455410F2,name: "Single mzizix database, real seed data and Acts from PDF",type: task,status: in-progress,priority: high,created_at: 2026-11-25T18:52:51.738Z,updated_at: 2026-11-25T18:52:51.738Z,tags: [seed,legal,database],order: 4096}
---

## Goal
Make `mzizix` the only local database with every app reading the root `.env`, fill it with real seed data (geography, statistics, reference, the Constitution and six Kenyan Acts) loaded incrementally without resets, and read Acts from PDF into the legal schema with the extraction package.

## Context
Earlier work left many scratch databases and per-app env files. The seed now lives in the git-ignored `.dev/seed/rebuild`, loaded by `batches.py` (staging, `ON CONFLICT DO NOTHING`, ledger). Acts are read by `mzizi_extraction.legislation.parse_act` and `find_citations`; `.dev/seed/rebuild/legal_acts.py` maps them to rows. The `legal.references.metadata` jsonb column was added as release `0002`, and `dryv.yaml` lost its dangling `app-app` destination so generation works again. Kenya Law is behind a bot challenge, so only the PDFs the owner supplied or Parliament publishes are used.

## Acceptance checklist
- [x] `mzizix` is the only database; `bun run db reset --yes` and `.docs/rules/database.md` document the guarded restart.
- [x] Geography, WHO and World Bank statistics, ISO and CLDR reference data and the Constitution are loaded without a reset.
- [x] Six Acts are parsed and match their contents pages, with lists, ranges and outside-instrument citations resolved.
- [x] Every Act is linked subordinate to the Constitution and instrument-only mentions are `cites` relationships.
- [x] Release 0002 and the regenerated snapshot agree, and the database tests pass.
- [ ] The apps are checked against the new data and `bun dev` is verified end to end.
- [ ] The source catalogue (publishers, sources, editions) is seeded into `source.*`.

## Comments

### 2026-11-25T20:01:05.875Z · PETER IRUNGU

Translation package, engine operations, PostgreSQL store, CLDR names (Swahili, Somali, French) and design doc done; gaps listed in .docs/design/data/TRANSLATION_PIPELINE.md (no model chosen, no provenance in source, nothing applied).
