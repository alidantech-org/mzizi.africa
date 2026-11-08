// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DNS_SNAPSHOT_RELATION_KEYS,
  DNS_SNAPSHOT_SORTABLE_FIELDS,
  DNS_SNAPSHOT_SEARCHABLE_FIELDS,
  DNS_SNAPSHOT_FILTERABLE_FIELDS,
  DNS_SNAPSHOT_DATE_RANGE_FIELDS,
  DNS_SNAPSHOT_SELECTABLE_FIELDS,
  DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS,
  DNS_SNAPSHOT_EDITABLE_FIELDS
} from './dns-snapshot.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Dns Snapshot */
export interface IDnsSnapshot extends B.IBase {
  domainId: string | null;
  observedAt: Date;
  rcode: string | null;
  recordType: string;
  resolver: string | null;
  values: string;
  zoneId: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DnsSnapshotKey = keyof IDnsSnapshot;

export type DnsSnapshotRelationKey = (typeof DNS_SNAPSHOT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDnsSnapshotReadonlyFields = B.IBaseReadonlyFields;

export type IDnsSnapshotContextualFields = never;

export type IDnsSnapshotSensitiveFields = never;

export type IDnsSnapshotTransitionFields = never;

export type IDnsSnapshotImmutableFields =
  | IDnsSnapshotReadonlyFields
  | IDnsSnapshotContextualFields
  | IDnsSnapshotSensitiveFields
  | IDnsSnapshotTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDnsSnapshotCreatable = Omit<IDnsSnapshot, IDnsSnapshotImmutableFields | DnsSnapshotRelationKey>;

export type IDnsSnapshotSystemWritable = Omit<IDnsSnapshot, B.IBaseReadonlyFields | DnsSnapshotRelationKey>;

export type IDnsSnapshotUpdatable = Partial<Omit<IDnsSnapshot, IDnsSnapshotImmutableFields | DnsSnapshotRelationKey>>;

export interface IDnsSnapshotTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DnsSnapshotSortableField = (typeof DNS_SNAPSHOT_SORTABLE_FIELDS)[number];

export type DnsSnapshotSearchableField = (typeof DNS_SNAPSHOT_SEARCHABLE_FIELDS)[number];

export type DnsSnapshotFilterableField = (typeof DNS_SNAPSHOT_FILTERABLE_FIELDS)[number];

export type DnsSnapshotDateRangeField = (typeof DNS_SNAPSHOT_DATE_RANGE_FIELDS)[number];

export type DnsSnapshotSelectableField = (typeof DNS_SNAPSHOT_SELECTABLE_FIELDS)[number];

export type DnsSnapshotDefaultSelectField = (typeof DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS)[number];

export type DnsSnapshotEditableField = (typeof DNS_SNAPSHOT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDnsSnapshotAsOneRelationConfig = Q.IOneRelationConfig<'dnsSnapshot', DnsSnapshotSelectableField>;

export type IDnsSnapshotAsManyRelationConfig = Q.IManyRelationConfig<'dnsSnapshots', DnsSnapshotSelectableField, DnsSnapshotSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDnsSnapshotAsOneRelationQuery = Q.IAsOneRelationQuery<IDnsSnapshot, DnsSnapshotSelectableField>;

export type IDnsSnapshotAsManyRelationQuery = Q.IAsManyRelationQuery<IDnsSnapshot, DnsSnapshotSelectableField, DnsSnapshotSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDnsSnapshotRelationMap extends Record<DnsSnapshotRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDnsSnapshotRelationQueries = Q.IBaseRelationQueries<IDnsSnapshot, DnsSnapshotRelationKey, IDnsSnapshotRelationMap>;

export type IDnsSnapshotItemQuery = Q.IBaseItemQuery<
  IDnsSnapshot,
  DnsSnapshotRelationKey,
  DnsSnapshotSelectableField,
  DnsSnapshotRelationKey,
  DnsSnapshotSelectableField,
  IDnsSnapshotRelationMap,
  IDnsSnapshotRelationQueries
>;

export type IDnsSnapshotListQuery = Q.IBaseListQuery<
  IDnsSnapshot,
  DnsSnapshotRelationKey,
  DnsSnapshotSelectableField,
  DnsSnapshotSortableField,
  DnsSnapshotRelationKey,
  DnsSnapshotSelectableField,
  DnsSnapshotSortableField,
  DnsSnapshotDateRangeField,
  DnsSnapshotFilterableField,
  IDnsSnapshotRelationMap,
  IDnsSnapshotRelationQueries,
  IDnsSnapshotItemQuery
>;