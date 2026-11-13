---
id: DEC-REFERENCE-BINDING-LEGAL-BRIDGE-20261113
name: Open decision - how pattern bindings reference Legal
type: decision
tags: [database, schema, reference, legal, open]
extra: {status: proposed, raised_on: 2026-11-13, needs: owner}
---

# Open decision: how pattern bindings reference Legal

## Context

`reference.pattern_bindings` carries an optional `provision_id` that scopes a pattern release to a legal provision. Today it is a plain typed id with no foreign key. Reference also owns `reference.legal_basis_links`, which already ties a provision version, a basis role and a citation together with an effective window and review fields. A binding can therefore name a provision directly, or name a legal basis link that already explains why the provision applies.

## Options

1. Replace `provision_id` with `legal_basis_link_id`, a real foreign key to `reference.legal_basis_links`. Bindings inherit the review and citation trail. This changes the binding contract.
2. Keep `provision_id` and give it a real foreign key to `legal.provisions`. It is simple, but a binding can then name a provision with no basis link or review trail.
3. Keep both, with a rule that at most one is set.

## Needed from the owner

Choose an option. Until then `provision_id` stays a plain id and `reference.ts` says so in one comment. Nothing else in Reference depends on this choice.
