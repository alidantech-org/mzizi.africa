// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { SubjectRelation } from '#/types/website/subject-relation.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_SUBJECT_RELATION_KEYS,
  SITE_SUBJECT_SORTABLE_FIELDS,
  SITE_SUBJECT_SEARCHABLE_FIELDS,
  SITE_SUBJECT_FILTERABLE_FIELDS,
  SITE_SUBJECT_DATE_RANGE_FIELDS,
  SITE_SUBJECT_SELECTABLE_FIELDS,
  SITE_SUBJECT_DEFAULT_SELECT_FIELDS,
  SITE_SUBJECT_EDITABLE_FIELDS
} from './site-subject.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Subject */
export interface ISiteSubject extends B.IBase {
  relation: SubjectRelation;
  siteId: string;
  targetId: string;
  targetKind: string;
  validFrom: Date | null;
  validTo: Date | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteSubjectKey = keyof ISiteSubject;

export type SiteSubjectRelationKey = (typeof SITE_SUBJECT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteSubjectReadonlyFields = B.IBaseReadonlyFields;

export type ISiteSubjectContextualFields = never;

export type ISiteSubjectSensitiveFields = never;

export type ISiteSubjectTransitionFields = never;

export type ISiteSubjectImmutableFields =
  | ISiteSubjectReadonlyFields
  | ISiteSubjectContextualFields
  | ISiteSubjectSensitiveFields
  | ISiteSubjectTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteSubjectCreatable = Omit<ISiteSubject, ISiteSubjectImmutableFields | SiteSubjectRelationKey>;

export type ISiteSubjectSystemWritable = Omit<ISiteSubject, B.IBaseReadonlyFields | SiteSubjectRelationKey>;

export type ISiteSubjectUpdatable = Partial<Omit<ISiteSubject, ISiteSubjectImmutableFields | SiteSubjectRelationKey>>;

export interface ISiteSubjectTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteSubjectSortableField = (typeof SITE_SUBJECT_SORTABLE_FIELDS)[number];

export type SiteSubjectSearchableField = (typeof SITE_SUBJECT_SEARCHABLE_FIELDS)[number];

export type SiteSubjectFilterableField = (typeof SITE_SUBJECT_FILTERABLE_FIELDS)[number];

export type SiteSubjectDateRangeField = (typeof SITE_SUBJECT_DATE_RANGE_FIELDS)[number];

export type SiteSubjectSelectableField = (typeof SITE_SUBJECT_SELECTABLE_FIELDS)[number];

export type SiteSubjectDefaultSelectField = (typeof SITE_SUBJECT_DEFAULT_SELECT_FIELDS)[number];

export type SiteSubjectEditableField = (typeof SITE_SUBJECT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteSubjectAsOneRelationConfig = Q.IOneRelationConfig<'siteSubject', SiteSubjectSelectableField>;

export type ISiteSubjectAsManyRelationConfig = Q.IManyRelationConfig<'siteSubjects', SiteSubjectSelectableField, SiteSubjectSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteSubjectAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteSubject, SiteSubjectSelectableField>;

export type ISiteSubjectAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteSubject, SiteSubjectSelectableField, SiteSubjectSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteSubjectRelationMap extends Record<SiteSubjectRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteSubjectRelationQueries = Q.IBaseRelationQueries<ISiteSubject, SiteSubjectRelationKey, ISiteSubjectRelationMap>;

export type ISiteSubjectItemQuery = Q.IBaseItemQuery<
  ISiteSubject,
  SiteSubjectRelationKey,
  SiteSubjectSelectableField,
  SiteSubjectRelationKey,
  SiteSubjectSelectableField,
  ISiteSubjectRelationMap,
  ISiteSubjectRelationQueries
>;

export type ISiteSubjectListQuery = Q.IBaseListQuery<
  ISiteSubject,
  SiteSubjectRelationKey,
  SiteSubjectSelectableField,
  SiteSubjectSortableField,
  SiteSubjectRelationKey,
  SiteSubjectSelectableField,
  SiteSubjectSortableField,
  SiteSubjectDateRangeField,
  SiteSubjectFilterableField,
  ISiteSubjectRelationMap,
  ISiteSubjectRelationQueries,
  ISiteSubjectItemQuery
>;