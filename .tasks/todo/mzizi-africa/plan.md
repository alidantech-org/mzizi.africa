---
{id: GRP-20A0F8C28FC0,name: Mzizi Africa,type: documentation}
---

# Mzizi Africa

## Goal

Coordinate practical work across the product API, Flutter mobile app, public website, and research dashboard while keeping evidence, provenance, time, geography, and service ownership explicit.

## Scope

- **API** (`GRP-ADD1BC017CB4`): inventory legacy FastAPI behavior, define target NestJS contracts, deliver geography read APIs, and plan responsibility migration.
- **Mobile app** (`GRP-695C42C20702`): make local API setup reproducible, complete verified map navigation, unify search, and verify platform behavior.
- **Sites** (`GRP-50781A300A74`): audit `apps/www` and `apps/dashboard`, build the public atlas and researcher workflows against stable contracts, and establish quality/accessibility checks.
- Existing repository guidance remains authoritative in `AGENTS.md` and `.docs/`.

## Notes

### Suggested sequence

1. Finish the legacy API inventory (`TSK-39C88A553155`) and site route/data audit (`TSK-3AED35436948`). Mobile local configuration can proceed in parallel.
2. Define target API contracts (`TSK-EFD9E84630E1`) and runtime conventions (`TSK-D76C98E59E1F`). Keep extraction, AI, file custody, and database lifecycle in their designated owners.
3. Implement the first target geography slice (`TSK-9EEB47279B23`) and write the migration plan (`TSK-38F9B96B1772`).
4. Complete the mobile hierarchy flow (`TSK-471C902B718F`), search behavior (`TSK-C8093926792F`), then platform verification (`TSK-62F7658798F7`).
5. Build the public atlas (`TSK-F71939F0BA48`) and researcher dashboard (`TSK-15039EBA58CC`) from the target contracts; audit and quality tasks remain separate activities.

### Planning constraints

- The geography contract in `apps/docs/geography-api-contract.md` is a client contract and should inform the target API DTOs.
- `services/api` is migration source material. Do not expand it into the long-term public API without an explicit architecture decision.
- Do not invent canonical records or claim a site is API-backed until the endpoint exists and is verified.
- Task acceptance criteria describe review evidence; they do not authorize deployment or external publication.
