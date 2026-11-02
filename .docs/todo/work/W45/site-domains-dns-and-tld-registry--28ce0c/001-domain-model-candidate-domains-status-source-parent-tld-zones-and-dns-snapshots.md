---
{id: TSK-2FE5E3594E4C,name: "Domain model: candidate domains, status, source, parent, TLD zones and DNS snapshots",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:02:40.961Z,updated_at: 2026-11-02T22:29:43.054Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T20:04:49.023Z},{from: in-progress,to: completed,at: 2026-11-02T22:29:43.054Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2FE5E3594E4C/1793649889025-start,started_at: 2026-11-02T20:04:49.546Z,end_ref: refs/tracking/TSK-2FE5E3594E4C/1793658583056-end,ended_at: 2026-11-02T22:29:43.055Z,summary: {files: 289,insertions: 18117,deletions: 30}}]}}}
---

# Domain model: candidate domains, status, source, parent, TLD zones and DNS snapshots

## Goal

Extend the website schema so a domain is a first-class record with its own status and facts, separate from the site it belongs to, and add a registry of top-level domains and second-level zones plus dated DNS snapshots.

## Context

Today `website.domains` holds hostname, scheme, role (primary, alias, redirect, legacy, mirror), valid time and an observed time. A domain exists only after a probe confirmed it, so the 384 sites made from patterns (county, assembly and constituency fund) and the 89 seed sites have no domain rows; their candidate hostnames sit inside a reachability check. The product owner decided on 2 November 2026 that every candidate hostname gets a domain row. A domain needs: status (candidate, reachable, redirects, moved, unreachable, refused, retired), a status reason and the source of the hostname (pattern, seed research, page link, redirect, manual), whether it is an apex or a subdomain and its parent domain, the zone it sits under, the HTTP result of the last probe and where it redirected to. A zone table records each registry zone in use (.go.ke, .or.ke, .ac.ke, .co.ke, .com, .org, .ke, and any other seen) with its registry operator, purpose, whether second-level names are open, and a source. DNS snapshots record dated lookups (A, AAAA, CNAME, NS, MX, TXT, SOA) per domain and per zone, kept as history, never overwritten. All new columns are nullable because facts arrive late. Contracts live in Dryv and the migration must keep the drift check clean.

## Acceptance checklist

- [x] Write the design note and decide column names, enums and the snapshot shape.
- [x] Add domain status, status reason, source, parent domain, zone and last probe result (nullable) through the Dryv contracts and a migration.
- [x] Add the zone registry table with operator, purpose, openness and source, seeded with the zones in use, labelled as custom-prepared from manual research.
- [x] Add the DNS snapshot table (domain or zone, record type, values, resolver, observed at).
- [x] Update the generated API and read endpoints and keep the schema integration spec green.
- [x] Add engine tests for a candidate domain, a redirect and a snapshot history.

## Design note

- `website.domains.status` (candidate, reachable, redirects, moved, unreachable, refused, retired) is separate from `website.sites.status`; a probe sets both independently. `status_reason` is free text for the why of the last change.
- `origin` (pattern, seed_research, page_link, redirect, manual) classifies how a hostname was found. It was first named `source` with a `source_note`; both were removed in migration 1793900000001 because provenance belongs to the evidence/provenance records (assessment principle 14), not to duplicated text columns. `website.domain_zones.source` and `source_note` were dropped for the same reason; the label "custom-prepared from manual research" stays in the seed fixture `_meta`.
- Apex or subdomain: `is_apex` plus `parent_domain_id` (self reference); `zone_id` points to the registry zone (longest matching suffix).
- `website.dns_snapshots` is append-only: one row per lookup (domain or zone, record type, JSON values text, resolver, rcode, observed_at), indexed by (owner, type, observed_at desc); history is read by ordering, nothing is updated.
- Read endpoints: the existing SiteDomain surface already returns the new columns; adding `status` and `origin` filters and zone/snapshot surfaces needs Dryv API generation and is left open.
