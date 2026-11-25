"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { LegalEffectCollection } from "#sdk/types/legal/dto/effect-collection.ts";
import type { LegalIdentityEffects } from "#sdk/types/legal/dto/identity-effects.ts";
import type { LegalInstrumentCollection } from "#sdk/types/legal/dto/instrument-collection.ts";
import type { LegalInstrumentDetail } from "#sdk/types/legal/dto/instrument-detail.ts";
import type { LegalInstrumentWindow } from "#sdk/types/legal/dto/instrument-window.ts";
import type { LegalProvisionCollection } from "#sdk/types/legal/dto/provision-collection.ts";
import type { LegalProvisionScope } from "#sdk/types/legal/dto/provision-scope.ts";
/** GET /v1/legal/instruments/{code} */
export type LegalGetInstrumentActionInput = ActionInput<{ code: string }, never, never>;

export async function legalGetInstrument(input: LegalGetInstrumentActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.legal.getInstrument(input.params);
  return api.get<LegalInstrumentDetail>(path, options);
}
/** GET /v1/legal/effects */
export type LegalListEffectsActionInput = ActionInput<never, LegalIdentityEffects, never>;

export async function legalListEffects(input: LegalListEffectsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.legal.listEffects;
  return api.get<LegalEffectCollection>(path, options);
}
/** GET /v1/legal/instruments */
export type LegalListInstrumentsActionInput = ActionInput<never, LegalInstrumentWindow, never>;

export async function legalListInstruments(input: LegalListInstrumentsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.legal.listInstruments;
  return api.get<LegalInstrumentCollection>(path, options);
}
/** GET /v1/legal/provisions */
export type LegalListProvisionsActionInput = ActionInput<never, LegalProvisionScope, never>;

export async function legalListProvisions(input: LegalListProvisionsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.legal.listProvisions;
  return api.get<LegalProvisionCollection>(path, options);
}
