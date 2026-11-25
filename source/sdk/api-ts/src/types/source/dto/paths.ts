import { SourceHttpMethod } from "#sdk/types/source/enums/http-method.ts";
import { SourcePathKind } from "#sdk/types/source/enums/path-kind.ts";

/** Any location on a domain: a page, listing, file, feed or API endpoint. */
export interface SourcePaths {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  domainId: string;
  id: string;
  kind: SourcePathKind;
  method: SourceHttpMethod;
  note?: string | null;
  noteLanguageId?: string | null;
  path: string;
  query?: string | null;
  updatedAt: string;
  version: number;
}
