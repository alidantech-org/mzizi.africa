---
{id: TSK-C6D3D74E1F13,name: "Engine explorer: runs, files, database views and a real procurement API proof",type: task,status: completed,priority: medium,created_at: 2026-11-18T03:45:42.254Z,updated_at: 2026-11-18T03:52:07.505Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-18T03:52:07.505Z}]}}
---

# Engine explorer: runs, files, database views and a real procurement API proof

## Goal

The developer portal showed only capabilities, a job table and the seed catalogue, so most of what the engine can do stayed invisible. The goal is to expose the engine's features in an organised way: runs with their stages, results and output files; file viewers for Markdown, CSV, JSON, YAML, PDF and images; a CSV preparation pane; human-editable job setup forms; a read-only database viewer with curated data lists and raw tables grouped by domain; and a term-knowledge tester. The same work proves that the fetch package and the engine can collect real public procurement data from the Kenya tenders portal and extract fields with the existing module and transform library.

## Context

The engine's operational HTTP API lives in `source/backend/engine/src/mzizi_engine/runtime/http/`. Jobs were held only in memory, there was no way to read run output folders over HTTP, and no collector for documented JSON APIs although the source schema (`source/schema/sources/api.schema.json`) describes one. The tenders portal (`https://tenders.go.ke/api/active-tenders`) is a public, robots-allowed JSON API with ten tenders per page; each tender also embeds staff contact details (name, phone, email, ID number), which must never be extracted. Seed files must not be added without owner approval, so the source manifest and module live under `.dev/sources/ke-tenders/`. The developer portal is the Next.js app in `source/apps/dev`; it reaches the engine only through its server-side proxy. See `.docs/design/architecture/DEVELOPER_PORTAL.md`.

## Acceptance checklist

- [x] The engine serves `/v1/explore/*`: file roots, folder listing, file views by kind, raw file download, guarded text saves under the dev root, CSV preparation, term groups and tagging, database domains, raw table pages and curated data lists, and job detail with events and output folder.
- [x] A new `api.collect` capability pages through a documented JSON API with the crawler's own polite client, keeps every raw page, extracts fields with a module (selectors and transforms) and writes `records.csv`, `records.jsonl` and `summary.json`; personal fields in the response are never read.
- [x] The collector was run through the portal against the live tenders API (436 active tenders, 45 pages, no extraction errors) and stopped cleanly on an empty page.
- [x] Job history survives an engine restart in development (`ENGINE_STATE_FILE`).
- [x] The portal has Runs (list, pipeline detail, new-run form built from each capability's input schema with presets), Files and viewers, CSV preparation, Database (data lists and raw tables), and Terms and knowledge.
- [x] Tests cover file roots and preparation, the collector, and the stack smoke test; the developer portal design guide and the Dryv gap list describe what exists.

## Progress

Done on 18 November 2026 on `develop`. The engine and portal were restarted and every new page was opened in the browser pane against the seeded `mzizi_ui` database. Findings about the tenders portal: `/api/active-tenders` and `/api/counties` return JSON; `/api/awarded-tenders` and `/api/contracts` return the site's HTML shell, not data, so awards are not exposed by a public API there.

Not done: the new explore operations are hand-written routes and portal pages, not yet declared in the Dryv engine contract; the tenders source is not in `seed/` pending owner approval; collected tenders are not yet mapped into `civic.*` tables; PDF extraction from the portal passes bytes as base64 and was not exercised on a large file.
