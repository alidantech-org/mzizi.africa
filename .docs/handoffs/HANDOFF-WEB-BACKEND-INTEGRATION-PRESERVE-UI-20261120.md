---
id: HANDOFF-WEB-BACKEND-INTEGRATION-PRESERVE-UI-20261120
name: Connect the copied web UI to the generated client and actual backend without redesigning it
type: handoff
tags: [web, backend, dryv, sdk, ssr, localisation, handoff]
extra: {date: 2026-11-20, status: ready-for-continuation, task: TSK-0CE2BE62D0CC}
---

# Owner's instruction

Connect the whole real web application to the generated API bridge client and actual backend. **The current copied UI must remain visually and behaviorally the same. Replace its data sources, not its design.** The owner explicitly rejected a newly written sidebar/appbar, simplified settings and a replacement shell. Do not repeat that approach.

This document hands off implementation; writing it does not mean backend integration is complete. Continue the existing delivery programme, especially web task `TSK-0CE2BE62D0CC`, API task `TSK-0A9E5ED02AFE` and generation task `TSK-76DD5D22DDB8`. Do not create a competing backlog. Read current task comments: older implementation claims precede several owner resets and are not proof of current behavior.

## Current checkout: preserve this starting point

The real application is handwritten:

- `source/apps/web/src/components/`: actual `cp -R` copies of demo components, including sidebar/appbar shell, search, location and language popovers, saved/help menus, settings, theme, sound, accessibility, media and visualization components.
- `source/apps/web/src/lib/`: copied helpers grouped by responsibility. Import paths and real preference storage were relocated. `navigation/base.ts` adapts the copied navigation to root URLs.
- `source/apps/web/src/app/(app)/layout.tsx` and `real.css`: copied document, fonts and theme styles. The real document does not register the demo PWA.
- `source/apps/web/src/app/(app)/_views/home.tsx`: only a Home/No content yet placeholder. `/`, `/[country]` and `/[country]/[...place]` currently render it. Subject URLs can change without a subject screen being implemented.
- There are **no** `(app)/_components` or `(app)/_lib` folders. Do not recreate them.
- The permanent reference UI, screens, local datasets, assets and preparation scripts remain under `source/apps/web/src/app/demo/`. Keep `/demo` working until the owner explicitly removes it.

Copied components still import prototype data from `#demo/_data`. They retain hardcoded labels, country lists, availability rules and illustrative behavior. This is intentional temporary scaffolding, not production correctness. Do not move fake data into shared lib/components or silently treat it as accepted backend evidence. The ignored local files also mean a local build is not proof of a clean-checkout, data-free build.

The copying checkpoint preserves 55 component/helper files exactly after import/storage substitutions; the root URL adapter is the additional intentional change. Browser verification showed the sidebar, appbar and complete appearance/accessibility popover. Web TypeScript and documentation validation passed. No web test files were added.

The rejected rewritten shell API/contract/fixture code was reverted. **There is no implemented `/v1/explorer/shell` operation.** Some development-only configuration rows may remain in the local `mzizi_ui` database from that experiment; inspect and reconcile them before relying on them. Their existence is not an approved contract, canonical seed or completed integration.

There is active uncommitted work. Preserve it. Also preserve unrelated owner edits to `.docs/_plan/README.md` and `.docs/_plan/guides/seed-outside-git.md`. Work directly on `develop`, never create a branch/worktree, and do not commit or push without the owner's instruction.

## Non-negotiable UI contract

Preserve the existing component hierarchy, DOM structure where practical, Tailwind classes, spacing, alignment, palette, typography, icon placement, sidebar resizing/collapse modes, responsive drawer, popover positioning, settings tabs/options, keyboard/focus handling and interactions. Keep the current chart/table/document presentation and alternatives as screens migrate.

Use typed props/providers/adapters to supply the existing UI. A successful request is not permission to replace a popover with a select or a full settings panel with three options. Do not delete unsupported controls to make integration appear finished. Model unavailable/empty/loading/error states within their current presentation; explain genuine capability gaps and implement their backend support. Do not invent functionality or evidence to fill them.

Record desktop/mobile screenshots before changes and compare after each slice, including opened popovers and settings. Changed real data, translated labels, genuine missing values and truthful evidence states are expected; layout redesign is not. Any design change beyond what is necessary to represent a real state needs separate owner direction.

CSS tokens, SVG geometry and presentation settings may remain handwritten. Country catalogues, administrative hierarchies, applicability, classifications, metrics, navigation availability and product copy must not be inferred from frontend constants.

## Ownership and generated client

Dryv authors backend schemas, requests/responses, API transport and the full TypeScript API bridge client. **All UI, pages, themes and components stay handwritten. Do not turn web frontend generation back on.** Follow the current contracts and packs, not historical generated-screen instructions in older handoffs.

