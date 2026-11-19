import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Legal Basis Items */
export interface LegalBasisItems {
  designation: String;
  effect: String;
  effectCode: String;
  excerpt: String;
  explanation: String;
  heading?: String | null;
  instrument: String;
  instrumentCode: String;
  provisionCode: String;
  reviewStatus: String;
  via?: String | null;
}
