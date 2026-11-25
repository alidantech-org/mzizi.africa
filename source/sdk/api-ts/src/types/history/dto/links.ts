import { HistoryLinkKind } from "#sdk/types/history/enums/link-kind.ts";

/** How historical occurrences relate to one another. */
export interface HistoryLinks {
  createdAt: string;
  deletedAt?: string | null;
  fromId: string;
  id: string;
  kind: HistoryLinkKind;
  toId: string;
}
