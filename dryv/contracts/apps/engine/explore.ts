/**
 * The engine's explorer: read-only views of files, the database, term knowledge and job detail, plus CSV preparation
 * and guarded saves under the dev root. The developer portal builds every page on these operations.
 *
 * Wire names are the engine's snake case. Rows and parsed documents are open JSON (`dynamic`) because their shape is
 * the file's or table's own.
 */
import {
  body,
  dynamic,
  failureProfile,
  field,
  group,
  http,
  mapFailure,
  operation,
  path,
  property,
  query,
  schema,
} from "@dryvcode/author";
import { sharedFailures as f } from "#/schemas/_shared.ts";
import { engineShared } from "./engine.ts";

const { ServiceKey } = engineShared;
const explore = group({ name: "explore" }).description(
  "Read-only exploration of the engine: files, database, terms and job detail.",
);
const exploreHttp = failureProfile().http(
  mapFailure(f.BadRequest, 400),
  mapFailure(f.Unauthorized, 401),
  mapFailure(f.NotFound, 404),
  mapFailure(f.ValidationError, 422),
  mapFailure(f.InternalError, 500),
);

const { Name, LongText, Flag, Whole, Total, RootName, RelPath, Domain } = explore.properties({
  Name: property.string().length({ min: 1, max: 500 }),
  LongText: property.string().length({ max: 4_000_000 }),
  Flag: property.boolean(),
  Whole: property.number.integer({ bits: 64 }),
  Total: property.number.integer({ bits: 64 }).range({ min: 0, max: 1_000_000_000 }),
  RootName: property.string().length({ min: 1, max: 40 }),
  RelPath: property.string().length({ max: 2000 }),
  Domain: property.string().length({ min: 1, max: 80 }),
});

/*---------------- files ----------------*/
const files = explore
  .feature("Files")
  .description("Browse and view the seed, dev, run-output and docs folders.")
  .failureDefaults(exploreHttp);
const { RootInfo, Entry, SaveFileBody, SaveFileResult } = files.schemas({
  RootInfo: schema({ name: field(RootName), path: field(RelPath) }),
  SaveFileBody: schema({ path: field(RelPath), text: field(LongText), overwrite: field(Flag).optional() }),
  SaveFileResult: schema({ path: field(RelPath) }),
  Entry: schema({
    name: field(Name),
    path: field(RelPath),
    directory: field(Flag),
    size: field(Total),
    modified: field(Name),
    kind: field(Name),
  }),
});
const { RootList, Listing, FileView } = files.schemas({
  RootList: schema({ roots: field(RootInfo).array() }),
  Listing: schema({
    root: field(RootName),
    path: field(RelPath),
    parent: field(RelPath).nullable(),
    entries: field(Entry).array(),
  }),
  FileView: schema({
    root: field(RootName),
    path: field(RelPath),
    name: field(Name),
    kind: field(Name),
    size: field(Total),
    modified: field(Name),
    truncated: field(Flag),
    text: field(LongText).nullable(),
    header: field(Name).array(),
    rows: field(dynamic()).array(),
    total_rows: field(Total).nullable(),
    parsed: field(dynamic()).nullable().optional(),
    actions: field(Name).array(),
  }),
});
const { ListFilesInput, GetFileInput } = files.schemas({
  ListFilesInput: schema({ root: field(RootName), path: field(RelPath).optional() }),
  GetFileInput: schema({
    root: field(RootName),
    path: field(RelPath),
    offset: field(Total).optional(),
    limit: field(Total).optional(),
  }),
});

