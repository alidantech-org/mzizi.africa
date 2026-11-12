import * as dryv from "@dryvcode/author";

/**
 * Shared base of the new contract design (`contracts/schemas/` + `contracts/apps/`).
 *
 * Owns the reusable values, the stored-entity base, transport/pagination contracts and the
 * canonical failures. It intentionally does not import from `contracts/_archive/`: the archived
 * pre-foundation contracts keep generating the legacy NestJS API, while every new app composes
 * this base. One file per schema lives beside this one in `contracts/schemas/`.
 */
export const shared = dryv.group({ name: "shared" }).description("Shared value, time, transport and failure semantics.");

const scalarProperties = shared.properties({
  /*---------------- Reusable scalar validation profiles ----------------*/
  String: dryv.property.string(),
  /** Length-based nonempty text; whitespace is preserved, not silently trimmed. */
  NonEmptyString: dryv.property.string().length({ min: 1 }),
  NonEmptyString255: dryv.property.string().length({ min: 1, max: 255 }),
  NonEmptyString500: dryv.property.string().length({ min: 1, max: 500 }),
  /** Language-tag length profile; full BCP 47 validation remains a separate rule. */
  LanguageTag: dryv.property.string().length({ min: 2, max: 35 }),
  Number: dryv.property.number(),
  NonNegativeInteger: dryv.property.number.integer({ range: { min: 0 } }),
  PositiveInteger: dryv.property.number.integer({ range: { min: 1 } }),
  Id: dryv.property.string.uuid(),
  /** Hierarchical lowercase business code such as ke/nairobi/westlands. */
  BusinessCode: dryv.property.string().length({ min: 2, max: 200 }),
  Name: dryv.property.string().length({ min: 1, max: 300 }),
  Description: dryv.property.string().length({ max: 4000 }),
  DateTime: dryv.property.temporal.datetime(),
  Flag: dryv.property.boolean(),
  Message: dryv.property.string().length({ min: 1, max: 2000 }),
  StatusCode: dryv.property.string().length({ min: 1, max: 100 }),
});

/** Compatibility names reuse the same property identity, without duplicate declarations. */
export const sharedProperties = {
  ...scalarProperties,
  Version: scalarProperties.NonNegativeInteger,
  PaginationNumber: scalarProperties.NonNegativeInteger,
  SortDirection: scalarProperties.StatusCode,
};

/** Identity, record time and optimistic versioning for every stored record. */
export const baseEntitySchemas = shared.schemas({
  BaseEntity: dryv
    .schema({
      id: dryv
        .field(sharedProperties.Id)
        .system()
        .query({ filter: ["equal"], select: "default" }),
      createdAt: dryv
        .field(sharedProperties.DateTime)
        .system()
        .query({ filter: ["between"], sort: true, select: "default" }),
      updatedAt: dryv
        .field(sharedProperties.DateTime)
        .system()
        .query({ filter: ["between"], sort: true }),
      version: dryv
        .field(sharedProperties.Version)
        .system()
        .query({ filter: ["between"], sort: true, select: "never" }),
    })
    .abstract()
    .facets({
      storage: dryv.storage().primaryKey("id"),
    }),
});

export const transportSchemas = shared.schemas({
  ApiError: dryv.schema({
    message: dryv.field(sharedProperties.Message),
    code: dryv.field(sharedProperties.StatusCode).optional(),
  }),

  /** Bounded pagination: the service clamps limit to its own maximum; callers cannot disable it. */
  BaseQuery: dryv.schema({
    page: dryv.field(sharedProperties.PaginationNumber).optional(),
    limit: dryv.field(sharedProperties.PaginationNumber).optional(),
    sort: dryv.field(sharedProperties.SortDirection).optional(),
    order: dryv.field(sharedProperties.SortDirection).optional(),
  }),

  PaginationMeta: dryv.schema({
    page: dryv.field(sharedProperties.PaginationNumber),
    limit: dryv.field(sharedProperties.PaginationNumber),
    total: dryv.field(sharedProperties.PaginationNumber),
    totalPages: dryv.field(sharedProperties.PaginationNumber),
  }),
});

