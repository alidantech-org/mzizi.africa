/** Temporal worker process for Mzizi pipeline workflows. */
import { existsSync } from "node:fs";
import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities.js";
import { startCommandDispatcher } from "./dispatcher.js";
import { startPipelineHttpServer } from "./server.js";

const http = await startPipelineHttpServer();
const dispatcher = await startCommandDispatcher();
const connection = await NativeConnection.connect({ address: process.env.TEMPORAL_ADDRESS ?? "127.0.0.1:7233" });
const sourceWorkflow = new URL("./workflows.ts", import.meta.url);
const compiledWorkflow = new URL("./workflows.js", import.meta.url);
const worker = await Worker.create({
  connection,
  namespace: process.env.TEMPORAL_NAMESPACE ?? "default",
  taskQueue: "mzizi-capabilities",
  workflowsPath: existsSync(sourceWorkflow) ? sourceWorkflow.pathname : compiledWorkflow.pathname,
  activities,
});
try {
  await worker.run();
} finally {
  await Promise.all([dispatcher.close(), http.close()]);
  await connection.close();
}
