---
{id: GRP-F1658FA99444,name: Geographic explorer addressing and navigation — NOT READY FOR IMPLEMENTATION,type: documentation,extra: {created_at: 2026-11-19T11:46:42.164Z}}
---

# Planning sequence and implementation gate

## Status: IMPLEMENTATION AUTHORIZED

Only planning is authorized. Product decisions recorded here do not release the implementation gate. All tasks remain planned and explicitly not ready. The owner has requested consolidation of MUST-FIX and the discussed server-rendering/generated-client requirements into these tasks; runtime implementation remains unauthorized.

## Agreed country and place addresses

Use one site and require country path prefixes for geographic explorer destinations: /ke, /ke/nairobi, /ke/nairobi/westlands and /ug/kampala. The first segment selects the country; subsequent segments select places within it. Country subdomains, hostname jurisdiction resolution, language path prefixes and translated place slugs are outside the initial scope. Switching views preserves place context, while explicit country and place in a URL take precedence over saved or detected defaults. Root entry behaviour and global utility-page exceptions still need agreement.

## Agreed language behaviour

Language is optional in the address. A supported explicit lang wins over the language cookie and saves that preference. Without lang, use the cookie, then the configured fallback. Preserve an explicit lang in the visible URL and subsequent geographic navigation; do not require it on ordinary links that started without it. Use supported BCP 47 tags such as sw and en. Unsupported values are not saved as supported preferences, and missing translations expose the actual fallback language.

Changing language updates the preference and rendered content while preserving geographic context, selected view and record, and compatible filters. If lang already appears in the address, update it; otherwise the selector leaves it absent. The Share control offers Include selected language, initially on. On includes the effective language; off removes any lang from the generated share link. Sharing preserves meaningful view/record state and does not change the sender's cookie or current URL. No country-specific language assumption is allowed.

## Remaining planning

Finish grouped query meanings, valid nesting, state preservation and resets, utility/root behaviour, historical applicability, empty/error states and all existing link mappings. Keep the earlier inventory of 43 page routes and nine catch-all variants, and revise it against active code before implementation. Tasks cover country paths, query/navigation behaviour, migration and language/sharing. Language has its own task so agreed behaviour is not confused with the previous discussion-only exclusion.

## Release gate

The initial scope is path prefixes only. Future hostname presentation would require separate approval and planning. Complete remaining product planning and obtain explicit owner acceptance before implementation begins. The combined task outcomes now include server-rendered product reads, generated clients/types and contract-owned frontend capabilities. Detailed implementation remains subject to the unfinished planning gate.

## One integrated delivery, not two frontend rewrites

MUST-FIX.md is now an audit baseline and index into this group, not a second executable backlog. The attached 2026-11-19 delivery report records earlier role-based API reads, the slim place chip, likes/views, new list/calendar/utility screens, statistics server rendering and Cloudflare-header checks. Preserve those reported deliveries and reverify them; do not equate historical green marks or HTTP 200 responses with current complete contextual, generated or server-rendered behaviour.

Five existing tasks were moved here through Task, retaining their IDs: TSK-E4D1683BC425 (slugs/typed sections/manifest), TSK-0A9E5ED02AFE (composed reads and metrics), TSK-76DD5D22DDB8 (generation/API verification), TSK-522F24223BB1 (Dryv frontend capabilities), and TSK-0CE2BE62D0CC (web migration). Existing dev and Flutter delivery tasks keep their own ownership and depend on the same shared contract/API outputs. Existing database/schema work retains its ownership; coordinate rather than duplicate it.

## Integrated execution sequence after planning acceptance

1. Reconcile the audit baseline and settle country paths, query semantics, applicability and language behaviour in the four planning tasks. Refresh the active route and link inventory.
2. Reuse verified slug/typed-section foundations. Close actual generator gaps and define the typed composed API documents, data-driven metric/level/copy contracts and generation evidence. Seed additions remain approval-gated.
3. Prove one representative final feature from contract through generated API/client/types to server-rendered contextual UI, then migrate remaining features using the same capabilities. Each slice includes its sidebar/detail/filter/search/evidence links and language state together. Do not fix the old UI first and then replace it.
4. Integrate API generation and feature checks throughout the work; the old phase letters are provenance, not a reason to postpone validation until the end. The web task owns the integrated desktop/mobile and network acceptance sweep.
5. Update MUST-FIX evidence and related design documents as behaviour changes. Report missing data, generator limitations, deployment controls and policy decisions separately. No push, deployment or reseed is implied by the historical delivery programme wording.

## Audit responsibility map

| Audit concern | Single owning task | Treatment |
| --- | --- | --- |
| Country paths, aliases, slugs, links | TSK-83C1E896E4C8; foundations TSK-E4D1683BC425 | Replace route assumptions once; preserve old-link coverage |
| Contextual sidebar, switcher, views, filters, rich overview | TSK-2063A0FD67FD; delivery TSK-0CE2BE62D0CC | Contract-owned navigation and final feature slices |
| Optional lang, cookies, sharing and copy language | TSK-F411B380B819 | Replace old lang stripping; no language prefixes |
| Duplicate hand types and remaining untyped fields | TSK-E4D1683BC425; consumer migration TSK-0CE2BE62D0CC | Generated named contracts, no casts as substitutes |
| Browser-triggered reads, composed reads, SDK-only access | TSK-0A9E5ED02AFE, TSK-522F24223BB1, TSK-0CE2BE62D0CC | Server screen reads; interactive leaves do not load product data |
| Code-owned metric catalogue, year/level/topic defaults | TSK-0A9E5ED02AFE | Data-driven semantics; preserve indicator roles |
| Component catalogue, address grammar, states, gallery | TSK-522F24223BB1 | Improve Dryv before relying on generation |
| Nearest facilities and exports | TSK-0A9E5ED02AFE; delivery TSK-0CE2BE62D0CC | Generated API capabilities first, no browser API workaround |
| Spending/debt and additional election kinds | TSK-0A9E5ED02AFE; inventory TSK-B01DE85F253D | Separate schema, data and UI gaps; no invented rows |
| Regeneration and API operation proof | TSK-76DD5D22DDB8 | Preserve engine/SDK consistency and existing write safeguards |
| Layout, maps, forms, saved links, metadata, all feature QA | TSK-0CE2BE62D0CC; inventory TSK-B01DE85F253D | Browser/network proof and root checks |
| Cloudflare origin controls | TSK-B01DE85F253D | Deployment prerequisite, not a frontend fix; path country wins |
| Interaction retention, consent, account linking; privacy draft | TSK-B01DE85F253D | Open owner/legal policy dependencies, no invented decisions |

## Definition of integrated completion

Final country/place/query addresses and optional language behave consistently; product reads execute during server rendering through generated server clients and named types; URL changes navigate for new datasets; no client effects invoke product reads, including indirect server-action wrappers. Device-local preferences and approved engagement mutations remain distinct. Contract-owned navigation/copy and backend-owned applicability replace frontend constants and endpoint stitching. Completed audit work stays functional. Every remaining audit item has verified evidence or an explicit owner-approved deferral; empty content is not disguised as implementation success. All nine tasks remain planned and not ready until the owner releases planning.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.
