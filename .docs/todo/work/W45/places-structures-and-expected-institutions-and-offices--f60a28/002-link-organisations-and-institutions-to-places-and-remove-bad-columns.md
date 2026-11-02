---
{id: TSK-AA0A323E646D,name: Link organisations and institutions to places and remove bad columns,type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:35.795Z,updated_at: 2026-11-02T20:59:35.795Z,order: 2048}
---

# Link organisations and institutions to places, and remove bad columns

## Goal
Make every organisation entity and governance institution use places through occupancies, and remove columns that held location facts directly.

## Context
Today `governance.institutions` has a geography unit and `organization.entities` has parents and jurisdictions but no place. After the place schema exists, each body gets at least one occupancy, which may be `expected` with an unknown real location (for example "headquarters, Nairobi" or "county headquarters, county X"). The institution to entity link must be explicit so a legal person and a governance body are one identity where appropriate. This task also removes columns found to be wrongly designed during migration, with the data moved first. Entity matching (DEC-ENTITY-MATCHING) is reused to detect the same building appearing from several sources: score on name, address and point, flag, never merge on a name alone.

## Acceptance checklist
- [ ] Add the explicit institution to entity link and migrate existing data.
- [ ] Create occupancies for all 194 institutions and for organisations with known addresses.
- [ ] Drop obsolete location columns after moving their data and update tests.
- [ ] Add duplicate-place scoring with flags for reviewers.
- [ ] Report bodies with no occupancy and places with no body.
