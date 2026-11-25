import { ProductSiteStatus } from "#sdk/types/product/enums/site-status.ts";

/** Site Detail */
export interface ProductSiteDetail {
  appCode: string;
  code: string;
  countryCode: string | null;
  countryId: string | null;
  host: string;
  localeId: string | null;
  siteId: string;
  status: ProductSiteStatus;
}
