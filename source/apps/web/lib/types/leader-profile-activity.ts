import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LeaderProfileActivityContributions } from "#/lib/types/leader-profile-activity-contributions.ts";
import { type LeaderProfileActivityRecent } from "#/lib/types/leader-profile-activity-recent.ts";
import { type LeaderProfileActivitySpeeches } from "#/lib/types/leader-profile-activity-speeches.ts";
import { type LeaderProfileActivityVotes } from "#/lib/types/leader-profile-activity-votes.ts";

/** Leader Profile Activity */
export interface LeaderProfileActivity {
  contributions: LeaderProfileActivityContributions;
  recent: LeaderProfileActivityRecent[];
  recorded: boolean;
  speeches: LeaderProfileActivitySpeeches[];
  votes: LeaderProfileActivityVotes;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivityFields: readonly FieldMeta[] = [
  { name: "contributions", label: "Contributions", kind: "other", required: true },
  { name: "recent", label: "Recent", kind: "other", required: true },
  { name: "recorded", label: "Recorded", kind: "boolean", required: true },
  { name: "speeches", label: "Speeches", kind: "other", required: true },
  { name: "votes", label: "Votes", kind: "other", required: true },
];