const ListFileRoots = files.operation(
  "ListFileRoots",
  operation()
    .role("list")
    .description("The folders the explorer may show.")
    .output(RootList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ output }) => ({ http: http("GET", "/v1/explore/roots").output(output) })),
);
const ListFiles = files.operation(
  "ListFiles",
  operation()
    .role("list")
    .description("A folder's entries; a file path lists the folder that holds it.")
    .input(ListFilesInput)
    .output(Listing)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/explore/files")
        .input(inputField("root"), query("root"))
        .input(inputField("path"), query("path"))
        .output(output),
    })),
);
const GetFile = files.operation(
  "GetFile",
  operation()
    .role("detail")
    .description("One file viewed by kind: text, CSV rows, parsed JSON or YAML.")
    .input(GetFileInput)
    .output(FileView)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/explore/file")
        .input(inputField("root"), query("root"))
        .input(inputField("path"), query("path"))
        .input(inputField("offset"), query("offset"))
        .input(inputField("limit"), query("limit"))
        .output(output),
    })),
);
const SaveFile = files.operation(
  "SaveFile",
  operation()
    .role("update")
    .description("Save a text file under the dev root (never outside it).")
    .input({ body: SaveFileBody })
    .output(SaveFileResult)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({ http: http("PUT", "/v1/explore/file").input(input.body, body()).output(output) })),
);

/*---------------- CSV preparation ----------------*/
const csv = explore
  .feature("CsvPreparation")
  .description("Clean and rename CSV columns, preview and save a copy.")
  .failureDefaults(exploreHttp);
const { ColumnPlan, PrepareResult } = csv.schemas({
  ColumnPlan: schema({
    source: field(Name),
    name: field(Name).optional(),
    clean: field(dynamic()).array().optional(),
    keep: field(Flag).optional(),
  }),
  PrepareResult: schema({
    header: field(Name).array(),
    rows: field(dynamic()).array(),
    total_rows: field(Total),
    dropped_rows: field(Total),
    problems: field(LongText).array(),
    saved: field(RelPath),
  }),
});
const { PrepareRequest } = csv.schemas({
  PrepareRequest: schema({
    root: field(RootName),
    path: field(RelPath),
    columns: field(ColumnPlan).array(),
    skip_empty_rows: field(Flag).optional(),
    save_as: field(Name).optional(),
  }),
});
const PrepareCsv = csv.operation(
  "PrepareCsv",
  operation()
    .role("create")
    .description("Preview (or save, when save_as is set) a cleaned copy of a CSV.")
    .input({ body: PrepareRequest })
    .output(PrepareResult)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/explore/csv/prepare").input(input.body, body()).output(output),
    })),
);

/*---------------- terms ----------------*/
const terms = explore.feature("Terms").description("The engine's term knowledge.").failureDefaults(exploreHttp);
const { TermGroup, TagBody, TermHit } = terms.schemas({
  TermGroup: schema({ domain: field(Domain), group: field(Name), label: field(LongText), terms: field(Name).array() }),
  TagBody: schema({ texts: field(LongText).array(), domain: field(Domain).optional() }),
  TermHit: schema({ domain: field(Domain), group: field(Name), term: field(Name), surface: field(Name) }),
});
const { TermGroupList, TaggedText } = terms.schemas({
  TermGroupList: schema({ groups: field(TermGroup).array() }),
  TaggedText: schema({ text: field(LongText), hits: field(TermHit).array() }),
});
const { TaggedList } = terms.schemas({ TaggedList: schema({ items: field(TaggedText).array() }) });
const ListTermGroups = terms.operation(
  "ListTermGroups",
  operation()
    .role("list")
    .description("Every term group, with its canonical terms.")
    .output(TermGroupList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ output }) => ({ http: http("GET", "/v1/explore/terms").output(output) })),
);
const TagTexts = terms.operation(
  "TagTexts",
  operation()
    .role("create")
    .description("Tag each text with the term groups it mentions.")
    .input({ body: TagBody })
    .output(TaggedList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/explore/terms/tag").input(input.body, body()).output(output),
    })),
);

/*---------------- database ----------------*/
const database = explore
  .feature("Database")
  .description("A read-only view of the database: tables, rows and curated lists.")
  .failureDefaults(exploreHttp);
