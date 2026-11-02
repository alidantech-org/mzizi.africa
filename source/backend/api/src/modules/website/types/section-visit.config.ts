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
  ISectionVisit,
  SectionVisitKey,
  SectionVisitRelationKey,
  SectionVisitSortableField,
  SectionVisitFilterableField,
  SectionVisitDateRangeField,
  SectionVisitSelectableField,
  ISectionVisitAsOneRelationConfig,
  ISectionVisitAsManyRelationConfig
} from './section-visit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SECTION_VISIT_RELATION_KEYS = ['site', ] as const satisfies readonly SectionVisitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SECTION_VISIT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', 'visitedAt', ] as const satisfies readonly SectionVisitKey[];

export const SECTION_VISIT_SEARCHABLE_FIELDS = [] as const satisfies readonly SectionVisitKey[];

export const SECTION_VISIT_FILTERABLE_FIELDS = ['id', 'sectionLabel', 'siteId', 'structureVersionId', 'version', ] as const satisfies readonly SectionVisitKey[];

export const SECTION_VISIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'visitedAt', ] as const satisfies readonly SectionVisitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SECTION_VISIT_SELECTABLE_FIELDS = ['createdAt', 'depth', 'id', 'itemsFound', 'pageUrl', 'ruleIndex', 'sectionLabel', 'siteId', 'structureVersionId', 'updatedAt', 'visitedAt', ] as const satisfies readonly SectionVisitKey[];

export const SECTION_VISIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SectionVisitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SECTION_VISIT_EDITABLE_FIELDS = ['depth', 'itemsFound', 'pageUrl', 'ruleIndex', 'sectionLabel', 'siteId', 'structureVersionId', 'visitedAt', ] as const satisfies readonly SectionVisitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SECTION_VISIT_AS_ONE_RELATION_CONFIG = {
  relation: 'sectionVisit',
  type: ERelationType.One,
  selectableFields: SECTION_VISIT_SELECTABLE_FIELDS,
  defaultSelectFields: SECTION_VISIT_DEFAULT_SELECT_FIELDS
} as const satisfies ISectionVisitAsOneRelationConfig;

export const SECTION_VISIT_AS_MANY_RELATION_CONFIG = {
  relation: 'sectionVisits',
  type: ERelationType.Many,
  selectableFields: SECTION_VISIT_SELECTABLE_FIELDS,
  defaultSelectFields: SECTION_VISIT_DEFAULT_SELECT_FIELDS,
  sortableFields: SECTION_VISIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISectionVisitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SECTION_VISIT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SectionVisitRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SECTION_VISIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SECTION_VISIT_QUERY_OPTIONS = {
  searchableFields: SECTION_VISIT_SEARCHABLE_FIELDS,
  selectableFields: SECTION_VISIT_SELECTABLE_FIELDS,
  defaultSelectFields: SECTION_VISIT_DEFAULT_SELECT_FIELDS,
  sortableFields: SECTION_VISIT_SORTABLE_FIELDS,
  filterFields: SECTION_VISIT_FILTERABLE_FIELDS,
  dateRangeFields: SECTION_VISIT_DATE_RANGE_FIELDS,
  oneRelations: SECTION_VISIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SECTION_VISIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISectionVisit,
  SectionVisitSortableField,
  SectionVisitSelectableField,
  SectionVisitFilterableField,
  SectionVisitDateRangeField,
  SectionVisitRelationKey,
  typeof SECTION_VISIT_ONE_RELATION_QUERY_OPTIONS,
  typeof SECTION_VISIT_MANY_RELATION_QUERY_OPTIONS
>;