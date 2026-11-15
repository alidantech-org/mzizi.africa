/**
 * Runs and their events: what the engine did, in order, for the API to watch.
 */
import { field, http, operation, path, query, schema } from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { runtime, runtimeEnums, runtimeSchemas } from "#/schemas/mongo/runtime.ts";
import { engineShared } from "./engine.ts";

const { ServiceKey, engineHttp, JobId, Count } = engineShared;
const runs = runtime.feature("Runs").description("Watch what the engine ran.").failureDefaults(engineHttp);

const { RunWindow, EventWindow } = runs.schemas({
  RunWindow: schema({ status: field(runtimeEnums.RunStatus).optional(), limit: field(Count).optional() }),
  EventWindow: schema({ runId: field(JobId), after: field(p.NonNegativeInteger).optional(), limit: field(Count).optional() }),
});
const { RunList, EventList } = runs.schemas({
  RunList: schema({ runs: field(runtimeSchemas.Run).array() }),
  EventList: schema({ events: field(runtimeSchemas.JobEvent).array() }),
});

export const ListRuns = runs.operation(
  "ListRuns",
  operation()
    .role("list")
    .description("Recent runs, newest first, optionally by status.")
    .input(RunWindow)
    .output(RunList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/runs").input(inputField("status"), query("status")).input(inputField("limit"), query("limit")).output(output),
    })),
);

export const GetRun = runs.operation(
  "GetRun",
  operation()
    .role("detail")
    .description("One run with its status and the jobs it started.")
    .input({ runId: JobId })
    .output(runtimeSchemas.Run)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ input, output }) => ({ http: http("GET", "/v1/runs/{runId}").input(input.runId, path()).output(output) })),
);

export const ListRunEvents = runs.operation(
  "ListRunEvents",
  operation()
    .role("list")
    .description("A run's events in order, optionally only those after a sequence number (for polling).")
    .input(EventWindow)
    .output(EventList)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/run-events")
        .input(inputField("runId"), query("runId"))
        .input(inputField("after"), query("after"))
        .input(inputField("limit"), query("limit"))
        .output(output),
    })),
);

export const runtimeApi = { runtime, runs, ListRuns, GetRun, ListRunEvents };
void f;
