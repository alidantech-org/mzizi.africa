---
{id: TSK-FABC30AE53FA,name: Move runtime and configuration notes out of the schema contracts,type: task,status: planned,priority: medium,created_at: 2026-11-13T08:20:21.293Z,updated_at: 2026-11-13T08:20:21.293Z,order: 12288}
---

# Move runtime and configuration notes out of the schema contracts

## Goal

Parts of the persistence-blocker comments are not schema facts at all: transactional S3 metadata verification, access inheritance and prefix checks, replay and atomic write behaviour, contact access enforcement, the rule that ReplaceCurrent never authorises deleting pinned versions, and the bucket, region and credentials settings. They describe services and configuration, and they make the contracts read as unfinished. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: filesystem.ts, source.ts, legal.ts and official.ts headers and persistence-blocker blocks.
- Right homes: design guides under .docs/design/, decisions under .docs/decisions/, and Dryv policy or operation contracts where the behaviour is a rule the system enforces.
- Keep one short pointer comment per schema naming the design document, so nothing is lost.
- Do not invent new behaviour; only relocate what the comments already state.

## Acceptance checklist

- [ ] List each runtime or configuration statement and choose its destination.
- [ ] Write the statements into the matching design or decision documents.
- [ ] Replace the comments in the contracts with a pointer to the document.
- [ ] Run task validate and formatting, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.
