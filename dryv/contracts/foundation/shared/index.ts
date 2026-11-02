import * as dryv from "@dryvcode/author";

/* -------------------------------------------------------------------------- */
/* Shared foundation                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Shared semantic foundation.
 *
 * Owns values and structural contracts reused by every domain: identity, historical time, record
 * time, provenance, verification, pagination and failures. Nothing here names a country: Kenya is
 * data scoped to a jurisdiction, not part of the contract (AGENTS.md sections 4 to 6).
 */
export const shared = dryv.group({ name: "shared" }).description("Shared value, evidence, time, transport and failure semantics.");

/* -------------------------------------------------------------------------- */
/* Reusable values                                                        */
/* -------------------------------------------------------------------------- */

export const sharedProperties = shared.properties({
  Id: dryv.property.string.uuid(),
  /** Hierarchical business code such as ke/nairobi/westlands; the first segment is the jurisdiction code. */
  BusinessCode: dryv.property.string().length({ min: 2, max: 200 }),
  JurisdictionCode: dryv.property.string().length({ min: 2, max: 40 }),
  Name: dryv.property.string().length({ min: 1, max: 300 }),
  Description: dryv.property.string().length({ max: 4000 }),
  Url: dryv.property.string.url().length({ max: 1000 }),
  Checksum: dryv.property.string().length({ min: 64, max: 64 }),

  DateTime: dryv.property.temporal.datetime(),
  Date: dryv.property.temporal.date(),
  Flag: dryv.property.boolean(),
  Version: dryv.property.number.integer({ range: { min: 0 } }),
  Count: dryv.property.number.integer({ range: { min: 0 } }),
  Confidence: dryv.property.number().range({ min: 0, max: 1 }),
  /** Unbounded text: legal provisions, rationales, manifestos. */
  LongText: dryv.property.string().length({ min: 1 }),
  /** Monetary or measured value; currency is always a separate column, never assumed. */
  Amount: dryv.property.number.decimal({ precision: 20, scale: 4 }),
  Rate: dryv.property.number.decimal({ precision: 9, scale: 4 }),
  Ratio: dryv.property.number.decimal({ precision: 7, scale: 4 }),
  CurrencyCode: dryv.property.string().length({ min: 3, max: 3 }),
  Label: dryv.property.string().length({ min: 1, max: 300 }),
  /** Kind of record a comment, evidence reference or decision is attached to. */
  TargetKind: dryv.property.string().length({ min: 2, max: 100 }),
  Message: dryv.property.string().length({ min: 1, max: 500 }),
  StatusCode: dryv.property.number().range({ min: 100, max: 599 }),
  PaginationNumber: dryv.property.number().range({ min: 0, max: 1000 }),
  SortDirection: dryv.property.enum({ ascending: "asc", descending: "desc" }),

  /** How a value came to be known. Never optional. */
  ProvenanceMethod: dryv.property.enum({
    extracted: "extracted",
    inferred: "inferred",
    curated: "curated",
    aiAssisted: "ai_assisted",
  }),

  VerificationState: dryv.property.enum({
    unverified: "unverified",
    underReview: "under_review",
    verified: "verified",
    disputed: "disputed",
    superseded: "superseded",
    rejected: "rejected",
  }),

  /** Precision of an uncertain or approximate date. */
  DatePrecision: dryv.property.enum({
    exact: "exact",
    month: "month",
    year: "year",
    decade: "decade",
    century: "century",
    approximate: "approximate",
  }),
});

/* -------------------------------------------------------------------------- */
/* Entity foundations                                                     */
/* -------------------------------------------------------------------------- */

/** Identity, record time and optimistic versioning for every stored record. */
export const baseEntitySchemas = shared.schemas({
  BaseEntity: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).system().query({ filter: ["equal"], select: "default" }),
      createdAt: dryv.field(sharedProperties.DateTime).system().query({ filter: ["between"], sort: true, select: "default" }),
      updatedAt: dryv.field(sharedProperties.DateTime).system().query({ filter: ["between"], sort: true }),
      version: dryv.field(sharedProperties.Version).system().query({ filter: ["between"], sort: true, select: "never" }),
    })
    .abstract()
    .facets({
      storage: dryv.storage().primaryKey("id"),
    }),
});

