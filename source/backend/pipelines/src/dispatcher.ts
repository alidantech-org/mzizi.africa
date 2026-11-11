/** Delivers the database outbox to Temporal with stable workflow IDs and lease recovery. */
import { Connection, Client } from "@temporalio/client";
import { databaseOperation } from "./database-client.js";
import type { PipelineManifest } from "./workflows.js";

type Command = { id: string; runId: string; kind: "start" | "cancel" | "review"; payload: Record<string, unknown>; attempts: number };
type Run = { runId: string; manifestSnapshot: PipelineManifest; input: Record<string, unknown> };

export async function startCommandDispatcher(): Promise<{ close(): Promise<void> }> {
  const address = process.env.TEMPORAL_ADDRESS ?? "127.0.0.1:7233";
  const connection = await Connection.connect({ address });
  const client = new Client({ connection, namespace: process.env.TEMPORAL_NAMESPACE ?? "default" });
  const controller = new AbortController();
  const loop = (async () => {
    while (!controller.signal.aborted) {
      let command: Command | null = null;
      try {
        ({ command } = await databaseOperation<{ command: Command | null }>("commands/claim", { leaseSeconds: 45 }));
        if (!command) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        if (command.kind === "start") {
          const run = await databaseOperation<Run>(`runs/${command.runId}`, undefined, "GET");
          try {
            await client.workflow.start("runPipeline", {
              workflowId: command.runId,
              taskQueue: "mzizi-capabilities",
              args: [{ runId: command.runId, manifestSnapshot: run.manifestSnapshot, input: run.input }],
              workflowExecutionTimeout: "30 days",
            });
          } catch (error) {
            if (!String(error).toLowerCase().includes("already started")) throw error;
          }
        } else if (command.kind === "cancel") {
          try { await client.workflow.getHandle(command.runId).cancel(); } catch (error) {
            if (!String(error).toLowerCase().includes("not found")) throw error;
          }
        } else {
          const decision = command.payload.decision;
          if (decision !== "approve" && decision !== "reject") throw new Error("invalid review command");
          await client.workflow.getHandle(command.runId).signal("reviewDecision", decision);
        }
        await databaseOperation(`commands/${command.id}/dispatched`);
      } catch (error) {
        if (command) {
          await databaseOperation(`commands/${command.id}/retry`, { error: error instanceof Error ? error.message : String(error) }).catch(() => undefined);
        }
        await new Promise((resolve) => setTimeout(resolve, 1_000));
      }
    }
  })();
  return {
    close: async () => {
      controller.abort();
      await loop;
      await connection.close();
    },
  };
}
