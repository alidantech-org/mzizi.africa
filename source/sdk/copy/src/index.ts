export * from "./define.ts";
import { menus } from "./areas/menus.ts";
import { search } from "./areas/search.ts";
import { shell } from "./areas/shell.ts";

/** Every declared area. Add a file under `areas/` and list it here. */
export const areas = [search, shell, menus] as const;

/** Typed keys for the apps: `copy.search.dialog.noMatch`. */
export const copy = { search: search.keys, shell: shell.keys, menus: menus.keys } as const;
