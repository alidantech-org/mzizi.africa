---
{id: TSK-24022EF90C1A,name: Validate canonical two-store Mzizi generation,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T11:40:31.473Z,updated_at: 2026-11-13T11:52:07.112Z,order: 12288,depends_on: [TSK-4D66638B9176],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T11:52:07.112Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-24022EF90C1A/1794570727113-start,started_at: 2026-11-13T11:52:07.611Z}]}}}
---

# Validate canonical two-store Mzizi generation

## Goal
Prove that the completed two-store contract and pack setup generates isolated Main and Operations artifacts while leaving unrelated legacy API output and immutable database releases intact.

## Context
This is the separate validation phase after the canonical-store implementation task passes code/documentation, typechecks and formatting. It uses the actual Mzizi authoring entrypoint and project-owned Rust packs with the current local Dryv Engine. Generation may update managed models and schema snapshots, but may never apply migrations or modify existing releases, database roles, seeds or object bytes. Preserve the existing Main and Operations deployment names and the public migration ledger. Record real observed results and distinguish unrelated baseline failures from changed-code regressions.

## Acceptance checklist
- [x] Compile and validate the database authoring source with both canonical stores, explicit application access and provider declarations; check non-persisted views and relation enforcement.
- [ ] Run app/store selection and pack analysis/rendering proofs, including store-only output isolation and unchanged legacy API output.
- [ ] Run affected Rust/TypeScript and canonical assignment checks; verify generated model module paths and schema SQL remain compatible with the database foundation.
- [ ] Verify immutable migration release/sidecar hashes and ledger code remain unchanged, and confirm no live migrations or database setup commands ran.
- [ ] Run the applicable root checks and task validate, record results and any pre-existing failures, and update the acceptance checklist immediately as each proof completes.

## Handoff
Keep the implementation task completed unless validation identifies a concrete defect in its code. For a defect, record it on that same task, correct code and repeat affected static gates before retrying its proof. The final handoff must name generation commands, store/pack ownership, checkpoint behavior and the unsupported initial Dryv migration mappings. No automatic commit or publication is part of this validation task.

## Comments

### 2026-11-13T11:58:00.819Z · PETER IRUNGU

Canonical database checks pass with Main=81 and Operations=46 concrete entities. Both stores and seven provided operations compile with the rebuilt local Dryv author/compiler; the actual Engine database-app plan now succeeds after fixing declared output-name defaults, an unsupported sort filter, and the inherited Jinja dict.values collision in SQL expression traversal. Root tooling tests pass 22/22. Historical docs link corrected; task validate passes. No live database/role/seed commands ran.

### 2026-11-13T12:08:04.964Z · PETER IRUNGU

User steering: remove all generated Rust code. Removed the entire generated src/models tree (265 .rs files, old flat and new store-grouped outputs), preserving scaffold lib.rs, Cargo manifests, handwritten Rust, SQL snapshots, immutable releases and all other-AI Python package edits. No further Rust regeneration is authorized by this removal request. The earlier actual generation succeeded (81 Main rows, 46 Operations rows; SQL snapshots contain 81/46 CREATE TABLE statements). Rust compilation was attempted before removal and failed; no compile pass is claimed. Remaining validation criteria must account for the deliberately absent generated models.
