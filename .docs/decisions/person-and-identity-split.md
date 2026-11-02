---
{id: DEC-PERSON-IDENTITY-SPLIT,name: Decision - person and identity are separate schemas,type: decision,tags: [person,identity,privacy]}
---

# Decision: person and identity are separate schemas

Date: 2026-11-02.

## Decision

`person` models every real human the research concerns (names, profile, contacts, public handles), independent of any role. `identity` models platform accounts and role grants and is private with no public endpoints. They link by plain id. People moved out of `governance`, which now refers to an individual by id only. Contacts and handles carry an exposure level and the public API serves only `public`.

## Why

Office holders, candidates, owners and historical figures are people first; login data is a different kind of data with a different audience. Keeping them apart is the data seclusion the platform needs and mirrors the Principal and Person separation used in the Alidantech backend. Portraits and other media are `filesystem.attachments`, not columns.

## Consequences

Sensitive identifiers (national ids, health, family) are not modelled until a privacy review; they would go in a separately permissioned schema. Entity resolution has one target per human. Account grants will replace token-claim roles later; until then the guard reads the claim.
