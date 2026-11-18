import type { ResearchArtifactRef } from "#sdk/types/research/artifact-ref.ts";

/** Artifact Metadata */
export interface ResearchArtifactMetadata {
  artifact: ResearchArtifactRef;
  derived_from: string[];
  media_type: string;
  size: number;
  source_url: string | null;
  stage: string;
}
