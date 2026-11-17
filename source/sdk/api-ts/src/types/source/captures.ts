/** One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other. */
export interface SourceCaptures {
  addressId?: string | null;
  artifactId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  discoveryId?: string | null;
  id: string;
  originalUrl: string;
  responseMetadata: string;
  retrievedAt: string;
  retrievedUrl?: string | null;
  sourceId: string;
  updatedAt: string;
  version: number;
}
