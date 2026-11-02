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
  ISiteTrait,
  SiteTraitKey,
  SiteTraitRelationKey,
  SiteTraitSortableField,
  SiteTraitFilterableField,
  SiteTraitDateRangeField,
  SiteTraitSelectableField,
  ISiteTraitAsOneRelationConfig,
  ISiteTraitAsManyRelationConfig
} from './site-trait.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_TRAIT_RELATION_KEYS = [] as const satisfies readonly SiteTraitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_TRAIT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteTraitKey[];

export const SITE_TRAIT_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteTraitKey[];

export const SITE_TRAIT_FILTERABLE_FIELDS = ['id', 'methodId', 'ownerId', 'ownerKind', 'tag', 'version', ] as const satisfies readonly SiteTraitKey[];

export const SITE_TRAIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteTraitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_TRAIT_SELECTABLE_FIELDS = ['createdAt', 'id', 'methodId', 'observedAt', 'ownerId', 'ownerKind', 'score', 'tag', 'updatedAt', ] as const satisfies readonly SiteTraitKey[];

export const SITE_TRAIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteTraitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_TRAIT_EDITABLE_FIELDS = ['methodId', 'observedAt', 'ownerId', 'ownerKind', 'score', 'tag', ] as const satisfies readonly SiteTraitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_TRAIT_AS_ONE_RELATION_CONFIG = {
  relation: 'siteTrait',
  type: ERelationType.One,
  selectableFields: SITE_TRAIT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_TRAIT_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteTraitAsOneRelationConfig;

export const SITE_TRAIT_AS_MANY_RELATION_CONFIG = {
  relation: 'siteTraits',
  type: ERelationType.Many,
  selectableFields: SITE_TRAIT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_TRAIT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_TRAIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteTraitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_TRAIT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const SITE_TRAIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_TRAIT_QUERY_OPTIONS = {
  searchableFields: SITE_TRAIT_SEARCHABLE_FIELDS,
  selectableFields: SITE_TRAIT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_TRAIT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_TRAIT_SORTABLE_FIELDS,
  filterFields: SITE_TRAIT_FILTERABLE_FIELDS,
  dateRangeFields: SITE_TRAIT_DATE_RANGE_FIELDS,
  oneRelations: SITE_TRAIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_TRAIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteTrait,
  SiteTraitSortableField,
  SiteTraitSelectableField,
  SiteTraitFilterableField,
  SiteTraitDateRangeField,
  SiteTraitRelationKey,
  typeof SITE_TRAIT_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_TRAIT_MANY_RELATION_QUERY_OPTIONS
>;