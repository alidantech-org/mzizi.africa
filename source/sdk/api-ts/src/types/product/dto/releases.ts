import { ProductReleaseStatus } from "#sdk/types/product/enums/release-status.ts";

/** Which country is served on which app and since when. */
export interface ProductReleases {
  appId: string;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromOn?: string | null;
  id: string;
  status: ProductReleaseStatus;
  toOn?: string | null;
  updatedAt: string;
  version: number;
}
