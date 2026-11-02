import * as dryv from "@dryvcode/author";

import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Contracts between the layers (AGENTS.md section 10): the documents the data engine, files service,
 * intelligence layer and database engine exchange. They are value schemas only: no storage, no
 * entities, no endpoints. The JSON Schema export of this group is the shared source for TypeScript
 * and Python models. Free-form documents (a candidate's payload, a locator) travel as serialised JSON
 * text and are validated against the contract of their target by the database engine.
 */
export const exchange = dryv.group({ name: "exchange" }).description("Layer-to-layer exchange contracts: artifact reference, extraction result, candidate, evaluation, promotion decision.").tags("internal");

export const exchangeProperties = exchange.properties({
  /** Serialised JSON document; the consumer validates it against the contract it targets. */
  JsonDocument: dryv.property.string().length({ min: 2 }),
  ContractVersion: dryv.property.string().length({ min: 1, max: 40 }),
  Sha256: dryv.property.string().length({ min: 64, max: 64 }),
  /** `schema.table` of the record a candidate or decision concerns. */
  Target: dryv.property.string().length({ min: 3, max: 100 }),
  ExtractionStatus: dryv.property.enum({ succeeded: "succeeded", partial: "partial", failed: "failed" }),
  DiagnosticLevel: dryv.property.enum({ info: "info", warning: "warning", error: "error" }),
  SegmentKind: dryv.property.enum({
    text: "text",
    table: "table",
    feature: "feature",
    record: "record",
    metadata: "metadata",
  }),
  CandidateStatus: dryv.property.enum({
    pending: "pending",
    invalid: "invalid",
    inReview: "in_review",
    approved: "approved",
    rejected: "rejected",
    promoted: "promoted",
    superseded: "superseded",
  }),
  EvaluationKind: dryv.property.enum({
    classification: "classification",
    entityMatch: "entity_match",
    contradiction: "contradiction",
    quality: "quality",
    summary: "summary",
  }),
  PromotionOutcome: dryv.property.enum({ promoted: "promoted", rejected: "rejected", deferred: "deferred" }),
  DocumentFormat: dryv.property.string().length({ min: 1, max: 100 }),
});

export const exchangeSchemas = exchange.schemas({
  /** Points at preserved bytes owned by the files service; never carries the bytes. */
  FileArtifactRef: dryv.schema({
    fileVersionId: dryv.field(sharedProperties.Id),
    captureId: dryv.field(sharedProperties.Id).optional(),
    documentId: dryv.field(sharedProperties.Id).optional(),
    contentHash: dryv.field(exchangeProperties.Sha256),
    sizeBytes: dryv.field(sharedProperties.ByteCount),
    mimeType: dryv.field(exchangeProperties.DocumentFormat),
    sourceUrl: dryv.field(sharedProperties.Url).optional(),
    retrievedAt: dryv.field(sharedProperties.DateTime).optional(),
  }),

  ExtractionDiagnostic: dryv.schema({
    level: dryv.field(exchangeProperties.DiagnosticLevel),
    code: dryv.field(sharedProperties.Label),
    message: dryv.field(sharedProperties.Message),
    /** Where in the artifact it happened: page, table, cell, byte range. */
    locator: dryv.field(exchangeProperties.JsonDocument).optional(),
  }),

  /** One piece of extracted content: a text block, a table, a geographic feature or a parsed record. */
  ExtractionSegment: dryv.schema({
    key: dryv.field(sharedProperties.Label),
    kind: dryv.field(exchangeProperties.SegmentKind),
    locator: dryv.field(exchangeProperties.JsonDocument),
    content: dryv.field(exchangeProperties.JsonDocument),
    confidence: dryv.field(sharedProperties.Confidence).optional(),
  }),
});

export const exchangeDocuments = exchange.schemas({
  /** Immutable output of one extractor run. A rerun is a new result with a new id, never an update. */
  ExtractionResult: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    artifact: dryv.field(exchangeSchemas.FileArtifactRef),
    extractor: dryv.field(sharedProperties.Label),
    extractorVersion: dryv.field(exchangeProperties.ContractVersion),
    profile: dryv.field(sharedProperties.Label).optional(),
    structureVersionId: dryv.field(sharedProperties.Id).optional(),
    status: dryv.field(exchangeProperties.ExtractionStatus),
    segments: dryv.field(exchangeSchemas.ExtractionSegment).array(),
    diagnostics: dryv.field(exchangeSchemas.ExtractionDiagnostic).array(),
    startedAt: dryv.field(sharedProperties.DateTime),
    finishedAt: dryv.field(sharedProperties.DateTime),
    inputHash: dryv.field(exchangeProperties.Sha256),
    supersedesResultId: dryv.field(sharedProperties.Id).optional(),
  }),

  /** One intended canonical record, before validation, review and promotion. */
  CandidateRecord: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    runId: dryv.field(sharedProperties.Id),
    target: dryv.field(exchangeProperties.Target),
    /** Hash of the target's natural key; the idempotency key within a run family. */
    naturalKeyHash: dryv.field(exchangeProperties.Sha256),
    payload: dryv.field(exchangeProperties.JsonDocument),
    extractionResultId: dryv.field(sharedProperties.Id),
    segmentKey: dryv.field(sharedProperties.Label).optional(),
    locator: dryv.field(exchangeProperties.JsonDocument).optional(),
    method: dryv.field(sharedProperties.ProvenanceMethod),
    confidence: dryv.field(sharedProperties.Confidence).optional(),
    status: dryv.field(exchangeProperties.CandidateStatus),
    supersedesCandidateId: dryv.field(sharedProperties.Id).optional(),
    resolvedTargetId: dryv.field(sharedProperties.Id).optional(),
  }),

  /** AI-produced assessment. Attributable and reviewable; it never mutates a record. */
  IntelligenceEvaluation: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    kind: dryv.field(exchangeProperties.EvaluationKind),
    subjectCandidateId: dryv.field(sharedProperties.Id).optional(),
    subjectResultId: dryv.field(sharedProperties.Id).optional(),
    tool: dryv.field(sharedProperties.Label),
    toolVersion: dryv.field(exchangeProperties.ContractVersion),
    model: dryv.field(sharedProperties.Label).optional(),
    inputHash: dryv.field(exchangeProperties.Sha256),
    output: dryv.field(exchangeProperties.JsonDocument),
    explanation: dryv.field(sharedProperties.LongText).optional(),
    confidence: dryv.field(sharedProperties.Confidence).optional(),
    createdAt: dryv.field(sharedProperties.DateTime),
  }),

  /** The database engine's act of applying a review decision to a candidate. */
  PromotionDecision: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    candidateId: dryv.field(sharedProperties.Id),
    auditDecisionId: dryv.field(sharedProperties.Id),
    outcome: dryv.field(exchangeProperties.PromotionOutcome),
    target: dryv.field(exchangeProperties.Target),
    targetId: dryv.field(sharedProperties.Id).optional(),
    previousTargetId: dryv.field(sharedProperties.Id).optional(),
    verificationState: dryv.field(sharedProperties.VerificationState),
    reasons: dryv.field(sharedProperties.Message).array(),
    decidedAt: dryv.field(sharedProperties.DateTime),
  }),
});
