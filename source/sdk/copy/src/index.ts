export * from "./define.ts";
import { search } from "./areas/search.ts";

/** Every declared area. Add a file under `areas/` and list it here. */
export const areas = [search] as const;

/** Typed keys for the apps: `copy.search.dialog.noMatch`. */
export const copy = { search: search.keys } as const;
