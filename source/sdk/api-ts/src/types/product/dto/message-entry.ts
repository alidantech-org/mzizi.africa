import { ProductMessageStatus } from "#sdk/types/product/enums/message-status.ts";
import { ProductTextOrigin } from "#sdk/types/product/enums/text-origin.ts";

/** Message Entry */
export interface ProductMessageEntry {
  countryId: string | null;
  key: string;
  origin: ProductTextOrigin;
  status: ProductMessageStatus;
  text: string;
}
