// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { MembershipBasis } from '#/types/website/membership-basis.enum';
import type { MembershipRole } from '#/types/website/membership-role.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_MEMBER_RELATION_KEYS,
  SITE_MEMBER_SORTABLE_FIELDS,
  SITE_MEMBER_SEARCHABLE_FIELDS,
  SITE_MEMBER_FILTERABLE_FIELDS,
  SITE_MEMBER_DATE_RANGE_FIELDS,
  SITE_MEMBER_SELECTABLE_FIELDS,
  SITE_MEMBER_DEFAULT_SELECT_FIELDS,
  SITE_MEMBER_EDITABLE_FIELDS
} from './site-member.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Member */
export interface ISiteMember extends B.IBase {
  basis: MembershipBasis;
  familyId: string;
  methodId: string | null;
  role: MembershipRole;
  score: number | null;
  siteId: string;
  validFrom: Date | null;
  validTo: Date | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteMemberKey = keyof ISiteMember;

export type SiteMemberRelationKey = (typeof SITE_MEMBER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteMemberReadonlyFields = B.IBaseReadonlyFields;

export type ISiteMemberContextualFields = never;

export type ISiteMemberSensitiveFields = never;

export type ISiteMemberTransitionFields = never;

export type ISiteMemberImmutableFields =
  | ISiteMemberReadonlyFields
  | ISiteMemberContextualFields
  | ISiteMemberSensitiveFields
  | ISiteMemberTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteMemberCreatable = Omit<ISiteMember, ISiteMemberImmutableFields | SiteMemberRelationKey>;

export type ISiteMemberSystemWritable = Omit<ISiteMember, B.IBaseReadonlyFields | SiteMemberRelationKey>;

export type ISiteMemberUpdatable = Partial<Omit<ISiteMember, ISiteMemberImmutableFields | SiteMemberRelationKey>>;

export interface ISiteMemberTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteMemberSortableField = (typeof SITE_MEMBER_SORTABLE_FIELDS)[number];

export type SiteMemberSearchableField = (typeof SITE_MEMBER_SEARCHABLE_FIELDS)[number];

export type SiteMemberFilterableField = (typeof SITE_MEMBER_FILTERABLE_FIELDS)[number];

export type SiteMemberDateRangeField = (typeof SITE_MEMBER_DATE_RANGE_FIELDS)[number];

export type SiteMemberSelectableField = (typeof SITE_MEMBER_SELECTABLE_FIELDS)[number];

export type SiteMemberDefaultSelectField = (typeof SITE_MEMBER_DEFAULT_SELECT_FIELDS)[number];

export type SiteMemberEditableField = (typeof SITE_MEMBER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteMemberAsOneRelationConfig = Q.IOneRelationConfig<'siteMember', SiteMemberSelectableField>;

export type ISiteMemberAsManyRelationConfig = Q.IManyRelationConfig<'siteMembers', SiteMemberSelectableField, SiteMemberSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteMemberAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteMember, SiteMemberSelectableField>;

export type ISiteMemberAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteMember, SiteMemberSelectableField, SiteMemberSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteMemberRelationMap extends Record<SiteMemberRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteMemberRelationQueries = Q.IBaseRelationQueries<ISiteMember, SiteMemberRelationKey, ISiteMemberRelationMap>;

export type ISiteMemberItemQuery = Q.IBaseItemQuery<
  ISiteMember,
  SiteMemberRelationKey,
  SiteMemberSelectableField,
  SiteMemberRelationKey,
  SiteMemberSelectableField,
  ISiteMemberRelationMap,
  ISiteMemberRelationQueries
>;

export type ISiteMemberListQuery = Q.IBaseListQuery<
  ISiteMember,
  SiteMemberRelationKey,
  SiteMemberSelectableField,
  SiteMemberSortableField,
  SiteMemberRelationKey,
  SiteMemberSelectableField,
  SiteMemberSortableField,
  SiteMemberDateRangeField,
  SiteMemberFilterableField,
  ISiteMemberRelationMap,
  ISiteMemberRelationQueries,
  ISiteMemberItemQuery
>;