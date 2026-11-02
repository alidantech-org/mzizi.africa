---
{id: TSK-C8093926792F,name: Unify mobile search and selected-place navigation,type: task,status: completed,priority: medium,created_at: 2026-11-01T00:36:49.760Z,updated_at: 2026-11-01T05:46:57.873Z,tags: [mobile,search,navigation],extra: {description: "Connect map and application search entry points to real available data, keep query state and selected canonical entity coherent, and provide visible empty/error/retry behavior. Do not fabricate search records when a data endpoint is unavailable.",acceptance_criteria: ["Search submits by keyboard and button, supports clearing, and handles rapid query changes safely.",Choosing a geography navigates/focuses the correct map entity.,History and Saved search continue filtering their actual records.,Money search is clearly scoped to available local fiscal sections until an API exists.],status_history: [{from: planned,to: completed,at: 2026-11-01T05:46:57.873Z}]},due_at: 2026-11-12}
---

# Unify mobile search and selected-place navigation

## Goal

Make each mobile search control lead to real, clearly scoped results and ensure choosing a geography focuses the map on the same canonical entity. Search requests can overlap when a person types quickly, changes a query, resets the map, or switches from results to a feature tap. Older responses must not replace the visible results or selected place. Empty and unavailable states must be honest; the client must not manufacture search results for governance or fiscal APIs that do not exist.

## Context

Explore and Home search geographic entities through `GeographyApiClient.search`. Home's search dialog also supports retry after an error. History filters the timeline records available on that screen, Saved filters the user's saved library, and Money currently narrows its existing fiscal-information sections rather than querying a nonexistent fiscal endpoint. Each screen should keep its behavior consistent between keyboard submit and search action, clear results when a query is cleared, and present API errors as errors rather than “no matches.” Selecting a map feature resolves its ID through the API; duplicate names remain distinct.

## Acceptance checklist

- [x] Search controls support keyboard submission and action buttons, and clearing a query clears old results.
- [x] In-flight requests are invalidated when the query changes, a place is selected, or the map is reset.
- [x] Selecting search results or map features focuses the map by canonical ID and preserves backend hierarchy.
- [x] Search does not fabricate governance or money records when those datasets are unavailable.
