"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ReferenceFoundMember } from "#sdk/types/reference/dto/found-member.ts";
import type { ReferenceMemberCollection } from "#sdk/types/reference/dto/member-collection.ts";
import type { ReferenceMemberKey } from "#sdk/types/reference/dto/member-key.ts";
import type { ReferenceMemberWindow } from "#sdk/types/reference/dto/member-window.ts";
import type { ReferenceSchemeCollection } from "#sdk/types/reference/dto/scheme-collection.ts";
import type { ReferenceSchemeWindow } from "#sdk/types/reference/dto/scheme-window.ts";
/** GET /v1/reference/values */
export type ReferenceBrowseSchemeMembersActionInput = ActionInput<
  never,
  ReferenceMemberWindow,
  never
>;

export async function referenceBrowseSchemeMembers(input: ReferenceBrowseSchemeMembersActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.browseSchemeMembers;
  return api.get<ReferenceMemberCollection>(path, options);
}
/** GET /v1/reference/schemes */
export type ReferenceBrowseSchemesActionInput = ActionInput<never, ReferenceSchemeWindow, never>;

export async function referenceBrowseSchemes(input: ReferenceBrowseSchemesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.browseSchemes;
  return api.get<ReferenceSchemeCollection>(path, options);
}
/** GET /v1/reference/lookup */
export type ReferenceLookupMemberActionInput = ActionInput<never, ReferenceMemberKey, never>;

export async function referenceLookupMember(input: ReferenceLookupMemberActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.lookupMember;
  return api.get<ReferenceFoundMember>(path, options);
}
