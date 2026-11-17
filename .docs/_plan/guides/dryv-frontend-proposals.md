---
id: DOC-31F2B0951714
name: Dryv frontend proposals from the Mzizi phase 2 prototype
type: documentation
tags: [dryv, frontend, proposals, planning]
extra: {status: proposal, dryv_changes: not_approved, evidence: phase_2_prototype}
---

# Dryv frontend proposals from the Mzizi phase 2 prototype

**PROPOSALS ONLY. Nothing here changes the Dryv repository; each needs the owner's approval first.** They follow Dryv's own discovery method (reuse, compose, then a narrow extension of the natural owner) and its principles: intent stays neutral and in the IR, packs decide implementation, and concerns are not mixed. Evidence is the probes recorded in task TSK-A08E18BDB85F (`.docs/todo/work/W47/.../010-phase-2-...`), where the stock Next.js pack and a throwaway template read the generation context.

## 1. A present part can bind its operation's input from view context

**Observed.** A detail view has a context value `featureId` and must read `geography.GetFeature`, whose input is that id. Dryv lets `invoke` bind inputs from view context (`context` list) and lets `collect` bind some paths from context while collecting the rest, but a `collect` with only context is rejected ("input collection selector must be omitted when empty") and a `present` part has no input binding at all. The prototype therefore authored an `invoke` part tagged `run:on-open`, which means a button, to carry the binding. The stock pack ignores context and calls the operation with no input.

**Existing vocabulary tried.** `collect` with an empty selector and context (rejected); `invoke` plus `present` of the same operation (works, wrong meaning: invoke is an action).

**Proposal.** Give a `present` part the same `context` binding list an `invoke` part has: each entry targets an input port of the source operation and names a view context value. Validation reuses the existing rules for invoke: every required input of the operation must be supplied by context (a present part collects nothing), context belongs to the owning view, types match, no duplicates. No new concept, no route, address or widget term; packs decide how the value arrives (a route parameter, a query value, a screen argument).

**Why the natural owner.** The part already owns "which operation output I show"; supplying that operation's input is the same relationship one step earlier.

**Evidence of done.** The detail view's `load` invoke part and its tag disappear; a pack reads the present part's context binding and the generated detail page calls `getFeature` with the id.

## 2. A field source's operation is a dependency of the files that use the field

**Observed.** The feature-type filter field declares a source of purpose `options` pointing at `BrowseFeatureKinds`. The probe shows the source on the field (`sources` is in the collect part's port schema context) but the page's `file.dependencies` contains only `browseFeatures`: the source operation is not planned as a dependency, so the page has no import path or symbol for it. A link context carries the operation's id and name variants but not its group, so a path cannot be built from the link without a naming convention duplicated between packs.

**Existing vocabulary tried.** Reading the source from the field context (works); importing the source operation through the pack's `imports` and `transitive` reach (does not reach it, because dependency planning follows the file subject's references, not a field's sources).

**Proposal.** When planning dependencies, treat the operations named by the `sources` of the schema fields a file's subject reaches as references of that subject, in the same way an operation port's schema is. The existing `needs` slot (`operation.client`) then binds them like any other referenced operation. No IR change.

**Why the natural owner.** Field sources are already validated as references to operation ports; dependency planning is the one place that ignores them.

**Evidence of done.** The generated browse page imports the `BrowseFeatureKinds` action from the bound client and the feature-type filter renders as a choice.

## What needs no Dryv change

Selecting views by `role` and tags to pick a pattern template, reading part tags and the `collection` hint, reading paging (`read.page` of `operation.persistence.document`) from an operation template, and reading field sources. Part order for list and detail patterns is the pattern's concern; an authored order (in the view's presentation, because mobile and web may differ) is needed only for free-form views and is deferred.