The generated SDK is `source/sdk/api-ts`:

```text
src/
  routes.ts           sole HTTP route registry
  index.ts            client-safe route/type exports
  actions/            one resource/group file, plus index.ts
  helpers/            shared next-api-bridge infrastructure
  types/              named generated resource DTOs and enums
```

Use public package exports:

```ts
import {
  explorerGetSetupBootstrap,
  explorerGetExplorerContext,
  explorerGetExplorerOverview,
  explorerSearchExplorerPlaces,
  explorerListExplorerChildren,
  explorerResolveExplorerCoordinates,
} from "@mzizi/api-client/actions/explorer";
import type { ExplorerContext } from "@mzizi/api-client";
```

Do not import `@mzizi/api-client/actions/explorer.actions.ts`: that obsolete spelling caused the reported build error. No compatibility shims, router folders, per-operation action folders, version files or `v1.ts`. Existing HTTP paths can still contain `/v1`; that does not require versioned client files.

The current explorer contract is `dryv/contracts/apps/api/explorer.ts`; its six operations cover bootstrap, context, overview, search, children and coordinate resolution. They do not support every copied screen. Review all resource contracts before adding endpoints. Authored changes must regenerate both backend artifacts and SDK; never patch generated output by hand. Repair the contract/pack when generation is wrong. Use generated named types without response duplicates or casts hiding mismatches.

`SERVER_URL` configures the server bridge. Verify the actual API process, port and database; root runner environment may override Next environment files. Do not connect to another database merely because a process responds.

## First work: inventory before swapping data

Create a screen/control-to-data matrix on the existing task. Inspect every static/dynamic `#demo/_data` dependency in real components/lib and each demo view to migrate. Include hidden dialogs, settings options, voice/audio behavior, saved items, document/source readers, maps, geometry and chart calculations.

For each item record its current UI/component, prototype input, required generated type/operation, context/applicability rules, language requirements, evidence/date/unit requirements, mutations, empty/error behavior and backend/database gap. An existing table or HTTP 200 is not a supported screen.

Inventory server/client boundaries as well. Identify pure display calculations that can stay local versus canonical applicability, classification, aggregation or comparison logic that belongs in backend reads. Produce one authoritative typed backend composition per screen/coherent region rather than joining unrelated endpoints in the browser.

## Implementation sequence: complete vertical slices

1. **Foundation without visual changes.** Keep the copied shell and providers. Introduce server-only SDK loaders and typed bindings. Resolve country/place/language, interface copy and navigation configuration on the backend; supply the same sidebar/appbar and popovers. Preserve every settings option. Personal display preferences may remain cookie-owned; product catalogues, labels and availability come from the backend. Fix database/API gaps before removing a prototype dependency.
2. **Setup and home.** Connect the existing onboarding/location dialog, manual country/place selection, search, confirmation, preference persistence and sharing. `/` remains neutral: do not infer Kenya from the copied `DEFAULT_PLACE`. Device/network hints are suggestions; the explicit selected path wins. Populate home/overview using recorded contextual reads and keep its existing design.
3. **Place and governance.** Copy the existing demo views into `(app)/_views` as needed, preserving their design. Connect overview, leaders, institutions, arms, powers, responsibilities and selection/seat presentations through generated types and composed reads. Separate expected seat counts, offices, holders and occupancy, and distinguish formal authority from administrative containment.
4. **Laws and documents.** Connect instruments, provisions, navigation/contents, source media, evidence and relationships affecting the selected place. Preserve document readers and nested selection behavior.
5. **Statistics, comparisons and elections.** Replace demo observations, maps, rankings, trends and results with persisted records and backend comparability decisions. Preserve units, periods, missingness and provenance; no fabricated totals or synthetic geometry presented as actual boundaries.
6. **Finance, procurement and suppliers.** Connect allocations, spending, projects, contract lifecycle, supplier relationships and evidence-labelled networks. Do not turn review signals into wrongdoing claims.
7. **Remaining destinations and personal actions.** Connect sources, content/calendar/coverage/search, utility pages, saved items, likes and view recording. Preserve anonymous local saved preferences where intended; authenticated persistence requires the actual supported mutation. Do not claim a click persisted merely because local state changed.
8. **Remove real-app prototype dependencies.** Complete the dependency audit across real routes/components/lib. Keep prototype datasets, fixtures and preparation scripts only in `/demo` or approved development tooling. `/demo` remains a working design reference, not a runtime fallback for the real app.

For promises/completeness and other later programme features, use persisted evidence and labelled deterministic fixtures where supported. Engine discovery, matching and pattern expansion remain excluded unless separately authorised. Do not use those exclusions to omit a supported UI read.

## Context, URL and language rules

