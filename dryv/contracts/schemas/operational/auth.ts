/**
 * Schema: auth | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/auth.md
 * Approved inventory: 11 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";

export const auth = dryv
  .group({ name: "auth" })
  .description("Approved Mzizi Operations auth records.")
  .facets({ storage: { namespace: "auth", store: "operations" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const authEnums = auth.properties({
  AccountStatus: dryv.property.enum({
    Active: "active",
    Suspended: "suspended",
    Closed: "closed",
  }),
  AuthActorKind: dryv.property.enum({
    Person: "person",
    Service: "service",
  }),
  MembershipStatus: dryv.property.enum({
    Pending: "pending",
    Active: "active",
    Suspended: "suspended",
    Expired: "expired",
    Revoked: "revoked",
  }),
  AuthAction: dryv.property.enum({
    Read: "read",
    Create: "create",
    Update: "update",
    Delete: "delete",
    Review: "review",
    Publish: "publish",
    Export: "export",
    Admin: "admin",
  }),
});

/*---------------- Approved auth table contracts ----------------*/
export const authSchemas: Record<string, any> = {};
export const Accounts = auth.schemas({
  Accounts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      actor_kind: dryv.field(authEnums.AuthActorKind),
      display_name: dryv.field(sharedProperties.NonEmptyString255),
      status: dryv.field(authEnums.AccountStatus),
      person_ref_id: dryv.field(sharedProperties.Id),
      created_at: dryv.field(sharedProperties.Instant),
      disabled_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      last_authenticated_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({ storage: dryv.storage("accounts").primaryKey("id") }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Accounts = Accounts.Accounts;

export const LoginIdentities = auth.schemas({
  LoginIdentities: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      issuer: dryv.field(sharedProperties.NonEmptyString500),
      subject: dryv.field(sharedProperties.NonEmptyString500),
      linked_at: dryv.field(sharedProperties.Instant),
      unlinked_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      last_authenticated_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("login_identities")
        .primaryKey("id")
        .indexes(
          { name: "idx_login_identities_account_id", fields: ["account_id"] },
          { name: "uq_login_identities_issuer_subject", fields: ["issuer", "subject"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.LoginIdentities = LoginIdentities.LoginIdentities;

export const Roles = auth.schemas({
  Roles: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.NonEmptyString255),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      managing_institution_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      protected: dryv.field(sharedProperties.Flag),
      policy_version: dryv.field(sharedProperties.NonEmptyString255),
      created_at: dryv.field(sharedProperties.Instant),
      retired_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("roles")
        .primaryKey("id")
        .indexes({ name: "uq_roles_code", fields: ["code"], unique: true }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Roles = Roles.Roles;

export const Permissions = auth.schemas({
  Permissions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      resource_type: dryv.field(sharedProperties.NonEmptyString255),
      action: dryv.field(authEnums.AuthAction),
      field_group: dryv.field(sharedProperties.String255).optional().nullable(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      is_active: dryv.field(sharedProperties.Flag),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("permissions")
        .primaryKey("id")
        .indexes({ name: "uq_permissions_code", fields: ["code"], unique: true }),
    }),
});

authSchemas.Permissions = Permissions.Permissions;

export const RolePermissions = auth.schemas({
  RolePermissions: dryv
    .schema({
      role_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Roles.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      permission_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Permissions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      granted_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      granted_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("role_permissions")
        .primaryKey("role_id", "permission_id")
        .indexes(
          { name: "idx_role_permissions_permission_id", fields: ["permission_id"] },
          { name: "idx_role_permissions_granted_by", fields: ["granted_by"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.RolePermissions = RolePermissions.RolePermissions;

export const Memberships = auth.schemas({
  Memberships: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      institution_ref_id: dryv.field(sharedProperties.Id),
      status: dryv.field(authEnums.MembershipStatus),
      verified_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      verified_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      starts_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      ends_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      revoked_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      revoked_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("memberships")
        .primaryKey("id")
        .indexes(
          { name: "idx_memberships_verified_by", fields: ["verified_by"] },
          { name: "idx_memberships_revoked_by", fields: ["revoked_by"] },
          { name: "idx_memberships_account_id", fields: ["account_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Memberships = Memberships.Memberships;

export const Invitations = auth.schemas({
  Invitations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      institution_ref_id: dryv.field(sharedProperties.Id),
      invited_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      intended_email: dryv.field(sharedProperties.Email),
      token_digest: dryv.field(sharedProperties.Sha256),
      expires_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      accepted_account_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      accepted_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      revoked_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("invitations")
        .primaryKey("id")
        .indexes(
          { name: "idx_invitations_invited_by", fields: ["invited_by"] },
          { name: "idx_invitations_accepted_account_id", fields: ["accepted_account_id"] },
          { name: "uq_invitations_token_digest", fields: ["token_digest"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Invitations = Invitations.Invitations;

export const Scopes = auth.schemas({
  Scopes: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      is_global: dryv.field(sharedProperties.Flag),
      institution_ref_id: dryv.field(sharedProperties.Id),
      country_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      geographic_unit_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      dataset_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      field_group: dryv.field(sharedProperties.String255).optional().nullable(),
      include_descendants: dryv.field(sharedProperties.Flag),
      scope_hash: dryv.field(sharedProperties.Sha256),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("scopes")
        .primaryKey("id")
        .indexes({ name: "uq_scopes_scope_hash", fields: ["scope_hash"], unique: true }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Scopes = Scopes.Scopes;

export const RoleAssignments = auth.schemas({
  RoleAssignments: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      role_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Roles.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      scope_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Scopes.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      membership_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Memberships.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      delegation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Delegations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      granted_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      starts_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      expires_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      revoked_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      revoked_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      revocation_reason: dryv.field(sharedProperties.Description).optional().nullable(),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("role_assignments")
        .primaryKey("id")
        .indexes(
          { name: "idx_role_assignments_membership_id", fields: ["membership_id"] },
          { name: "idx_role_assignments_delegation_id", fields: ["delegation_id"] },
          { name: "idx_role_assignments_granted_by", fields: ["granted_by"] },
          { name: "idx_role_assignments_revoked_by", fields: ["revoked_by"] },
          { name: "idx_role_assignments_account_id", fields: ["account_id"] },
          { name: "idx_role_assignments_role_id", fields: ["role_id"] },
          { name: "idx_role_assignments_scope_id", fields: ["scope_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.RoleAssignments = RoleAssignments.RoleAssignments;

export const Delegations = auth.schemas({
  Delegations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      delegator_account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      delegate_account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      scope_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Scopes.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      starts_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      expires_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      revoked_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      revoked_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("delegations")
        .primaryKey("id")
        .indexes(
          { name: "idx_delegations_delegator_account_id", fields: ["delegator_account_id"] },
          { name: "idx_delegations_delegate_account_id", fields: ["delegate_account_id"] },
          { name: "idx_delegations_revoked_by", fields: ["revoked_by"] },
          { name: "idx_delegations_scope_id", fields: ["scope_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.Delegations = Delegations.Delegations;

export const DelegationRoles = auth.schemas({
  DelegationRoles: dryv
    .schema({
      delegation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Delegations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      role_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Roles.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("delegation_roles")
        .primaryKey("delegation_id", "role_id")
        .indexes({ name: "idx_delegation_roles_role_id", fields: ["role_id"] }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

authSchemas.DelegationRoles = DelegationRoles.DelegationRoles;

/** Compatibility name retained for the existing database operation contracts. */
export const authProperties = authEnums;
