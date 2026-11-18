"use server";

/**
 * One capture: where it came from, its hash and where the raw bytes are stored.
 *
 * GET /v1/captures/{captureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StagingCapture } from "#sdk/types/staging/capture.ts";

export type GetCaptureInput = ActionInput<{ captureId: string }, never, never>;

export async function getCapture(input: GetCaptureInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/captures/${input.params.captureId}`;
  return api.get<StagingCapture>(path, options);
}
