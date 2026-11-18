---
{id: TSK-522F24223BB1,name: "Phase D: Dryv frontend capabilities in the TypeScript author",type: task,status: planned,priority: medium,created_at: 2026-11-18T22:29:04.334Z,updated_at: 2026-11-18T22:29:04.334Z,order: 4096}
---

# Phase D: Dryv frontend capabilities in the TypeScript author

## Goal

Add to Dryv the declarations the web needs: component catalog with typed props, shell binding, address grammar and place scope, navigation, context, intents, state, copy keys, page states, render mode, and a generated component gallery. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Implement the declarations in the TypeScript author, compiler and IR with validation rules and tests.
- [ ] Document that the Python author was not changed.
- [ ] Write the app-next templates: server pages, link builder, breadcrumbs, place switcher binding, sitemap, canonical and hreflang, gallery.
- [ ] Contracts compile and a sample app builds.
