import { ScriptsLanguage } from "#sdk/types/enums/scripts/language.ts";
import type { ResearchArtifactRef } from "#sdk/types/research/artifact-ref.ts";

/** Script Request */
export interface ScriptsScriptRequest {
  inputs?: ResearchArtifactRef[];
  language: ScriptsLanguage;
  script: string;
  timeout_seconds?: number;
}
