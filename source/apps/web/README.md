# Public Mzizi web application

This Next.js application is the public civic explorer on port 3300. It consumes the NestJS product API through generated operation clients under `lib/api/`; authored presentation lives in `app/`, `components/site/` and `lib/site/`. It does not own canonical governance classifications, source acquisition or database writes.

## Governance and explanatory reading

- `/institutions` searches and filters the directory by the arms and kinds returned by the API. `/institutions/[code]` presents responsibilities, holders, relationships, explanatory text and legal foundations.
- `/leaders` renders connected, collapsible branches from the governance operation's nodes and edges. Category tabs, institution choices, scope labels and connection meanings come from the server. Select a node for its reference values and related records; select a scope to filter other levels out; only existing same-level connections remain.
- `/constitution` opens the stored constitutional overview and chapters. Legal links can open a provision with `?provision=<code>`. Child provisions are linked through the content operation.
- `/content` lists explanatory content by category and tag; `/content/[slug]` renders Markdown and GFM tables using `react-markdown`, with raw HTML disabled. The backend resolves media references. Development text is labelled.
- `/compare?place=<feature UUID>` offers the nearest and top ranked peers returned by the API, an upward level selector, and a side-by-side table. Missing figures stay missing rather than becoming zero or a low rank.

The dynamic nested sections of generated responses are validated at `lib/site/governance/parse/documents.ts` into named contracts before reaching components. The API still owns the metrics, relationships and classifications. Unknown node kinds fail explicitly rather than being misclassified.

## Running and checking

Run from the repository root:

```bash
bun run dev:stack -- web
bun run typecheck --only web
bun run build --only web
```

The API must be available on port 8700 for data-backed screens. Avoid building and serving development output concurrently: both currently use `.next`. The coordinating process should restart the development server after a production build if needed.

## Data limits

The local development database contains invented holders and explanatory development text; it is not a verified register of current public officials. Available performance measures describe recorded votes or projects and are not overall leader ratings. Legal effects carry their review status. Some Acts are recorded only as statements, and some institution and place records lack legal links or measurements. Missing translations are not silently presented as completed localisation.

See [the governance and content design](../../../.docs/design/data/GOVERNANCE_AND_CONTENT.md) for backend operations, and [the root command guide](../../../scripts/README.md) for service ownership.

## Responsive exploration and preferences

The shared shell uses a desktop sidebar and a small-screen drawer. Navigation is ordered and grouped by the authored explorer contract. Sidebar selection follows the current place and `view`; record and presentation parameters do not highlight a second subject. Governance details stack beneath the structure on small screens. The browser proof covers the 1440-pixel desktop and 390-pixel mobile layouts, position selection, country isolation and optional-language cookie behaviour. Screenshots are development review artifacts, not evidence that every destination has migrated.

Legacy leadership graph components retain their presentation controls, but the old client-loading container is removed. The contextual leadership entry currently uses the generated country structure document. Full contextual holder profiles, family/radial diagrams and generated server read bindings for every old destination remain unfinished.

## Contextual explorer implementation in progress

The generated catch-all now accepts explicit country/place paths and contract-generated grouped query state. `lang` is optional, stays visible when explicitly supplied and persists to a cookie; sharing can include the effective language. The main shell consumes generated navigation and synchronizes its server-resolved context on page navigation. The new `structure` API screen is generated from an authored read query, with country-isolated institutions, positions, seat definitions, formal powers and function assignments. The read explicitly describes national structure rather than claiming all returned institutions apply to a selected locality.

Finance, comparison, attached legal-basis/explanatory reads and leadership entry no longer start their product reads from browser effects. The legacy graph component receives data rather than importing read clients. Device-local state and engagement writes remain separate. Thirteen web tests cover identity validation, view-specific parameters, state round-trips, navigation ordering, list pagination reset and context-preserving navigation. Initial like counts now render on the server; client leaves retain explicit like/unlike and view-recording writes. Canonical URLs retain record, filter and pagination state.

This is not the completed redesign: several view renderers, full scoped applicability, generated typed replacement of all old insights shapes, election-detail browser reads, the complete chart set, copy migration, analytical fixtures and release-stream synchronization still need implementation. The generated SQL snapshot has been applied to an isolated proof database; existing development databases have not been reset or migrated to all new constraints. Development fixtures live in `scripts/dev/web_proof/` and are explicitly synthetic. Existing template generation also emits API SDK artifacts for Dart; the Flutter frontend itself is not part of this work.
