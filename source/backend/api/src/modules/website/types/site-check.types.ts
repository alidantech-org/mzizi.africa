// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { CheckKind } from '#/types/website/check-kind.enum';
import type { CheckOutcome } from '#/types/website/check-outcome.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_CHECK_RELATION_KEYS,
  SITE_CHECK_SORTABLE_FIELDS,
  SITE_CHECK_SEARCHABLE_FIELDS,
  SITE_CHECK_FILTERABLE_FIELDS,
  SITE_CHECK_DATE_RANGE_FIELDS,
  SITE_CHECK_SELECTABLE_FIELDS,
  SITE_CHECK_DEFAULT_SELECT_FIELDS,
  SITE_CHECK_EDITABLE_FIELDS
} from './site-check.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Check */
export interface ISiteCheck extends B.IBase {
  checkedAt: Date;
  detail: string | null;
  kind: CheckKind;
  outcome: CheckOutcome;
  siteId: string;
  structureVersionId: string | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteCheckKey = keyof ISiteCheck;

export type SiteCheckRelationKey = (typeof SITE_CHECK_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteCheckReadonlyFields = B.IBaseReadonlyFields;

export type ISiteCheckContextualFields = never;

export type ISiteCheckSensitiveFields = never;

export type ISiteCheckTransitionFields = never;

export type ISiteCheckImmutableFields =
  | ISiteCheckReadonlyFields
  | ISiteCheckContextualFields
  | ISiteCheckSensitiveFields
  | ISiteCheckTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteCheckCreatable = Omit<ISiteCheck, ISiteCheckImmutableFields | SiteCheckRelationKey>;

export type ISiteCheckSystemWritable = Omit<ISiteCheck, B.IBaseReadonlyFields | SiteCheckRelationKey>;

export type ISiteCheckUpdatable = Partial<Omit<ISiteCheck, ISiteCheckImmutableFields | SiteCheckRelationKey>>;

export interface ISiteCheckTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteCheckSortableField = (typeof SITE_CHECK_SORTABLE_FIELDS)[number];

export type SiteCheckSearchableField = (typeof SITE_CHECK_SEARCHABLE_FIELDS)[number];

export type SiteCheckFilterableField = (typeof SITE_CHECK_FILTERABLE_FIELDS)[number];

export type SiteCheckDateRangeField = (typeof SITE_CHECK_DATE_RANGE_FIELDS)[number];

export type SiteCheckSelectableField = (typeof SITE_CHECK_SELECTABLE_FIELDS)[number];

export type SiteCheckDefaultSelectField = (typeof SITE_CHECK_DEFAULT_SELECT_FIELDS)[number];

export type SiteCheckEditableField = (typeof SITE_CHECK_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteCheckAsOneRelationConfig = Q.IOneRelationConfig<'siteCheck', SiteCheckSelectableField>;

export type ISiteCheckAsManyRelationConfig = Q.IManyRelationConfig<'siteChecks', SiteCheckSelectableField, SiteCheckSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteCheckAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteCheck, SiteCheckSelectableField>;

export type ISiteCheckAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteCheck, SiteCheckSelectableField, SiteCheckSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteCheckRelationMap extends Record<SiteCheckRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteCheckRelationQueries = Q.IBaseRelationQueries<ISiteCheck, SiteCheckRelationKey, ISiteCheckRelationMap>;

export type ISiteCheckItemQuery = Q.IBaseItemQuery<
  ISiteCheck,
  SiteCheckRelationKey,
  SiteCheckSelectableField,
  SiteCheckRelationKey,
  SiteCheckSelectableField,
  ISiteCheckRelationMap,
  ISiteCheckRelationQueries
>;

export type ISiteCheckListQuery = Q.IBaseListQuery<
  ISiteCheck,
  SiteCheckRelationKey,
  SiteCheckSelectableField,
  SiteCheckSortableField,
  SiteCheckRelationKey,
  SiteCheckSelectableField,
  SiteCheckSortableField,
  SiteCheckDateRangeField,
  SiteCheckFilterableField,
  ISiteCheckRelationMap,
  ISiteCheckRelationQueries,
  ISiteCheckItemQuery
>;