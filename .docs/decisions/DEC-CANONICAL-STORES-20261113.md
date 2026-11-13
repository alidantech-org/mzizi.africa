---
{id: DEC-CANONICAL-STORES-20261113,name: Canonical Main and Operations store ownership,type: decision}
---

# Canonical Main and Operations store ownership

Use the existing Dryv v1alpha1 store model. Persisted neutral groups own their store defaults;
namespace/table names remain separate. The database application declares both store identities,
read/write access and its provided service operations. Root usage binds the database activation
to its independent authoring source, store-specific Rust packs and explicit deployment metadata.
The legacy API remains independent until its own contract migration is authorized.

Remove the duplicated namespace lists from usage and templates. Engine owns impossible foreign
key rejection. Existing application-verified external IDs remain plain IDs until a real resolver
operation is defined; do not invent validation behavior. Persisted entities alone become SQL
schema/model artifacts; Accountability view models remain non-persisted.

Generate store-specific row directories and modules with the public Rust paths preserved. A
small separate catalogue pack owns shared root modules so partial store runs cannot collide or
rewrite the other store's output. The existing SQL snapshot filenames, immutable migration
releases, snapshot sidecars and public applied ledger remain unchanged. This adoption does not
authorize database execution or switching to Dryv's initial generic migration adapter, whose
mapping coverage is insufficient for Mzizi's advanced model. Checkpoints stay local by default
and require explicit approval after successful generation. Code/docs plus typecheck/formatting
complete before the separately tracked tests and real-generation phase.
