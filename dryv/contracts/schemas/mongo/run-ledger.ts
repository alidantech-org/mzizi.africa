/**
 * Worker run ledger documents. MongoDB holds operational state and evidence metadata.
 * The run spec is stored as canonical JSON so its hash remains independently verifiable.
 * The adapter provisions the TTL index on expiresAt because Dryv has no Mongo storage facet.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";

export const runLedger = dryv.group({ name: "runLedger" }).description("Worker runs and evidence metadata in MongoDB.");

const state = runLedger.properties({
  LedgerRunState: dryv.property
    .enum([
      "queued",
      "leased",
      "working",
      "completed",
      "failed",
      "cancelled",
      "sealed",
      "checking",
      "approved",
      "rejected",
      "partial",
      "promoted",
      "expiring",
      "expired",
    ])
    .tags("mongo"),
  LedgerArtifactState: dryv.property.enum(["staged", "promoted", "rejected"]).tags("mongo"),
  LedgerEventLevel: dryv.property.enum(["info", "error"]).tags("mongo"),
});

const shapes = runLedger.schemas({
  RunArtifactDocument: dryv
    .schema({
      runId: dryv.field(p.Id),
      path: dryv.field(p.NonEmptyString),
      sha256: dryv.field(p.Sha256),
      size: dryv.field(p.NonNegativeInt64),
      mediaType: dryv.field(p.NonEmptyString),
      stage: dryv.field(p.NonEmptyString),
      sourceUrl: dryv.field(p.NonEmptyString).optional(),
      derivedFrom: dryv.field(p.NonEmptyString).array(),
      state: dryv.field(state.LedgerArtifactState),
    })
    .tags("mongo"),
  LedgerStageCount: dryv
    .schema({
      stage: dryv.field(p.NonEmptyString),
      files: dryv.field(p.NonNegativeInt64),
    })
    .tags("mongo"),
  LedgerDecision: dryv
    .schema({
      sourceUrl: dryv.field(p.NonEmptyString),
      fetched: dryv.field(p.Flag),
      reason: dryv.field(p.NonEmptyString),
      score: dryv.field(p.Number).optional(),
    })
    .tags("mongo"),
});

runLedger.schemas({
  HostGovernorDocument: dryv
    .schema({
      revision: dryv.field(p.Id),
      stateJson: dryv.field(p.JsonText),
      expiresAt: dryv.field(p.Instant),
    })
    .tags("mongo"),
  WorkerRunDocument: dryv
    .schema({
      runId: dryv.field(p.Id),
      specHash: dryv.field(p.Sha256),
      specJson: dryv.field(p.JsonText),
      state: dryv.field(state.LedgerRunState),
      attempts: dryv.field(p.NonNegativeInteger),
      revision: dryv.field(p.NonNegativeInteger).optional(),
      leaseId: dryv.field(p.Id).optional(),
      leaseExpiresAt: dryv.field(p.Instant).optional(),
      heartbeatAt: dryv.field(p.Instant).optional(),
      availableAt: dryv.field(p.Instant).optional(),
      stagesCompleted: dryv.field(p.NonNegativeInteger).optional(),
      cancelRequestedAt: dryv.field(p.Instant).optional(),
      sealedAt: dryv.field(p.Instant).optional(),
      runStore: dryv.field(p.NonEmptyString).optional(),
      approvalJson: dryv.field(p.JsonText).optional(),
      releasePlanHash: dryv.field(p.Sha256).optional(),
      logsExpired: dryv.field(p.Flag).optional(),
      requestedAt: dryv.field(p.Instant),
      startedAt: dryv.field(p.Instant).optional(),
      finishedAt: dryv.field(p.Instant).optional(),
      requestedBy: dryv.field(p.NonEmptyString).optional(),
      manifestHash: dryv.field(p.Sha256).optional(),
      failureType: dryv.field(p.NonEmptyString).optional(),
    })
    .tags("mongo"),
  RunEventDocument: dryv
    .schema({
      eventId: dryv.field(p.Id),
      runId: dryv.field(p.Id),
      time: dryv.field(p.Instant),
      expiresAt: dryv.field(p.Instant),
      level: dryv.field(state.LedgerEventLevel),
      state: dryv.field(state.LedgerRunState),
      stage: dryv.field(p.NonEmptyString).optional(),
      failureType: dryv.field(p.NonEmptyString).optional(),
    })
    .tags("mongo"),
  RunSummaryDocument: dryv
    .schema({
      runId: dryv.field(p.Id),
      specHash: dryv.field(p.Sha256),
      state: dryv.field(state.LedgerRunState),
      finishedAt: dryv.field(p.Instant),
      counts: dryv.field(shapes.LedgerStageCount).array(),
      files: dryv.field(shapes.RunArtifactDocument).array(),
      decisions: dryv.field(shapes.LedgerDecision).array(),
      approver: dryv.field(p.NonEmptyString).optional(),
      approvalJson: dryv.field(p.JsonText).optional(),
      manifestHash: dryv.field(p.Sha256).optional(),
    })
    .tags("mongo"),
});
