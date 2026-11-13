import * as d from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { auth, authProperties } from "#/schemas/operational/auth.ts";

const access = auth.feature("AccountAccess").failureDefaults(databaseHttp);
const { ActiveAccount } = access.schemas({
  ActiveAccount: d.schema({ account_id: d.field(p.Id), display_name: d.field(p.Name), status: d.field(authProperties.AccountStatus) }),
});
const io = access.schemas({
  LoginKey: d.schema({ issuer: d.field(p.NonEmptyString500), subject: d.field(p.NonEmptyString500) }),
  ResolvedLogin: d.schema({ identity: d.field(ActiveAccount) }),
  PermissionProbe: d.schema({ account_id: d.field(p.Id), permission: d.field(p.BusinessCode) }),
  PermissionDecision: d.schema({ allowed: d.field(p.Flag) }),
});

export const authOperations = access.operations({
  ResolveActiveLogin: d
    .operation()
    .description("Resolve an issuer and subject to an active platform account.")
    .input(io.LoginKey)
    .output(io.ResolvedLogin)
    .failures(f.Forbidden, f.NotFound)
    .facets(({ input, output }) => ({ http: d.http("POST", "/v1/auth/identity/resolve").input(input, d.body()).output(output) })),
  EvaluatePlatformPermission: d
    .operation()
    .description("Evaluate an account's effective grants for a platform permission at request time.")
    .input(io.PermissionProbe)
    .output(io.PermissionDecision)
    .failures(f.Forbidden)
    .facets(({ input, output }) => ({ http: d.http("POST", "/v1/auth/permissions/check").input(input, d.body()).output(output) })),
});
