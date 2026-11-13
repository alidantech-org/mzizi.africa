# Shared Rust catalogue

This pack owns only stable `models/mod.rs` and `models/contract.rs`. Store-scoped model packs own
all schema-sensitive rows, Main/Operations modules and per-store verification functions. The
catalogue delegates verification to those functions and contains no namespace assignment rules.
It activates under the database app with no store selector and is generated during a complete app
run. No other pack activation may own these two paths. Store-only runs leave them untouched.
