# Store-scoped Rust rows

This pack consumes one canonical store per activation. Engine resolves group defaults, schema
overrides and access before rendering. Row files use the `rows` destination slot; the primary
destination owns one store module and one store verifier. No namespace list or database inference
belongs in a template. References retain UUID values and target documentation; only foreign-key
enforcement belongs in SQL. Unsupported field mappings fail explicitly.

`rust-main-models` and `rust-operations-models` have disjoint outputs. Run the database app once to
create its stable `rust-catalog` modules; subsequent store-only runs can update one side. Preserve
the public `models::main/operations::<namespace>::<entity>` module paths. The old flat generated
row files are no longer referenced; they may be removed only through managed output cleanup, not
by editing generated files manually.

Generated exact decimal fields use rust_decimal::Decimal; the workspace and generated crate
manifests enable rust_decimal and SQLx's rust_decimal integration. SQL NUMERIC values are never
silently changed to floating point. Regenerate both rows and store verifiers after mapping changes.
