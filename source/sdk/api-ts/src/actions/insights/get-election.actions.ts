"use server";

/**
 * One election: its contests, and results by unit under a parent, for tables and heat maps.
 *
 * GET /v1/elections/{electionId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsElectionDetail } from "#sdk/types/insights/election-detail.ts";

export type GetElectionInput = ActionInput<
  { electionId: string },
  { parentFeatureId?: string; contestKind?: string },
  never
>;

export async function getElection(input: GetElectionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/elections/${input.params.electionId}`;
  return api.get<InsightsElectionDetail>(path, options);
}
