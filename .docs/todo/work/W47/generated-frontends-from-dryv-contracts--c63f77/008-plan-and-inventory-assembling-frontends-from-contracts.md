---
{id: TSK-66BADAC8CE62,name: "Plan and inventory: assembling frontends from contracts",type: task,status: in-progress,priority: medium,created_at: 2026-11-17T09:01:12.124Z,updated_at: 2026-11-17T09:01:18.482Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T09:01:18.482Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-66BADAC8CE62/1794906078485-start,started_at: 2026-11-17T09:01:19.082Z}]}}}
---

# Plan and inventory: assembling frontends from contracts

## Goal

Decide how Mzizi's web and mobile apps are assembled from Dryv contracts while Dryv stays out of implementation. Dryv should supply intent and behaviour vocabulary and patterns; hand-written shells and components provide implementation; generation produces only thin typed glue linked by operation and schema. This task records what Dryv already offers, what is missing, and the phased plan, so the owner can approve direction before any component library or Dryv change begins.

## Context

The shared theme, SDKs and first generated slice exist (tasks in this group). Dryv's reference docs and generation context show views with present, collect and invoke parts, view context, overlay flows, destinations, field query capabilities and field-local option sources, but no addressable state, paging vocabulary or after-effects. The plan lives in `.docs/_plan/guides/frontend-assembly-from-contracts.md`. No change to the Dryv repository is made or approved by this task. Riderescue's dashboard and mobile kits are the source of shell patterns.

## Acceptance checklist

- [x] The plan document records the inventory with evidence for each Dryv capability and its verdict.
- [x] The three layers, the assembly flow, the behaviour vocabulary to define, the phases and the open questions are written down.
- [x] The owner has answered the open questions or accepted the plan, recorded in this task.
- [x] `task validate` passes.