const { TableInfo, ColumnInfo, DataList } = database.schemas({
  TableInfo: schema({ name: field(Name), rows: field(Total), columns: field(Total), describe: field(LongText) }),
  ColumnInfo: schema({ name: field(Name), type: field(Name), nullable: field(Flag), primary: field(Flag) }),
  DataList: schema({
    code: field(Name),
    domain: field(Domain),
    title: field(Name),
    describe: field(LongText),
    columns: field(Name).array(),
    sql: field(LongText),
  }),
});
const { DomainInfo, TablePage, DataListList, DataListPage } = database.schemas({
  DomainInfo: schema({ domain: field(Domain), tables: field(TableInfo).array() }),
  TablePage: schema({
    domain: field(Domain),
    table: field(Name),
    columns: field(ColumnInfo).array(),
    rows: field(dynamic()).array(),
    total: field(Total),
    limit: field(Total),
    offset: field(Total),
    order: field(Name),
    direction: field(Name),
    search: field(LongText),
  }),
  DataListList: schema({ lists: field(DataList).array() }),
  DataListPage: schema({
    definition: field(DataList),
    rows: field(dynamic()).array(),
    total: field(Total),
    limit: field(Total),
    offset: field(Total),
  }),
});
const { DomainList } = database.schemas({ DomainList: schema({ domains: field(DomainInfo).array() }) });
const { TableInput, ListInput } = database.schemas({
  TableInput: schema({
    domain: field(Domain),
    table: field(Name),
    limit: field(Total).optional(),
    offset: field(Total).optional(),
    order: field(Name).optional(),
    direction: field(Name).optional(),
    q: field(LongText).optional(),
  }),
  ListInput: schema({
    domain: field(Domain),
    code: field(Name),
    limit: field(Total).optional(),
    offset: field(Total).optional(),
  }),
});
const ListDatabaseDomains = database.operation(
  "ListDatabaseDomains",
  operation()
    .role("list")
    .description("Every schema with its tables and row counts.")
    .output(DomainList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ output }) => ({ http: http("GET", "/v1/explore/db/domains").output(output) })),
);
const GetTablePage = database.operation(
  "GetTablePage",
  operation()
    .role("detail")
    .description("One page of a raw table, with search and sorting.")
    .input(TableInput)
    .output(TablePage)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/explore/db/tables/{domain}/{table}")
        .input(inputField("domain"), path())
        .input(inputField("table"), path())
        .input(inputField("limit"), query("limit"))
        .input(inputField("offset"), query("offset"))
        .input(inputField("order"), query("order"))
        .input(inputField("direction"), query("direction"))
        .input(inputField("q"), query("q"))
        .output(output),
    })),
);
const ListDataLists = database.operation(
  "ListDataLists",
  operation()
    .role("list")
    .description("The curated data lists, grouped by domain.")
    .output(DataListList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ output }) => ({ http: http("GET", "/v1/explore/db/lists").output(output) })),
);
const GetDataListPage = database.operation(
  "GetDataListPage",
  operation()
    .role("detail")
    .description("One page of a curated data list.")
    .input(ListInput)
    .output(DataListPage)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/explore/db/lists/{domain}/{code}")
        .input(inputField("domain"), path())
        .input(inputField("code"), path())
        .input(inputField("limit"), query("limit"))
        .input(inputField("offset"), query("offset"))
        .output(output),
    })),
);

/*---------------- job detail ----------------*/
const runs = explore
  .feature("RunDetail")
  .description("A job with its events and output folder.")
  .failureDefaults(exploreHttp);
const { JobDetail, JobDetailInput } = runs.schemas({
  JobDetailInput: schema({ jobId: field(Name) }),
  JobDetail: schema({ job: field(dynamic()), events: field(dynamic()).array(), output: field(Listing).nullable() }),
});
const GetJobDetail = runs.operation(
  "GetJobDetail",
  operation()
    .role("detail")
    .description("One job with its event timeline and the folder it wrote.")
    .input(JobDetailInput)
    .output(JobDetail)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/explore/jobs/{jobId}").input(inputField("jobId"), path()).output(output),
    })),
);

export const exploreApi = {
  explore,
  ListFileRoots,
  ListFiles,
  GetFile,
  SaveFile,
  PrepareCsv,
  ListTermGroups,
  TagTexts,
  ListDatabaseDomains,
  GetTablePage,
  ListDataLists,
  GetDataListPage,
  GetJobDetail,
  Whole,
  RootInfo,
  Entry,
  TermGroup,
  TermHit,
  TaggedText,
  DataList,
  ColumnInfo,
  TableInfo,
  DomainInfo,
  ColumnPlan,
};
