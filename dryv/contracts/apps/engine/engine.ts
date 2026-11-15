/**
 * Engine jobs: submit work, watch it, cancel it, and list what the engine can do.
 *
 * These are server-to-server operations. Failures keep the engine's own meaning (an unknown capability
 * is a 422, a missing job is a 404) so the API can pass them on or translate them for its own callers.
 */
import {
  dynamic,
  failureProfile,
  field,
  group,
  http,
  mapFailure,
  operation,
  path,
  policy,
  property,
  query,
  respond,
  body,
  schema,
} from "@dryvcode/author";
import { sharedFailures as f } from "#/schemas/_shared.ts";

const engine = group({ name: "engine" }).description("The Python engine: capabilities and jobs, offered to the API.");

const { JobStatus, CapabilityKind, JobId, IdempotencyKey, Count, Reason, Blurb } = engine.properties({
  JobStatus: property.enum(["queued", "running", "succeeded", "failed", "cancelled"]),
  CapabilityKind: property.string().length({ min: 1, max: 200 }),
  JobId: property.string.uuid(),
  IdempotencyKey: property.string().length({ min: 1, max: 255 }),
  Count: property.number.integer({ bits: 64 }).range({ min: 0, max: 500 }),
  Reason: property.string().length({ max: 4000 }),
  Blurb: property.string().length({ max: 1000 }),
});

/** The single service credential the API presents. A stub: the generated guard asks the project to check the key. */
const { ServiceKey } = engine.policies({ ServiceKey: policy() });

const engineHttp = failureProfile().http(
  mapFailure(f.Unauthorized, 401),
  mapFailure(f.NotFound, 404),
  mapFailure(f.ValidationError, 422),
  mapFailure(f.InternalError, 500),
);

const jobs = engine.feature("Jobs").description("Submit, watch and cancel engine jobs.").failureDefaults(engineHttp);

const { Job, Capability, SubmitJobBody, ListJobsInput } = jobs.schemas({
  Job: schema({
    id: field(JobId),
    runId: field(JobId).optional(),
    kind: field(CapabilityKind),
    status: field(JobStatus),
    attempts: field(Count),
    error: field(Reason).optional(),
    result: field(dynamic()).optional(),
  }),
  Capability: schema({
    kind: field(CapabilityKind),
    description: field(Blurb).optional(),
  }),
  SubmitJobBody: schema({
    kind: field(CapabilityKind),
    input: field(dynamic()).optional(),
    idempotencyKey: field(IdempotencyKey).optional(),
    runId: field(JobId).optional(),
  }),
  ListJobsInput: schema({
    status: field(JobStatus).optional(),
    limit: field(Count).optional(),
  }),
});

const { CapabilityList, JobList } = jobs.schemas({
  CapabilityList: schema({ capabilities: field(Capability).array() }),
  JobList: schema({ jobs: field(Job).array() }),
});

export const ListCapabilities = jobs.operation(
  "ListCapabilities",
  operation()
    .role("list")
    .description("What the engine can run.")
    .output(CapabilityList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ output }) => ({ http: http("GET", "/capabilities").output(output) })),
);

export const SubmitJob = jobs.operation(
  "SubmitJob",
  operation()
    .role("create")
    .description("Queue a job. Repeating an idempotency key returns the first job.")
    .input({ body: SubmitJobBody })
    .output(Job)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/jobs").input(input.body, body()).output(output, respond(202)),
    })),
);

export const GetJob = jobs.operation(
  "GetJob",
  operation()
    .role("detail")
    .description("One job with its status and result.")
    .input({ jobId: JobId })
    .output(Job)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("GET", "/v1/jobs/{jobId}").input(input.jobId, path()).output(output),
    })),
);

export const ListJobs = jobs.operation(
  "ListJobs",
  operation()
    .role("list")
    .description("Recent jobs, newest first, optionally by status.")
    .input(ListJobsInput)
    .output(JobList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/jobs")
        .input(inputField("status"), query("status"))
        .input(inputField("limit"), query("limit"))
        .output(output),
    })),
);

export const CancelJob = jobs.operation(
  "CancelJob",
  operation()
    .role("update")
    .description("Cancel a queued or running job.")
    .input({ jobId: JobId })
    .output(Job)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/jobs/{jobId}/cancel").input(input.jobId, path()).output(output),
    })),
);

export const engineApi = { engine, jobs, ListCapabilities, SubmitJob, GetJob, ListJobs, CancelJob };

/** What the other engine feature files share: the service-key policy, the failure mapping and the common properties. */
export const engineShared = { ServiceKey, engineHttp, JobId, Count, Reason, Blurb };
