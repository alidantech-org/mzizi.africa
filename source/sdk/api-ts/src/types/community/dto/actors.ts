import { CommunityActorKind } from "#sdk/types/community/enums/actor-kind.ts";
import { CommunityActorStatus } from "#sdk/types/community/enums/actor-status.ts";

/** A visitor or member; a member's public profile. Members are not identities. */
export interface CommunityActors {
  accountId?: string | null;
  avatarId?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  displayName?: string | null;
  firstSeenAt: string;
  handle?: string | null;
  id: string;
  kind: CommunityActorKind;
  languageId?: string | null;
  lastSeenAt: string;
  status: CommunityActorStatus;
  updatedAt: string;
  version: number;
}
