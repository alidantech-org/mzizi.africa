/**
 * Schema: auth | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 27.4 and 28.4 (approved 2026-11-25).
 * Contract authors: auth keeps revoke and expiry history instead of soft delete and versions. Role titles are internal
 * English admin text (a deliberate exception to the no-display-text rule). Members sign in with an email or phone and a
 * one-time code; only digests of codes and tokens are stored.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo } from "./_links.ts";
import { Features } from "./geography.ts";
import { Institutions } from "./governance.ts";
import { Individuals } from "./official.ts";
import { Countries } from "./reference.ts";

export const auth = dryv
  .group({ name: "auth" })
  .description("Platform accounts, sign-in, one-time codes, roles, permissions, memberships, scopes, grants and delegation.")
  .facets({ storage: { namespace: "auth", store: "main" } });

export const authEnums = auth.properties({
  AccountStatus: dryv.property.enum(["active", "suspended", "closed"]),
  AuthActorKind: dryv.property.enum(["person", "service", "agent"]),
  MembershipStatus: dryv.property.enum(["pending", "active", "suspended", "expired", "revoked"]),
  AuthAction: dryv.property.enum(["read", "create", "update", "delete", "review", "publish", "export", "admin"]),
  /** The resource a permission applies to: one value per database schema (the API modules carry the same names). */
  ResourceType: dryv.property.enum([
    "reference",
    "identity",
    "vocabulary",
    "product",
    "media",
    "filesystem",
    "geography",
    "official",
    "source",
    "legal",
    "governance",
    "legislature",
    "politics",
    "election",
    "civic",
    "finance",
    "economy",
    "statistics",
    "event",
    "history",
    "community",
    "auth",
  ]),
  LoginKind: dryv.property.enum(["email", "phone", "oidc"]),
  CodePurpose: dryv.property.enum(["signup", "signin", "change"]),
  CodeChannel: dryv.property.enum(["email", "sms"]),
  LoginValue: dryv.property.string().length({ min: 3, max: 320 }),
  Attempts: dryv.property.number.integer({ range: { min: 0, max: 100 } }),
});

