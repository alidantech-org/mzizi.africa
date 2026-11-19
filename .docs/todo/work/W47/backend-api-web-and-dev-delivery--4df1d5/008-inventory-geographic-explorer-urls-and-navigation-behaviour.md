---
{id: TSK-D3D7345BAA2F,name: Inventory geographic explorer URLs and navigation behaviour,type: task,status: archived,priority: medium,created_at: 2026-11-19T11:35:13.488Z,updated_at: 2026-11-19T11:35:39.711Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-19T11:35:20.182Z},{from: in-progress,to: completed,at: 2026-11-19T11:35:36.902Z},{from: completed,to: archived,at: 2026-11-19T11:35:39.711Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D3D7345BAA2F/1795088120193-start,started_at: 2026-11-19T11:35:21.584Z,end_ref: refs/tracking/TSK-D3D7345BAA2F/1795088136905-end,ended_at: 2026-11-19T11:35:36.903Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Inventory geographic explorer URLs and navigation behaviour

## Goal
Explain how every active public web page and its navigation would translate to the owner-approved place-only paths with query-selected views. Provide a concrete, understandable recommendation for grouped query keys, detail navigation, filters and pagination without implementing the migration.

## Context
The owner wants every civic information view to retain its selected geographic context and asks specifically about dotted parameter namespaces, nested laws and predictable navigation precedence. Inspect the current 43 page files, contextual catch-all section handlers, shared shell, link builders, search result links, saved records, filters and backend read adapters. Earlier architecture documents are proposals and their route inventory is older than active code. Preserve unrelated changes already present in the shared develop checkout. This assessment must distinguish proposed UI behaviour from code behaviour and must not imply browser screenshot verification or completed backend applicability rules.

## Acceptance checklist
- [x] Inventory every active page route and map contextual variants to the proposed URL contract.
- [x] Explain typed grouped keys, nested record relationships, validation, precedence and state transitions.
- [x] Identify concrete navigation, form, rendering, indexing, saved-link and backend migration risks from active code.
- [x] Record assessment findings and validate the documentation workspace before delivering the explanation.

## Comments

### 2026-11-19T11:35:36.065Z · PETER IRUNGU

Assessment: 43 active page.tsx files and nine catch-all section suffixes inventoried. Proposed grouped contract: view, view.tab, view.entity, view.id (registered slug/code or ID), view.provision; filters.*, sort.*, page.*, display.*, optional at for historical applicability. Dots are literal keys parsed by an allowlisted typed schema per view/entity. No generic recursive dotted-object expansion. Entity relationships validated; path is sole primary geography; invalid/duplicate singleton identity is rejected; list filters do not redefine detail identity. Each navigation intent has explicit preservation/reset rules. Scope-switch defaults to same view/tab with selections and pages reset, with an explicit keep-record option when appropriate. Current risks: only calendar/infrastructure sidebar links scoped; pathname-based active detection and suffix tabs fail for queries; root-layout context may remain stale; raw hrefs across cards/maps/search/details/content escape context; form submissions need hidden route fields; search tender q and source citationId links are ignored by their target pages; compare and directory/tree choices have local-only state; election parent duplicates geographic scope; saved items lack sufficient country/context metadata; canonical metadata strips all semantic queries; sitemap uses old paths and shallow discovery; fixed list limits require backend pagination contracts. Backend facade calls for budgets/funds/coverage/coalitions/manifestos/search/law do not currently pass selected place; tenders already supports featureId but page omits it. No browser visual QA performed: UI conclusions are source-based, proposed layouts are illustrative. Existing architecture route inventory is stale and must be revised during implementation. No application implementation performed.
