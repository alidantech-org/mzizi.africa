/** One public procurement process run by a buyer, optionally linked to a project. */
export interface CivicProcurements {
  awardedOn?: string | null;
  buyerEntityId: string;
  categoryId?: string | null;
  closesOn?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  natureId?: string | null;
  procedureKindId: string;
  projectId?: string | null;
  publishedOn?: string | null;
  reference?: string | null;
  sourceCitationId?: string | null;
  statusId?: string | null;
  title?: string | null;
  updatedAt: string;
  version: number;
}
