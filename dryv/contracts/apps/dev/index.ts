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
import engine from "../engine/index.ts";
import { engineApi } from "../engine/engine.ts";

const dev = dryv.group({ name: "dev" }).description("The developer portal: its surface and views.");
const surfaces = dev.surfaces({ Main: surface.web() });
const capabilities = dev.feature("Capabilities");
const views = capabilities.views({
  CapabilityList: view()
    .role("list")
    .parts({ capabilities: part.present(outputFrom(engineApi.ListCapabilities.out)) })
    .presentation("web", surfaces.Main),
});

const dev_app = dryv
  .app({ name: "mzizi-dev" })
  .info({ title: "Mzizi developer portal", version: "0.1.0" })
  .groups(shared, engineApi.engine, brand, dev)
  .surfaces(surfaces.Main)
  .theme(themes.Mzizi)
  .consumes(engine, engineApi.ListCapabilities)
  .destination("capabilities", views.CapabilityList);

export default dryv.project({ name: "mzizi-dev" }).apps(engine, dev_app);
