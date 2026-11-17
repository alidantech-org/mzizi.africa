"use server";

/**
 * Page through the members of one scheme, including superseded members.
 *
 * GET /v1/reference/values
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ReferenceMemberCollection } from "#sdk/types/reference/member-collection.ts";
import type { ReferenceMemberWindow } from "#sdk/types/reference/member-window.ts";

export type BrowseSchemeMembersInput = ActionInput<never, ReferenceMemberWindow, never>;

export async function browseSchemeMembers(input: BrowseSchemeMembersInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/reference/values";
  return api.get<ReferenceMemberCollection>(path, options);
}
