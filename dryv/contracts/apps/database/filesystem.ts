import * as d from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { filesystem, filesystemEnums, Folders } from "#/schemas/mzizi/filesystem.ts";

const hierarchy = filesystem.feature("FolderHierarchy").failureDefaults(databaseHttp);
const { FolderView } = hierarchy.schemas({
  FolderView: d
    .schema({})
    .projection(d.projection(Folders.asRef()).read().pick("id", "parentId", "name", "code", "access", "roleId", "version", "createdAt")),
});
const io = hierarchy.schemas({
  RegisterFolderInput: d.schema({
    accountId: d.field(p.Id),
    parentId: d.field(p.Id).maybe(),
    name: d.field(p.Name),
    code: d.field(p.IdentityCode),
    access: d.field(filesystemEnums.Access),
    roleId: d.field(p.Id),
  }),
  RegisteredFolder: d.schema({ folder: d.field(FolderView) }),
});

export const filesystemOperations = hierarchy.operations({
  RegisterFolder: d
    .operation()
    .role("create")
    .description("Register a logical folder under an optional parent after checking the acting account's filesystem edit permission.")
    .input(io.RegisterFolderInput)
    .output(io.RegisteredFolder)
    .failures(f.Forbidden, f.ValidationError)
    .facets(({ input, output }) => ({ http: d.http("POST", "/v1/filesystem/folders").input(input, d.body()).output(output, d.respond(201)) })),
});
