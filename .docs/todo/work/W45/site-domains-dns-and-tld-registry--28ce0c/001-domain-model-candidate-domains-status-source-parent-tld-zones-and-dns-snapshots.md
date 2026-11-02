---
{id: TSK-2FE5E3594E4C,name: "Domain model: candidate domains, status, source, parent, TLD zones and DNS snapshots",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:40.961Z,updated_at: 2026-11-02T20:02:40.961Z,order: 1024}
---

# Domain model: candidate domains, status, source, parent, TLD zones and DNS snapshots

## Goal

Extend the website schema so a domain is a first-class record with its own status and facts, separate from the site it belongs to, and add a registry of top-level domains and second-level zones plus dated DNS snapshots.

## Context

Today `website.domains` holds hostname, scheme, role (primary, alias, redirect, legacy, mirror), valid time and an observed time. A domain exists only after a probe confirmed it, so the 384 sites made from patterns (county, assembly and constituency fund) and the 89 seed sites have no domain rows; their candidate hostnames sit inside a reachability check. The product owner decided on 2 November 2026 that every candidate hostname gets a domain row. A domain needs: status (candidate, reachable, redirects, moved, unreachable, refused, retired), a status reason and the source of the hostname (pattern, seed research, page link, redirect, manual), whether it is an apex or a subdomain and its parent domain, the zone it sits under, the HTTP result of the last probe and where it redirected to. A zone table records each registry zone in use (.go.ke, .or.ke, .ac.ke, .co.ke, .com, .org, .ke, and any other seen) with its registry operator, purpose, whether second-level names are open, and a source. DNS snapshots record dated lookups (A, AAAA, CNAME, NS, MX, TXT, SOA) per domain and per zone, kept as history, never overwritten. All new columns are nullable because facts arrive late. Contracts live in Dryv and the migration must keep the drift check clean.

## Acceptance checklist

- [ ] Write the design note and decide column names, enums and the snapshot shape.
- [ ] Add domain status, status reason, source, parent domain, zone and last probe result (nullable) through the Dryv contracts and a migration.
- [ ] Add the zone registry table with operator, purpose, openness and source, seeded with the zones in use, labelled as custom-prepared from manual research.
- [ ] Add the DNS snapshot table (domain or zone, record type, values, resolver, observed at).
- [ ] Update the generated API and read endpoints and keep the schema integration spec green.
- [ ] Add engine tests for a candidate domain, a redirect and a snapshot history.
