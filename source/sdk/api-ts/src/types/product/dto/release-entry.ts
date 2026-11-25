import { ProductReleaseStatus } from "#sdk/types/product/enums/release-status.ts";

/** Release Entry */
export interface ProductReleaseEntry {
  appCode: string;
  countryCode: string;
  countryId: string;
  fromOn: string | null;
  releaseId: string;
  status: ProductReleaseStatus;
}