/** Historical validity, kept separate from record time (createdAt/updatedAt). */
export const historicalEntitySchemas = shared.schemas({
  HistoricalEntity: dryv
    .schema({
      validFrom: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"], sort: true }),
      validTo: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"], sort: true }),
      validFromPrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      validToPrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      isCurrent: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
    })
    .abstract()
    .extends(baseEntitySchemas.BaseEntity),
});

/**
 * Evidence on a record: where it came from, how it was produced, how confident we are and its
 * review state. The source artifact is referenced (files service), never copied.
 */
export const evidencedEntitySchemas = shared.schemas({
  EvidencedEntity: dryv
    .schema({
      sourceName: dryv.field(sharedProperties.Name),
      sourceReference: dryv.field(sharedProperties.Description).optional().nullable(),
      sourceUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      artifactId: dryv.field(sharedProperties.Id).optional().nullable(),
      artifactChecksum: dryv.field(sharedProperties.Checksum).optional().nullable(),
      retrievedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      licence: dryv.field(sharedProperties.Name).optional().nullable(),
      method: dryv.field(sharedProperties.ProvenanceMethod).query({ filter: ["equal", "in"] }),
      toolOrModel: dryv.field(sharedProperties.Name).optional().nullable(),
      confidence: dryv.field(sharedProperties.Confidence).optional().nullable(),
      verificationState: dryv.field(sharedProperties.VerificationState).query({ filter: ["equal", "in"] }),
    })
    .abstract()
    .extends(historicalEntitySchemas.HistoricalEntity),
});

/* -------------------------------------------------------------------------- */
/* Transport and pagination contracts                                     */
/* -------------------------------------------------------------------------- */

export const transportSchemas = shared.schemas({
  ApiMessage: dryv.schema({
    message: dryv.field(sharedProperties.Message),
  }),

  ApiError: dryv.schema({
    message: dryv.field(sharedProperties.Message),
    code: dryv.field(sharedProperties.StatusCode).optional(),
  }),

  BaseQuery: dryv.schema({
    page: dryv.field(sharedProperties.PaginationNumber).optional(),
    limit: dryv.field(sharedProperties.PaginationNumber).optional(),
    sort: dryv.field(sharedProperties.SortDirection).optional(),
    order: dryv.field(sharedProperties.SortDirection).optional(),
    /** Lists return current records only; set this to include superseded versions. */
    includeHistory: dryv.field(sharedProperties.Flag).optional(),
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

/* -------------------------------------------------------------------------- */
/* Canonical failures                                                     */
/* -------------------------------------------------------------------------- */

export const sharedFailures = shared.failures({
  BadRequest: dryv.failure("bad_request").description("The request is invalid.").payload(dryv.ref(transportSchemas.ApiError)),
  Unauthorized: dryv.failure("unauthorized").description("Authentication is required or invalid.").payload(dryv.ref(transportSchemas.ApiError)),
  Forbidden: dryv.failure("forbidden").description("The caller's role does not permit this action.").payload(dryv.ref(transportSchemas.ApiError)),
  NotFound: dryv.failure("not_found").description("The requested resource does not exist.").payload(dryv.ref(transportSchemas.ApiError)),
  ValidationError: dryv.failure("validation_error").description("The request failed semantic validation.").payload(dryv.ref(transportSchemas.ApiError)),
  InternalError: dryv.failure("internal_error").description("The operation failed because of an internal server error.").payload(dryv.ref(transportSchemas.ApiError)),
});

/* -------------------------------------------------------------------------- */
/* Frontend surfaces                                                      */
/* -------------------------------------------------------------------------- */

export const frontendSurfaces = shared.surfaces({
  Web: dryv.surface.web().description("Public research and heritage web application."),
  Mobile: dryv.surface.mobile().description("Mobile application consuming geography and heritage data."),
  AdminWeb: dryv.surface.web().description("Research dashboard for review and curation."),
});
