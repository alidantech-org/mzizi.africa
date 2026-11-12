---
{id: TSK-EBA9E2370C55,name: Research and reinforcement of expectations into identified places,type: task,status: archived,priority: medium,created_at: 2026-11-02T20:59:36.382Z,updated_at: 2026-11-12T05:47:35.233Z,order: 6656,depends_on: [TSK-28DC592B1E17],due_at: 2026-11-04,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T06:16:13.177Z},{from: in-progress,to: planned,at: 2026-11-03T06:17:10.018Z},{from: planned,to: in-progress,at: 2026-11-03T06:18:53.645Z},{from: in-progress,to: planned,at: 2026-11-03T06:21:26.403Z},{from: planned,to: in-progress,at: 2026-11-03T06:22:03.490Z},{from: in-progress,to: planned,at: 2026-11-03T06:23:46.092Z},{from: planned,to: blocked,at: 2026-11-03T06:27:00.590Z},{from: blocked,to: planned,at: 2026-11-03T06:27:49.245Z},{from: planned,to: in-progress,at: 2026-11-03T06:38:54.681Z},{from: in-progress,to: archived,at: 2026-11-12T05:47:35.233Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EBA9E2370C55/1793686573236-start,started_at: 2026-11-03T06:16:15.027Z,end_ref: refs/tracking/TSK-EBA9E2370C55/1793686630019-end,ended_at: 2026-11-03T06:17:10.018Z,summary: {files: 0,insertions: 0,deletions: 0}},{base_ref: refs/tracking/TSK-EBA9E2370C55/1793686733646-start,started_at: 2026-11-03T06:18:54.556Z,end_ref: refs/tracking/TSK-EBA9E2370C55/1793686886404-end,ended_at: 2026-11-03T06:21:26.403Z,summary: {files: 5,insertions: 478,deletions: 0}},{base_ref: refs/tracking/TSK-EBA9E2370C55/1793686923490-start,started_at: 2026-11-03T06:22:04.608Z,end_ref: refs/tracking/TSK-EBA9E2370C55/1793687026093-end,ended_at: 2026-11-03T06:23:46.092Z,summary: {files: 6,insertions: 1024,deletions: 0}},{base_ref: refs/tracking/TSK-EBA9E2370C55/1793687934686-start,started_at: 2026-11-03T06:38:56.071Z,ended_at: 2026-11-12T05:47:35.233Z,end_error: "EROFS: read-only file system, open '/home/alidante/.local/share/taskcode/projects/f166568a11ef213d/.init.lock'"}]}},archived_at: 2026-11-12T05:47:53.793Z}
---

# Research and reinforcement of expectations into identified places

## Goal
Turn expectations into identified places and confirmed occupancies using documents, while keeping every claim, its evidence and any conflict.

## Context
The research states are represented with existing parts: expected by rule or plan is the expectation basis; identified by an official source, reported by a secondary source, corroborated and contradicted are attribution relations plus the verification state; not researched, researched without details and confirmed closed are expectation statuses. Sources include the constituency offices PDF already downloaded (290 offices), crawled site sections, Wikidata and OpenStreetMap where the licence is recorded, and manually researched seeds. Conflicting claims are kept with source trust ranking; nothing is overwritten. Duplicate places from several sources are scored on name, address and point and flagged, never merged on name alone (DEC-ENTITY-MATCHING). Moves and closures end occupancies, never delete places. Depends on the content-section crawler for documents.

## Acceptance checklist
- [ ] Parse the constituency offices PDF into candidate places with fuzzy geography matching.
- [ ] Create refill jobs that attach address, point and contact claims with attributions.
- [x] Resolve expectations to occupancies only when a verified or corroborated claim exists.
- [x] Record moves, splits, closures and disputes through links and verification states.
- [x] Report expectation coverage by status and by institution.
