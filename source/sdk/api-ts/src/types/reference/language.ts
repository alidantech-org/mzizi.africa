/** A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values. */
export interface ReferenceLanguage {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  directionId?: string | null;
  familyId?: string | null;
  glottocode?: string | null;
  id: string;
  iso6391?: string | null;
  iso6392?: string | null;
  iso6393?: string | null;
  kindId: string;
  name: string;
  parentId?: string | null;
  scriptId?: string | null;
  statusId?: string | null;
  updatedAt: string;
  version: number;
}
