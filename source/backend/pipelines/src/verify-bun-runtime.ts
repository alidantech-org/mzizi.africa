/** Run the real pipeline workflow under Bun against a local Temporal development server. */
import { randomUUID } from "node:crypto";
import { NativeConnection, Worker } from "@temporalio/worker";
import { Client } from "@temporalio/client";
import type { CapabilityRequest, PipelineRun } from "./workflows.js";

const address = process.env.TEMPORAL_ADDRESS ?? "127.0.0.1:7233";
const namespace = process.env.TEMPORAL_NAMESPACE ?? "default";
const taskQueue = `mzizi-bun-smoke-${randomUUID()}`;
const workflowId = `${taskQueue}-run`;
const runId = randomUUID();
const connection = await NativeConnection.connect({ address });
const client = new Client({ connection, namespace });
const worker = await Worker.create({
  connection,
  namespace,
  taskQueue,
  workflowsPath: new URL("./workflows.ts", import.meta.url).pathname,
  activities: {
    async recordRunProgress(): Promise<void> {},
    async executeCapability(request: CapabilityRequest) {
      return { output: { ...request.input, observedVersion: request.version } };
    },
  },
});

const run: PipelineRun = {
  runId,
  manifestSnapshot: {
    schema_version: "pipeline/v1",
    id: "bun.runtime.smoke",
    version: 1,
    steps: [{ id: "echo", capability: "test.echo", capability_version: "1.0.0", input: { value: "bun" } }],
  },
  input: {},
};

try {
  const result = await worker.runUntil(() => client.workflow.execute("runPipeline", {
    workflowId,
    taskQueue,
    args: [run],
  }));
  if (result.echo?.value !== "bun" || result.echo?.observedVersion !== "1.0.0") {
    throw new Error(`Temporal workflow returned an unexpected result: ${JSON.stringify(result)}`);
  }
  console.log(`Bun Temporal workflow passed (${workflowId})`);
} finally {
  connection.close();
}
