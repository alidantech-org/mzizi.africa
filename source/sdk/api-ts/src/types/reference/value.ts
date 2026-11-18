/** A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations. */
export interface ReferenceValue {
  code: string;
  colorToken?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  iconCode?: string | null;
  id: string;
  label: string;
  parentId?: string | null;
  position?: number | null;
  schemeId: string;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
