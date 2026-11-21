export * from "./define.ts";
import { common } from "./areas/common.ts";
import { location } from "./areas/location.ts";
import { menus } from "./areas/menus.ts";
import { pages } from "./areas/pages.ts";
import { place } from "./areas/place.ts";
import { preferences } from "./areas/preferences.ts";
import { search } from "./areas/search.ts";
import { setup } from "./areas/setup.ts";
import { shell } from "./areas/shell.ts";

/** Every declared area. Add a file under `areas/` and list it here. */
export const areas = [search, shell, menus, location, preferences, common, setup, pages, place] as const;

/** Typed keys for the apps: `copy.search.dialog.noMatch`. */
export const copy = { search: search.keys, shell: shell.keys, menus: menus.keys, location: location.keys, preferences: preferences.keys, common: common.keys, setup: setup.keys, pages: pages.keys, place: place.keys } as const;
