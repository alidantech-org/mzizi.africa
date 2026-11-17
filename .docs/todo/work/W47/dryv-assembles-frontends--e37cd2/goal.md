---
{id: GOAL-GRP-C56499E37CD2,name: Dryv assembles frontends goal,type: documentation,extra: {created_at: 2026-11-17T21:24:36.438Z,group: GRP-C56499E37CD2}}
---

# Goal

Make the generated frontends (web, dev and the Flutter app) assemblies rather than finished products. Dryv owns the automatable parts: folder structure, route and path constants, navigation data, per-view metadata such as table columns, filter fields and paging, SDK clients, and reference pages or components that hand-written code can borrow. People own layouts, real route pages and how components are put together, and regeneration never overwrites those. Success means a visitor reaches every page from the root URL through working navigation in each frontend, and editing a page never fights the generator.

The generator stays useful because it removes repetitive work, and the interface stays flexible because people decide how it looks.
