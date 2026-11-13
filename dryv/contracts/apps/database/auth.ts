import * as dryv from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { auth, authProperties } from "#/schemas/operational/auth.ts";

const access = auth.feature("AccountAccess").failureDefaults(databaseHttp);
const { ActiveAccount } = access.schemas({
  ActiveAccount: dryv.schema({
    account_id: dryv.field(p.Id),
    display_name: dryv.field(p.Name),
    status: dryv.field(authProperties.AccountStatus),
  }),
});
const io = access.schemas({
  LoginKey: dryv.schema({ issuer: dryv.field(p.NonEmptyString500), subject: dryv.field(p.NonEmptyString500) }),
  ResolvedLogin: dryv.schema({ identity: dryv.field(ActiveAccount) }),
  PermissionProbe: dryv.schema({ account_id: dryv.field(p.Id), permission: dryv.field(p.BusinessCode) }),
  PermissionDecision: dryv.schema({ allowed: dryv.field(p.Flag) }),
});

export const authOperations = access.operations({
  ResolveActiveLogin: dryv
    .operation()
    .description("Resolve an issuer and subject to an active platform account.")
    .input(io.LoginKey)
    .output(io.ResolvedLogin)
    .failures(f.Forbidden, f.NotFound)
    .facets(({ input, output }) => ({ http: dryv.http("POST", "/v1/auth/identity/resolve").input(input, dryv.body()).output(output) })),
  EvaluatePlatformPermission: dryv
    .operation()
    .description("Evaluate an account's effective grants for a platform permission at request time.")
    .input(io.PermissionProbe)
    .output(io.PermissionDecision)
    .failures(f.Forbidden)
    .facets(({ input, output }) => ({ http: dryv.http("POST", "/v1/auth/permissions/check").input(input, dryv.body()).output(output) })),
});
