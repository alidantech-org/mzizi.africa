import * as dryv from "@dryvcode/author";

import { optionalId, plainId, relationTo, searchable, systemRecord } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Sourcing: where claims come from (.docs/design/data/SOURCING_DESIGN.md).
 *
 * Data rows in other schemas carry no provenance and no foreign key to this schema. A source knows
 * the records it produced: an attribution points at any row by (target kind, target id), through a
 * method, from a document and the capture of it that was actually read. Verification state is an
 * append-only ledger kept here too.
 */
export const source = dryv
  .group({ name: "source" })
  .description("Publishers, documents, captures, methods, attributions and the verification ledger.")
  .tags("public", "source")
  .facets({ storage: { namespace: "source" } });

export const sourceProperties = source.properties({
  AttributionRelation: dryv.property.enum({
    supports: "supports",
    contradicts: "contradicts",
    derivedFrom: "derived_from",
    mentions: "mentions",
  }),
  Locator: dryv.property.string().length({ min: 1, max: 500 }),
  HttpStatus: dryv.property.number.integer({ range: { min: 100, max: 599 } }),
  ToolName: dryv.property.string().length({ min: 1, max: 200 }),
  Citation: dryv.property.string().length({ min: 1, max: 1000 }),
  DocumentKindCode: dryv.property.string().length({ min: 2, max: 60 }),
  ClassifierMethod: dryv.property.enum({ urlPattern: "url_pattern", textPattern: "text_pattern", titleFuzzy: "title_fuzzy", none: "none" }),
  RouteStatus: dryv.property.enum({ routed: "routed", unrouted: "unrouted", gapped: "gapped" }),
});

const publishers = source.schemas({
  Publisher: systemRecord(
    {
      jurisdictionId: optionalId(),
      kindId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      websiteUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      reliability: dryv.field(sharedProperties.Confidence).optional().nullable(),
    },
    "publishers",
    [{ name: "idx_publisher_code", fields: ["code"], unique: true }],
  ),
});

