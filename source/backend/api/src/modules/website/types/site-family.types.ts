// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FamilyKind } from '#/types/website/family-kind.enum';
import type { FamilyStatus } from '#/types/website/family-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_FAMILY_RELATION_KEYS,
  SITE_FAMILY_SORTABLE_FIELDS,
  SITE_FAMILY_SEARCHABLE_FIELDS,
  SITE_FAMILY_FILTERABLE_FIELDS,
  SITE_FAMILY_DATE_RANGE_FIELDS,
  SITE_FAMILY_SELECTABLE_FIELDS,
  SITE_FAMILY_DEFAULT_SELECT_FIELDS,
  SITE_FAMILY_EDITABLE_FIELDS
} from './site-family.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Family */
export interface ISiteFamily extends B.IBase {
  code: string;
  description: string | null;
  jurisdictionId: string | null;
  kind: FamilyKind;
  name: string;
  status: FamilyStatus;
  subjectKindId: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteFamilyKey = keyof ISiteFamily;

export type SiteFamilyRelationKey = (typeof SITE_FAMILY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteFamilyReadonlyFields = B.IBaseReadonlyFields;

export type ISiteFamilyContextualFields = never;

export type ISiteFamilySensitiveFields = never;

export type ISiteFamilyTransitionFields = never;

export type ISiteFamilyImmutableFields =
  | ISiteFamilyReadonlyFields
  | ISiteFamilyContextualFields
  | ISiteFamilySensitiveFields
  | ISiteFamilyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteFamilyCreatable = Omit<ISiteFamily, ISiteFamilyImmutableFields | SiteFamilyRelationKey>;

export type ISiteFamilySystemWritable = Omit<ISiteFamily, B.IBaseReadonlyFields | SiteFamilyRelationKey>;

export type ISiteFamilyUpdatable = Partial<Omit<ISiteFamily, ISiteFamilyImmutableFields | SiteFamilyRelationKey>>;

export interface ISiteFamilyTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteFamilySortableField = (typeof SITE_FAMILY_SORTABLE_FIELDS)[number];

export type SiteFamilySearchableField = (typeof SITE_FAMILY_SEARCHABLE_FIELDS)[number];

export type SiteFamilyFilterableField = (typeof SITE_FAMILY_FILTERABLE_FIELDS)[number];

export type SiteFamilyDateRangeField = (typeof SITE_FAMILY_DATE_RANGE_FIELDS)[number];

export type SiteFamilySelectableField = (typeof SITE_FAMILY_SELECTABLE_FIELDS)[number];

export type SiteFamilyDefaultSelectField = (typeof SITE_FAMILY_DEFAULT_SELECT_FIELDS)[number];

export type SiteFamilyEditableField = (typeof SITE_FAMILY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteFamilyAsOneRelationConfig = Q.IOneRelationConfig<'siteFamily', SiteFamilySelectableField>;

export type ISiteFamilyAsManyRelationConfig = Q.IManyRelationConfig<'siteFamilys', SiteFamilySelectableField, SiteFamilySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteFamilyAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteFamily, SiteFamilySelectableField>;

export type ISiteFamilyAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteFamily, SiteFamilySelectableField, SiteFamilySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteFamilyRelationMap extends Record<SiteFamilyRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteFamilyRelationQueries = Q.IBaseRelationQueries<ISiteFamily, SiteFamilyRelationKey, ISiteFamilyRelationMap>;

export type ISiteFamilyItemQuery = Q.IBaseItemQuery<
  ISiteFamily,
  SiteFamilyRelationKey,
  SiteFamilySelectableField,
  SiteFamilyRelationKey,
  SiteFamilySelectableField,
  ISiteFamilyRelationMap,
  ISiteFamilyRelationQueries
>;

export type ISiteFamilyListQuery = Q.IBaseListQuery<
  ISiteFamily,
  SiteFamilyRelationKey,
  SiteFamilySelectableField,
  SiteFamilySortableField,
  SiteFamilyRelationKey,
  SiteFamilySelectableField,
  SiteFamilySortableField,
  SiteFamilyDateRangeField,
  SiteFamilyFilterableField,
  ISiteFamilyRelationMap,
  ISiteFamilyRelationQueries,
  ISiteFamilyItemQuery
>;