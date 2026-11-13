---
{id: TSK-9C953AD7CBB8,name: Decide how Accountability indicators are defined,type: task,status: planned,priority: medium,created_at: 2026-11-13T08:20:21.548Z,updated_at: 2026-11-13T08:20:21.548Z,order: 13312}
---

# Decide how Accountability indicators are defined

## Goal

Accountability is described as a read-only derived surface with no storage, and its contract says query and aggregate execution is not implemented by the database application. The seven indicator names are only a list, so the group has no real contract and the comment reads as unfinished work. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Affected comments: accountability.ts header and the generation-gated summary in apps/database/index.ts.
- Options: define the indicators as Dryv view declarations and teach the SQL pack to generate database views; keep them as an API-layer concern and remove the group from the database app; or defer the group entirely.
- The decision belongs to the owner because it changes what the database app owns.
- Whatever is chosen, the comment should state the decision rather than complain about a missing feature.

## Acceptance checklist

- [ ] Write a short decision note comparing the three options for the owner.
- [ ] Record the owner's choice as a decision document.
- [ ] Implement the chosen option or remove the group.
- [ ] Update the app-level comment in apps/database/index.ts to state the current gating accurately.
- [ ] Run task validate and formatting, and report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.
