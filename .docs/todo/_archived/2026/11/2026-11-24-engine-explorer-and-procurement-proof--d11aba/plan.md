---
{id: GRP-61E2E2D11ABA,name: Engine explorer and procurement proof,type: documentation,extra: {created_at: 2026-11-18T03:45:38.656Z}}
---

# Engine explorer and procurement proof plan

## Approach

Add a read-only `/v1/explore` router to the engine over small typed modules (files, CSV preparation, terms, database browsing), add an `api.collect` capability to the crawler package that reuses its polite client, selectors and transforms, and build the portal pages by hand over the engine through the portal's server-side proxy.

## Milestones

1. Probe the tenders portal and record what it exposes.
2. Build and test `api.collect` and run it against the live API.
3. Build the explorer endpoints and the database data lists.
4. Build the portal pages and open each in the browser.
5. Extend the smoke test, update the guides, run the root checks.

## Risks and open questions

The tenders response embeds staff personal data; the module reads only named procurement fields. The explorer must never leave its roots or write outside the dev root. The explore routes are not in the Dryv contract yet, so the portal pages are hand-written until the contract is extended.
