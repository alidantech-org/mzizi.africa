"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { PoliticsCommitmentCollection } from "#sdk/types/politics/dto/commitment-collection.ts";
import type { PoliticsCountryParties } from "#sdk/types/politics/dto/country-parties.ts";
import type { PoliticsMakerCommitments } from "#sdk/types/politics/dto/maker-commitments.ts";
import type { PoliticsPartyCollection } from "#sdk/types/politics/dto/party-collection.ts";
import type { PoliticsPartyDetail } from "#sdk/types/politics/dto/party-detail.ts";
/** GET /v1/politics/parties/{code} */
export type PoliticsGetPartyActionInput = ActionInput<{ code: string }, never, never>;

export async function politicsGetParty(input: PoliticsGetPartyActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.politics.getParty(input.params);
  return api.get<PoliticsPartyDetail>(path, options);
}
/** GET /v1/politics/commitments */
export type PoliticsListCommitmentsActionInput = ActionInput<
  never,
  PoliticsMakerCommitments,
  never
>;

export async function politicsListCommitments(input: PoliticsListCommitmentsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.politics.listCommitments;
  return api.get<PoliticsCommitmentCollection>(path, options);
}
/** GET /v1/politics/parties */
export type PoliticsListPartiesActionInput = ActionInput<never, PoliticsCountryParties, never>;

export async function politicsListParties(input: PoliticsListPartiesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.politics.listParties;
  return api.get<PoliticsPartyCollection>(path, options);
}
