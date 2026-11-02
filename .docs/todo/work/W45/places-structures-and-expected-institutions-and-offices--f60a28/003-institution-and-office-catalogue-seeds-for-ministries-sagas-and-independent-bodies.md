---
{id: TSK-0FDD5A808362,name: "Institution and office catalogue seeds for ministries, SAGAs and independent bodies",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:35.990Z,updated_at: 2026-11-02T20:59:35.990Z,order: 3072}
---

# Institution and office catalogue seeds (ministries, SAGAs, independent bodies)

## Goal
Know every public body and every post it is expected to have, from JSON seed files saved in the repository, so automated fetching knows what to look for.

## Context
Seeds are prepared from manual research by a coding agent or the user, labelled "custom-prepared from manual research", kept under `fixtures/seed`, and loaded idempotently. Scope: every ministry and state department, state corporations and SAGAs, constitutional commissions and independent offices, and agencies with public data such as TSC, DCI, NTSA, KeNHA, KURA, KeRRA, KRA, EACC, ODPP, the Judiciary, IEBC, NLC, CRA, SRC, CAJ, KNCHR, ORPP and the Controller of Budget and Auditor-General. For each body: code, name, type, legal basis, parent, mandate, expected sites and hosts, expected offices (title, cardinality, appointing authority, term) and expected places (headquarters, regional offices). Unknowns stay null and are listed for reinforcement.

## Acceptance checklist
- [ ] Define the seed file shape and loader with a validation test.
- [ ] Write seed files for ministries and state departments.
- [ ] Write seed files for state corporations and SAGAs.
- [ ] Write seed files for constitutional commissions and independent bodies.
- [ ] Load into the real database and report counts and gaps.
