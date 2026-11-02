---
{id: DOC-PEOPLE-DESIGN,name: PEOPLE_DESIGN,type: documentation,tags: [person,identity,privacy]}
---

# People and identity design

The humans in the loop are of two kinds and are modelled apart:

- **Persons**: real human beings the research is about or by (office holders, candidates, party officials, owners, historical figures, authors of sources, reviewers). They exist outside governance and outlive any role.
- **Accounts**: platform principals that sign in to Mzizi (contributors, reviewers, administrators). An account may be linked to a person; most persons never have an account.

They link by plain id, as every schema does. This follows the separation of principal from person already used in the Alidantech backend.

## `person` schema

```text
individuals   the human: code, display name, birth and death with precision, life status
names         every name: legal, common, honorific, alias, transliteration, in a language
profiles      public biography, summary, languages, occupation, nationality, as dated rows
contacts      ways to reach them: email, phone, postal, website, with an exposure level
handles       social media and platform identities: platform, handle, URL, verified flag
```

Portraits and gallery images are not columns anywhere: they are `filesystem.attachments` rows with a role (portrait, gallery, signature) pointing at the individual.

- **Public offices and exposure.** Contacts and handles carry `exposure` (`public`, `restricted`, `private`). The API serves only `public`; it is enforced in the use cases and tested. A public office's published email or phone is public; a person's private number never is. Restricted and private values exist for the research dashboard and are not served by the public API.
- **Time.** Profiles, contacts and handles are valid-time records: an office email changes when the holder changes. Names have validity (a person renamed).
- **Privacy.** Only public-interest information about public figures enters the public surface. Sensitive identifiers (national ids, health data, family details) are not modelled until a privacy review decides how they are held, and would go to a separately permissioned schema, not `person`.
- **Provenance.** Each fact about a person (birth date, a contact, a handle) is supported by `source.attributions`, not by columns on the person tables.

## `identity` schema (private)

```text
accounts   the platform principal: issuer, subject, linked person (soft id), status
grants     account roles: reader, contributor, reviewer, admin, optionally scoped to a jurisdiction
```

Mzizi issues no credentials and stores no passwords (`DEC-API-AUTH-RBAC`): the token's issuer and subject identify the account. `identity` has no public endpoints. Today the API reads roles from the token claim; grants are the durable store a later change will consult, scoped by jurisdiction. `audit` and `source` record `actorId` and `attributed_by` as account ids.

## Relationship to governance

`governance.holders` links an office to an individual by id, with the term, selection procedure and legal basis. A holder row never copies a name. People appearing in elections, parties, ownership and approvals refer to the same individual id, so one human is one row across the system and entity resolution has a single target.
