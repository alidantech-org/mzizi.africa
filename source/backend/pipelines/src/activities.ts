/** Temporal activities bridge persistence to the database owner and compute to the Python capability engine. */
import { heartbeat } from "@temporalio/activity";
import { ApplicationFailure } from "@temporalio/common";
import type { CapabilityRequest, CapabilityResult } from "./workflows.js";
import { databaseOperation } from "./database-client.js";

const allowed = new Set(["extraction.pdf", "extraction.csv", "extraction.json", "extraction.geojson", "scraping.links", "manifest.validate_structure", "manifest.check_seeds"]);

export async function executeCapability(request: CapabilityRequest): Promise<CapabilityResult> {
  if (!allowed.has(request.capability)) throw new Error(`Unregistered capability: ${request.capability}`);
  const base = process.env.ENGINE_URL ?? "http://127.0.0.1:8760";
  const token = process.env.ENGINE_SERVICE_TOKEN;
  if (!token) throw new Error("ENGINE_SERVICE_TOKEN is required");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(1, Math.min(86400, request.timeoutSeconds)) * 1000);
  const heartbeatTimer = setInterval(() => heartbeat({ runId: request.runId, stepId: request.stepId, capability: request.capability }), 25_000);
  try {
    const response = await fetch(`${base}/internal/v1/capabilities/execute`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ kind: request.capability, input: request.input, run_id: request.runId, idempotency_key: `${request.runId}:${request.stepId}:${request.version}` }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const message = `Python capability service returned ${response.status}: ${await response.text()}`;
      if (response.status >= 400 && response.status < 500 && response.status !== 429) throw ApplicationFailure.nonRetryable(message, "CapabilityRejected");
      throw new Error(message);
    }
    const result = await response.json() as { result?: Record<string, unknown> };
    if (!result.result || typeof result.result !== "object") throw new Error("Python capability service returned no result object");
    return { output: result.result };
  } finally {
    clearTimeout(timeout);
    clearInterval(heartbeatTimer);
  }
}

export async function recordRunProgress(runId: string, kind: string, status: string | undefined, data: Record<string, unknown>): Promise<void> {
  await databaseOperation(`runs/${runId}/progress`, { kind, ...(status ? { status } : {}), data });
}
