# Store-scoped PostgreSQL schema snapshots

One template renders the selected logical store from Engine's schema collection and
`pack.connection` metadata. Main and Operations use separate activations and output names.
Namespaces are collected from those canonical entities in deterministic order. Existing scalar,
temporal, invariant, partial-index and advanced-constraint SQL mappings remain in the template.
An application reference never emits a foreign key. Engine rejects impossible cross-store foreign
keys before rendering; a missing same-store target is also a rendering error.

The output is a full schema snapshot, not an incremental migration or an applied-state record.
This pack never changes immutable releases or a live database. Keep the existing Rust CLI ledger
and release assembly boundary. Dryv's generic initial PostgreSQL migration adapter is not enabled
for Mzizi's advanced model.

Scalar defaults and rule literals use PostgreSQL escaping (including apostrophes), not JSON quote
replacement. Null comparisons emit IS NULL / IS NOT NULL. Boolean, arithmetic and nested logical
rules render from the canonical expression tree up to five levels; unsupported operators,
structured literals and storage constraint kinds fail explicitly. Cross-store references never
become SQL foreign keys. Decimal precision/scale comes from canonical property constraints.
