---
{id: TSK-EDD0990C97E9,name: Person and identity schemas,type: task,status: planned,priority: medium,created_at: 2026-11-02T06:41:22.494Z,updated_at: 2026-11-02T06:41:22.494Z,due_at: 2026-11-02,order: 3072}
---

# Person and identity schemas

## Goal

Model the humans in the loop: a person schema for every real human with names, profiles, contacts and social handles and an exposure level on contact data, and a private identity schema for platform accounts and grants. Move people out of governance.

## Context

.docs/docs/PEOPLE_DESIGN.md has the model. Governance currently owns people and person names; these become person individuals and names. Contacts and handles carry an exposure of public, restricted or private and the API serves only public values; a use-case test must prove private contacts never leak. Identity has no public endpoints and no read surface. Portraits and other media are not columns; they are filesystem attachments. Other schemas that mention a person keep a plain id to the individual.

## Acceptance checklist

- [ ] Author the person contracts and read endpoints at /v1/people.
- [ ] Remove people and aliases from governance and repoint references to the individual id.
- [ ] Enforce public-only contacts and handles in the use cases and test the leak case.
- [ ] Author identity accounts and grants without public endpoints.
- [ ] Update the access rules export, fixtures and tests.