Country/place path is authoritative: `/ke`, `/ke/nairobi`, `/ke/nairobi/westlands`; the same resolver must support other registered countries such as `/za`. No country subdomains in this delivery. Do not hardcode Kenya's hierarchy or imply constituency/ward structure is globally universal.

Subjects and selections use `view` and `view.*`; filters use `filters.*`, ordering `sort.*`, pagination `page.*`, shareable presentation `display.*`; the hash identifies the reading section. Each view declares valid combinations. Laws may use `view=law&view.entity=instrument&view.id=…&view.provision=…`, with actual agreed names settled against the preserved UI/contracts. Do not embed `laws/slug` in `view` or turn content identifiers into place path segments.

Sidebar navigation keeps place and clears incompatible selection/filter state. Place changes retain the subject and compatible subsection, clear incompatible record identity, and preserve scroll/hash. Changes to list membership/order reset its page. Back/Forward, deep links and sharing must restore context. Resolve national/inherited/local applicability in backend reads with evidence and uncertainty; do not blindly include all ancestors' records or filter only by exact place ID.

`lang` is optional and uses supported recognisable codes such as `en` and `sw`. Explicit URL language wins and persists; otherwise use the cookie, then the supported default. Do not automatically append `lang` to cookie-only journeys. Sharing offers the initially-on language toggle. Preserve the language popover and settings design. Audit full English/Swahili coverage, including aria labels, dialogs, disabled explanations, error/empty states and metadata. Never advertise complete coverage while silently falling back to English. Source texts retain their actual language and provenance.

The copied root preference namespace is currently `mzizi-app-*`, independent of `mzizi-demo-*`. Inspect existing codecs/server initialisation before changing it; do not mix them with obsolete welcome-dialog cookie formats or break first paint.

## SSR and interaction boundary

All product datasets load in server rendering through generated SDK actions. Direct URLs must contain meaningful rendered content. Cache keys must separate place/country, effective language, view/selection and relevant filters; personalised responses must not leak through shared caches. Shared layouts must not retain stale context after navigation.

Client leaves handle UI state, resizing, opening popovers, focus, theme/audio/accessibility, clipboard, approved mutations and device capabilities. They receive generated typed data. No product `fetch`, client effects, SWR/query hooks or client calls to server-action read wrappers. Open/search/narrow a dataset by URL navigation to an SSR read while preserving the same popover experience; do not close/rebuild the UI as a shortcut. Separate genuinely local control state from shareable data selection.

Coordinates may be obtained in the browser only with the intended user permission flow, then submitted through the generated resolution operation, confirmed and navigated to the canonical place. Never put precise coordinates in shared URLs. Preferences and engagement writes remain explicit mutations, not an excuse for client-loaded product reads.

## Backend/database/fixtures and acceptance

Reuse existing reference copy/languages/values/labels, geography and domain structures after verifying current constraints. Add missing screen composition and localization support through owning contracts and typed backend handlers. Custom typed handlers are allowed by the owner's later direction; do not reintroduce duplicate API schemas or canonical frontend rules.

Use real persisted records, including clearly labelled synthetic development fixtures where acquisition is excluded. Unknown stays unknown. Do not fabricate flags, indicators, occupancy, translations or evidence. Media needs registered metadata/bytes and lawful provenance; use a neutral existing UI state when unavailable. No external acquisition is silently authorised by this handoff.

Read `seed/README.md`: root seed files/folders/manifest entries still require per-file owner approval. Extend existing development tooling without resetting databases, deleting artifacts or committing fake datasets, GeoJSON, flags/downloaded images. Do not bypass approval by creating a second canonical seed tree. Keep real reusable code and identity assets distinct from ignored local development data.

Acceptance for every slice:

- Same design and interaction at desktop/mobile, including open popovers, settings, long labels, themes, focus and graph/table alternatives.
- Generated contracts/client/types match the running backend; appropriate API/fixture checks prove inclusion/exclusion, pagination, validity and totals.
- Direct SSR content and browser network evidence show no client-initiated product reads.
- Path/query/hash, sidebar, place changes, language, sharing and history behave correctly.
- No mock fallback in the completed slice; missing support is explicit rather than hidden.
- Preserve demo and existing working engagement behavior. No new automated web tests until the owner requests them; use browser verification, TypeScript and the configured formatter. Backend/SDK tests remain appropriate.
- Run relevant generation/type/quality/documentation checks; record pre-existing failures accurately. Known baseline issues include oversized `scripts/dev/dev_seed/extra.py`, oversized API insights contract and Python lint/type/test failures. Recheck current output rather than claiming all checks pass.

Keep the existing tasks updated with changed files, remaining gaps and browser evidence. Do not mark the whole web app complete because its shell renders. Finish only when all migrated screens and controls use actual supported backend data with the preserved UI, or a specific remaining item has an explicit owner-approved deferral.
