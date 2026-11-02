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

export const evidenceSchemas = pipeline.schemas({
  DocumentSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    title: dryv.field(pipelineProperties.Text),
    kind: dryv.field(sharedProperties.Label),
    publisher: dryv.field(pipelineProperties.Text),
    url: dryv.field(pipelineProperties.Text).optional().nullable(),
    language: dryv.field(sharedProperties.Label).optional().nullable(),
    publishedOn: dryv.field(sharedProperties.Label).optional().nullable(),
    captures: dryv.field(sharedProperties.PaginationNumber),
  }),
  CaptureSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    documentId: dryv.field(sharedProperties.Id),
    documentTitle: dryv.field(pipelineProperties.Text),
    siteId: dryv.field(sharedProperties.Id).optional().nullable(),
    retrievedUrl: dryv.field(pipelineProperties.Text).optional().nullable(),
    httpStatus: dryv.field(sharedProperties.PaginationNumber).optional().nullable(),
    contentHash: dryv.field(sharedProperties.Label).optional().nullable(),
    tool: dryv.field(pipelineProperties.Text).optional().nullable(),
    retrievedAt: dryv.field(sharedProperties.DateTime),
  }),
  StructureVersionSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    structureId: dryv.field(sharedProperties.Id),
    purpose: dryv.field(sharedProperties.Label),
    number: dryv.field(sharedProperties.PaginationNumber),
    status: dryv.field(sharedProperties.Label),
    isCurrent: dryv.field(sharedProperties.Flag),
    schemaVersion: dryv.field(sharedProperties.Label),
    notes: dryv.field(pipelineProperties.Text).optional().nullable(),
    createdAt: dryv.field(sharedProperties.DateTime),
  }),
  CheckSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    siteId: dryv.field(sharedProperties.Id),
    siteName: dryv.field(sharedProperties.Label),
    kind: dryv.field(sharedProperties.Label),
    outcome: dryv.field(sharedProperties.Label),
    detail: dryv.field(pipelineProperties.Text).optional().nullable(),
    checkedAt: dryv.field(sharedProperties.DateTime),
  }),
  DraftAssessmentRequest: dryv.schema({
    siteId: dryv.field(sharedProperties.Id),
    accessBasis: dryv.field(sharedProperties.Label),
    sourceType: dryv.field(sharedProperties.Label),
    rightsHolder: dryv.field(pipelineProperties.Text),
    approvedScope: dryv.field(pipelineProperties.JsonText),
    rationale: dryv.field(pipelineProperties.Text).optional(),
    evidence: dryv.field(pipelineProperties.Text).optional(),
  }),
  DraftAssessmentResponse: dryv.schema({ assessmentId: dryv.field(sharedProperties.Id) }),
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

const registry = pipeline.schemas({
  AssessmentSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    siteId: dryv.field(sharedProperties.Id),
    siteName: dryv.field(sharedProperties.Label),
    status: dryv.field(sharedProperties.Label),
    isCurrent: dryv.field(sharedProperties.Flag),
    sourceType: dryv.field(sharedProperties.Label),
    rightsHolder: dryv.field(sharedProperties.Label),
    approvedScope: dryv.field(pipelineProperties.JsonText),
    rationale: dryv.field(pipelineProperties.Text).optional().nullable(),
    reviewedBy: dryv.field(sharedProperties.Id).optional().nullable(),
    reviewedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
  }),
  DossierSummary: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    jurisdictionId: dryv.field(sharedProperties.Id),
    jurisdictionName: dryv.field(sharedProperties.Label),
    launchStage: dryv.field(sharedProperties.Label),
    isCurrent: dryv.field(sharedProperties.Flag),
    reviewedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    openQuestions: dryv.field(pipelineProperties.Text).optional().nullable(),
  }),
  ApplyReviewsQuery: dryv.schema({ runId: dryv.field(sharedProperties.Id).optional() }),
  ApplyReviewsResponse: dryv.schema({
    applied: dryv.field(sharedProperties.PaginationNumber),
    detail: dryv.field(pipelineProperties.JsonText),
  }),
  AssessmentDecisionResponse: dryv.schema({
    assessmentId: dryv.field(sharedProperties.Id),
    outcome: dryv.field(sharedProperties.Label),
    newAssessmentId: dryv.field(sharedProperties.Id),
  }),
});

