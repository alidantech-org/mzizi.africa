import type { ExperienceFactRow } from "#sdk/types/experience/dto/fact-row.ts";

/** Fact List */
export interface ExperienceFactList {
  facts: ExperienceFactRow[];
  gaps: string[];
}
