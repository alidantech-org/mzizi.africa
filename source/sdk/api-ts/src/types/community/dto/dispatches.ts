import { CommunityDispatchState } from "#sdk/types/community/enums/dispatch-state.ts";

/** One sending of a notification to one device; partitioned by month. */
export interface CommunityDispatches {
  createdAt: string;
  deviceId: string;
  id: string;
  notificationCreatedAt: string;
  notificationId: string;
  openedAt?: string | null;
  sentAt?: string | null;
  state: CommunityDispatchState;
  subscriptionId: string;
}
