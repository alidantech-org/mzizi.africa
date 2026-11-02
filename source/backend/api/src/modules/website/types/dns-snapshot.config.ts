// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDnsSnapshot,
  DnsSnapshotKey,
  DnsSnapshotRelationKey,
  DnsSnapshotSortableField,
  DnsSnapshotFilterableField,
  DnsSnapshotDateRangeField,
  DnsSnapshotSelectableField,
  IDnsSnapshotAsOneRelationConfig,
  IDnsSnapshotAsManyRelationConfig
} from './dns-snapshot.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DNS_SNAPSHOT_RELATION_KEYS = [] as const satisfies readonly DnsSnapshotKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DNS_SNAPSHOT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly DnsSnapshotKey[];

export const DNS_SNAPSHOT_SEARCHABLE_FIELDS = [] as const satisfies readonly DnsSnapshotKey[];

export const DNS_SNAPSHOT_FILTERABLE_FIELDS = ['domainId', 'id', 'version', 'zoneId', ] as const satisfies readonly DnsSnapshotKey[];

export const DNS_SNAPSHOT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly DnsSnapshotKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DNS_SNAPSHOT_SELECTABLE_FIELDS = ['createdAt', 'domainId', 'id', 'observedAt', 'rcode', 'recordType', 'resolver', 'updatedAt', 'values', 'zoneId', ] as const satisfies readonly DnsSnapshotKey[];

export const DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DnsSnapshotSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DNS_SNAPSHOT_EDITABLE_FIELDS = ['domainId', 'observedAt', 'rcode', 'recordType', 'resolver', 'values', 'zoneId', ] as const satisfies readonly DnsSnapshotKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DNS_SNAPSHOT_AS_ONE_RELATION_CONFIG = {
  relation: 'dnsSnapshot',
  type: ERelationType.One,
  selectableFields: DNS_SNAPSHOT_SELECTABLE_FIELDS,
  defaultSelectFields: DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS
} as const satisfies IDnsSnapshotAsOneRelationConfig;

export const DNS_SNAPSHOT_AS_MANY_RELATION_CONFIG = {
  relation: 'dnsSnapshots',
  type: ERelationType.Many,
  selectableFields: DNS_SNAPSHOT_SELECTABLE_FIELDS,
  defaultSelectFields: DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS,
  sortableFields: DNS_SNAPSHOT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDnsSnapshotAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DNS_SNAPSHOT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const DNS_SNAPSHOT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DNS_SNAPSHOT_QUERY_OPTIONS = {
  searchableFields: DNS_SNAPSHOT_SEARCHABLE_FIELDS,
  selectableFields: DNS_SNAPSHOT_SELECTABLE_FIELDS,
  defaultSelectFields: DNS_SNAPSHOT_DEFAULT_SELECT_FIELDS,
  sortableFields: DNS_SNAPSHOT_SORTABLE_FIELDS,
  filterFields: DNS_SNAPSHOT_FILTERABLE_FIELDS,
  dateRangeFields: DNS_SNAPSHOT_DATE_RANGE_FIELDS,
  oneRelations: DNS_SNAPSHOT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DNS_SNAPSHOT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDnsSnapshot,
  DnsSnapshotSortableField,
  DnsSnapshotSelectableField,
  DnsSnapshotFilterableField,
  DnsSnapshotDateRangeField,
  DnsSnapshotRelationKey,
  typeof DNS_SNAPSHOT_ONE_RELATION_QUERY_OPTIONS,
  typeof DNS_SNAPSHOT_MANY_RELATION_QUERY_OPTIONS
>;