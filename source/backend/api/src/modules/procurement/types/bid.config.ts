// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as TenderConfig from '#/modules/procurement/types/tender.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBid,
  BidKey,
  BidRelationKey,
  BidSortableField,
  BidFilterableField,
  BidDateRangeField,
  BidSelectableField,
  IBidAsOneRelationConfig,
  IBidAsManyRelationConfig
} from './bid.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BID_RELATION_KEYS = ['tender', ] as const satisfies readonly BidKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BID_SORTABLE_FIELDS = ['amount', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly BidKey[];

export const BID_SEARCHABLE_FIELDS = [] as const satisfies readonly BidKey[];

export const BID_FILTERABLE_FIELDS = ['amount', 'bidderEntityId', 'id', 'isCurrent', 'method', 'status', 'tenderId', 'verificationState', 'version', ] as const satisfies readonly BidKey[];

export const BID_DATE_RANGE_FIELDS = ['createdAt', 'submittedOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly BidKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BID_SELECTABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'bidderEntityId', 'confidence', 'createdAt', 'currencyCode', 'evaluationNote', 'id', 'isCompliant', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'submittedOn', 'tenderId', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BidKey[];

export const BID_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly BidSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BID_EDITABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'bidderEntityId', 'confidence', 'currencyCode', 'evaluationNote', 'isCompliant', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'submittedOn', 'tenderId', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BidKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BID_AS_ONE_RELATION_CONFIG = {
  relation: 'bid',
  type: ERelationType.One,
  selectableFields: BID_SELECTABLE_FIELDS,
  defaultSelectFields: BID_DEFAULT_SELECT_FIELDS
} as const satisfies IBidAsOneRelationConfig;

export const BID_AS_MANY_RELATION_CONFIG = {
  relation: 'bids',
  type: ERelationType.Many,
  selectableFields: BID_SELECTABLE_FIELDS,
  defaultSelectFields: BID_DEFAULT_SELECT_FIELDS,
  sortableFields: BID_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IBidAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BID_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BidRelationKey>().one(TenderConfig.TENDER_AS_ONE_RELATION_CONFIG, 'tender'),
] as const;

export const BID_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BID_QUERY_OPTIONS = {
  searchableFields: BID_SEARCHABLE_FIELDS,
  selectableFields: BID_SELECTABLE_FIELDS,
  defaultSelectFields: BID_DEFAULT_SELECT_FIELDS,
  sortableFields: BID_SORTABLE_FIELDS,
  filterFields: BID_FILTERABLE_FIELDS,
  dateRangeFields: BID_DATE_RANGE_FIELDS,
  oneRelations: BID_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BID_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IBid,
  BidSortableField,
  BidSelectableField,
  BidFilterableField,
  BidDateRangeField,
  BidRelationKey,
  typeof BID_ONE_RELATION_QUERY_OPTIONS,
  typeof BID_MANY_RELATION_QUERY_OPTIONS
>;