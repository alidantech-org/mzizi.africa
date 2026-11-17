import { SourceHttpMethod } from "#sdk/types/enums/source/http-method.ts";
import { SourcePathKind } from "#sdk/types/enums/source/path-kind.ts";

/** A page, listing, file or API endpoint on a domain; captures hang off it. */
export interface SourcePaths {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  domainId: string;
  id: string;
  kind: SourcePathKind;
  method?: SourceHttpMethod | null;
  note?: string | null;
  path: string;
  updatedAt: string;
  version: number;
}
