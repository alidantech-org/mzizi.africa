---
{id: GOAL-GRP-5C21D3E8E888,name: Database domain redesign goal,type: documentation,extra: {created_at: 2026-11-02T06:41:22.132Z,group: GRP-5C21D3E8E888}}
---

# Goal

Redesign the Mzizi database as separable, fully named domain schemas: full-word schema and table names, no foreign keys between schemas, provenance moved out of data tables into a source schema that links to any record by reference, a person schema and an identity schema for the humans in the loop, and a filesystem schema that models files and media for heavy traffic. The group delivers researched design documents, rewritten Dryv contracts, regenerated code, updated queries and tests, and a recreated development database.

## Why it matters

The current layout repeats ten evidence columns in 69 tables, buries people inside governance, has no home for media, and uses abbreviated schema names. A normalised, separable design is cheaper to run at scale today on one database and lets any schema move to its own database later. The data engine and the files service will build on these schemas, so the shape must be right before real data arrives.
