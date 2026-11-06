---
{id: TSK-EDD0990C97E9,name: Person and identity schemas,type: task,status: completed,priority: medium,created_at: 2026-11-02T06:41:22.494Z,updated_at: 2026-11-02T06:59:00.417Z,due_at: 2026-11-02,order: 1280,extra: {status_history: [{from: planned,to: completed,at: 2026-11-02T06:59:00.417Z}]},archived_at: 2026-11-06T12:50:48.210Z}
---

# Person and identity schemas

## Goal

Model the humans in the loop: a person schema for every real human with names, profiles, contacts and social handles and an exposure level on contact data, and a private identity schema for platform accounts and grants. Move people out of governance.

## Context

.docs/docs/PEOPLE_DESIGN.md has the model. Governance currently owns people and person names; these become person individuals and names. Contacts and handles carry an exposure of public, restricted or private and the API serves only public values; a use-case test must prove private contacts never leak. Identity has no public endpoints and no read surface. Portraits and other media are not columns; they are filesystem attachments. Other schemas that mention a person keep a plain id to the individual.

## Acceptance checklist

- [x] Author the person contracts and read endpoints at /v1/people.
- [x] Remove people and aliases from governance and repoint references to the individual id.
- [x] Enforce public-only contacts and handles in the use cases and test the leak case.
- [x] Author identity accounts and grants without public endpoints.
- [x] Update the access rules export, fixtures and tests.

## Progress

New person schema (individuals, names, profiles, contacts, handles) with read endpoints at /v1/people, and a private identity schema (accounts, grants) with no endpoints. People and aliases left governance; holders refer to an individual by id. Contacts and handles carry an exposure level and the use cases serve public values only: a test shows a client cannot request private values through the query and a private contact answers 404. Decision record: .docs/decisions/person-and-identity-split.md.
