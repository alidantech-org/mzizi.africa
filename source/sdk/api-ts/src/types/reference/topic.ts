/** Cross-domain discovery topic hierarchy; topics do not own domain records. */
export interface ReferenceTopic {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  parentId?: string | null;
  updatedAt: string;
  version: number;
}
