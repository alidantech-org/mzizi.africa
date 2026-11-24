---
{id: TSK-478D86A8F857,name: Assess engine disk writes and SSD endurance,type: task,status: archived,priority: medium,created_at: 2026-11-17T11:28:57.301Z,updated_at: 2026-11-17T11:29:08.671Z,order: 17408,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T11:29:07.592Z},{from: in-progress,to: completed,at: 2026-11-17T11:29:08.444Z},{from: completed,to: archived,at: 2026-11-17T11:29:08.671Z}]},archived_at: 2026-11-24T19:25:23.410Z}
---

# Assess engine disk writes and SSD endurance

## Goal

Answer the owner's question about whether the current research engine can wear out the local SSD. Ground the answer in active implementation and explain the difference between a busy disk, accumulated host writes, and a measured hardware health problem. The outcome is an evidence-based explanation without changing runtime behavior or deleting research evidence.

## Context

The engine supports local run storage, local capture and extraction outputs, an optional conditional HTTP cache, and S3 staging. These paths can create multiple representations of the same downloaded bytes. The repository contains planned capabilities as well as active code, so this assessment must use implementation evidence. No workload benchmark or privileged hardware access is required for the answer. A manufacturer endurance rating is a useful comparison budget rather than a predicted failure date. Actual remaining endurance needs the SSD model, health counters, and representative writes over time. Existing evidence retention requirements remain in force.

## Acceptance checklist

- [x] Inspect active capture, cache and run-store write paths and identify concrete contributors to disk traffic.
- [x] Check whether local hardware details and health tools are accessible without privileged changes, and state measurement limits.
- [x] Explain endurance with a clearly hypothetical numerical example and record findings without modifying engine behavior.

## Comments

### 2026-11-17T11:29:07.790Z · PETER IRUNGU

Inspected active capture, extraction, cache, download and local run-store paths. The optional HTTP validator cache encodes bodies as hex (about twice body size). LocalRunStore writes and fsyncs a temporary artifact before testing an existing destination, so identical retries still write bytes; hardlink publication itself does not copy the payload. Captures and extraction create additional evidence representations. lsblk reports a Samsung MZALQ512HALU-000L2, 476.9 GiB; df reports 53% usage and 221 GiB available. smartctl is installed but the device is unavailable in this execution environment, so health, lifetime writes and actual workload rate remain unmeasured. Explain hypothetical 600 TBW budgets: 100 GB/day is about 16.4 years, 1 TB/day about 1.64 years, before subtracting previous writes; these are budget arithmetic, not lifetime predictions or this drive specifications. No runtime changes made.
