/** Authorized, isolated data-preparation jobs with durable text outputs. */
import {
  body,
  failure,
  failureProfile,
  field,
  group,
  http,
  mapFailure,
  operation,
  path,
  property,
  ref,
  respond,
  schema,
} from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p, transportSchemas } from "#/schemas/_shared.ts";
import { engineShared } from "./engine.ts";
import { researchApi } from "./research.ts";

const { ServiceKey, JobId, Blurb } = engineShared;
const scripts = group({ name: "scripts" }).description("Bounded script workspaces.");
const { Busy, Disabled } = scripts.failures({
  Busy: failure("script_worker_busy").payload(ref(transportSchemas.ApiError)),
  Disabled: failure("script_workspace_unavailable").payload(ref(transportSchemas.ApiError)),
});
const scriptFailures = failureProfile().http(
  mapFailure(f.Unauthorized, 401),
  mapFailure(f.Forbidden, 403),
  mapFailure(f.NotFound, 404),
  mapFailure(Busy, 409),
  mapFailure(f.ValidationError, 422),
  mapFailure(Disabled, 503),
);
const jobs = scripts
  .feature("ScriptJobs")
  .description("Submit, inspect and cancel script jobs.")
  .failureDefaults(scriptFailures);
const { Language, Program, ScriptTimeout, ScriptState, LogText } = scripts.properties({
  Language: property.enum(["python", "bash"]),
  Program: property.string().length({ min: 1, max: 65536 }),
  ScriptTimeout: property.number.integer().range({ min: 1, max: 60 }),
  ScriptState: property.enum(["running", "succeeded", "failed", "cancelled", "timed_out", "output_limit", "interrupted"]),
  LogText: property.string().length({ max: 262144 }),
});
const { ScriptRequest } = jobs.schemas({
  ScriptRequest: schema({
    language: field(Language),
    script: field(Program),
    inputs: field(researchApi.ArtifactRef).array().optional(),
    timeout_seconds: field(ScriptTimeout).optional(),
  }),
});
const { ScriptJob } = jobs.schemas({
  ScriptJob: schema({
    id: field(JobId),
    status: field(ScriptState),
    request: field(ScriptRequest),
    script_sha256: field(p.Sha256),
    image_id: field(Blurb),
    started_at: field(p.Instant),
    finished_at: field(p.Instant).nullable(),
    cancel_requested: field(p.Flag),
    exit_code: field(p.Integer).nullable(),
    stdout: field(LogText),
    stderr: field(LogText),
    stdout_sha256: field(p.Sha256).nullable(),
    stderr_sha256: field(p.Sha256).nullable(),
    error: field(Blurb).nullable(),
  }),
});
const SubmitScript = jobs.operation(
  "SubmitScript",
  operation()
    .role("create")
    .description("Start a bounded data transformation over verified artifacts.")
    .input({ script: ScriptRequest })
    .output(ScriptJob)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/research/scripts").input(input.script, body()).output(output, respond(202)),
    })),
);
const GetScript = jobs.operation(
  "GetScript",
  operation()
    .role("detail")
    .description("Read the current script state and recorded output.")
    .input({ jobId: JobId })
    .output(ScriptJob)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("GET", "/v1/research/scripts/{jobId}").input(input.jobId, path()).output(output),
    })),
);
const CancelScript = jobs.operation(
  "CancelScript",
  operation()
    .role("update")
    .description("Request cancellation of an active script.")
    .input({ jobId: JobId })
    .output(ScriptJob)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({
      http: http("POST", "/v1/research/scripts/{jobId}/cancel").input(input.jobId, path()).output(output),
    })),
);

export const scriptApi = { scripts, SubmitScript, GetScript, CancelScript };
