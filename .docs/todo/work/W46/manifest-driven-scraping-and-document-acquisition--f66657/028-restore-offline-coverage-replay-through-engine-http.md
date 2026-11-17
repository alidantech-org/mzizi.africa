---
{id: TSK-C5499450BD6D,name: Restore offline coverage replay through engine HTTP,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:36:51.623Z,updated_at: 2026-11-17T07:44:53.303Z,order: 28672,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:37:03.704Z},{from: in-progress,to: completed,at: 2026-11-17T07:44:52.694Z},{from: completed,to: archived,at: 2026-11-17T07:44:53.303Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C5499450BD6D/1794901023706-start,started_at: 2026-11-17T07:37:03.985Z,end_ref: refs/tracking/TSK-C5499450BD6D/1794901492696-end,ended_at: 2026-11-17T07:44:52.695Z,summary: {files: 318,insertions: 9281,deletions: 21}}]}}}
---

# Restore offline coverage replay through engine HTTP

## Goal

Let an authorized engine client check saved source material against reviewed replay expectations through the same engine runtime used by the developer CLI.

## Context

The crawler already implements replay for saved PDF and HTML, and the CLI declares the command. The engine does not register the operation yet. Resolve suites and nested captures only under an explicitly configured operator-controlled workspace root. The engine owns resolution and result placement. A result with mismatches is a successful check with a failed comparison and inspectable details. Protect raw inputs and avoid network access during replay. Durable run artifact references and per-user workspaces are subsequent work and should build on the scoped input boundary rather than changing it in place.

## Acceptance checklist

- [x] Register a typed replay operation callable through engine HTTP jobs and the developer CLI.
- [x] Exercise passing and failing expectations with saved captures and check for no source mutation.
- [x] Verify malformed requests and references outside the configured workspace are refused and document the approved invocation.

## Comments

### 2026-11-17T07:44:51.783Z · PETER IRUNGU

Registered typed scraping.replay for engine HTTP jobs and CLI. Operator-configured workspace references are resolved before reading captures. HTTP tests verify exact expectations, mismatch reports, malformed suites, absolute paths, directory traversal and symlink escapes. The real CLI replay passed all 11 saved Nairobi Assembly pages with zero mismatches. Broader engine/crawler regression checks reported 55 passing tests and a seed manifest assertion failure because seed/manifest.yaml is absent on this checkout. Durable run storage references are tracked in TSK-583968232F6B.
