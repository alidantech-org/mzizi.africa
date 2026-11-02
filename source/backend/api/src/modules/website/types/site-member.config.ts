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
  ISiteMember,
  SiteMemberKey,
  SiteMemberRelationKey,
  SiteMemberSortableField,
  SiteMemberFilterableField,
  SiteMemberDateRangeField,
  SiteMemberSelectableField,
  ISiteMemberAsOneRelationConfig,
  ISiteMemberAsManyRelationConfig
} from './site-member.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_MEMBER_RELATION_KEYS = ['site', ] as const satisfies readonly SiteMemberKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_MEMBER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteMemberKey[];

export const SITE_MEMBER_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteMemberKey[];

export const SITE_MEMBER_FILTERABLE_FIELDS = ['basis', 'familyId', 'id', 'methodId', 'siteId', 'version', ] as const satisfies readonly SiteMemberKey[];

export const SITE_MEMBER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteMemberKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_MEMBER_SELECTABLE_FIELDS = ['basis', 'createdAt', 'familyId', 'id', 'methodId', 'role', 'score', 'siteId', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SiteMemberKey[];

export const SITE_MEMBER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteMemberSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_MEMBER_EDITABLE_FIELDS = ['basis', 'familyId', 'methodId', 'role', 'score', 'siteId', 'validFrom', 'validTo', ] as const satisfies readonly SiteMemberKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_MEMBER_AS_ONE_RELATION_CONFIG = {
  relation: 'siteMember',
  type: ERelationType.One,
  selectableFields: SITE_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_MEMBER_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteMemberAsOneRelationConfig;

export const SITE_MEMBER_AS_MANY_RELATION_CONFIG = {
  relation: 'siteMembers',
  type: ERelationType.Many,
  selectableFields: SITE_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_MEMBER_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_MEMBER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteMemberAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_MEMBER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SiteMemberRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_MEMBER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_MEMBER_QUERY_OPTIONS = {
  searchableFields: SITE_MEMBER_SEARCHABLE_FIELDS,
  selectableFields: SITE_MEMBER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_MEMBER_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_MEMBER_SORTABLE_FIELDS,
  filterFields: SITE_MEMBER_FILTERABLE_FIELDS,
  dateRangeFields: SITE_MEMBER_DATE_RANGE_FIELDS,
  oneRelations: SITE_MEMBER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_MEMBER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteMember,
  SiteMemberSortableField,
  SiteMemberSelectableField,
  SiteMemberFilterableField,
  SiteMemberDateRangeField,
  SiteMemberRelationKey,
  typeof SITE_MEMBER_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_MEMBER_MANY_RELATION_QUERY_OPTIONS
>;