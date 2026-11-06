---
{id: GOAL-GRP-8BAFC9BA79FC,name: Postgres schema naming goal,type: documentation,extra: {created_at: 2026-11-02T06:15:28.411Z,group: GRP-8BAFC9BA79FC}}
---

# Goal

Give the Mzizi PostgreSQL database a clean, domain-grouped layout: no tables in the public schema, one singular schema per domain, short plural table names with no repeated prefix. The group delivers the naming rule, the renamed contracts, regenerated code, updated queries and tests, and a freshly created database using the new names.

## Why it matters

Table names such as geo_units and legal_instruments in the public schema repeat their domain in every name, mix all domains together, and make grants awkward. Schemas per domain give readable names (geo.units, legal.instruments), per-domain permissions, and a layout the database engine can migrate and seed domain by domain. Doing this before the data engine is built avoids migrating real data later.
