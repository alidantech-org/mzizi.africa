---
{id: GRP-F1658FA99444,name: Geographic explorer addressing and navigation — NOT READY FOR IMPLEMENTATION,type: documentation,extra: {created_at: 2026-11-19T11:46:42.164Z}}
---

# Planning sequence and implementation gate

## Status: NOT READY FOR IMPLEMENTATION

Only planning is authorized. Product decisions recorded here do not release the implementation gate. All tasks remain planned and explicitly not ready. Do not add technical implementation specifications until the owner has discussed them.

## Agreed country and place addresses

Use one site and require country path prefixes for geographic explorer destinations: /ke, /ke/nairobi, /ke/nairobi/westlands and /ug/kampala. The first segment selects the country; subsequent segments select places within it. Country subdomains, hostname jurisdiction resolution, language path prefixes and translated place slugs are outside the initial scope. Switching views preserves place context, while explicit country and place in a URL take precedence over saved or detected defaults. Root entry behaviour and global utility-page exceptions still need agreement.

## Agreed language behaviour

Language is optional in the address. A supported explicit lang wins over the language cookie and saves that preference. Without lang, use the cookie, then the configured fallback. Preserve an explicit lang in the visible URL and subsequent geographic navigation; do not require it on ordinary links that started without it. Use supported BCP 47 tags such as sw and en. Unsupported values are not saved as supported preferences, and missing translations expose the actual fallback language.

Changing language updates the preference and rendered content while preserving geographic context, selected view and record, and compatible filters. If lang already appears in the address, update it; otherwise the selector leaves it absent. The Share control offers Include selected language, initially on. On includes the effective language; off removes any lang from the generated share link. Sharing preserves meaningful view/record state and does not change the sender's cookie or current URL. No country-specific language assumption is allowed.

## Remaining planning

Finish grouped query meanings, valid nesting, state preservation and resets, utility/root behaviour, historical applicability, empty/error states and all existing link mappings. Keep the earlier inventory of 43 page routes and nine catch-all variants, and revise it against active code before implementation. Tasks cover country paths, query/navigation behaviour, migration and language/sharing. Language has its own task so agreed behaviour is not confused with the previous discussion-only exclusion.

## Release gate

The initial scope is path prefixes only. Future hostname presentation would require separate approval and planning. Complete remaining product planning and obtain explicit owner acceptance before implementation begins. Technical rendering, generated clients and types are being discussed separately and are deliberately not specified in this update.
