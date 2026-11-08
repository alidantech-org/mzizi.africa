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
  ISiteSubject,
  SiteSubjectKey,
  SiteSubjectRelationKey,
  SiteSubjectSortableField,
  SiteSubjectFilterableField,
  SiteSubjectDateRangeField,
  SiteSubjectSelectableField,
  ISiteSubjectAsOneRelationConfig,
  ISiteSubjectAsManyRelationConfig
} from './site-subject.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_SUBJECT_RELATION_KEYS = ['site', ] as const satisfies readonly SiteSubjectKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_SUBJECT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteSubjectKey[];

export const SITE_SUBJECT_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteSubjectKey[];

export const SITE_SUBJECT_FILTERABLE_FIELDS = ['id', 'relation', 'siteId', 'targetId', 'targetKind', 'version', ] as const satisfies readonly SiteSubjectKey[];

export const SITE_SUBJECT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteSubjectKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_SUBJECT_SELECTABLE_FIELDS = ['createdAt', 'id', 'relation', 'siteId', 'targetId', 'targetKind', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SiteSubjectKey[];

export const SITE_SUBJECT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteSubjectSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_SUBJECT_EDITABLE_FIELDS = ['relation', 'siteId', 'targetId', 'targetKind', 'validFrom', 'validTo', ] as const satisfies readonly SiteSubjectKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_SUBJECT_AS_ONE_RELATION_CONFIG = {
  relation: 'siteSubject',
  type: ERelationType.One,
  selectableFields: SITE_SUBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_SUBJECT_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteSubjectAsOneRelationConfig;

export const SITE_SUBJECT_AS_MANY_RELATION_CONFIG = {
  relation: 'siteSubjects',
  type: ERelationType.Many,
  selectableFields: SITE_SUBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_SUBJECT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_SUBJECT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteSubjectAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_SUBJECT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SiteSubjectRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_SUBJECT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_SUBJECT_QUERY_OPTIONS = {
  searchableFields: SITE_SUBJECT_SEARCHABLE_FIELDS,
  selectableFields: SITE_SUBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_SUBJECT_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_SUBJECT_SORTABLE_FIELDS,
  filterFields: SITE_SUBJECT_FILTERABLE_FIELDS,
  dateRangeFields: SITE_SUBJECT_DATE_RANGE_FIELDS,
  oneRelations: SITE_SUBJECT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_SUBJECT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteSubject,
  SiteSubjectSortableField,
  SiteSubjectSelectableField,
  SiteSubjectFilterableField,
  SiteSubjectDateRangeField,
  SiteSubjectRelationKey,
  typeof SITE_SUBJECT_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_SUBJECT_MANY_RELATION_QUERY_OPTIONS
>;