---
{id: DEC-ENTITY-MATCHING,name: Decision - deduplication and profiling never merge on a name alone,type: decision,tags: [data-engine,dedup,people,organisations]}
---

# Decision: deduplication and profiling

Date: 2 November 2026. The product owner chose scored automatic merging above a threshold. The scoring is built so that a shared name is never enough.

- **Evidence.** A pair is scored from name similarity (order free, honorifics and company words removed), shared identifiers (registration numbers, tax numbers), the same office, the same place and the same party. A shared identifier scores 1. Otherwise the score is 0.8 name, 0.1 office, 0.06 place, 0.04 party.
- **Auto-merge** needs a score of at least 0.9 and corroboration other than the name (a shared identifier, the same office, or the same place together with the same party or, for organisations, the same place) and no conflict. Two people with the same name in different places are flagged and never merged.
- **Flag** at 0.75 or more. Below that nothing is recorded.
- **No record is deleted or rewritten.** Pairs are stored in `engine.match_candidates` with score, features, decision and approving account; merged pairs are grouped (union-find) into `engine.match_clusters`, one canonical member each. A reviewer, a person or an AI agent, can reject a flagged pair; a rejected pair is never re-scored over.
- **Profiles** (`profile <person code>`) join a person's names, offices, party, sources and matches.
- Public identifier lists hide published phones, emails and tax numbers; reviewers and admins see them.
