/** Credit and rights for one artifact and publisher; equal bytes from other places never overwrite it. */
export interface SourceAttributions {
  artifactId: string;
  assessedAt: string;
  assessorSnapshot: string;
  code: string;
  createdAt: string;
  credit: string;
  deletedAt?: string | null;
  id: string;
  licenseValueId?: string | null;
  publisherId: string;
  rightsStatement: string;
  updatedAt: string;
  version: number;
}
