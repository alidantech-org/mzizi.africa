/** Absolute locations keep demo preparation independent of the shell's working directory. */
import { resolve } from "node:path";
export const DEMO_ROOT = resolve(import.meta.dir, "..");
export const WEB_ROOT = resolve(DEMO_ROOT, "../../..");
export const REPOSITORY_ROOT = resolve(WEB_ROOT, "../../..");
