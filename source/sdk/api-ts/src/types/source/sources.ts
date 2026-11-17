import { SourceSourceKind } from "#sdk/types/enums/source/source-kind.ts";

/** A publication channel, named by anything but its domain: a real website, a real API, or a dataset (files or data obtained from somewhere that is neither). Only websites and APIs have domains and paths; the dataset tables record what we prepared from sources. */
export interface SourceSources {
  code: string;
  createdAt: string;
  credentialBinding?: string | null;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kind: SourceSourceKind;
  officialEntityId?: string | null;
  publisherId: string;
  title: string;
  updatedAt: string;
  version: number;
}
