// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SiteConfig from '#/modules/website/types/site.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISiteFingerprint,
  SiteFingerprintKey,
  SiteFingerprintRelationKey,
  SiteFingerprintSortableField,
  SiteFingerprintFilterableField,
  SiteFingerprintDateRangeField,
  SiteFingerprintSelectableField,
  ISiteFingerprintAsOneRelationConfig,
  ISiteFingerprintAsManyRelationConfig
} from './site-fingerprint.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_FINGERPRINT_RELATION_KEYS = ['site', ] as const satisfies readonly SiteFingerprintKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_FINGERPRINT_SORTABLE_FIELDS = ['computedAt', 'createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteFingerprintKey[];

export const SITE_FINGERPRINT_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteFingerprintKey[];

export const SITE_FINGERPRINT_FILTERABLE_FIELDS = ['checkId', 'id', 'kind', 'siteId', 'version', ] as const satisfies readonly SiteFingerprintKey[];

export const SITE_FINGERPRINT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteFingerprintKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_FINGERPRINT_SELECTABLE_FIELDS = ['checkId', 'computedAt', 'createdAt', 'digest', 'features', 'id', 'kind', 'siteId', 'updatedAt', ] as const satisfies readonly SiteFingerprintKey[];

export const SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteFingerprintSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_FINGERPRINT_EDITABLE_FIELDS = ['checkId', 'computedAt', 'digest', 'features', 'kind', 'siteId', ] as const satisfies readonly SiteFingerprintKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_FINGERPRINT_AS_ONE_RELATION_CONFIG = {
  relation: 'siteFingerprint',
  type: ERelationType.One,
  selectableFields: SITE_FINGERPRINT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteFingerprintAsOneRelationConfig;

export const SITE_FINGERPRINT_AS_MANY_RELATION_CONFIG = {
  relation: 'siteFingerprints',
  type: ERelationType.Many,
  selectableFields: SITE_FINGERPRINT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_FINGERPRINT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteFingerprintAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_FINGERPRINT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SiteFingerprintRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_FINGERPRINT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_FINGERPRINT_QUERY_OPTIONS = {
  searchableFields: SITE_FINGERPRINT_SEARCHABLE_FIELDS,
  selectableFields: SITE_FINGERPRINT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_FINGERPRINT_SORTABLE_FIELDS,
  filterFields: SITE_FINGERPRINT_FILTERABLE_FIELDS,
  dateRangeFields: SITE_FINGERPRINT_DATE_RANGE_FIELDS,
  oneRelations: SITE_FINGERPRINT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_FINGERPRINT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteFingerprint,
  SiteFingerprintSortableField,
  SiteFingerprintSelectableField,
  SiteFingerprintFilterableField,
  SiteFingerprintDateRangeField,
  SiteFingerprintRelationKey,
  typeof SITE_FINGERPRINT_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_FINGERPRINT_MANY_RELATION_QUERY_OPTIONS
>;