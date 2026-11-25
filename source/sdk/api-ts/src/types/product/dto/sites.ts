import { ProductSiteStatus } from "#sdk/types/product/enums/site-status.ts";

/** A public site or domain of an app, with its default locale and status. */
export interface ProductSites {
  appId: string;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  host: string;
  id: string;
  localeId?: string | null;
  status: ProductSiteStatus;
  updatedAt: string;
  version: number;
}
