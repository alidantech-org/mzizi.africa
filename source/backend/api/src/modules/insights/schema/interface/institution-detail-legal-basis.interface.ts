import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Institution Detail Legal Basis */
export interface InstitutionDetailLegalBasis {
  designation: String;
  effect: String;
  effectCode?: String;
  excerpt: String;
  explanation?: String;
  heading?: String | null;
  instrument: String;
  instrumentCode?: String | null;
  provisionCode?: String | null;
  reviewStatus: String;
  type: String;
  via?: String | null;
}
