"use server";

/**
 * Find one classification member from its code (codes are unique across every scheme).
 *
 * GET /v1/reference/lookup
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ReferenceFoundMember } from "#sdk/types/reference/found-member.ts";
import type { ReferenceMemberKey } from "#sdk/types/reference/member-key.ts";

export type LookupMemberInput = ActionInput<never, ReferenceMemberKey, never>;

export async function lookupMember(input: LookupMemberInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/reference/lookup";
  return api.get<ReferenceFoundMember>(path, options);
}
