// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPublicationReceipts,
  PublicationReceiptsKey,
  PublicationReceiptsRelationKey,
  PublicationReceiptsSortableField,
  PublicationReceiptsFilterableField,
  PublicationReceiptsDateRangeField,
  PublicationReceiptsSelectableField,
  IPublicationReceiptsAsOneRelationConfig,
  IPublicationReceiptsAsManyRelationConfig
} from './publication-receipts.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PUBLICATION_RECEIPTS_RELATION_KEYS = [] as const satisfies readonly PublicationReceiptsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PUBLICATION_RECEIPTS_SORTABLE_FIELDS = [] as const satisfies readonly PublicationReceiptsKey[];

export const PUBLICATION_RECEIPTS_SEARCHABLE_FIELDS = [] as const satisfies readonly PublicationReceiptsKey[];

export const PUBLICATION_RECEIPTS_FILTERABLE_FIELDS = [] as const satisfies readonly PublicationReceiptsKey[];

export const PUBLICATION_RECEIPTS_DATE_RANGE_FIELDS = [] as const satisfies readonly PublicationReceiptsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PUBLICATION_RECEIPTS_SELECTABLE_FIELDS = ['actorSnapshot', 'contractVersion', 'createdAt', 'deletedAt', 'id', 'idempotencyKey', 'payloadHash', 'publicationRefId', 'publishedAt', 'requestHash', 'resultManifest', 'updatedAt', 'version', ] as const satisfies readonly PublicationReceiptsKey[];

export const PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS = ['actorSnapshot', 'contractVersion', 'createdAt', 'deletedAt', 'id', 'idempotencyKey', 'payloadHash', 'publicationRefId', 'publishedAt', 'requestHash', 'resultManifest', 'updatedAt', 'version', ] as const satisfies readonly PublicationReceiptsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PUBLICATION_RECEIPTS_EDITABLE_FIELDS = ['actorSnapshot', 'contractVersion', 'idempotencyKey', 'payloadHash', 'publicationRefId', 'publishedAt', 'requestHash', 'resultManifest', ] as const satisfies readonly PublicationReceiptsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PUBLICATION_RECEIPTS_AS_ONE_RELATION_CONFIG = {
  relation: 'publicationReceipts',
  type: ERelationType.One,
  selectableFields: PUBLICATION_RECEIPTS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS
} as const satisfies IPublicationReceiptsAsOneRelationConfig;

export const PUBLICATION_RECEIPTS_AS_MANY_RELATION_CONFIG = {
  relation: 'publicationReceiptss',
  type: ERelationType.Many,
  selectableFields: PUBLICATION_RECEIPTS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLICATION_RECEIPTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPublicationReceiptsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PUBLICATION_RECEIPTS_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PUBLICATION_RECEIPTS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PUBLICATION_RECEIPTS_QUERY_OPTIONS = {
  searchableFields: PUBLICATION_RECEIPTS_SEARCHABLE_FIELDS,
  selectableFields: PUBLICATION_RECEIPTS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLICATION_RECEIPTS_SORTABLE_FIELDS,
  filterFields: PUBLICATION_RECEIPTS_FILTERABLE_FIELDS,
  dateRangeFields: PUBLICATION_RECEIPTS_DATE_RANGE_FIELDS,
  oneRelations: PUBLICATION_RECEIPTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PUBLICATION_RECEIPTS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPublicationReceipts,
  PublicationReceiptsSortableField,
  PublicationReceiptsSelectableField,
  PublicationReceiptsFilterableField,
  PublicationReceiptsDateRangeField,
  PublicationReceiptsRelationKey,
  typeof PUBLICATION_RECEIPTS_ONE_RELATION_QUERY_OPTIONS,
  typeof PUBLICATION_RECEIPTS_MANY_RELATION_QUERY_OPTIONS
>;