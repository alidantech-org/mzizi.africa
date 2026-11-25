import { ProductMessageStatus } from "#sdk/types/product/enums/message-status.ts";
import { ProductTextOrigin } from "#sdk/types/product/enums/text-origin.ts";

/** The text of one interface key in one language, optionally for one country. */
export interface ProductMessages {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  keyId: string;
  languageId: string;
  origin: ProductTextOrigin;
  status: ProductMessageStatus;
  text: string;
  translator?: string | null;
  updatedAt: string;
  version: number;
}
