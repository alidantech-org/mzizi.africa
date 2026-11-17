
import type { FeatureDetailNames } from './feature-detail-names';

/** Feature Detail */
export interface FeatureDetail {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: FeatureDetailNames[];
  validFrom: string | null;
  validUntil: string | null;
}