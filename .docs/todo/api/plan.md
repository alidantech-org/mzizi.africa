---
{id: GRP-ADD1BC017CB4,name: API,type: documentation}
---

# API

## Goal

Move toward a stable NestJS product API without losing useful legacy behavior, source provenance, or explicit domain ownership.

## Activities

1. Inventory legacy routes, models, migrations, seeds, and consumers (`TSK-39C88A553155`).
2. Define versioned NestJS DTOs for geography and evidence (`TSK-EFD9E84630E1`).
3. Establish runtime, auth, configuration, and error conventions (`TSK-D76C98E59E1F`).
4. Implement an initial verified geography read slice (`TSK-9EEB47279B23`).
5. Plan responsibility and data migration from FastAPI (`TSK-38F9B96B1772`).

## Boundary

Product query endpoints belong in target NestJS API. Extraction, AI evaluation, file custody, database migrations, and seed/import lifecycle must remain with their designated services. Treat Python FastAPI as migration source material.

## Goal

## Scope

## Notes
