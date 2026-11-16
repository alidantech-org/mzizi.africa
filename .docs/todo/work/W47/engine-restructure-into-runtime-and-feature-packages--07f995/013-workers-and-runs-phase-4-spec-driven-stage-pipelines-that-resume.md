---
{id: TSK-1F71EC3D265C,name: "Workers and runs, phase 4: spec-driven stage pipelines that resume",type: task,status: planned,priority: medium,created_at: 2026-11-16T09:48:45.595Z,updated_at: 2026-11-16T09:48:45.595Z,order: 13312}
---

# Workers and runs, phase 4: spec-driven stage pipelines that resume

## Goal

Compose crawl, download, convert to Markdown, extract (PDF, tables, CSV) and publish stages from a job spec, each stage checkpointing so a run resumes, while raw source bytes are stored first and every derived file links back to its source.

## Context

Depends on phases 1 to 3. Reuse the crawl engine, the markdown and download pools, the extraction operations (`extraction.markdown`, `extraction.pdf`, `extraction.csv`) and the site store. Crawling and downloading overlap today and must keep doing so. A spec may crawl one site or a series of sites; a hunt-mode spec fetches everything matching the file rules. Outputs are ready CSV and Markdown files plus the raw sources, all registered as artifacts with `derived_from`, and all logs and decisions recorded. Source authority is recorded in the spec and checked by the gate at spin time (`source.gate`).

## Build

- [ ] A stage runner that executes a spec's stages in order with checkpoints and resume data.
- [ ] Raw bytes first, derived files registered with `derived_from`; media types and source URLs recorded.
- [ ] Spec examples under `seed/_examples/` (non-executable) for a one-site crawl, a many-site series, an extraction-only run and a hunt run.
- [ ] Documentation of each stage's parameters and requirements.

## Acceptance checklist

- [ ] A loopback-site run produces raw files, Markdown and extracted CSV, seals, and resumes correctly after a simulated crash in each stage.
- [ ] An extraction-only spec needs no network settings; a crawl spec reports every missing setting by name.
- [ ] Strict typing, boundaries 0, structure clean, suite unchanged or better, `task validate` passes, docs and the task note updated.
