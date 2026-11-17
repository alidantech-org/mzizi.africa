
import type { FeatureEntryNames } from './feature-entry-names';

/** Feature Entry */
export interface FeatureEntry {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: FeatureEntryNames[];
  validFrom: string | null;
  validUntil: string | null;
}