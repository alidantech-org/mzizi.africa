//! Named domain operations — the only place hand-written SQL lives.
//!
//! One module per domain schema the foundation implements. Operations are named and typed;
//! callers never supply SQL, table names or unbounded pagination. Table shapes come from the
//! generated migrations; when generation changes a shape, these queries are updated with it
//! (compile-time checked once the SQLx offline cache is recorded).

pub mod reference;
