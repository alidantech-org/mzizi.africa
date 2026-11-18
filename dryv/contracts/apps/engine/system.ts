/**
 * Engine health: liveness for process managers and readiness that names each dependency.
 */
import { field, group, http, operation, property, schema } from "@dryvcode/author";
import { engineShared } from "./engine.ts";

const { engineHttp, Blurb } = engineShared;

export const system = group({ name: "system" }).description("Engine health.");
const { HealthState, Count } = system.properties({
  HealthState: property.enum(["ok", "degraded", "down"]),
  Count: property.number.integer({ bits: 64 }),
});
const health = system.feature("Health").description("Is the engine alive and ready?").failureDefaults(engineHttp);

const { Dependency, PackageHealth } = health.schemas({
  Dependency: schema({ name: field(Blurb), state: field(HealthState), detail: field(Blurb).optional() }),
  /** One package the engine hosts: how it is exposed and how many calls it runs at once. */
  PackageHealth: schema({
    name: field(Blurb),
    exposure: field(Blurb),
    in_flight: field(Count),
    max_concurrency: field(Count),
  }),
});
const { Health } = health.schemas({
  /** The engine's `/health` document, in the engine's wire names. */
  Health: schema({
    status: field(Blurb),
    service: field(Blurb),
    version: field(Blurb),
    store: field(Blurb),
    auth: field(Blurb),
    runtime: field(Blurb),
    capabilities: field(Count),
    active_jobs: field(Count),
    packages: field(PackageHealth).array(),
  }),
});
const { Readiness } = health.schemas({
  Readiness: schema({ state: field(HealthState), dependencies: field(Dependency).array() }),
});

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
