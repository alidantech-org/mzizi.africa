import { SourceAddressKind } from "#sdk/types/enums/source/address-kind.ts";
import { SourceHttpMethod } from "#sdk/types/enums/source/http-method.ts";

/** A page, listing, file or API endpoint on a domain, distinguished by method, path and query. */
export interface SourceAddresses {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  domainId: string;
  id: string;
  kind: SourceAddressKind;
  method: SourceHttpMethod;
  note?: string | null;
  path: string;
  query?: string | null;
  updatedAt: string;
  version: number;
}
