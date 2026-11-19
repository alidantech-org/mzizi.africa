import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Tender List Tenders */
export interface TenderListTenders {
  amount?: Number | null;
  awardedOn?: String | null;
  bids: Number;
  buyer: String;
  closesOn: String;
  code: String;
  disclosed: Number;
  disclosedOf: Number;
  place?: String | null;
  procedure: String;
  publishedOn: String;
  reference?: String | null;
  status: String;
  supplier?: String | null;
  title: String;
}
