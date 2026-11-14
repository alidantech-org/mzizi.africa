/**
 * Schema: auth | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/auth.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const auth = dryv
  .group({ name: "auth" })
  .description("Platform accounts, access control, roles and delegation.")
  .facets({ storage: { namespace: "auth", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const authEnums = auth.properties({
  AccountStatus: dryv.property.enum(["active", "suspended", "closed"]),
  AuthActorKind: dryv.property.enum(["person", "service"]),
  MembershipStatus: dryv.property.enum(["pending", "active", "suspended", "expired", "revoked"]),
  AuthAction: dryv.property.enum(["read", "create", "update", "delete", "review", "publish", "export", "admin"]),
});

export const Accounts = auth
  .schema("Accounts", {
    actorKind: dryv.field(authEnums.AuthActorKind),
    displayName: dryv.field(sharedProperties.NonEmptyString255),
    status: dryv.field(authEnums.AccountStatus),
    personRefId: dryv.field(sharedProperties.Id),
    disabledAt: dryv.field(sharedProperties.Instant).maybe(),
    lastAuthenticatedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description(
    "Login principal for a person or service; identity is separate from the people and institutions it refers to.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("accounts"),
  });

export const LoginIdentities = auth
  .schema("LoginIdentities", {
    accountId: belongsTo(() => Accounts),
    issuer: dryv.field(sharedProperties.NonEmptyString500),
    subject: dryv.field(sharedProperties.NonEmptyString500),
    linkedAt: dryv.field(sharedProperties.Instant),
    unlinkedAt: dryv.field(sharedProperties.Instant).maybe(),
    lastAuthenticatedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("External issuer and subject linked to one account; unlinking is recorded, never deleted.")
  .role("entity")
  .facets({
    storage: dryv.storage("login_identities").index("accountId").unique("issuer", "subject"),
  });

export const Roles = auth
  .schema("Roles", {
    title: dryv.field(sharedProperties.NonEmptyString255),
    description: dryv.field(sharedProperties.Description).maybe(),
    managingInstitutionRefId: dryv.field(sharedProperties.Id).maybe(),
    protected: dryv.field(sharedProperties.Flag),
    policyVersion: dryv.field(sharedProperties.NonEmptyString255),
    retiredAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedCreated)
  .description("Named permission bundle with a policy version; protected roles cannot be edited away.")
  .role("entity")
  .facets({
    storage: dryv.storage("roles"),
  });

export const Permissions = auth
  .schema("Permissions", {
    resourceType: dryv.field(sharedProperties.NonEmptyString255),
    action: dryv.field(authEnums.AuthAction),
    fieldGroup: dryv.field(sharedProperties.String255).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
    isActive: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.CodedIdentified)
  .description("Named action on a resource type, optionally narrowed to a field group.")
  .role("entity")
  .facets({
    storage: dryv.storage("permissions"),
  });

export const RolePermissions = auth
  .schema("RolePermissions", {
    roleId: belongsTo(() => Roles),
    permissionId: belongsTo(() => Permissions),
    grantedBy: belongsTo(() => Accounts),
    grantedAt: dryv.field(sharedProperties.Instant),
  })
  .description("Permission granted to a role, with who granted it and when.")
  .role("entity")
  .facets({
    storage: dryv.storage("role_permissions").primaryKey("roleId", "permissionId").index("permissionId").index("grantedBy"),
  });

export const Memberships = auth
  .schema("Memberships", {
    accountId: belongsTo(() => Accounts),
    institutionRefId: dryv.field(sharedProperties.Id),
    status: dryv.field(authEnums.MembershipStatus),
    verifiedBy: belongsTo(() => Accounts).maybe(),
    verifiedAt: dryv.field(sharedProperties.Instant).maybe(),
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    endsAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedBy: belongsTo(() => Accounts).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Account membership of an institution, verified and revocable with attribution.")
  .role("entity")
  .facets({
    storage: dryv.storage("memberships").index("verifiedBy").index("revokedBy").index("accountId"),
  });

export const Invitations = auth
  .schema("Invitations", {
    institutionRefId: dryv.field(sharedProperties.Id),
    invitedBy: belongsTo(() => Accounts),
    intendedEmail: dryv.field(sharedProperties.Email),
    tokenDigest: dryv.field(sharedProperties.Sha256),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
    acceptedAccountId: belongsTo(() => Accounts).maybe(),
    acceptedAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Single-use invitation to an institution; only a digest of the token is stored.")
  .role("entity")
  .facets({
    storage: dryv.storage("invitations").index("invitedBy").index("acceptedAccountId").unique("tokenDigest"),
  });

export const Scopes = auth
  .schema("Scopes", {
    isGlobal: dryv.field(sharedProperties.Flag),
    institutionRefId: dryv.field(sharedProperties.Id),
    countryRefId: dryv.field(sharedProperties.Id).maybe(),
    geographicUnitRefId: dryv.field(sharedProperties.Id).maybe(),
    datasetRefId: dryv.field(sharedProperties.Id).maybe(),
    fieldGroup: dryv.field(sharedProperties.String255).maybe(),
    includeDescendants: dryv.field(sharedProperties.Flag),
    scopeHash: dryv.field(sharedProperties.Sha256),
  })
  .extends(baseSchemas.Created)
  .description("Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group.")
  .role("entity")
  .facets({
    storage: dryv.storage("scopes").unique("scopeHash"),
  });

export const RoleAssignments = auth
  .schema("RoleAssignments", {
    accountId: belongsTo(() => Accounts),
    roleId: belongsTo(() => Roles),
    scopeId: belongsTo(() => Scopes),
    membershipId: belongsTo(() => Memberships).maybe(),
    delegationId: belongsTo(() => Delegations).maybe(),
    grantedBy: belongsTo(() => Accounts),
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedBy: belongsTo(() => Accounts).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
    revocationReason: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Scoped role grant to an account, optionally through a membership or delegation, with revocation history.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("role_assignments")
      .index("membershipId")
      .index("delegationId")
      .index("grantedBy")
      .index("revokedBy")
      .index("accountId")
      .index("roleId")
      .index("scopeId"),
  });

export const Delegations = auth
  .schema("Delegations", {
    delegatorAccountId: belongsTo(() => Accounts),
    delegateAccountId: belongsTo(() => Accounts),
    scopeId: belongsTo(() => Scopes),
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedBy: belongsTo(() => Accounts).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Time-limited delegation of scoped access from one account to another.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("delegations")
      .index("delegatorAccountId")
      .index("delegateAccountId")
      .index("revokedBy")
      .index("scopeId"),
  });

export const DelegationRoles = auth
  .schema("DelegationRoles", {
    delegationId: belongsTo(() => Delegations),
    roleId: belongsTo(() => Roles),
  })
  .description("Role included in a delegation.")
  .role("entity")
  .facets({
    storage: dryv.storage("delegation_roles").primaryKey("delegationId", "roleId").index("roleId"),
  });
