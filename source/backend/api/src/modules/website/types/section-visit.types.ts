// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SECTION_VISIT_RELATION_KEYS,
  SECTION_VISIT_SORTABLE_FIELDS,
  SECTION_VISIT_SEARCHABLE_FIELDS,
  SECTION_VISIT_FILTERABLE_FIELDS,
  SECTION_VISIT_DATE_RANGE_FIELDS,
  SECTION_VISIT_SELECTABLE_FIELDS,
  SECTION_VISIT_DEFAULT_SELECT_FIELDS,
  SECTION_VISIT_EDITABLE_FIELDS
} from './section-visit.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Section Visit */
export interface ISectionVisit extends B.IBase {
  depth: number;
  itemsFound: number;
  pageUrl: string | null;
  ruleIndex: number | null;
  sectionLabel: string;
  siteId: string;
  structureVersionId: string | null;
  visitedAt: Date;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SectionVisitKey = keyof ISectionVisit;

export type SectionVisitRelationKey = (typeof SECTION_VISIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISectionVisitReadonlyFields = B.IBaseReadonlyFields;

export type ISectionVisitContextualFields = never;

export type ISectionVisitSensitiveFields = never;

export type ISectionVisitTransitionFields = never;

export type ISectionVisitImmutableFields =
  | ISectionVisitReadonlyFields
  | ISectionVisitContextualFields
  | ISectionVisitSensitiveFields
  | ISectionVisitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISectionVisitCreatable = Omit<ISectionVisit, ISectionVisitImmutableFields | SectionVisitRelationKey>;

export type ISectionVisitSystemWritable = Omit<ISectionVisit, B.IBaseReadonlyFields | SectionVisitRelationKey>;

export type ISectionVisitUpdatable = Partial<Omit<ISectionVisit, ISectionVisitImmutableFields | SectionVisitRelationKey>>;

export interface ISectionVisitTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SectionVisitSortableField = (typeof SECTION_VISIT_SORTABLE_FIELDS)[number];

export type SectionVisitSearchableField = (typeof SECTION_VISIT_SEARCHABLE_FIELDS)[number];

export type SectionVisitFilterableField = (typeof SECTION_VISIT_FILTERABLE_FIELDS)[number];

export type SectionVisitDateRangeField = (typeof SECTION_VISIT_DATE_RANGE_FIELDS)[number];

export type SectionVisitSelectableField = (typeof SECTION_VISIT_SELECTABLE_FIELDS)[number];

export type SectionVisitDefaultSelectField = (typeof SECTION_VISIT_DEFAULT_SELECT_FIELDS)[number];

export type SectionVisitEditableField = (typeof SECTION_VISIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISectionVisitAsOneRelationConfig = Q.IOneRelationConfig<'sectionVisit', SectionVisitSelectableField>;

export type ISectionVisitAsManyRelationConfig = Q.IManyRelationConfig<'sectionVisits', SectionVisitSelectableField, SectionVisitSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISectionVisitAsOneRelationQuery = Q.IAsOneRelationQuery<ISectionVisit, SectionVisitSelectableField>;

export type ISectionVisitAsManyRelationQuery = Q.IAsManyRelationQuery<ISectionVisit, SectionVisitSelectableField, SectionVisitSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISectionVisitRelationMap extends Record<SectionVisitRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISectionVisitRelationQueries = Q.IBaseRelationQueries<ISectionVisit, SectionVisitRelationKey, ISectionVisitRelationMap>;

export type ISectionVisitItemQuery = Q.IBaseItemQuery<
  ISectionVisit,
  SectionVisitRelationKey,
  SectionVisitSelectableField,
  SectionVisitRelationKey,
  SectionVisitSelectableField,
  ISectionVisitRelationMap,
  ISectionVisitRelationQueries
>;

export type ISectionVisitListQuery = Q.IBaseListQuery<
  ISectionVisit,
  SectionVisitRelationKey,
  SectionVisitSelectableField,
  SectionVisitSortableField,
  SectionVisitRelationKey,
  SectionVisitSelectableField,
  SectionVisitSortableField,
  SectionVisitDateRangeField,
  SectionVisitFilterableField,
  ISectionVisitRelationMap,
  ISectionVisitRelationQueries,
  ISectionVisitItemQuery
>;