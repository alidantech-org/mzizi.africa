"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { LegislatureBillCollection } from "#sdk/types/legislature/dto/bill-collection.ts";
import type { LegislatureBillDetail } from "#sdk/types/legislature/dto/bill-detail.ts";
import type { LegislatureBillWindow } from "#sdk/types/legislature/dto/bill-window.ts";
import type { LegislatureMotionVotes } from "#sdk/types/legislature/dto/motion-votes.ts";
import type { LegislatureVoteCollection } from "#sdk/types/legislature/dto/vote-collection.ts";
/** GET /v1/legislature/bills/{code} */
export type LegislatureGetBillActionInput = ActionInput<{ code: string }, never, never>;

export async function legislatureGetBill(input: LegislatureGetBillActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.legislature.getBill(input.params);
  return api.get<LegislatureBillDetail>(path, options);
}
/** GET /v1/legislature/bills */
export type LegislatureListBillsActionInput = ActionInput<never, LegislatureBillWindow, never>;

export async function legislatureListBills(input: LegislatureListBillsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.legislature.listBills;
  return api.get<LegislatureBillCollection>(path, options);
}
/** GET /v1/legislature/votes */
export type LegislatureListVotesActionInput = ActionInput<never, LegislatureMotionVotes, never>;

export async function legislatureListVotes(input: LegislatureListVotesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.legislature.listVotes;
  return api.get<LegislatureVoteCollection>(path, options);
}
