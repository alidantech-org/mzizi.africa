import * as dryv from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { filesystem, filesystemEnums, Folders } from "#/schemas/mzizi/filesystem.ts";

const hierarchy = filesystem.feature("FolderHierarchy").failureDefaults(databaseHttp);
const { FolderView } = hierarchy.schemas({
  FolderView: dryv
    .schema({})
    .projection(dryv.projection(Folders.asRef()).read().pick("id", "parentId", "name", "code", "access", "roleId", "version", "createdAt")),
});
const io = hierarchy.schemas({
  RegisterFolderInput: dryv.schema({
    accountId: dryv.field(p.Id),
    parentId: dryv.field(p.Id).maybe(),
    name: dryv.field(p.Name),
    code: dryv.field(p.IdentityCode),
    access: dryv.field(filesystemEnums.Access),
    roleId: dryv.field(p.Id),
  }),
  RegisteredFolder: dryv.schema({ folder: dryv.field(FolderView) }),
});

export const filesystemOperations = hierarchy.operations({
  RegisterFolder: dryv
    .operation()
    .role("create")
    .description("Register a logical folder under an optional parent after checking the acting account's filesystem edit permission.")
    .input(io.RegisterFolderInput)
    .output(io.RegisteredFolder)
    .failures(f.Forbidden, f.ValidationError)
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/filesystem/folders").input(input, dryv.body()).output(output, dryv.respond(201)),
    })),
});
