---
id: DOC-SUBJECT-REFERENCES
name: Standard subject references across schemas
type: documentation
---

# Standard subject references

## Owner decision

The owner approved a coordinated breaking change on 17 November 2026: every single-subject generic record association uses the same keys, a closed enum of known tables, and one reusable authored base contract. No compatibility aliases or mixed old/new naming remain. This applies to Filesystem media, Source provenance/support associations, Legal effects and every equivalent single-subject association discovered across active contracts and consumers.

## Exact shared contract

Use `SubjectTable` as the shared enum and `SubjectReference` as the reusable base contract. The only fields contributed by this contract are:

| Authored field | SQL column | Type | Meaning |
|---|---|---|---|
| subjectTable | subject_table | SubjectTable | Fully qualified eligible database table |
| subjectId | subject_id | UUID/approved shared identity scalar | Existing subject record in that table |

Both are required for a persisted subject association. The base adds no code, timestamps, soft deletion, version or workflow fields. Use supported Dryv authoring constructs; the approved semantic base is not permission to invent an unsupported API. Input seed codes resolve to subject_id through the same identity rules as other links; seed cells do not require manually copied UUIDs.

Declare the enum centrally with shared technical properties and the base alongside other shared/base contracts, without making _shared import domain schemas. Populate all known supported subject tables from the authored schema inventory. Do not infer persisted table names from a class label or accept arbitrary runtime strings. The enum must stay synchronized with actual table mappings; verify missing, duplicate, renamed and removed values. Eligible domain targets should not be omitted for convenience. Database PK type compatibility must be checked; composite/non-UUID subjects require an explicit supported identity mapping, not lossy coercion.

Use one enum throughout generated SQL, catalogues, API clients, runtime validation and import/export tooling. Final enum output spelling must retain fully qualified SQL identities (for example official.entities and geography.features), independent of display labels. Validate actual generated enum representations rather than assuming language enum member names are serialized database values.

## Meaning and enforcement

subject_table identifies the table; subject_id identifies a row there. A closed table enum alone does not establish that a UUID exists in the selected table. Implement a common typed target resolver and strong integrity enforcement. Use database-side validation where supported and enforce deletion/update behavior so subject deletion cannot silently leave dangling associations. Declare whether deletion is restricted, cascades intentionally or preserves historical subject identity; do not implement dynamic SQL from untrusted table strings. Any registry dispatch uses known enum mappings and parameterized identifiers/values through reviewed safe code.

Prefer actual foreign keys when targets are fixed. In particular geography.assets retains required feature_id, optional geometry_id, and its same-feature composite FK; it does not become a generic subject pointer.

I/O relationships have two endpoint roles, unlike one-subject metadata. Use centrally defined endpoint shapes with explicit input/output roles and an allowed kind/endpoint matrix. Do not overwrite both ends with one subject pair. Where a relationship additionally concerns an external domain subject, use the exact SubjectReference keys for that association rather than target_table/target_id. Final endpoint composition must preserve the agreed common contract without creating parallel names for the same single-subject meaning.

## Source provenance naming

The current source.provenance role is consolidated into the approved source.relationships target; mentioning source.provenance as a current consumer does not require an extra fourteenth Source table. Its subject association must use SubjectReference in the replacement. Migrate table_name/record_id and target/subject aliases everywhere; retain input_code-style data only as explicit seed-resolution inputs, not second authoritative runtime subject keys.

## Breaking migration

Inventory all authored/generated tables, engine adapters, runtime payloads, SDKs, API projections, UI selectors, loaders, CSV headers, fixtures, examples and docs carrying this semantic association. Migrate them together. No legacy aliases, dual-write periods, old-format readers, v2 copies or compatibility shims are requested. Preserve data, codes, historical provenance and subject existence despite the hard cutover.

Validation must reject unknown table values, table/id mismatches, invalid/missing subjects, unsupported PK shapes and orphan creation through subject deletion. Verify same keys in every generated language and seed alias, consistent enum membership, deterministic regeneration and zero active old subject-key spellings for this meaning. Word search results must be reviewed semantically: legitimate target/input/output roles and fixed foreign keys are not automatically subject associations.
