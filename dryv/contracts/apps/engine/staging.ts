/**
 * Staging review: captured pages and the candidates proposed from them, and the decision on each candidate.
 * A decision never writes domain data; approval only queues the promotion the change ledger performs.
 */
import { body, field, http, operation, path, query, schema } from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { staging, stagingEnums, stagingSchemas } from "#/schemas/mongo/staging.ts";
import { engineShared } from "./engine.ts";

const { ServiceKey, engineHttp, JobId, Count, Reason } = engineShared;

const captures = staging.feature("Captures").description("What the engine fetched.").failureDefaults(engineHttp);
const candidates = staging
  .feature("Candidates")
  .description("What was proposed from captures, and its review.")
  .failureDefaults(engineHttp);

const { CaptureWindow } = captures.schemas({
  CaptureWindow: schema({ sourceId: field(p.Id).optional(), limit: field(Count).optional() }),
});
const { CaptureList } = captures.schemas({ CaptureList: schema({ captures: field(stagingSchemas.Capture).array() }) });

const { CandidateWindow, DecisionBody } = candidates.schemas({
  CandidateWindow: schema({
    kind: field(stagingEnums.CandidateKind).optional(),
    status: field(stagingEnums.CandidateStatus).optional(),
    limit: field(Count).optional(),
  }),
  DecisionBody: schema({ decision: field(stagingEnums.ReviewDecision), reason: field(Reason).optional() }),
});
const { CandidateList } = candidates.schemas({
  CandidateList: schema({ candidates: field(stagingSchemas.Candidate).array() }),
});

export const ListCaptures = captures.operation(
  "ListCaptures",
  operation()
    .role("list")
    .description("Recent captures, newest first, optionally for one source.")
    .input(CaptureWindow)
    .output(CaptureList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/captures")
        .input(inputField("sourceId"), query("sourceId"))
        .input(inputField("limit"), query("limit"))
        .output(output),
    })),
);

export const GetCapture = captures.operation(
  "GetCapture",
  operation()
    .role("detail")
    .description("One capture: where it came from, its hash and where the raw bytes are stored.")
    .input({ captureId: JobId })
    .output(stagingSchemas.Capture)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("GET", "/v1/captures/{captureId}").input(input.captureId, path()).output(output),
    })),
);

export const ListCandidates = candidates.operation(
  "ListCandidates",
  operation()
    .role("list")
    .description("Candidates awaiting or past review, optionally by kind or status.")
    .input(CandidateWindow)
    .output(CandidateList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/candidates")
        .input(inputField("kind"), query("kind"))
        .input(inputField("status"), query("status"))
        .input(inputField("limit"), query("limit"))
        .output(output),
    })),
);

export const GetCandidate = candidates.operation(
  "GetCandidate",
  operation()
    .role("detail")
    .description("One candidate with its payload, confidence and the captures it came from.")
    .input({ candidateId: JobId })
    .output(stagingSchemas.Candidate)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("GET", "/v1/candidates/{candidateId}").input(input.candidateId, path()).output(output),
    })),
);

export const DecideCandidate = candidates.operation(
  "DecideCandidate",
  operation()
    .role("update")
    .description(
      "Record a review decision. Approval queues promotion through the change ledger; nothing is written to domain tables here.",
    )
    .input({ candidateId: JobId, decision: DecisionBody })
    .output(stagingSchemas.Candidate)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/candidates/{candidateId}/decision")
        .input(input.candidateId, path())
        .input(input.decision, body())
        .output(output),
    })),
);

export const stagingApi = {
  staging,
  captures,
  candidates,
  ListCaptures,
  GetCapture,
  ListCandidates,
  GetCandidate,
  DecideCandidate,
};
