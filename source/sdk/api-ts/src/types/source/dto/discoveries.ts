/** An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture. */
export interface SourceDiscoveries {
  addressId?: string | null;
  anchorText?: string | null;
  context?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  discoveredAt: string;
  foundOnAddressId?: string | null;
  id: string;
  observedUrl: string;
  sourceId?: string | null;
  updatedAt: string;
  version: number;
}
