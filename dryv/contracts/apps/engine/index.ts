/**
 * The Mzizi engine application (Python).
 *
 * Operations the engine exposes to our own API, server to server. The engine is not a public
 * service: callers present a single service API key, nothing finer. Our API decides which people
 * may ask for what, then calls these operations; the generated client lives in the API, the generated
 * server interface in the engine.
 */
import { dryv } from "@dryvcode/author";
import { engineApi } from "./engine.ts";

export default dryv
  .app({ name: "mzizi-engine" })
  .info({ title: "Mzizi engine", version: "0.1.0" })
  .provides(engineApi.ListCapabilities, engineApi.SubmitJob, engineApi.GetJob, engineApi.ListJobs, engineApi.CancelJob)
  .groups(engineApi.engine);
