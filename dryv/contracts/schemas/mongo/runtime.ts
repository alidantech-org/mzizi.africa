/**
 * Runtime documents (MongoDB): runs, and the ordered events each run and job emits.
 *
 * Staging data, never domain truth. Documents are camelCase JSON; the Python engine reads and writes them as
 * generated Pydantic models. No storage facet: Dryv has no Mongo store driver yet, so these are plain schemas.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";

export const runtime = dryv.group({ name: "runtime" }).description("Engine runs and the events they emit (Mongo).");

export const runtimeEnums = runtime.properties({
  RunStatus: dryv.property.enum(["queued", "running", "succeeded", "failed", "cancelled"]).tags("mongo"),
  JobEventType: dryv.property.enum(["queued", "started", "progress", "log", "succeeded", "failed", "cancelled"]).tags("mongo"),
});

export const runtimeSchemas = runtime.schemas({
  Run: dryv.schema({
    id: dryv.field(p.Id),
    kind: dryv.field(p.NonEmptyString100),
    status: dryv.field(runtimeEnums.RunStatus),
    startedAt: dryv.field(p.Instant),
    finishedAt: dryv.field(p.Instant).optional(),
    jobIds: dryv.field(p.Id).array(),
    note: dryv.field(p.NullableString1000).optional(),
  }).tags("mongo"),
  JobEvent: dryv.schema({
    id: dryv.field(p.Id),
    jobId: dryv.field(p.Id),
    runId: dryv.field(p.Id).optional(),
    sequence: dryv.field(p.NonNegativeInteger),
    type: dryv.field(runtimeEnums.JobEventType),
    at: dryv.field(p.Instant),
    message: dryv.field(p.NullableString1000).optional(),
    data: dryv.field(dryv.dynamic()).optional(),
  }).tags("mongo"),
});