const lists = pipeline.schemas({
  AssessmentListResponse: dryv.schema({ assessments: dryv.field(registry.AssessmentSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  DossierListResponse: dryv.schema({ dossiers: dryv.field(registry.DossierSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  CandidateListQuery: dryv.schema({
    status: dryv.field(pipelineProperties.CandidateStatusFilter).optional(),
    targetKind: dryv.field(pipelineProperties.TargetKind).optional(),
    runId: dryv.field(sharedProperties.Id).optional(),
  }).extends(transportSchemas.BaseQuery),
  CandidateListResponse: dryv.schema({ candidates: dryv.field(pipelineSchemas.CandidateSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  PageQuery: dryv.schema({}).extends(transportSchemas.BaseQuery),
  RunListResponse: dryv.schema({ runs: dryv.field(pipelineSchemas.RunSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  JobListResponse: dryv.schema({ jobs: dryv.field(pipelineSchemas.JobSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  DocumentListResponse: dryv.schema({ documents: dryv.field(evidenceSchemas.DocumentSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  CaptureListResponse: dryv.schema({ captures: dryv.field(evidenceSchemas.CaptureSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  StructureVersionListResponse: dryv.schema({ structureVersions: dryv.field(evidenceSchemas.StructureVersionSummary).array() }).extends(sharedSchemas.PaginatedResponse),
  CheckListResponse: dryv.schema({ checks: dryv.field(evidenceSchemas.CheckSummary).array() }).extends(sharedSchemas.PaginatedResponse),
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

function action(description: string, path: string, idParam: string | undefined, output: any, policy: any) {
  const op = dryv.operation().description(description).input(idParam ? ({ [idParam]: sharedProperties.Id } as any) : registry.ApplyReviewsQuery).output(output).failures(...failures).authenticated().requires(policy);
  op.facets({
    http: withStandardHttpFailures(idParam ? dryv.http("POST", `/v1${path}`).description(description).input((op.in as any)[idParam], dryv.path()).output(op.out, dryv.respond(200)) : dryv.http("POST", `/v1${path}`).description(description).input(op.in, dryv.queryObject()).output(op.out, dryv.respond(200)))
      .failure(sharedFailures.Unauthorized, 401)
      .failure(sharedFailures.Forbidden, 403),
  });
  return op;
}

const promoteOperation = () => action("Promote an approved candidate to a canonical record through the database engine.", "/pipeline/candidates/{candidateId}/promote", "candidateId", detail.PromoteResponse, accessPolicies.CandidatePromoteAccess);

function draftOperation() {
  const description = "Draft a site assessment as in_review; a draft never authorises collection.";
  const op = dryv.operation().description(description).input(evidenceSchemas.DraftAssessmentRequest).output(evidenceSchemas.DraftAssessmentResponse).failures(...failures).authenticated().requires(accessPolicies.AssessmentDraftAccess);
  op.facets({
    http: withStandardHttpFailures(dryv.http("POST", "/v1/pipeline/assessments").description(description).input(op.in, dryv.body()).output(op.out, dryv.respond(201)))
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
  ApplyReviewDecisions: action("Apply recorded review decisions to their candidates (approved, rejected, held) through the database engine.", "/pipeline/reviews/apply", undefined, registry.ApplyReviewsResponse, accessPolicies.ReviewerAccess),
  FindDocuments: read("List source documents with their capture counts.", "/pipeline/documents", lists.PageQuery, lists.DocumentListResponse, accessPolicies.PipelineReadAccess),
  FindCaptures: read("List captures (retrievals of a document), newest first.", "/pipeline/captures", lists.PageQuery, lists.CaptureListResponse, accessPolicies.PipelineReadAccess),
  FindStructureVersions: read("List site structure versions.", "/pipeline/structure-versions", lists.PageQuery, lists.StructureVersionListResponse, accessPolicies.PipelineReadAccess),
  FindChecks: read("List site checks, newest first.", "/pipeline/checks", lists.PageQuery, lists.CheckListResponse, accessPolicies.PipelineReadAccess),
  DraftAssessment: draftOperation(),
  FindAssessments: read("List site legal and source assessments.", "/pipeline/assessments", lists.PageQuery, lists.AssessmentListResponse, accessPolicies.PipelineReadAccess),
  FindDossiers: read("List jurisdiction legal dossiers.", "/pipeline/dossiers", lists.PageQuery, lists.DossierListResponse, accessPolicies.PipelineReadAccess),
  ApproveAssessment: action("Approve a site assessment; only a named human account holding assessment.approve.", "/pipeline/assessments/{assessmentId}/approve", "assessmentId", registry.AssessmentDecisionResponse, accessPolicies.AssessmentApproveAccess),
  RejectAssessment: action("Reject a site assessment; only a named human account holding assessment.approve.", "/pipeline/assessments/{assessmentId}/reject", "assessmentId", registry.AssessmentDecisionResponse, accessPolicies.AssessmentApproveAccess),
});
