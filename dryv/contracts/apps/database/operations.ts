import * as dryv from "@dryvcode/author";

import { readSurface, sharedProperties, standardFailures, withStandardHttpFailures } from "../../schemas/_shared.ts";
import { filesystem, filesystemEnums } from "../../schemas/mzizi/filesystem.ts";
import { reference, Scheme, Value } from "../../schemas/mzizi/reference.ts";
import { auth, authProperties, authSchemas } from "../../schemas/operational/auth.ts";

/**
 * Named operations of the database service. Callers never supply SQL, table or schema names;
 * lists use bounded pagination and declared filters. Authorization is resolved and enforced
 * inside the Rust service and fails closed.
 */

/* ------------------------------- auth ------------------------------------ */

const authAccess = auth.feature("AuthAccess").description("Identity resolution and platform permission checks.").tags("internal");

const identitySchemas = auth.schemas({
  ResolvedIdentity: dryv.schema({
    accountId: dryv.field(sharedProperties.Id),
    displayName: dryv.field(sharedProperties.Name),
    status: dryv.field(authProperties.AccountStatus),
  }),
});

const authAccessSchemas = auth.schemas({
  ResolveIdentityRequest: dryv.schema({
    issuer: dryv.field(sharedProperties.NonEmptyString500),
    subject: dryv.field(sharedProperties.NonEmptyString500),
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
  .description("Resolve an OIDC (issuer, subject) pair to an active platform account; unknown identities deny.")
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
  .description("Check whether an account holds a platform permission through active, unrevoked, unexpired grants.")
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

const vocabularyRead = reference.feature("VocabularyRead").description("Scheme and value reads for service callers.").tags("internal");

const schemes = readSurface(reference, {
  singular: "Scheme",
  plural: "Schemes",
  itemKey: "scheme",
  listKey: "schemes",
  path: "/reference/schemes",
  idParam: "schemeId",
  entity: Scheme,
  description: "vocabulary schemes",
  filters: {
    code: dryv.field(sharedProperties.BusinessCode).optional(),
    q: dryv.field(sharedProperties.Name).optional(),
  },
});

const values = readSurface(reference, {
  singular: "Value",
  plural: "Values",
  itemKey: "value",
  listKey: "values",
  path: "/reference/values",
  idParam: "valueId",
  entity: Value,
  description: "vocabulary values",
  filters: {
    schemeId: dryv.field(sharedProperties.Id).optional(),
    code: dryv.field(sharedProperties.BusinessCode).optional(),
  },
});

/* Lookup one value by scheme code and value code, the common hot path. */
const lookupSchemas = reference.schemas({
  ValueLookupRequest: dryv.schema({
    scheme: dryv.field(sharedProperties.BusinessCode),
    code: dryv.field(sharedProperties.BusinessCode),
    language: dryv.field(sharedProperties.LanguageTag).optional().nullable(),
  }),
  ValueLookupResponse: dryv.schema({
    value: dryv.field(values.schemas.ValuePublic),
    label: dryv.field(sharedProperties.Name).optional().nullable(),
  }),
});

const lookupValue = dryv
  .operation()
  .description("Look up a vocabulary value by scheme code and value code, optionally with a preferred label.")
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

/* ----------------------------- filesystem --------------------------------
 * Hand-written in Rust and Python today (official Dryv client/server generation packs failed
 * to load against the running engine, see DEC-DATABASE-ACCESS-LIFECYCLE); authored here so the
 * contract stays the single source of truth and generation becomes a drop-in replacement once
 * the upstream packs are fixed.
 */

const filesystemWrite = filesystem.feature("FilesystemWrite").description("Folder and file writes for service callers.").tags("internal");

const folderEntitySchemas = filesystemWrite.schemas({
  Folder: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    parentId: dryv.field(sharedProperties.Id).optional().nullable(),
    name: dryv.field(sharedProperties.Name),
    code: dryv.field(sharedProperties.BusinessCode),
    access: dryv.field(filesystemEnums.Access),
    roleId: dryv.field(sharedProperties.Id),
    version: dryv.field(sharedProperties.PositiveInteger),
    createdAt: dryv.field(sharedProperties.Instant),
  }),
});

const folderSchemas = filesystemWrite.schemas({
  CreateFolderRequest: dryv.schema({
    accountId: dryv.field(sharedProperties.Id),
    parentId: dryv.field(sharedProperties.Id).optional().nullable(),
    name: dryv.field(sharedProperties.Name),
    code: dryv.field(sharedProperties.BusinessCode),
    access: dryv.field(filesystemEnums.Access),
    roleId: dryv.field(sharedProperties.Id),
  }),
  CreateFolderResponse: dryv.schema({
    folder: dryv.field(folderEntitySchemas.Folder),
  }),
});

const createFolder = dryv
  .operation()
  .description("Create a folder under an optional parent, with its access class and role resolved by the caller. Denies on a duplicate code.")
  .input(folderSchemas.CreateFolderRequest)
  .output(folderSchemas.CreateFolderResponse)
  .failures(...standardFailures);
createFolder.facets({
  http: withStandardHttpFailures(
    dryv
      .http("POST", "/v1/filesystem/folders")
      .description("Create a filesystem folder.")
      .input(createFolder.in, dryv.body())
      .output(createFolder.out, dryv.respond(201)),
  ),
});

export const filesystemWriteOperations = filesystemWrite.operations({
  CreateFolder: createFolder,
});
