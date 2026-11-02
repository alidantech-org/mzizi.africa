---
{id: DEC-DRYV-PACK-SOURCE,name: Decision - Dryv pins and TypeScript authoring,type: decision,tags: [dryv,api]}
---

# Decision: Dryv engine and packs pinned, TypeScript authoring

Date: 2026-11-02 (amended the same day).

## Decision

- Contracts are authored in **TypeScript** with `@dryvcode/author`, in `dryv/contracts`, matching the Alidantech backend. The Python authoring spike was dropped.
- The generated API follows the Alidantech backend structure: `dryv.yaml` pins the engine ref (`6dba3100f02ada9dfd061e5100112c1d01760e3b`) and the packs repository (`https://github.com/dryvcode/packs` at `7fdaa6f0d0d35f0522aabcd2699e48cabf31b46a`). Output goes to `source/backend/api/src/modules/<group>`, `src/types/<group>`, `src/app.module.ts` and `src/database`.
- The project file `dryv.yaml` sits at the repository root because Dryv destinations cannot leave the project root; contracts and project packs stay in the root-level `dryv/` folder as decided.
- The TypeScript author and compiler are linked from the local Dryv checkout (`dryv/scripts/link-dryv.sh`, `DRYV_HOME`), because the published 0.0.1 packages are older than the pinned engine and lack features the contracts use.

## Why

Generated code must be reproducible and structurally identical to the other Alidantech systems so tooling, tests and review habits carry over. Pinning both refs keeps generated diffs attributable to contract changes.

## Consequences

Bumping either pin is its own commit with a regeneration review. A fresh clone needs the Dryv checkout at the pinned ref to regenerate.
