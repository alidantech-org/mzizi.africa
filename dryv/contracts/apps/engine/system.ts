/**
 * Engine health: liveness for process managers and readiness that names each dependency.
 */
import { field, group, http, operation, property, schema } from "@dryvcode/author";
import { engineShared } from "./engine.ts";

const { engineHttp, Blurb } = engineShared;

export const system = group({ name: "system" }).description("Engine health.");
const { HealthState } = system.properties({ HealthState: property.enum(["ok", "degraded", "down"]) });
const health = system.feature("Health").description("Is the engine alive and ready?").failureDefaults(engineHttp);

const { Health, Dependency } = health.schemas({
  Dependency: schema({ name: field(Blurb), state: field(HealthState), detail: field(Blurb).optional() }),
  Health: schema({ state: field(HealthState) }),
});
const { Readiness } = health.schemas({ Readiness: schema({ state: field(HealthState), dependencies: field(Dependency).array() }) });

/** Public: process managers call it without a key. */
export const GetHealth = health.operation(
  "GetHealth",
  operation()
    .role("detail")
    .description("Liveness: the process is up.")
    .output(Health)
    .facets(({ output }) => ({ http: http("GET", "/health").output(output) })),
);

/** Public: names each dependency (PostgreSQL, Mongo, object storage) and its state. */
export const GetReadiness = health.operation(
  "GetReadiness",
  operation()
    .role("detail")
    .description("Readiness: each dependency and whether it answers.")
    .output(Readiness)
    .facets(({ output }) => ({ http: http("GET", "/ready").output(output) })),
);

export const systemApi = { system, health, GetHealth, GetReadiness };
