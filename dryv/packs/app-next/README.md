# Next.js app pack

Generates Next.js App Router pages from views, with a typed API call for every HTTP operation and forms and results driven by schema field metadata.

| IR | Generated |
| --- | --- |
| view | `components/dryv/pages/<group>/<view>/page.tsx`: a managed, unofficial reference page (client component) that hand-written routes may borrow |
| view (scaffold once) | `app/<view>/page.tsx`: the real route at the root-level URL `/<view>`, owned by the app; it renders the reference page until replaced |
| application | `lib/dryv/routes.ts`: managed route constants, `routePath()` and `navigation`. Scaffolded once: `app/page.tsx` (home at `/`) and `app/layout.tsx` (nav shell) |
| `collect` part | `DryvForm` built from the input port's schema fields; submitting calls the operation |
| `present` part | `DryvResult` showing the operation's latest result (only the `select`ed fields, when given). The page calls the operation on load unless a form in the same view feeds it. |
| `invoke` part | a button that calls the operation |
| operation with an HTTP facet | `lib/api/<group>/<operation>.ts`: a typed function plus `<operation>InputFields` / `<operation>OutputFields` |
| schema | `lib/types/<schema>.ts`: an interface plus `<Schema>Fields` metadata |
| enum | `lib/types/<enum>.enum.ts` |

Support files, written once per generation: `lib/dryv/transport.ts` (`fetch` against `NEXT_PUBLIC_API_URL`), `components/dryv/dryv-form.tsx` and `components/dryv/dryv-result.tsx`.

**Ownership:** Dryv manages files and structure (routes, navigation data, metadata, SDK calls, reference pages). Layouts and route pages are scaffolded once and never overwritten; assemble them yourself from the generated pieces.

**Limits in 0.1.0:**
- Routes use each operation's local path (`facets.http.path.local`), as the other HTTP packs do.
- Forms cover string, number, boolean, enum and date fields. Nested schemas and arrays aren't editable yet.

**Test:** `bun scripts/test-pack.ts unit/frontend/nextjs-app` renders the flagship IR, typechecks against the real `next` and `react`, checks the API calls, and renders the generated page with a mocked API, including submitting its form.

## Use it

Point the destination at your Next.js source root (the folder that holds `app/`). The [executable Usage fixture](tests/fixture/dryv.yaml) shows the current source collection and activation.
