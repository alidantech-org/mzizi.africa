//! Typed identifiers. New identities are UUIDv7 (time-ordered, index-friendly).
//!
//! Cross-database relationships are typed identifiers, never foreign keys: a value of
//! `AccountId` may be stored in `mzizi` rows, but nothing in `mzizi` references
//! `mzizi_operations` tables at the SQL level.

use serde::{Deserialize, Serialize};
use uuid::Uuid;

macro_rules! typed_id {
    ($(#[$doc:meta])* $name:ident) => {
        $(#[$doc])*
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $name(pub Uuid);

        impl $name {
            /// A new time-ordered identity.
            pub fn generate() -> Self {
                Self(Uuid::now_v7())
            }
        }

        impl std::fmt::Display for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                self.0.fmt(f)
            }
        }
    };
}

typed_id!(
    /// A platform account in `mzizi_operations.auth.accounts`.
    AccountId
);
typed_id!(
    /// A vocabulary scheme in `mzizi.reference.schemes`.
    SchemeId
);
typed_id!(
    /// A vocabulary value in `mzizi.reference.values`.
    ValueId
);
typed_id!(
    /// A role in `mzizi_operations.auth.roles`.
    RoleId
);
typed_id!(
    /// A permission in `mzizi_operations.auth.permissions`.
    PermissionId
);
