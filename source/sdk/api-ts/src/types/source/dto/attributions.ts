/** Credit and rights of an artifact. */
export interface SourceAttributions {
  artifactId: string;
  assessedAt: string;
  assessorId?: string | null;
  code: string;
  createdAt: string;
  credit: string;
  deletedAt?: string | null;
  id: string;
  licenceTerm?: string | null;
  publisherId: string;
  rights: string;
  updatedAt: string;
  version: number;
}