export const sharedSchemas = shared.schemas({
  PaginatedResponse: dryv.schema({
    meta: dryv.field(transportSchemas.PaginationMeta),
  }),
});

export const sharedFailures = shared.failures({
  BadRequest: dryv.failure("bad_request").description("The request is invalid.").payload(dryv.ref(transportSchemas.ApiError)),
  Unauthorized: dryv
    .failure("unauthorized")
    .description("Authentication is required or invalid.")
    .payload(dryv.ref(transportSchemas.ApiError)),
  Forbidden: dryv
    .failure("forbidden")
    .description("The caller is not permitted to perform this operation.")
    .payload(dryv.ref(transportSchemas.ApiError)),
  NotFound: dryv.failure("not_found").description("The requested resource does not exist.").payload(dryv.ref(transportSchemas.ApiError)),
  ValidationError: dryv
    .failure("validation_error")
    .description("The request failed semantic validation.")
    .payload(dryv.ref(transportSchemas.ApiError)),
  InternalError: dryv
    .failure("internal_error")
    .description("The operation failed because of an internal server error.")
    .payload(dryv.ref(transportSchemas.ApiError)),
});

/* ----------------------------- read surface ------------------------------ */

export interface ReadSurfaceSpec {
  singular: string;
  plural: string;
  itemKey: string;
  listKey: string;
  path: string;
  idParam: string;
  entity: any;
  filters?: Record<string, any>;
  description: string;
}

export const standardFailures = [
  sharedFailures.BadRequest,
  sharedFailures.NotFound,
  sharedFailures.ValidationError,
  sharedFailures.InternalError,
] as const;

export function withStandardHttpFailures(exposure: ReturnType<typeof dryv.http>) {
  return exposure
    .failure(sharedFailures.BadRequest, 400)
    .failure(sharedFailures.NotFound, 404)
    .failure(sharedFailures.ValidationError, 422)
    .failure(sharedFailures.InternalError, 500);
}

/** The standard read surface for an entity: public projection, bounded list query, Find/Get. */
export function readSurface(group: any, spec: ReadSurfaceSpec) {
  const { singular, plural } = spec;

  const schemas = group.schemas({
    [`${singular}Public`]: dryv.schema({}).projection(dryv.projection(spec.entity).read()),
  } as any) as Record<string, any>;

  const queries = group.schemas({
    [`${singular}ListQuery`]: dryv.schema({ ...(spec.filters ?? {}) }).extends(transportSchemas.BaseQuery),
  } as any) as Record<string, any>;

  const responses = group.schemas({
    [`${singular}Response`]: dryv.schema({ [spec.itemKey]: dryv.field(schemas[`${singular}Public`]) }),
    [`${plural}ListResponse`]: dryv
      .schema({ [spec.listKey]: dryv.field(schemas[`${singular}Public`]).array() })
      .extends(sharedSchemas.PaginatedResponse),
  } as any) as Record<string, any>;

  const find = dryv
    .operation()
    .description(`List ${spec.description}.`)
    .input(queries[`${singular}ListQuery`])
    .output(responses[`${plural}ListResponse`])
    .failures(...standardFailures);
  find.facets({
    http: withStandardHttpFailures(
      dryv
        .http("GET", `/v1${spec.path}`)
        .description(`List ${spec.description}.`)
        .input(find.in, dryv.queryObject())
        .output(find.out, dryv.respond(200)),
    ),
  });

  const get = dryv
    .operation()
    .description(`Get ${spec.description} by id.`)
    .input({ [spec.idParam]: sharedProperties.Id } as any)
    .output(responses[`${singular}Response`])
    .failures(...standardFailures);
  get.facets({
    http: withStandardHttpFailures(
      dryv
        .http("GET", `/v1${spec.path}/{${spec.idParam}}`)
        .description(`Get ${spec.description} by id.`)
        .input((get.in as any)[spec.idParam], dryv.path())
        .output(get.out, dryv.respond(200)),
    ),
  });

  return { schemas, queries, responses, operations: { [`Find${plural}`]: find, [`Get${singular}ById`]: get } as Record<string, any> };
}
