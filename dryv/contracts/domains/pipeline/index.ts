import * as dryv from "@dryvcode/author";

import { accessPolicies } from "../../foundation/shared/access.ts";
import { standardFailures, withStandardHttpFailures } from "../../foundation/shared/read-surface.ts";
import { sharedFailures, sharedProperties, sharedSchemas, transportSchemas } from "../../foundation/shared/index.ts";

/**
 * Reviewer-only view of the data pipeline for the admin site: staged candidates with their issues and
 * lineage, runs, engine jobs and the site registry, plus the promote action. None of it is public and
 * none of it is stored by the API: the shapes are read-models over tables the database engine and the
 * data engine own (DEC-API-REVIEWER). Promotion stays owned by the database engine; the API only asks it.
 */
export const pipeline = dryv.group({ name: "pipeline" }).description("Reviewer-only read models over staging, runs, jobs and the site registry, and the promote action.").tags("internal", "pipeline");

export const pipelineProperties = pipeline.properties({
  /** Free-form JSON as text: a candidate payload, a locator, a job input. */
  JsonText: dryv.property.string().length({ min: 2 }),
  CandidateStatusFilter: dryv.property.string().length({ min: 1, max: 20 }),
  TargetKind: dryv.property.string().length({ min: 3, max: 100 }),
  Text: dryv.property.string().length({ min: 0, max: 5000 }),
});

export const pipelineSchemas = pipeline.schemas({
  CandidateIssue: dryv.schema({
    rule: dryv.field(sharedProperties.Label),
    severity: dryv.field(sharedProperties.Label),
    message: dryv.field(pipelineProperties.Text),
  }),
  CandidateSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    runId: dryv.field(sharedProperties.Id),
    targetKind: dryv.field(pipelineProperties.TargetKind),
    status: dryv.field(sharedProperties.Label),
    method: dryv.field(sharedProperties.Label),
    confidence: dryv.field(sharedProperties.Confidence).optional().nullable(),
    issueCount: dryv.field(sharedProperties.PaginationNumber),
    createdAt: dryv.field(sharedProperties.DateTime),
  }),
  RunSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    dataset: dryv.field(sharedProperties.Label),
    mappingVersion: dryv.field(sharedProperties.Label),
    status: dryv.field(sharedProperties.Label),
    candidates: dryv.field(sharedProperties.PaginationNumber),
    createdAt: dryv.field(sharedProperties.DateTime),
  }),
  JobSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    kind: dryv.field(sharedProperties.Label),
    status: dryv.field(sharedProperties.Label),
    attempts: dryv.field(sharedProperties.PaginationNumber),
    error: dryv.field(pipelineProperties.Text).optional().nullable(),
    createdAt: dryv.field(sharedProperties.DateTime),
  }),
  SiteSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    name: dryv.field(sharedProperties.Label),
    status: dryv.field(sharedProperties.Label),
    kind: dryv.field(sharedProperties.Label),
    primaryDomain: dryv.field(sharedProperties.Label).optional().nullable(),
  }),
});

const detail = pipeline.schemas({
  CandidateDetailResponse: dryv.schema({
    candidate: dryv.field(pipelineSchemas.CandidateSummary),
    payload: dryv.field(pipelineProperties.JsonText),
    locator: dryv.field(pipelineProperties.JsonText).optional().nullable(),
    segmentKey: dryv.field(sharedProperties.Label).optional().nullable(),
    extractionResultId: dryv.field(sharedProperties.Id),
    captureId: dryv.field(sharedProperties.Id).optional().nullable(),
    documentId: dryv.field(sharedProperties.Id).optional().nullable(),
    siteId: dryv.field(sharedProperties.Id).optional().nullable(),
    issues: dryv.field(pipelineSchemas.CandidateIssue).array(),
    /** The canonical record this candidate would replace, as JSON text, when one exists. */
    current: dryv.field(pipelineProperties.JsonText).optional().nullable(),
  }),
  PromoteResponse: dryv.schema({
    outcome: dryv.field(sharedProperties.Label),
    reason: dryv.field(pipelineProperties.Text).optional().nullable(),
    recordId: dryv.field(sharedProperties.Id).optional().nullable(),
  }),
});

const lists = pipeline.schemas({
  CandidateListQuery: dryv.schema({
    status: dryv.field(pipelineProperties.CandidateStatusFilter).optional(),
    targetKind: dryv.field(pipelineProperties.TargetKind).optional(),
    runId: dryv.field(sharedProperties.Id).optional(),
  }).extends(transportSchemas.BaseQuery),
  CandidateListResponse: dryv.schema({ candidates: dryv.field(pipelineSchemas.CandidateSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  PageQuery: dryv.schema({}).extends(transportSchemas.BaseQuery),
  RunListResponse: dryv.schema({ runs: dryv.field(pipelineSchemas.RunSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  JobListResponse: dryv.schema({ jobs: dryv.field(pipelineSchemas.JobSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  SiteListResponse: dryv.schema({ sites: dryv.field(pipelineSchemas.SiteSummary).array() }).extends(sharedSchemas.PaginatedResponse),
});

const failures = [...standardFailures, sharedFailures.Unauthorized, sharedFailures.Forbidden] as const;

function read(description: string, path: string, input: any, output: any, policy: any) {
  const op = dryv.operation().description(description).input(input).output(output).failures(...failures).authenticated().requires(policy);
  op.facets({
    http: withStandardHttpFailures(dryv.http("GET", `/v1${path}`).description(description).input(path.includes("{") ? (op.in as any).candidateId : op.in, path.includes("{") ? dryv.path() : dryv.queryObject()).output(op.out, dryv.respond(200)))
      .failure(sharedFailures.Unauthorized, 401)
      .failure(sharedFailures.Forbidden, 403),
  });
  return op;
}

function promoteOperation() {
  const description = "Promote an approved candidate to a canonical record through the database engine.";
  const op = dryv.operation().description(description).input({ candidateId: sharedProperties.Id } as any).output(detail.PromoteResponse).failures(...failures).authenticated().requires(accessPolicies.CandidatePromoteAccess);
  op.facets({
    http: withStandardHttpFailures(dryv.http("POST", "/v1/pipeline/candidates/{candidateId}/promote").description(description).input((op.in as any).candidateId, dryv.path()).output(op.out, dryv.respond(200)))
      .failure(sharedFailures.Unauthorized, 401)
      .failure(sharedFailures.Forbidden, 403),
  });
  return op;
}

const reviewer = pipeline.feature("PipelineReview").description("Reviewer-only reads over the pipeline and the promote action.").tags("internal");

export const pipelineOperations = reviewer.operations({
  FindCandidates: read("List staged candidates.", "/pipeline/candidates", lists.CandidateListQuery, lists.CandidateListResponse, accessPolicies.PipelineReadAccess),
  GetCandidateDetail: read("Get a staged candidate with payload, issues, lineage and the current canonical record.", "/pipeline/candidates/{candidateId}", { candidateId: sharedProperties.Id } as any, detail.CandidateDetailResponse, accessPolicies.PipelineReadAccess),
  FindRuns: read("List staging runs.", "/pipeline/runs", lists.PageQuery, lists.RunListResponse, accessPolicies.PipelineReadAccess),
  FindJobs: read("List data engine jobs.", "/pipeline/jobs", lists.PageQuery, lists.JobListResponse, accessPolicies.PipelineReadAccess),
  FindSites: read("List registered sites.", "/pipeline/sites", lists.PageQuery, lists.SiteListResponse, accessPolicies.PipelineReadAccess),
  PromoteCandidate: promoteOperation(),
});
