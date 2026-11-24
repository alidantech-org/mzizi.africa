---
{id: TSK-CBB8B40CF8E0,name: "Workers and runs, phase 5: the Ranker port with a rule-based implementation",type: task,status: archived,priority: medium,created_at: 2026-11-16T09:48:45.924Z,updated_at: 2026-11-24T19:25:11.517Z,order: 14336,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:25:11.517Z}]},archived_at: 2026-11-24T19:25:23.410Z}
---

# Workers and runs, phase 5: the Ranker port with a rule-based implementation

## Goal

Add a `Ranker` port to the crawler and a rule-based implementation driven by the site manifests, supporting criteria mode (rank before fetching) and hunt mode (fetch everything that matches the file rules and rank after extraction), recording every skip with its score and reason.

## Context

Depends on phase 4. Ranking and `expect` rules are specified in `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md` and `CRAWL_AND_PURPOSE_DETECTION.md`; the crawler already ranks attachments (`features/rank`, `mzizi_crawler.shared.scraping.rank`). The vector store is only a skeleton (`persistence/vector`): do not build vector ranking, only leave the port so a vector ranker can plug in later. A skip is never silent: the run manifest lists skipped URLs with score and reason so recall can be measured.

## Build

- [ ] The `Ranker` port and a rule-based implementation from site manifests; thresholds come from manifest data, not code.
- [ ] Criteria and hunt modes selectable per spec; ranking after extraction in hunt mode.
- [ ] Every fetch and skip decision recorded in the run's decisions list and events.
- [ ] Tests on the loopback site for both modes, including a deliberately mis-ranked page to show the skip is recorded.

## Acceptance checklist

- [ ] Criteria mode fetches only candidates above the threshold and records the rest; hunt mode fetches all matches and ranks afterwards.
- [ ] No hard-coded site, country or classification knowledge; no regular expressions outside the pattern modules.
- [ ] Strict typing, boundaries 0, structure clean, suite unchanged or better, `task validate` passes, docs and the task note updated.

## Comments

### 2026-11-16T14:28:06.485Z · PETER IRUNGU

Note from the schema redesign (16 Nov 2026): ranking rules are now the rank block of a website source manifest (source/schema/sources/website.schema.json, example in source/schema/sources/_example/website-bundle/manifest.yml), not a standalone ranking.yml with a schema marker. A rule's target must be a stored table listed in the generated source/schema/database/*.schema.json. The crawler already validates rules this way (validate_ranking).
