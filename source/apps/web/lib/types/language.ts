import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values. */
export interface Language {
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

/** Field metadata for forms and results. */
export const LanguageFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "directionId", label: "Direction Id", kind: "string", required: false },
  { name: "familyId", label: "Family Id", kind: "string", required: false },
  { name: "glottocode", label: "Glottocode", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "iso6391", label: "Iso6391", kind: "string", required: false },
  { name: "iso6392", label: "Iso6392", kind: "string", required: false },
  { name: "iso6393", label: "Iso6393", kind: "string", required: false },
  { name: "kindId", label: "Kind Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "parentId", label: "Parent Id", kind: "string", required: false },
  { name: "scriptId", label: "Script Id", kind: "string", required: false },
  { name: "statusId", label: "Status Id", kind: "string", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
