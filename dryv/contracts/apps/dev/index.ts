/**
 * The Mzizi developer portal (generated frontend).
 *
 * The Next.js portal for developers and agents. It is the only frontend that talks to the engine, and only through
 * a server-side layer so the engine service key never reaches a browser (`.docs/decisions/DEC-DEVELOPER-PORTAL.md`).
 * First slice only: the shared theme, one surface and one destination, to inspect what generation produces.
 */
import { dryv, outputFrom, part, surface, view } from "@dryvcode/author";
import { shared } from "#/schemas/_shared.ts";
import { brand, themes } from "#/schemas/theme.ts";
import engine from "#/apps/engine/index.ts";
import { engineApi } from "#/apps/engine/engine.ts";
import { catalogApi } from "#/apps/engine/catalog.ts";
import { exploreApi } from "#/apps/engine/explore.ts";

const dev = dryv.group({ name: "dev" }).description("The developer portal: its surface and views.");
const surfaces = dev.surfaces({ Main: surface.web() });
const capabilities = dev.feature("Capabilities");
const views = capabilities.views({
  CapabilityList: view()
    .role("list")
    .parts({
      capabilities: part.present(outputFrom(engineApi.ListCapabilities.out, ["capabilities"])).collection("table"),
    })
    .presentation("web", surfaces.Main),

  SeedTableList: view()
    .role("list")
    .description("The tables the engine can seed, with their natural keys.")
    .parts({
      tables: part.present(outputFrom(catalogApi.GetSeedCatalog.out, ["tables"])).collection("table"),
    })
    .presentation("web", surfaces.Main),

  JobList: view()
    .role("list")
    .description("Recent engine jobs, newest first.")
    .parts({
      jobs: part.present(outputFrom(engineApi.ListJobs.out, ["jobs"])).collection("table"),
    })
    .presentation("web", surfaces.Main),
});

const dev_app = dryv
  .app({ name: "mzizi-dev" })
  .info({ title: "Mzizi developer portal", version: "0.1.0" })
  .groups(shared, engineApi.engine, catalogApi.catalog, exploreApi.explore, brand, dev)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(
    engine,
    engineApi.ListCapabilities,
    engineApi.ListJobs,
    engineApi.SubmitJob,
    engineApi.CancelJob,
    catalogApi.GetSeedCatalog,
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
  .destination("capabilities", views.CapabilityList)
  .destination("jobs", views.JobList)
  .destination("tables", views.SeedTableList);

export default dryv.project({ name: "mzizi-dev" }).apps(engine, dev_app);
