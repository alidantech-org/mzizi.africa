/** Deterministic workflow definitions; network, database and Python work belongs in activities. */
import { CancellationScope, condition, defineSignal, proxyActivities, setHandler } from "@temporalio/workflow";

export type PipelineStep = {
  id: string;
  capability: string;
  capability_version: string;
  depends_on?: string[];
  input: Record<string, unknown>;
  timeout_seconds?: number;
  max_attempts?: number;
  review_gate?: boolean;
};
export type PipelineManifest = { schema_version: "pipeline/v1"; id: string; version: number; steps: PipelineStep[] };
export type PipelineRun = { runId: string; manifestSnapshot: PipelineManifest; input: Record<string, unknown> };
export type CapabilityRequest = { runId: string; stepId: string; capability: string; version: string; timeoutSeconds: number; input: Record<string, unknown> };
export type CapabilityResult = { output: Record<string, unknown> };

type Activities = {
  executeCapability(request: CapabilityRequest): Promise<CapabilityResult>;
  recordRunProgress(runId: string, kind: string, status: string | undefined, data: Record<string, unknown>): Promise<void>;
};

const reviewDecision = defineSignal<["approve" | "reject"]>("reviewDecision");

function bind(value: unknown, input: Record<string, unknown>, outputs: Record<string, Record<string, unknown>>): unknown {
  if (typeof value === "string") {
    const full = value.match(/^\$\{(input|steps)\.([a-zA-Z0-9_-]+)(?:\.output\.([a-zA-Z0-9_.-]+))?\}$/);
    if (!full) return value;
    if (full[1] === "input") return full[3] ? undefined : input[full[2]!];
    let current: unknown = outputs[full[2]!];
    for (const segment of (full[3] ?? "").split(".").filter(Boolean)) current = (current as Record<string, unknown> | undefined)?.[segment];
    return current;
  }
  if (Array.isArray(value)) return value.map((item) => bind(item, input, outputs));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, bind(item, input, outputs)]));
  return value;
}

export async function runPipeline(run: PipelineRun): Promise<Record<string, unknown>> {
  const outputs: Record<string, Record<string, unknown>> = {};
  let decision: "approve" | "reject" | undefined;
  setHandler(reviewDecision, (value) => { decision = value; });
  const progress = proxyActivities<Pick<Activities, "recordRunProgress">>({ startToCloseTimeout: "30 seconds", retry: { maximumAttempts: 10 } });
  await progress.recordRunProgress(run.runId, "pipeline.started", "running", { manifestId: run.manifestSnapshot.id, version: run.manifestSnapshot.version });
  try {
    for (const step of run.manifestSnapshot.steps) {
      const timeout = Math.max(1, Math.min(86400, step.timeout_seconds ?? 1800));
      const activities = proxyActivities<Pick<Activities, "executeCapability">>({
        startToCloseTimeout: `${timeout} seconds`,
        heartbeatTimeout: "2 minutes",
        retry: { maximumAttempts: Math.max(1, Math.min(10, step.max_attempts ?? 3)), initialInterval: "2 seconds", maximumInterval: "5 minutes" },
      });
      const resolved = bind(step.input, run.input, outputs) as Record<string, unknown>;
      if (!resolved || typeof resolved !== "object" || Array.isArray(resolved)) throw new Error(`Step ${step.id} input did not resolve to an object`);
      await progress.recordRunProgress(run.runId, "step.started", undefined, { stepId: step.id, capability: step.capability });
      const result = await activities.executeCapability({ runId: run.runId, stepId: step.id, capability: step.capability, version: step.capability_version, timeoutSeconds: timeout, input: resolved });
      outputs[step.id] = result.output;
      await progress.recordRunProgress(run.runId, "step.completed", undefined, { stepId: step.id, outputKeys: Object.keys(result.output) });
      if (step.review_gate) {
        await progress.recordRunProgress(run.runId, "review.requested", "needs_review", { stepId: step.id });
        await condition(() => decision !== undefined);
        if (decision !== "approve") throw new Error(`Review rejected at step ${step.id}`);
        await progress.recordRunProgress(run.runId, "review.approved", "running", { stepId: step.id });
        decision = undefined;
      }
    }
    await progress.recordRunProgress(run.runId, "pipeline.completed", "succeeded", { stepIds: Object.keys(outputs) });
    return outputs;
  } catch (error) {
    if (error instanceof Error && error.name === "CancelledFailure") {
      await CancellationScope.nonCancellable(() => progress.recordRunProgress(run.runId, "pipeline.cancelled", "cancelled", {}));
      throw error;
    }
    await progress.recordRunProgress(run.runId, "pipeline.failed", "failed", { error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}
