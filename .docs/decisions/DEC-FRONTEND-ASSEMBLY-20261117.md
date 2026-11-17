---
id: DEC-FRONTEND-ASSEMBLY-20261117
name: Frontends are assembled from contracts, SDKs and hand-written components
type: decision
tags: [frontend, dryv, sdk, patterns, owner-approved]
extra: {status: accepted, approved_by: project owner, approved_on: 2026-11-17, implementation: phase_2_web_and_flutter_slice}
---

# Frontends are assembled from contracts, SDKs and hand-written components

The project owner approved these rules for every Mzizi frontend (`source/apps/{app,web,dev}`; `admin` and `mobile` are hand-written and untouched):

1. **Dryv holds intent and behaviour; implementation is hand-written.** A frontend contract (`dryv/contracts/apps/<app>/index.ts`) declares views, parts, view context, destinations, transitions and one theme, and consumes only operations of the app it talks to (`api`, or `engine` for `dev`). An app never invents operations.
2. **One SDK per language, generated once from the `api` contract** into `source/sdk/{api-ts,api-dart}`. Apps import the package; they never carry a copy.
3. **Hand-written components live under `source/ui/{web,flutter}`** and use only the generated theme for colour, type, radii and shadows (`dryv/contracts/schemas/theme.ts` is the one source).
4. **The pack is the pattern binding.** `dryv/packs/app-next` and `dryv/packs/app-flutter` select views by `role` (list, detail; other roles keep the generic page) and write only glue that fills the components' typed props. **There is no separate manifest.** Do not add YAML beyond `dryv.yaml` and the pack's own `dryv.pack.yaml`.
5. **Absolute imports only.** `#/` inside the Next.js apps (tsconfig `paths`), `#sdk/` inside the TypeScript SDK (package.json `imports`, explicit extensions), `#ui/` inside `source/ui/web`, `package:` in Dart. No `../`.
6. **Query logic Dryv cannot express stays hand-written on generated code** (repository, entities, DTOs): the geometry and feature-kind operations.

Handoff and gaps: [HANDOFF-GENERATED-FRONTENDS-20261117](../handoffs/HANDOFF-GENERATED-FRONTENDS-20261117.md).
