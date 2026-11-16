/** Builds the public system report served at `/`: what this API is, whether its dependencies answer, and where to go next. */
import { Injectable, RequestMethod } from "@nestjs/common";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants.js";
import { DiscoveryService } from "@nestjs/core";
import { InjectDataSource } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";

import catalog from "./catalog/catalog.json" with { type: "json" };
import { EngineClient } from "../engine/engine.client.ts";

const contract = catalog.operations as ContractOperation[];
const STARTED_AT = Date.now();
const PROBE_TIMEOUT_MS = 3000;

export type DependencyStatus = "ok" | "unavailable" | "unconfigured";

export interface DependencyReport {
  status: DependencyStatus;
  latencyMs?: number;
  detail?: string;
  info?: Record<string, unknown>;
}

/** One operation as the Dryv contract declares it (generated into `catalog/catalog.json`). */
interface ContractOperation {
  name: string;
  group: string;
  feature: string;
  method: string;
  path: string;
  role: string;
  inputs: string[];
  output: string | null;
  summary: string;
}

export interface EndpointReport {
  method: string;
  path: string;
  feature: string;
  handler: string;
  /** Present when the contract declares the route; routes the project wrote by hand have none. */
  contract?: { name: string; group: string; role: string; summary: string; inputs: string[]; output: string | null };
}

export interface FeatureReport {
  id: string;
  name: string;
  endpoints: number;
}

export interface SystemReport {
  service: "mzizi-api";
  name: string;
  status: "ok" | "degraded";
  version: string;
  environment: string;
  time: string;
  startedAt: string;
  uptimeSeconds: number;
  runtime: { name: string; version: string };
  dependencies: { database: DependencyReport; engine: DependencyReport };
  features: FeatureReport[];
  endpoints: EndpointReport[];
  contract: { source: string; operations: number; generatedBy: string };
}

@Injectable()
export class SystemService {
  constructor(
    @InjectDataSource() private readonly database: DataSource,
    private readonly engine: EngineClient,
    private readonly discovery: DiscoveryService,
  ) {}

  async report(): Promise<SystemReport> {
    const endpoints = this.endpoints();
    const [database, engine] = await Promise.all([this.probeDatabase(), this.probeEngine()]);
    return {
      service: "mzizi-api",
      name: "Mzizi Africa product API",
      status: database.status === "ok" ? "ok" : "degraded",
      version: process.env.npm_package_version ?? "0.1.0",
      environment: process.env.NODE_ENV ?? "development",
      time: new Date().toISOString(),
      startedAt: new Date(STARTED_AT).toISOString(),
      uptimeSeconds: Math.round((Date.now() - STARTED_AT) / 1000),
      runtime: { name: process.versions.bun ? "bun" : "node", version: process.versions.bun ?? process.version },
      dependencies: { database, engine },
      contract: { source: "dryv/contracts/apps/api", operations: contract.length, generatedBy: catalog.generatedBy },
      features: features(endpoints),
      endpoints,
    };
  }

  /** Every HTTP route the running application has mapped, read from the framework's own metadata. */
  endpoints(): EndpointReport[] {
    const found: EndpointReport[] = [];
    for (const wrapper of this.discovery.getControllers()) {
      const type = wrapper.metatype;
      const instance = wrapper.instance as object | undefined;
      if (!type || !instance) continue;
      const base = paths(Reflect.getMetadata(PATH_METADATA, type));
      for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
        const handler = (instance as Record<string, unknown>)[name];
        if (typeof handler !== "function") continue;
        const method = Reflect.getMetadata(METHOD_METADATA, handler) as RequestMethod | undefined;
        if (method === undefined) continue;
        for (const route of paths(Reflect.getMetadata(PATH_METADATA, handler))) {
          const path = join(base[0] ?? "", route);
          const verb = RequestMethod[method];
          const declared = contract.find((item) => item.method === verb && item.path.replace(/\{(\w+)\}/g, ":$1") === path);
          found.push({
            method: verb,
            path,
            feature: type.name.replace(/Controller$/, ""),
            handler: name,
            ...(declared && {
              contract: {
                name: declared.name,
                group: declared.group,
                role: declared.role,
                summary: declared.summary,
                inputs: declared.inputs,
                output: declared.output,
              },
            }),
          });
        }
      }
    }
    return found.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
  }

  async probeDatabase(): Promise<DependencyReport> {
    const began = Date.now();
    try {
      await this.database.query("select 1");
      return { status: "ok", latencyMs: Date.now() - began, info: { driver: "postgres" } };
    } catch (problem) {
      return { status: "unavailable", latencyMs: Date.now() - began, detail: describe(problem) };
    }
  }

  async probeEngine(): Promise<DependencyReport> {
    if (!process.env.ENGINE_URL || !process.env.ENGINE_SERVICE_TOKEN) {
      return { status: "unconfigured", detail: "ENGINE_URL and ENGINE_SERVICE_TOKEN are not set" };
    }
    const began = Date.now();
    try {
      const response = await this.engine.request("/health", { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
      if (!response.ok) {
        return { status: "unavailable", latencyMs: Date.now() - began, detail: `engine answered ${response.status}` };
      }
      const body = (await response.json()) as Record<string, unknown>;
      const { status: _status, ...info } = body;
      return { status: body.status === "ok" ? "ok" : "unavailable", latencyMs: Date.now() - began, info };
    } catch (problem) {
      return { status: "unavailable", latencyMs: Date.now() - began, detail: describe(problem) };
    }
  }
}

function describe(problem: unknown): string {
  return problem instanceof Error ? problem.message.split("\n")[0] : "unknown error";
}

function paths(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [typeof value === "string" ? value : ""];
}

function join(base: string, route: string): string {
  return `/${[base, route].map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/")}`;
}

function features(endpoints: EndpointReport[]): FeatureReport[] {
  const counts = new Map<string, number>();
  for (const endpoint of endpoints) counts.set(endpoint.feature, (counts.get(endpoint.feature) ?? 0) + 1);
  return [...counts].map(([id, count]) => ({
    id,
    name: id.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
    endpoints: count,
  }));
}
