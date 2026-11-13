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
