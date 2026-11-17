'use server';

/**
 * Browse geographic features with their names, optionally of one type or by code prefix.
 *
 * GET /v1/geography/features
 */

import {
  api,
  type ActionInput,
  requestOptions,
} from '../../helpers';
import type { FeatureCollection } from './../../types/feature-collection';
import type { FeatureWindow } from './../../types/feature-window';

export type BrowseFeaturesInput = ActionInput<never, FeatureWindow, never>;

export async function browseFeatures(input: BrowseFeaturesInput = {}) {
  const options = requestOptions(
    input.options,
    input.query,
    false,
  );
  const path = '/v1/geography/features';
  return api.get<FeatureCollection>(path, options);
}