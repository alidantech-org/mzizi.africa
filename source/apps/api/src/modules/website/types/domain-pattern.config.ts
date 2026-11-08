// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SiteFamilyConfig from '#/modules/website/types/site-family.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDomainPattern,
  DomainPatternKey,
  DomainPatternRelationKey,
  DomainPatternSortableField,
  DomainPatternFilterableField,
  DomainPatternDateRangeField,
  DomainPatternSelectableField,
  IDomainPatternAsOneRelationConfig,
  IDomainPatternAsManyRelationConfig
} from './domain-pattern.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOMAIN_PATTERN_RELATION_KEYS = ['siteFamily', ] as const satisfies readonly DomainPatternKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOMAIN_PATTERN_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly DomainPatternKey[];

export const DOMAIN_PATTERN_SEARCHABLE_FIELDS = [] as const satisfies readonly DomainPatternKey[];

export const DOMAIN_PATTERN_FILTERABLE_FIELDS = ['familyId', 'id', 'status', 'template', 'version', ] as const satisfies readonly DomainPatternKey[];

export const DOMAIN_PATTERN_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly DomainPatternKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOMAIN_PATTERN_SELECTABLE_FIELDS = ['createdAt', 'domainRole', 'familyId', 'id', 'notes', 'scheme', 'status', 'template', 'updatedAt', 'variables', ] as const satisfies readonly DomainPatternKey[];

export const DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DomainPatternSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOMAIN_PATTERN_EDITABLE_FIELDS = ['domainRole', 'familyId', 'notes', 'scheme', 'status', 'template', 'variables', ] as const satisfies readonly DomainPatternKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOMAIN_PATTERN_AS_ONE_RELATION_CONFIG = {
  relation: 'domainPattern',
  type: ERelationType.One,
  selectableFields: DOMAIN_PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS
} as const satisfies IDomainPatternAsOneRelationConfig;

export const DOMAIN_PATTERN_AS_MANY_RELATION_CONFIG = {
  relation: 'domainPatterns',
  type: ERelationType.Many,
  selectableFields: DOMAIN_PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAIN_PATTERN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDomainPatternAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOMAIN_PATTERN_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DomainPatternRelationKey>().one(SiteFamilyConfig.SITE_FAMILY_AS_ONE_RELATION_CONFIG, 'siteFamily'),
] as const;

export const DOMAIN_PATTERN_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOMAIN_PATTERN_QUERY_OPTIONS = {
  searchableFields: DOMAIN_PATTERN_SEARCHABLE_FIELDS,
  selectableFields: DOMAIN_PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAIN_PATTERN_SORTABLE_FIELDS,
  filterFields: DOMAIN_PATTERN_FILTERABLE_FIELDS,
  dateRangeFields: DOMAIN_PATTERN_DATE_RANGE_FIELDS,
  oneRelations: DOMAIN_PATTERN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOMAIN_PATTERN_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDomainPattern,
  DomainPatternSortableField,
  DomainPatternSelectableField,
  DomainPatternFilterableField,
  DomainPatternDateRangeField,
  DomainPatternRelationKey,
  typeof DOMAIN_PATTERN_ONE_RELATION_QUERY_OPTIONS,
  typeof DOMAIN_PATTERN_MANY_RELATION_QUERY_OPTIONS
>;