"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ElectionCountryElections } from "#sdk/types/election/dto/country-elections.ts";
import type { ElectionElectionCollection } from "#sdk/types/election/dto/election-collection.ts";
import type { ElectionElectionDetail } from "#sdk/types/election/dto/election-detail.ts";
import type { ElectionPlaceTallies } from "#sdk/types/election/dto/place-tallies.ts";
import type { ElectionTallyCollection } from "#sdk/types/election/dto/tally-collection.ts";
/** GET /v1/election/elections/{code} */
export type ElectionGetElectionActionInput = ActionInput<{ code: string }, never, never>;

export async function electionGetElection(input: ElectionGetElectionActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.election.getElection(input.params);
  return api.get<ElectionElectionDetail>(path, options);
}
/** GET /v1/election/elections */
export type ElectionListElectionsActionInput = ActionInput<never, ElectionCountryElections, never>;

export async function electionListElections(input: ElectionListElectionsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.election.listElections;
  return api.get<ElectionElectionCollection>(path, options);
}
/** GET /v1/election/tallies */
export type ElectionListTalliesActionInput = ActionInput<never, ElectionPlaceTallies, never>;

export async function electionListTallies(input: ElectionListTalliesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.election.listTallies;
  return api.get<ElectionTallyCollection>(path, options);
}
