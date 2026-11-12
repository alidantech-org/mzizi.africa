import * as dryv from "@dryvcode/author";

import { baseEntitySchemas, sharedProperties } from "../_shared.ts";

/**
 * Platform authorization (database: mzizi_operations, schema: auth).
 *
 * Accounts are platform identities, separate from civic people and organizations. OIDC identities
 * are unique by (issuer, subject). Only active accounts with unrevoked, unexpired grants qualify;
 * unknown identities and unknown permissions deny. Grants stay attributable to their grantor.
 * Institutional hierarchies and record-scoped authorization are deferred.
 */
export const auth = dryv
  .group({ name: "auth" })
  .description(
    "Platform accounts, OIDC identities, permissions, roles and grants.",
  )
  .facets({ storage: { namespace: "auth" } });

export const authProperties = auth.properties({
  AccountStatus: dryv.property.enum({
    active: "active",
    suspended: "suspended",
    closed: "closed",
  }),
  /** OIDC issuer URL as presented by the provider. */
  Issuer: dryv.property.string().length({ min: 1, max: 500 }),
  /** OIDC subject claim, opaque provider-scoped identifier. */
  Subject: dryv.property.string().length({ min: 1, max: 500 }),
  LabelKind: dryv.property.enum({
    preferred: "preferred",
    alternate: "alternate",
  }),
});

export const authSchemas = auth.schemas({
  Account: dryv
    .schema({
      displayName: dryv
        .field(sharedProperties.Name)
        .query({ filter: ["contains"], sort: true }),
      status: dryv
        .field(authProperties.AccountStatus)
        .query({ filter: ["equal", "in"] }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({ storage: dryv.storage("accounts") }),

  OidcIdentity: dryv
    .schema({
      accountId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            authSchemas.Account.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      issuer: dryv.field(authProperties.Issuer).query({ filter: ["equal"] }),
      subject: dryv.field(authProperties.Subject).query({ filter: ["equal"] }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("oidc_identities").indexes({
        name: "idx_oidc_identity_issuer_subject",
        fields: ["issuer", "subject"],
        unique: true,
      }),
    }),

  Permission: dryv
    .schema({
      code: dryv
        .field(sharedProperties.BusinessCode)
        .query({ filter: ["equal", "startsWith"], sort: true }),
      description: dryv
        .field(sharedProperties.Description)
        .optional()
        .nullable(),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("permissions").indexes({
        name: "idx_permission_code",
        fields: ["code"],
        unique: true,
      }),
    }),

  Role: dryv
    .schema({
      code: dryv
        .field(sharedProperties.BusinessCode)
        .query({ filter: ["equal", "startsWith"], sort: true }),
      title: dryv.field(sharedProperties.Name),
      description: dryv
        .field(sharedProperties.Description)
        .optional()
        .nullable(),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv
        .storage("roles")
        .indexes({ name: "idx_role_code", fields: ["code"], unique: true }),
    }),

  RolePermission: dryv
    .schema({
      roleId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            authSchemas.Role.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      permissionId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            authSchemas.Permission.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("role_permissions").indexes({
        name: "idx_role_permission",
        fields: ["roleId", "permissionId"],
        unique: true,
      }),
    }),

  RoleAssignment: dryv
    .schema({
      accountId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            authSchemas.Account.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      roleId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            authSchemas.Role.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      /** Granting account; a plain id so the grantor stays attributable without a second Account relation. */
      grantedBy: dryv.field(sharedProperties.Id).query({ filter: ["equal"] }),
      grantedAt: dryv.field(sharedProperties.DateTime),
      expiresAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      revokedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("role_assignments").indexes({
        name: "idx_role_assignment_account",
        fields: ["accountId", "roleId"],
      }),
    }),
});
