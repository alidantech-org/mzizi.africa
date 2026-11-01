---
{id: TSK-C8093926792F,name: Unify mobile search and selected-place navigation,type: task,status: planned,priority: medium,created_at: 2026-11-01T00:36:49.760Z,updated_at: 2026-11-01T05:36:25.327Z,tags: [mobile,search,navigation],extra: {description: "Connect map and application search entry points to real available data, keep query state and selected canonical entity coherent, and provide visible empty/error/retry behavior. Do not fabricate search records when a data endpoint is unavailable.",acceptance_criteria: ["Search submits by keyboard and button, supports clearing, and handles rapid query changes safely.",Choosing a geography navigates/focuses the correct map entity.,History and Saved search continue filtering their actual records.,Money search is clearly scoped to available local fiscal sections until an API exists.]},due_at: 2026-11-12}
---

# Unify mobile search and selected-place navigation

## Summary

Make mobile search entry points and selection transitions use available API or on-screen records with clear status feedback.

## Acceptance criteria

- [ ] Keyboard submit, search action, and clear behavior work consistently.
- [ ] Rapid requests cannot replace newer results with stale responses.
- [ ] Geography results focus the correct canonical map entity.
- [ ] Unavailable datasets are not represented as fabricated search results.
