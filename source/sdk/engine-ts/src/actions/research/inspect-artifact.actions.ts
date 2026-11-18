"use server";

/**
 * Verify the bytes at an exact artifact reference and return their provenance.
 *
 * POST /v1/research/inspect
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ResearchArtifactMetadata } from "#sdk/types/research/artifact-metadata.ts";
import type { ResearchArtifactRef } from "#sdk/types/research/artifact-ref.ts";

export type InspectArtifactInput = ActionInput<never, never, ResearchArtifactRef>;

export async function inspectArtifact(input: InspectArtifactInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/research/inspect";
  return api.post<ResearchArtifactMetadata>(path, input.body, options);
}
