import * as dryv from "@dryvcode/author";

import { sharedProperties } from "./_shared.ts";
import { belongsTo } from "./postgres/_links.ts";
import { Templates } from "./postgres/template.ts";

/** The kinds of root row a template can create (the root tables that carry `templateFields`). */
export type TemplateProduct =
  | "area"
  | "institution"
  | "position"
  | "office"
  | "term"
  | "election-cycle"
  | "contest"
  | "event-rule"
  | "event-schedule"
  | "budget"
  | "fund";

/**
 * The only field a root row carries about the template that created it: the plain link `templateId` (owner rule,
 * 2026-11-25 and 2026-11-26: only roots keep the pattern reference; rows created because of a root are effects and are
 * traced through their foreign keys). Confidence and reason belong to the template itself, never to the rows. A root made
 * by hand has no template. Contract authors: spread these into a root table and add `.index("templateId")`.
 */
export function templateFields(product: TemplateProduct) {
  return {
    templateId: belongsTo(() => Templates)
      .maybe()
      .tags(`template-product:${product}`)
      .description(
        "The template that created this root row; empty for a row made by hand. The database checks that the template makes this kind of row.",
      ),
  };
}
