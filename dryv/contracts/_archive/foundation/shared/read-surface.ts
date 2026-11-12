import * as dryv from "@dryvcode/author";

import { sharedFailures, sharedProperties, sharedSchemas, transportSchemas } from "./index.ts";

/**
 * Builds the standard read surface for an entity: a public projection, a list query with
 * pagination, list and detail responses, and Find/Get operations under /v1.
 *
 * Mzizi's API is read-mostly, so every canonical entity gets this surface; custom reads (search,
 * hierarchy, boundaries) are authored by hand beside it. The projection keeps API shapes separate
 * from persistence so private fields never leak by default.
 */
export interface ReadSurfaceSpec {
  /** Singular PascalCase name, for example LegalInstrument. */
  singular: string;
  /** Plural PascalCase name, for example LegalInstruments. */
  plural: string;
  /** camelCase response keys: item and list property names. */
  itemKey: string;
  listKey: string;
  /** Path below /v1, for example /legal/instruments. */
  path: string;
  /** Path parameter name, for example instrumentId. */
  idParam: string;
  entity: any;
  /** Optional equality/range filters exposed as query parameters. */
  filters?: Record<string, any>;
  description: string;
}

const standardFailures = [
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

export { standardFailures };

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
