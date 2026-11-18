import type { ExperienceFactRow } from "#sdk/types/experience/fact-row.ts";

/** Fact List */
export interface ExperienceFactList {
  facts: ExperienceFactRow[];
  gaps: string[];
}
