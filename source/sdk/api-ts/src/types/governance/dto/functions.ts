import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A government function (county health services) from law, possibly under a broader one. */
export interface GovernanceFunctions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  parentId?: string | null;
  provisionId?: string | null;
  topicTerm: string;
  updatedAt: string;
  version: number;
}
