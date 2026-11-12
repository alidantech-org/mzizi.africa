import * as dryv from "@dryvcode/author";

import {
  readSurface,
  sharedProperties,
  standardFailures,
  withStandardHttpFailures,
} from "../../schemas/_shared.ts";
import {
  auth,
  authProperties,
  authSchemas,
} from "../../schemas/operational/auth.ts";
import { vocabulary, vocabularyProperties, vocabularySchemas } from "../../schemas/mzizi/reference.ts";


/**
 * Named operations of the database service. Callers never supply SQL, table or schema names;
 * lists use bounded pagination and declared filters. Authorization is resolved and enforced
 * inside the Rust service and fails closed.
 */

/* ------------------------------- auth ------------------------------------ */

const authAccess = auth
  .feature("AuthAccess")
  .description("Identity resolution and platform permission checks.")
  .tags("internal");

const identitySchemas = auth.schemas({
  ResolvedIdentity: dryv.schema({
    accountId: dryv.field(sharedProperties.Id),
    displayName: dryv.field(sharedProperties.Name),
    status: dryv.field(authProperties.AccountStatus),
  }),
});

const authAccessSchemas = auth.schemas({
  ResolveIdentityRequest: dryv.schema({
    issuer: dryv.field(authProperties.Issuer),
    subject: dryv.field(authProperties.Subject),
  }),
  ResolveIdentityResponse: dryv.schema({
    identity: dryv.field(identitySchemas.ResolvedIdentity),
  }),
  CheckPermissionRequest: dryv.schema({
    accountId: dryv.field(sharedProperties.Id),
    permission: dryv.field(sharedProperties.BusinessCode),
  }),
  CheckPermissionResponse: dryv.schema({
    allowed: dryv.field(sharedProperties.Flag),
  }),
});

const resolveIdentity = dryv
  .operation()
  .description(
    "Resolve an OIDC (issuer, subject) pair to an active platform account; unknown identities deny.",
  )
  .input(authAccessSchemas.ResolveIdentityRequest)
  .output(authAccessSchemas.ResolveIdentityResponse)
  .failures(...standardFailures);
resolveIdentity.facets({
  http: withStandardHttpFailures(
    dryv
      .http("POST", "/v1/auth/identity/resolve")
      .description("Resolve an OIDC identity to a platform account.")
      .input(resolveIdentity.in, dryv.body())
      .output(resolveIdentity.out, dryv.respond(200)),
  ),
});

const checkPermission = dryv
  .operation()
  .description(
    "Check whether an account holds a platform permission through active, unrevoked, unexpired grants.",
  )
  .input(authAccessSchemas.CheckPermissionRequest)
  .output(authAccessSchemas.CheckPermissionResponse)
  .failures(...standardFailures);
checkPermission.facets({
  http: withStandardHttpFailures(
    dryv
      .http("POST", "/v1/auth/permissions/check")
      .description("Check a platform permission for an account.")
      .input(checkPermission.in, dryv.body())
      .output(checkPermission.out, dryv.respond(200)),
  ),
});

export const authAccessOperations = authAccess.operations({
  ResolveIdentity: resolveIdentity,
  CheckPermission: checkPermission,
});

/* ----------------------------- vocabulary -------------------------------- */

const vocabularyRead = vocabulary
  .feature("VocabularyRead")
  .description("Scheme and value reads for service callers.")
  .tags("internal");

const schemes = readSurface(vocabulary, {
  singular: "Scheme",
  plural: "Schemes",
  itemKey: "scheme",
  listKey: "schemes",
  path: "/reference/schemes",
  idParam: "schemeId",
  entity: vocabularySchemas.Scheme,
  description: "vocabulary schemes",
  filters: {
    code: dryv.field(sharedProperties.BusinessCode).optional(),
    q: dryv.field(sharedProperties.Name).optional(),
  },
});

const values = readSurface(vocabulary, {
  singular: "Value",
  plural: "Values",
  itemKey: "value",
  listKey: "values",
  path: "/reference/values",
  idParam: "valueId",
  entity: vocabularySchemas.Value,
  description: "vocabulary values",
  filters: {
    schemeId: dryv.field(sharedProperties.Id).optional(),
    code: dryv.field(sharedProperties.BusinessCode).optional(),
  },
});

/* Lookup one value by scheme code and value code, the common hot path. */
const lookupSchemas = vocabulary.schemas({
  ValueLookupRequest: dryv.schema({
    scheme: dryv.field(sharedProperties.BusinessCode),
    code: dryv.field(sharedProperties.BusinessCode),
    language: dryv
      .field(vocabularyProperties.LanguageTag)
      .optional()
      .nullable(),
  }),
  ValueLookupResponse: dryv.schema({
    value: dryv.field(values.schemas.ValuePublic),
    label: dryv.field(vocabularyProperties.Label).optional().nullable(),
  }),
});

const lookupValue = dryv
  .operation()
  .description(
    "Look up a vocabulary value by scheme code and value code, optionally with a preferred label.",
  )
  .input(lookupSchemas.ValueLookupRequest)
  .output(lookupSchemas.ValueLookupResponse)
  .failures(...standardFailures);
lookupValue.facets({
  http: withStandardHttpFailures(
    dryv
      .http("POST", "/v1/reference/values/lookup")
      .description("Look up a vocabulary value by codes.")
      .input(lookupValue.in, dryv.body())
      .output(lookupValue.out, dryv.respond(200)),
  ),
});

export const vocabularyReadOperations = vocabularyRead.operations({
  ...schemes.operations,
  ...values.operations,
  LookupValue: lookupValue,
});
