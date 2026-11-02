// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { RelationOwnerKind } from '#/types/website/relation-owner-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_TRAIT_RELATION_KEYS,
  SITE_TRAIT_SORTABLE_FIELDS,
  SITE_TRAIT_SEARCHABLE_FIELDS,
  SITE_TRAIT_FILTERABLE_FIELDS,
  SITE_TRAIT_DATE_RANGE_FIELDS,
  SITE_TRAIT_SELECTABLE_FIELDS,
  SITE_TRAIT_DEFAULT_SELECT_FIELDS,
  SITE_TRAIT_EDITABLE_FIELDS
} from './site-trait.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Trait */
export interface ISiteTrait extends B.IBase {
  methodId: string | null;
  observedAt: Date | null;
  ownerId: string;
  ownerKind: RelationOwnerKind;
  score: number | null;
  tag: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteTraitKey = keyof ISiteTrait;

export type SiteTraitRelationKey = (typeof SITE_TRAIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteTraitReadonlyFields = B.IBaseReadonlyFields;

export type ISiteTraitContextualFields = never;

export type ISiteTraitSensitiveFields = never;

export type ISiteTraitTransitionFields = never;

export type ISiteTraitImmutableFields =
  | ISiteTraitReadonlyFields
  | ISiteTraitContextualFields
  | ISiteTraitSensitiveFields
  | ISiteTraitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteTraitCreatable = Omit<ISiteTrait, ISiteTraitImmutableFields | SiteTraitRelationKey>;

export type ISiteTraitSystemWritable = Omit<ISiteTrait, B.IBaseReadonlyFields | SiteTraitRelationKey>;

export type ISiteTraitUpdatable = Partial<Omit<ISiteTrait, ISiteTraitImmutableFields | SiteTraitRelationKey>>;

export interface ISiteTraitTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteTraitSortableField = (typeof SITE_TRAIT_SORTABLE_FIELDS)[number];

export type SiteTraitSearchableField = (typeof SITE_TRAIT_SEARCHABLE_FIELDS)[number];

export type SiteTraitFilterableField = (typeof SITE_TRAIT_FILTERABLE_FIELDS)[number];

export type SiteTraitDateRangeField = (typeof SITE_TRAIT_DATE_RANGE_FIELDS)[number];

export type SiteTraitSelectableField = (typeof SITE_TRAIT_SELECTABLE_FIELDS)[number];

export type SiteTraitDefaultSelectField = (typeof SITE_TRAIT_DEFAULT_SELECT_FIELDS)[number];

export type SiteTraitEditableField = (typeof SITE_TRAIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteTraitAsOneRelationConfig = Q.IOneRelationConfig<'siteTrait', SiteTraitSelectableField>;

export type ISiteTraitAsManyRelationConfig = Q.IManyRelationConfig<'siteTraits', SiteTraitSelectableField, SiteTraitSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteTraitAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteTrait, SiteTraitSelectableField>;

export type ISiteTraitAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteTrait, SiteTraitSelectableField, SiteTraitSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteTraitRelationMap extends Record<SiteTraitRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteTraitRelationQueries = Q.IBaseRelationQueries<ISiteTrait, SiteTraitRelationKey, ISiteTraitRelationMap>;

export type ISiteTraitItemQuery = Q.IBaseItemQuery<
  ISiteTrait,
  SiteTraitRelationKey,
  SiteTraitSelectableField,
  SiteTraitRelationKey,
  SiteTraitSelectableField,
  ISiteTraitRelationMap,
  ISiteTraitRelationQueries
>;

export type ISiteTraitListQuery = Q.IBaseListQuery<
  ISiteTrait,
  SiteTraitRelationKey,
  SiteTraitSelectableField,
  SiteTraitSortableField,
  SiteTraitRelationKey,
  SiteTraitSelectableField,
  SiteTraitSortableField,
  SiteTraitDateRangeField,
  SiteTraitFilterableField,
  ISiteTraitRelationMap,
  ISiteTraitRelationQueries,
  ISiteTraitItemQuery
>;