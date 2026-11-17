'use server';

/**
 * What the engine can run.
 *
 * GET /capabilities
 */

import {
  api,
  type ActionInput,
  requestOptions,
} from '../../helpers';
import type { CapabilityList } from './../../types/capability-list';

export type ListCapabilitiesInput = ActionInput<never, never, never>;

export async function listCapabilities(input: ListCapabilitiesInput = {}) {
  const options = requestOptions(
    input.options,
    undefined,
    false,
  );
  const path = '/capabilities';
  return api.get<CapabilityList>(path, options);
}