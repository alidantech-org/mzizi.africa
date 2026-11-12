import { dryv } from "@dryvcode/author";
import { shared } from "../schemas/_shared.ts";
import { reference } from "../schemas/mzizi/reference.ts";
import { geography } from "../schemas/mzizi/geography.ts";
import { filesystem } from "../schemas/mzizi/filesystem.ts";
import { source } from "../schemas/mzizi/source.ts";
import { legal } from "../schemas/mzizi/legal.ts";
import { official } from "../schemas/mzizi/official.ts";
import { referenceLegal } from "../schemas/mzizi/reference.ts";
export default dryv
  .app({ name: "main-evidence-review" })
  .groups(shared, reference, geography, filesystem, source, legal, official, referenceLegal);
