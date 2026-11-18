/**
 * The Mzizi engine application (Python).
 *
 * Operations the engine exposes to our own API, server to server. The engine is not a public
 * service: callers present a single service API key, nothing finer. Our API decides which people
 * may ask for what, then calls these operations; the generated client lives in the API, the generated
 * server interface in the engine.
 */
import { dryv } from "@dryvcode/author";
import { runLedger } from "#/schemas/mongo/run-ledger.ts";
import { shared } from "#/schemas/_shared.ts";
import { catalogApi } from "./catalog.ts";
import { engineApi } from "./engine.ts";
import { exploreApi } from "./explore.ts";
import { researchApi } from "./research.ts";
import { runtimeApi } from "./runtime.ts";
import { scriptApi } from "./scripts.ts";
import { stagingApi } from "./staging.ts";
import { systemApi } from "./system.ts";

export default dryv
  .app({ name: "mzizi-engine" })
  .info({ title: "Mzizi engine", version: "0.1.0" })
  .provides(
    catalogApi.GetSeedCatalog,
    researchApi.InspectArtifact,
    scriptApi.SubmitScript,
    scriptApi.GetScript,
    scriptApi.CancelScript,
    engineApi.ListCapabilities,
    engineApi.SubmitJob,
    engineApi.GetJob,
    engineApi.ListJobs,
    engineApi.CancelJob,
    runtimeApi.ListRuns,
    runtimeApi.GetRun,
    runtimeApi.ListRunEvents,
    stagingApi.ListCaptures,
    stagingApi.GetCapture,
    stagingApi.ListCandidates,
    stagingApi.GetCandidate,
    stagingApi.DecideCandidate,
    systemApi.GetHealth,
    systemApi.GetReadiness,
    exploreApi.ListFileRoots,
    exploreApi.ListFiles,
    exploreApi.GetFile,
    exploreApi.SaveFile,
    exploreApi.PrepareCsv,
    exploreApi.ListTermGroups,
    exploreApi.TagTexts,
    exploreApi.ListDatabaseDomains,
    exploreApi.GetTablePage,
    exploreApi.ListDataLists,
    exploreApi.GetDataListPage,
    exploreApi.GetJobDetail,
  )
  .groups(
    shared,
    catalogApi.catalog,
    engineApi.engine,
    researchApi.research,
    scriptApi.scripts,
    runtimeApi.runtime,
    stagingApi.staging,
    systemApi.system,
    exploreApi.explore,
    runLedger,
  );
