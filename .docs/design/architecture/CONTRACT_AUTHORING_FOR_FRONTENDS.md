---
id: DOC-CONTRACT-AUTHORING-FOR-FRONTENDS-20261118
name: CONTRACT_AUTHORING_FOR_FRONTENDS
type: documentation
tags: [dryv, contracts, packs, frontend, sdk, generation, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-18, code_changes: none, supersedes: DEC-FRONTEND-ASSEMBLY-20261117}
---

# Authoring frontends in Dryv contracts

**Status: proposal.** It replaces the 2026-11-17 rule that "implementation is hand-written" ([DEC-FRONTEND-ASSEMBLY-20261117](../../decisions/DEC-FRONTEND-ASSEMBLY-20261117.md)). Rules from the owner: schemas, operations, queries and all backend and frontend behaviour are authored in `dryv/contracts/apps` and `dryv/contracts/schemas`; packs generate code; frontends reach the backend only through the generated SDK; whatever Dryv cannot express is fixed by improving Dryv and its packs, never by hard-coding in an app.

## 1. Layers and who owns what

| Layer | Owns | Never contains |
| --- | --- | --- |
| Schemas (`contracts/schemas`) | tables, reference data shapes, interaction and context entities | UI words |
| API contract (`contracts/apps/api`) | operations, composed reads with typed sections, context requirements, client-kind rules | per-screen presentation |
| App contracts (`contracts/apps/<app>`) | features, views, parts, intents, destinations and navigation, copy keys, state and preference declarations, render mode | operations of their own; hand code |
| Packs | the implementation patterns: server pages, SDK server and browser forms, routers, providers, repositories, header and tab bars, theme, copy delivery, trace headers | project knowledge (countries, indicators) |
| Generated code | everything packs emit, regenerated and never hand-edited | decisions |
| Hand-written source | visual components only, in `source/ui/web` and `source/ui/flutter`, taking typed props and the generated theme | `fetch`, route handlers, country or indicator literals, colours, copy |

## 2. Structure of an app contract

Several files per app, grouped by feature, instead of one `index.ts`:

```text
dryv/contracts/apps/web/
  index.ts                 the application: surfaces, theme, consumed operations, imports features
  navigation.ts            groups, destinations, address scheme
  features/<feature>/
    views.ts               views and parts by role
    intents.ts             named user intents and transitions
    states.ts              loading, empty, gap, error, preferences
    copy.ts                copy keys with default text
```

A **view** is a screen: a role, context values taken from the address, parts that present one composed read or collect inputs, and a render mode. An **intent** is something the user can do ("find my place", "compare", "save", "switch language", "follow the leader tree", "like", and on the mobile app "post a contribution"), with the operation it calls, the state it changes and where it leads. A **feature** groups views, intents and copy. Views shared by web and mobile are declared once and presented per surface.

## 3. One call per screen

The UI never queries several endpoints or stitches responses. For each view the API contract authors a **composed read**: one operation whose output is the typed document the screen needs, with typed sections (no `dynamic`). Composition is expressed in the contract as authored queries over schemas (or as references to finer reads), and Dryv generates the handler wiring, the SDK method and the types. Where Dryv cannot yet express a query, the gap is fixed in Dryv ([DRYV_CAPABILITY_PLAN](DRYV_CAPABILITY_PLAN.md)) before the screen is built.

## 4. Server rendering and SDK forms

- Default render mode is `server`: the generated page is a server component that reads through the generated server SDK and passes typed props to client leaf components.
- `client` is allowed only for named parts (maps, charts, forms, live updates) and uses the generated browser SDK form, which carries the same context options.
- Mobile uses the generated Dart SDK through generated repositories and Riverpod providers (RideRescue pattern).
- No browser `fetch`, no Next route handlers, no `NEXT_PUBLIC_API_URL` for first paint. The API origin and secrets are server configuration.

## 5. Context, copy and preferences are contract concepts

- A view declares which context fields it needs; the generated middleware resolves them (see [CONTEXT_AND_LOCALISATION](../data/CONTEXT_AND_LOCALISATION.md)) and the SDK sends them.
- Copy keys are declared in the feature; values live in the database per language; the copy catalogue is delivered through the SDK and cached by the generated layer.
- Preferences (language, theme, country, place, saved items) are declared state with a storage target (device, account) and generated providers or server cookies.

## 6. Traceability and gates

- Every generated file begins with a header naming its contract source path, the generator and pack, and the engine revision.
- A generation manifest (committed) lists file, source element, generator, hash, engine and pack revisions.
- Gate 1: regenerate to a temporary directory and fail on any difference from the working tree (no hand edits in generated files).
- Gate 2: fail on forbidden patterns in app code: `fetch(`, `"use client"` in `page.tsx`, `app/api` route handlers, `NEXT_PUBLIC_API_URL`, raw colours, country or indicator literals, copy literals outside generated catalogues.
- Gate 3: a contract change prints the files it will rewrite (the blast radius) before generation runs.
- Per feature, five status layers are recorded: contract, generated, wired, validated, content available.

## 7. Sources used as references

RideRescue dashboard (`app/(app)/*/page.tsx` as server components over `_gen/server/actions`, `AGENTS.md` generated-code rules), RideRescue driver (`core/services`, `presentation/screens`, Riverpod, `sdk/{api,ui}`), DefyTickets `events` (server pages, no client pages). Copy their structure; do not copy their product code.

## 8. Open questions

1. Server actions generated from operations (RideRescue style) or server components calling a server SDK (DefyTickets style) for forms and writes? Reads are decided: server SDK.
2. May a pack generate whole screens including layout, or only the data layer plus slots for hand-written components?
3. Where do hand-written components register (naming convention, slot contract)?
4. Is a shared view declared once for web and mobile, even when layouts differ?
5. Which copy languages ship first, and who writes them?
6. How are feature flags per country authored (contract or data)?
