---
{id: GOAL-GRP-12CC0F28CE0C,name: "Site domains, DNS and TLD registry goal",type: documentation,extra: {created_at: 2026-11-02T20:01:36.992Z,group: GRP-12CC0F28CE0C}}
---

# Site domains, DNS and TLD registry goal

## Goal

Every site in the registry has a domain record for every hostname it is known or expected to use, and every domain says what is known about it: its status (candidate, reachable, redirects, moved, unreachable, refused), why and from which source it is recorded, whether it is an apex or a subdomain and of what, which top-level domain or registry zone it belongs to, and what the DNS says about it at a stated time. Sites and domains keep separate status because a site can work while one of its domains redirects, has moved or is dead.

## Why it matters

On 2 November 2026 the registry received 481 sites but only 15 domain rows, because the earlier design created a domain only after a probe confirmed it and kept candidate hostnames inside a reachability check. The product owner needs the candidates visible and queryable (nakuru.go.ke, westlands.ngcdf.go.ke), with the registry facts (.go.ke, .or.ke, .ac.ke, .co.ke and every zone used) and DNS facts attached, so that discovery, probing and later reinforcement work from data rather than from log text.

## Success criteria

- A domain row for each candidate hostname of each site, with status, source and reason.
- A registry table of TLDs and second-level zones with operator, purpose and source, and each domain linked to its zone and, for subdomains, to its parent domain.
- Dated DNS snapshots per domain and per zone.
- Probing updates domain status and site status separately.
