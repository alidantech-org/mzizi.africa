// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FingerprintKind } from '#/types/website/fingerprint-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_FINGERPRINT_RELATION_KEYS,
  SITE_FINGERPRINT_SORTABLE_FIELDS,
  SITE_FINGERPRINT_SEARCHABLE_FIELDS,
  SITE_FINGERPRINT_FILTERABLE_FIELDS,
  SITE_FINGERPRINT_DATE_RANGE_FIELDS,
  SITE_FINGERPRINT_SELECTABLE_FIELDS,
  SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS,
  SITE_FINGERPRINT_EDITABLE_FIELDS
} from './site-fingerprint.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Fingerprint */
export interface ISiteFingerprint extends B.IBase {
  checkId: string | null;
  computedAt: Date;
  digest: string;
  features: string;
  kind: FingerprintKind;
  siteId: string;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteFingerprintKey = keyof ISiteFingerprint;

export type SiteFingerprintRelationKey = (typeof SITE_FINGERPRINT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteFingerprintReadonlyFields = B.IBaseReadonlyFields;

export type ISiteFingerprintContextualFields = never;

export type ISiteFingerprintSensitiveFields = never;

export type ISiteFingerprintTransitionFields = never;

export type ISiteFingerprintImmutableFields =
  | ISiteFingerprintReadonlyFields
  | ISiteFingerprintContextualFields
  | ISiteFingerprintSensitiveFields
  | ISiteFingerprintTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteFingerprintCreatable = Omit<ISiteFingerprint, ISiteFingerprintImmutableFields | SiteFingerprintRelationKey>;

export type ISiteFingerprintSystemWritable = Omit<ISiteFingerprint, B.IBaseReadonlyFields | SiteFingerprintRelationKey>;

export type ISiteFingerprintUpdatable = Partial<Omit<ISiteFingerprint, ISiteFingerprintImmutableFields | SiteFingerprintRelationKey>>;

export interface ISiteFingerprintTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteFingerprintSortableField = (typeof SITE_FINGERPRINT_SORTABLE_FIELDS)[number];

export type SiteFingerprintSearchableField = (typeof SITE_FINGERPRINT_SEARCHABLE_FIELDS)[number];

export type SiteFingerprintFilterableField = (typeof SITE_FINGERPRINT_FILTERABLE_FIELDS)[number];

export type SiteFingerprintDateRangeField = (typeof SITE_FINGERPRINT_DATE_RANGE_FIELDS)[number];

export type SiteFingerprintSelectableField = (typeof SITE_FINGERPRINT_SELECTABLE_FIELDS)[number];

export type SiteFingerprintDefaultSelectField = (typeof SITE_FINGERPRINT_DEFAULT_SELECT_FIELDS)[number];

export type SiteFingerprintEditableField = (typeof SITE_FINGERPRINT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteFingerprintAsOneRelationConfig = Q.IOneRelationConfig<'siteFingerprint', SiteFingerprintSelectableField>;

export type ISiteFingerprintAsManyRelationConfig = Q.IManyRelationConfig<'siteFingerprints', SiteFingerprintSelectableField, SiteFingerprintSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteFingerprintAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteFingerprint, SiteFingerprintSelectableField>;

export type ISiteFingerprintAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteFingerprint, SiteFingerprintSelectableField, SiteFingerprintSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteFingerprintRelationMap extends Record<SiteFingerprintRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteFingerprintRelationQueries = Q.IBaseRelationQueries<ISiteFingerprint, SiteFingerprintRelationKey, ISiteFingerprintRelationMap>;

export type ISiteFingerprintItemQuery = Q.IBaseItemQuery<
  ISiteFingerprint,
  SiteFingerprintRelationKey,
  SiteFingerprintSelectableField,
  SiteFingerprintRelationKey,
  SiteFingerprintSelectableField,
  ISiteFingerprintRelationMap,
  ISiteFingerprintRelationQueries
>;

export type ISiteFingerprintListQuery = Q.IBaseListQuery<
  ISiteFingerprint,
  SiteFingerprintRelationKey,
  SiteFingerprintSelectableField,
  SiteFingerprintSortableField,
  SiteFingerprintRelationKey,
  SiteFingerprintSelectableField,
  SiteFingerprintSortableField,
  SiteFingerprintDateRangeField,
  SiteFingerprintFilterableField,
  ISiteFingerprintRelationMap,
  ISiteFingerprintRelationQueries,
  ISiteFingerprintItemQuery
>;