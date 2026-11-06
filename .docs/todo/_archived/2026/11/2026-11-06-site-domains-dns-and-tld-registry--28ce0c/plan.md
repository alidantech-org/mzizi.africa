---
{id: GRP-12CC0F28CE0C,name: "Site domains, DNS and TLD registry",type: documentation,extra: {created_at: 2026-11-02T20:01:36.992Z}}
---

# Site domains, DNS and TLD registry plan

## Approach

Extend the website schema additively through the Dryv contracts: domain status and status reason, source, a link to the parent domain, a zone (TLD) reference table, and a DNS snapshot table. Backfill candidate domains from the existing expected-site checks and the seed host lists, then let the gated probe set status. DNS lookups are made by the engine through a resolver with the same politeness limits, and are recorded as snapshots, never as updates.

## Milestones

1. Schema: domain status, source, reason, parent, zone; zone registry; DNS snapshots (task 001).
2. Backfill: candidate domains for all 481 sites and the zone registry (task 002).
3. Probe and DNS: status and DNS snapshots for each domain (existing task "Probe expected sites and confirm hostnames", extended).
