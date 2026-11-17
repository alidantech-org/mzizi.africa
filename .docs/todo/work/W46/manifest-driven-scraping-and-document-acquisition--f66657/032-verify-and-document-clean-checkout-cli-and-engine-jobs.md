---
{id: TSK-EE32A175502C,name: Verify and document clean-checkout CLI and engine jobs,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:55:39.519Z,updated_at: 2026-11-17T07:58:42.266Z,order: 32768,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:55:46.721Z},{from: in-progress,to: completed,at: 2026-11-17T07:58:41.524Z},{from: completed,to: archived,at: 2026-11-17T07:58:42.266Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EE32A175502C/1794902146732-start,started_at: 2026-11-17T07:55:47.293Z,end_ref: refs/tracking/TSK-EE32A175502C/1794902321528-end,ended_at: 2026-11-17T07:58:41.524Z,summary: {files: 5,insertions: 113,deletions: 9}}]}}}
---

# Verify and document clean-checkout CLI and engine jobs

## Goal

Give a new operator a reproducible path from cloning Mzizi to running a bounded crawl, reviewing its artifacts and submitting an engine job. Explain which workflows require additional services and where source-specific work is needed.

## Context

The CLI and engine READMEs describe commands and settings, but the repository landing page still claims a missing Python package blocks setup. New users also need an explicit distinction between one-off HTTP jobs, supervised job specs and website extraction modules. Verify the pushed branch in an isolated source snapshot without using the current worktree configuration. Use a controlled website fixture and an offline replay example to distinguish setup and usage failures from publisher restrictions. Keep the workflow compatible with the engine's existing permissions, source policy and evidence capture.

## Acceptance checklist

- [x] Confirm installation and core CLI use on a clean snapshot of the pushed branch.
- [x] Verify a bounded crawl and a typed HTTP job, with inspectable results.
- [x] Publish a linked operator quickstart and document job-spec prerequisites, supported scope and troubleshooting.

## Comments

### 2026-11-17T07:58:40.820Z · PETER IRUNGU

Verified origin/develop b2dab44c from a git archive with no project .env or virtualenv. Locked uv installation succeeded. The real CLI crawled two pages on a controlled loopback server with filesystem activity and wrote raw HTML, Markdown, inventories and policy evidence. The documented offline replay passed via the CLI and a separately started service-auth HTTP server. The documented supervised example passed parser and worker preflight. No MongoDB-backed execution or arbitrary publisher crawl was tested. Added and linked the operator quickstart and corrected the stale missing-package warning in the root README.