const documents = source.schemas({
  Document: systemRecord(
    {
      publisherId: relationTo(() => publishers.Publisher.field("id")),
      jurisdictionId: optionalId(),
      kindId: plainId(),
      title: dryv.field(sharedProperties.Name).query(searchable),
      publishedOn: dryv
        .field(sharedProperties.Date)
        .optional()
        .nullable()
        .query({ filter: ["between"], sort: true }),
      publishedOnPrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      language: dryv.field(sharedProperties.Label).optional().nullable(),
      url: dryv.field(sharedProperties.Url).optional().nullable(),
      licence: dryv.field(sharedProperties.Name).optional().nullable(),
      citation: dryv.field(sourceProperties.Citation).optional().nullable(),
      siteId: optionalId(),
    },
    "documents",
    [
      { name: "idx_document_publisher", fields: ["publisherId"] },
      { name: "idx_document_published", fields: ["publishedOn"] },
    ],
  ),

  Method: systemRecord(
    {
      kind: dryv.field(sharedProperties.ProvenanceMethod).query({ filter: ["equal", "in"] }),
      name: dryv.field(sharedProperties.Name).query(searchable),
      tool: dryv.field(sourceProperties.ToolName).optional().nullable(),
      toolVersion: dryv.field(sourceProperties.ToolName).optional().nullable(),
      model: dryv.field(sourceProperties.ToolName).optional().nullable(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "methods",
    [{ name: "idx_method_kind", fields: ["kind"] }],
  ),
});

const captures = source.schemas({
  /** One retrieval of a document. Raw evidence is never overwritten: a revisit is a new capture. */
  Capture: systemRecord(
    {
      documentId: relationTo(() => documents.Document.field("id")),
      fileVersionId: optionalId(),
      retrievedAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
      retrievedUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      httpStatus: dryv.field(sourceProperties.HttpStatus).optional().nullable(),
      contentHash: dryv.field(sharedProperties.Checksum).optional().nullable(),
      tool: dryv.field(sourceProperties.ToolName).optional().nullable(),
      retrievedBy: optionalId(),
      /** The site, the hostname actually used and the structure versions (site overlay and inherited family base) that drove retrieval; null for manual downloads. */
      siteId: optionalId(),
      domainId: optionalId(),
      structureVersionId: optionalId(),
      familyVersionId: optionalId(),
      /** The legal/source assessment (website.assessments) that governed this retrieval. */
      assessmentId: optionalId(),
    },
    "captures",
    [{ name: "idx_capture_document", fields: ["documentId", "retrievedAt"] }],
  ),
});

const classification = source.schemas({
  /** What a document is, as decided by one version of the layered classifier. Append-only: a new classifier version adds a row. */
  DocumentClassification: systemRecord(
    {
      /** A plain id of the source.documents row. */
      documentId: plainId(),
      /** Code from the document-kind catalogue (gazette_notice, act, bill, hansard, budget ...) or `unclassified`. */
      kind: dryv.field(sourceProperties.DocumentKindCode).query({ filter: ["equal", "in"] }),
      score: dryv.field(sharedProperties.Confidence),
      /** The deciding layer: url_pattern, text_pattern, title_fuzzy or none. */
      method: dryv.field(sourceProperties.ClassifierMethod).query({ filter: ["equal", "in"] }),
      classifierVersion: dryv.field(sourceProperties.ToolName).query({ filter: ["equal"] }),
      routeStatus: dryv.field(sourceProperties.RouteStatus).query({ filter: ["equal", "in"] }),
      /** Parser the document is routed to, when one exists. */
      routeParser: dryv.field(sourceProperties.ToolName).optional().nullable(),
      /** Every layer's evidence as serialised JSON. */
      evidence: dryv.field(sharedProperties.LongText).optional().nullable(),
      /** Extracted dates, amounts and reference numbers with their source spans, as serialised JSON. */
      facts: dryv.field(sharedProperties.LongText).optional().nullable(),
      classifiedAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
    },
    "document_classifications",
    [
      { name: "idx_docclass_document_version", fields: ["documentId", "classifierVersion"], unique: true },
      { name: "idx_docclass_kind", fields: ["kind"] },
    ],
  ),
});

const links = source.schemas({
  /** The linkage: this document, read through this method, supports this record. Append-only. */
  Attribution: systemRecord(
    {
      documentId: relationTo(() => documents.Document.field("id")),
      captureId: optionalId(),
      methodId: plainId(),
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      targetField: dryv.field(sharedProperties.Label).optional().nullable(),
      relation: dryv.field(sourceProperties.AttributionRelation).query({ filter: ["equal", "in"] }),
      locator: dryv.field(sourceProperties.Locator).optional().nullable(),
      confidence: dryv.field(sharedProperties.Confidence).optional().nullable(),
      attributedBy: optionalId(),
    },
    "attributions",
    [
      { name: "idx_attribution_target", fields: ["targetKind", "targetId"] },
      { name: "idx_attribution_document", fields: ["documentId"] },
    ],
  ),

  /** Append-only ledger of a record's verification state; the row with isCurrent is the state now. */
  Verification: systemRecord(
    {
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      state: dryv.field(sharedProperties.VerificationState).query({ filter: ["equal", "in"] }),
      decisionId: optionalId(),
      decidedBy: optionalId(),
      rationale: dryv.field(sharedProperties.LongText).optional().nullable(),
      isCurrent: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
    },
    "verifications",
    [{ name: "idx_verification_target", fields: ["targetKind", "targetId", "isCurrent"] }],
  ),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const sourceRead = source.feature("SourceRead").description("Public read access to where claims come from.").tags("public");
const surfaces = [
  readSurface(source, {
    singular: "Publisher",
    plural: "Publishers",
    itemKey: "publisher",
    listKey: "publishers",
    path: "/source/publishers",
    idParam: "publisherId",
    entity: publishers.Publisher,
    description: "publishers",
    filters: { jurisdictionId: id(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(source, {
    singular: "Document",
    plural: "Documents",
    itemKey: "document",
    listKey: "documents",
    path: "/source/documents",
    idParam: "documentId",
    entity: documents.Document,
    description: "source documents",
    filters: { publisherId: id(), jurisdictionId: id(), kindId: id(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(source, {
    singular: "Method",
    plural: "Methods",
    itemKey: "method",
    listKey: "methods",
    path: "/source/methods",
    idParam: "methodId",
    entity: documents.Method,
    description: "sourcing methods",
    filters: { kind: dryv.field(sharedProperties.ProvenanceMethod).optional(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(source, {
    singular: "Capture",
    plural: "Captures",
    itemKey: "capture",
    listKey: "captures",
    path: "/source/captures",
    idParam: "captureId",
    entity: captures.Capture,
    description: "captures of source documents",
    filters: { documentId: id() },
  }),
  readSurface(source, {
    singular: "Attribution",
    plural: "Attributions",
    itemKey: "attribution",
    listKey: "attributions",
    path: "/source/attributions",
    idParam: "attributionId",
    entity: links.Attribution,
    description: "attributions",
    filters: {
      targetKind: dryv.field(sharedProperties.TargetKind).optional(),
      targetId: id(),
      documentId: id(),
      methodId: id(),
      relation: dryv.field(sourceProperties.AttributionRelation).optional(),
    },
  }),
  readSurface(source, {
    singular: "Verification",
    plural: "Verifications",
    itemKey: "verification",
    listKey: "verifications",
    path: "/source/verifications",
    idParam: "verificationId",
    entity: links.Verification,
    description: "verifications",
    filters: {
      targetKind: dryv.field(sharedProperties.TargetKind).optional(),
      targetId: id(),
      isCurrent: dryv.field(sharedProperties.Flag).optional(),
    },
  }),
];
export const sourceReadOperations = sourceRead.operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
