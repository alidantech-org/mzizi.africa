// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISiteFamily,
  SiteFamilyKey,
  SiteFamilyRelationKey,
  SiteFamilySortableField,
  SiteFamilyFilterableField,
  SiteFamilyDateRangeField,
  SiteFamilySelectableField,
  ISiteFamilyAsOneRelationConfig,
  ISiteFamilyAsManyRelationConfig
} from './site-family.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_FAMILY_RELATION_KEYS = [] as const satisfies readonly SiteFamilyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_FAMILY_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly SiteFamilyKey[];

export const SITE_FAMILY_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly SiteFamilyKey[];

export const SITE_FAMILY_FILTERABLE_FIELDS = ['code', 'id', 'jurisdictionId', 'kind', 'name', 'status', 'subjectKindId', 'version', ] as const satisfies readonly SiteFamilyKey[];

export const SITE_FAMILY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteFamilyKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_FAMILY_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'id', 'jurisdictionId', 'kind', 'name', 'status', 'subjectKindId', 'updatedAt', ] as const satisfies readonly SiteFamilyKey[];

export const SITE_FAMILY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteFamilySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_FAMILY_EDITABLE_FIELDS = ['code', 'description', 'jurisdictionId', 'kind', 'name', 'status', 'subjectKindId', ] as const satisfies readonly SiteFamilyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_FAMILY_AS_ONE_RELATION_CONFIG = {
  relation: 'siteFamily',
  type: ERelationType.One,
  selectableFields: SITE_FAMILY_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FAMILY_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteFamilyAsOneRelationConfig;

export const SITE_FAMILY_AS_MANY_RELATION_CONFIG = {
  relation: 'siteFamilys',
  type: ERelationType.Many,
  selectableFields: SITE_FAMILY_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FAMILY_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_FAMILY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteFamilyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_FAMILY_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const SITE_FAMILY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_FAMILY_QUERY_OPTIONS = {
  searchableFields: SITE_FAMILY_SEARCHABLE_FIELDS,
  selectableFields: SITE_FAMILY_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_FAMILY_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_FAMILY_SORTABLE_FIELDS,
  filterFields: SITE_FAMILY_FILTERABLE_FIELDS,
  dateRangeFields: SITE_FAMILY_DATE_RANGE_FIELDS,
  oneRelations: SITE_FAMILY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_FAMILY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteFamily,
  SiteFamilySortableField,
  SiteFamilySelectableField,
  SiteFamilyFilterableField,
  SiteFamilyDateRangeField,
  SiteFamilyRelationKey,
  typeof SITE_FAMILY_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_FAMILY_MANY_RELATION_QUERY_OPTIONS
>;