---
{id: GRP-C56499E37CD2,name: Dryv assembles frontends,type: documentation,extra: {created_at: 2026-11-17T21:24:36.438Z}}
---

# Plan

Start with the Next.js pack: split managed output (lib/dryv routes, navigation and view metadata, reference page components) from scaffold-once files (root page, layout shell, route pages). Verify by running a Dryv generation against the running Dryv API and typechecking both apps. Then apply the same split to the Flutter pack: managed route constants, view metadata and reference screens, with the router, shell and screens scaffolded once. Risks: the pack template language may not expose every value needed for routes, in which case the Dryv checkout under the codepot repository is adjusted; scaffold-once files already written by the previous design must be reconciled by hand. Finish by updating dryv/README.md, pack READMEs and the app READMEs, and running task validate.
