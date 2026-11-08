// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { MembershipBasis } from '#/types/website/membership-basis.enum';
import type { RelationOwnerKind } from '#/types/website/relation-owner-kind.enum';
import type { SiteRelationKind } from '#/types/website/site-relation-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_RELATION_RELATION_KEYS,
  SITE_RELATION_SORTABLE_FIELDS,
  SITE_RELATION_SEARCHABLE_FIELDS,
  SITE_RELATION_FILTERABLE_FIELDS,
  SITE_RELATION_DATE_RANGE_FIELDS,
  SITE_RELATION_SELECTABLE_FIELDS,
  SITE_RELATION_DEFAULT_SELECT_FIELDS,
  SITE_RELATION_EDITABLE_FIELDS
} from './site-relation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Relation */
export interface ISiteRelation extends B.IBase {
  basis: MembershipBasis;
  evidence: string | null;
  fromId: string;
  fromKind: RelationOwnerKind;
  relation: SiteRelationKind;
  score: number | null;
  toId: string;
  toKind: RelationOwnerKind;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteRelationKey = keyof ISiteRelation;

export type SiteRelationRelationKey = (typeof SITE_RELATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteRelationReadonlyFields = B.IBaseReadonlyFields;

export type ISiteRelationContextualFields = never;

export type ISiteRelationSensitiveFields = never;

export type ISiteRelationTransitionFields = never;

export type ISiteRelationImmutableFields =
  | ISiteRelationReadonlyFields
  | ISiteRelationContextualFields
  | ISiteRelationSensitiveFields
  | ISiteRelationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteRelationCreatable = Omit<ISiteRelation, ISiteRelationImmutableFields | SiteRelationRelationKey>;

export type ISiteRelationSystemWritable = Omit<ISiteRelation, B.IBaseReadonlyFields | SiteRelationRelationKey>;

export type ISiteRelationUpdatable = Partial<Omit<ISiteRelation, ISiteRelationImmutableFields | SiteRelationRelationKey>>;

export interface ISiteRelationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteRelationSortableField = (typeof SITE_RELATION_SORTABLE_FIELDS)[number];

export type SiteRelationSearchableField = (typeof SITE_RELATION_SEARCHABLE_FIELDS)[number];

export type SiteRelationFilterableField = (typeof SITE_RELATION_FILTERABLE_FIELDS)[number];

export type SiteRelationDateRangeField = (typeof SITE_RELATION_DATE_RANGE_FIELDS)[number];

export type SiteRelationSelectableField = (typeof SITE_RELATION_SELECTABLE_FIELDS)[number];

export type SiteRelationDefaultSelectField = (typeof SITE_RELATION_DEFAULT_SELECT_FIELDS)[number];

export type SiteRelationEditableField = (typeof SITE_RELATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteRelationAsOneRelationConfig = Q.IOneRelationConfig<'siteRelation', SiteRelationSelectableField>;

export type ISiteRelationAsManyRelationConfig = Q.IManyRelationConfig<'siteRelations', SiteRelationSelectableField, SiteRelationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteRelationAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteRelation, SiteRelationSelectableField>;

export type ISiteRelationAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteRelation, SiteRelationSelectableField, SiteRelationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteRelationRelationMap extends Record<SiteRelationRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteRelationRelationQueries = Q.IBaseRelationQueries<ISiteRelation, SiteRelationRelationKey, ISiteRelationRelationMap>;

export type ISiteRelationItemQuery = Q.IBaseItemQuery<
  ISiteRelation,
  SiteRelationRelationKey,
  SiteRelationSelectableField,
  SiteRelationRelationKey,
  SiteRelationSelectableField,
  ISiteRelationRelationMap,
  ISiteRelationRelationQueries
>;

export type ISiteRelationListQuery = Q.IBaseListQuery<
  ISiteRelation,
  SiteRelationRelationKey,
  SiteRelationSelectableField,
  SiteRelationSortableField,
  SiteRelationRelationKey,
  SiteRelationSelectableField,
  SiteRelationSortableField,
  SiteRelationDateRangeField,
  SiteRelationFilterableField,
  ISiteRelationRelationMap,
  ISiteRelationRelationQueries,
  ISiteRelationItemQuery
>;