/*---------------- auth.accounts ----------------*/
export const Accounts = auth
  .schema("Accounts", {
    actorKind: dryv.field(authEnums.AuthActorKind).description("person, service or agent."),
    displayName: dryv.field(sharedProperties.NonEmptyString255),
    status: dryv.field(authEnums.AccountStatus),
    individualId: belongsTo(() => Individuals)
      .maybe()
      .description("Set only when the account belongs to a known public person."),
    disabledAt: dryv.field(sharedProperties.Instant).maybe(),
    lastAuthenticatedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("A sign-in principal for a person, service or agent.")
  .role("entity")
  .facets({ storage: dryv.storage("accounts").index("individualId") });

/*---------------- auth.logins ----------------*/
export const Logins = auth
  .schema("Logins", {
    accountId: belongsTo(() => Accounts),
    kind: dryv.field(authEnums.LoginKind).description("email, phone or oidc."),
    value: dryv
      .field(authEnums.LoginValue)
      .maybe()
      .description("Email stored lowercase or phone in E.164 (+254712345678); empty for OIDC."),
    issuer: dryv.field(sharedProperties.NonEmptyString500).maybe().description("OIDC issuer."),
    subject: dryv.field(sharedProperties.NonEmptyString500).maybe().description("OIDC subject."),
    verifiedAt: dryv.field(sharedProperties.Instant).maybe(),
    linkedAt: dryv.field(sharedProperties.Instant),
    unlinkedAt: dryv.field(sharedProperties.Instant).maybe(),
    lastAuthenticatedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .rule("OidcLoginHasIssuer", (v) => v.kind.ne("oidc").or(v.issuer.isNotNull().and(v.subject.isNotNull())))
  .rule("CodeLoginHasValue", (v) => v.kind.eq("oidc").or(v.value.isNotNull()))
  .description("A way an account signs in: email or phone with one-time codes, or an OIDC issuer and subject.")
  .role("entity");

const liveLogin = (name: string, kind: "oidc" | "code") =>
  auth.expression(
    name,
    Logins.check((v) => (kind === "oidc" ? v.kind.eq("oidc") : v.kind.ne("oidc")).and(v.unlinkedAt.isNull())),
  );
Logins.facets({
  storage: dryv
    .storage("logins")
    .indexes(
      {
        description: "One live login per kind and value.",
        fields: ["kind", "value"],
        unique: true,
        where: liveLogin("LiveCodeLogin", "code"),
      },
      {
        description: "One live login per OIDC issuer and subject.",
        fields: ["issuer", "subject"],
        unique: true,
        where: liveLogin("LiveOidcLogin", "oidc"),
      },
    )
    .index("accountId"),
});

/*---------------- auth.codes ----------------*/
export const Codes = auth
  .schema("Codes", {
    loginId: belongsTo(() => Logins)
      .maybe()
      .description("The login the code verifies; empty for a new sign-up."),
    value: dryv.field(authEnums.LoginValue).maybe().description("The email or phone being verified for a new sign-up."),
    purpose: dryv.field(authEnums.CodePurpose).description("signup, signin or change."),
    digest: dryv.field(sharedProperties.Sha256).description("Hash of the code; the code itself is never stored."),
    channel: dryv.field(authEnums.CodeChannel),
    expiresAt: dryv.field(sharedProperties.Instant).description("Short expiry, for example 10 minutes."),
    attempts: dryv.field(authEnums.Attempts).description("Failed attempts so far; limited, for example 5."),
    consumedAt: dryv.field(sharedProperties.Instant).maybe().description("When the code was used; codes are single use."),
  })
  .extends(baseSchemas.Created)
  .rule("CodeHasTarget", dryv.rule.exactlyOne("loginId", "value"))
  .description("A one-time sign-up or sign-in code.")
  .role("entity")
  .facets({ storage: dryv.storage("codes").index("loginId").index("value").index("expiresAt") });

/*---------------- auth.roles ----------------*/
export const Roles = auth
  .schema("Roles", {
    title: dryv.field(sharedProperties.NonEmptyString255).description("Internal English title for administrators."),
    description: dryv.field(sharedProperties.Description).maybe(),
    institutionId: belongsTo(() => Institutions)
      .maybe()
      .description("The institution that manages the role."),
    protected: dryv.field(sharedProperties.Flag).description("True when the role cannot be edited away."),
    policyVersion: dryv.field(sharedProperties.NonEmptyString255),
    retiredAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedCreated)
  .description("A named permission bundle with a policy version.")
  .role("entity")
  .facets({ storage: dryv.storage("roles").index("institutionId") });

/*---------------- auth.permissions ----------------*/
export const Permissions = auth
  .schema("Permissions", {
    resourceType: dryv.field(authEnums.ResourceType).description("The schema whose data the permission covers."),
    action: dryv.field(authEnums.AuthAction),
    fieldGroup: dryv
      .field(sharedProperties.String255)
      .maybe()
      .description("Optional group of fields the permission narrows to."),
    description: dryv.field(sharedProperties.Description).maybe(),
    isActive: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.CodedIdentified)
  .description("A named action on a resource type, optionally narrowed to a field group.")
  .role("entity")
  .facets({ storage: dryv.storage("permissions") });

/*---------------- auth.privileges ----------------*/
export const Privileges = auth
  .schema("Privileges", {
    roleId: belongsTo(() => Roles),
    permissionId: belongsTo(() => Permissions),
    grantedBy: belongsTo(() => Accounts),
    grantedAt: dryv.field(sharedProperties.Instant),
  })
  .description("What a role may do: a permission granted to a role, with who granted it and when.")
  .role("entity")
  .facets({
    storage: dryv.storage("privileges").primaryKey("roleId", "permissionId").index("permissionId").index("grantedBy"),
  });

/*---------------- auth.memberships ----------------*/
export const Memberships = auth
  .schema("Memberships", {
    accountId: belongsTo(() => Accounts),
    institutionId: belongsTo(() => Institutions),
    status: dryv.field(authEnums.MembershipStatus),
    verifiedBy: belongsTo(() => Accounts).maybe(),
    verifiedAt: dryv.field(sharedProperties.Instant).maybe(),
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    endsAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedBy: belongsTo(() => Accounts).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("An account's membership of an institution, verified and revocable with attribution.")
  .role("entity")
  .facets({
    storage: dryv.storage("memberships").index("accountId").index("institutionId").index("verifiedBy").index("revokedBy"),
  });

/*---------------- auth.invitations ----------------*/
export const Invitations = auth
  .schema("Invitations", {
    institutionId: belongsTo(() => Institutions),
    invitedBy: belongsTo(() => Accounts),
    intendedEmail: dryv.field(sharedProperties.Email),
    tokenDigest: dryv.field(sharedProperties.Sha256).description("Hash of the invitation token; the token is never stored."),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
    acceptedAccountId: belongsTo(() => Accounts).maybe(),
    acceptedAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("A single-use invitation to an institution.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("invitations")
      .unique("tokenDigest")
      .index("institutionId")
      .index("invitedBy")
      .index("acceptedAccountId"),
  });

/*---------------- auth.scopes ----------------*/
export const Scopes = auth
  .schema("Scopes", {
    isGlobal: dryv.field(sharedProperties.Flag),
    institutionId: belongsTo(() => Institutions).maybe(),
    countryId: belongsTo(() => Countries).maybe(),
    featureId: belongsTo(() => Features).maybe(),
    fieldGroup: dryv.field(sharedProperties.String255).maybe(),
    includeDescendants: dryv
      .field(sharedProperties.Flag)
      .description("True when the scope covers places under `feature_id`."),
    scopeHash: dryv.field(sharedProperties.Sha256).description("Hash of the scope's columns, so equal scopes are one row."),
  })
  .extends(baseSchemas.Created)
  .description("A deduplicated access scope: global, or narrowed by institution, country, place or field group.")
  .role("entity")
  .facets({
    storage: dryv.storage("scopes").unique("scopeHash").index("institutionId").index("countryId").index("featureId"),
  });

/*---------------- auth.grants ----------------*/
export const Grants = auth
  .schema("Grants", {
    accountId: belongsTo(() => Accounts),
    roleId: belongsTo(() => Roles),
    scopeId: belongsTo(() => Scopes),
    membershipId: belongsTo(() => Memberships).maybe(),
    delegationId: belongsTo(() => Delegations)
      .maybe()
      .description("The delegation the grant came from."),
    grantedBy: belongsTo(() => Accounts),
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
    revokedBy: belongsTo(() => Accounts).maybe(),
    revokedAt: dryv.field(sharedProperties.Instant).maybe(),
    revocationReason: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Who holds which role, within which scope, with revocation history.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("grants")
      .index("accountId")
      .index("roleId")
      .index("scopeId")
      .index("membershipId")
      .index("delegationId")
      .index("grantedBy")
      .index("revokedBy"),
  });

/*---------------- auth.delegations ----------------*/
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
      .index("scopeId")
      .index("revokedBy"),
  });

/*---------------- auth.allowances ----------------*/
export const Allowances = auth
  .schema("Allowances", {
    delegationId: belongsTo(() => Delegations, { onDelete: "cascade" }),
    roleId: belongsTo(() => Roles),
  })
  .description("The security ceiling of a delegation: the roles a delegate may receive through it.")
  .role("entity")
  .facets({ storage: dryv.storage("allowances").primaryKey("delegationId", "roleId").index("roleId") });
