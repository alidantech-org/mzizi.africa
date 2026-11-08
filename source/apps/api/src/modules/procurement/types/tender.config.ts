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
  ITender,
  TenderKey,
  TenderRelationKey,
  TenderSortableField,
  TenderFilterableField,
  TenderDateRangeField,
  TenderSelectableField,
  ITenderAsOneRelationConfig,
  ITenderAsManyRelationConfig
} from './tender.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TENDER_RELATION_KEYS = [] as const satisfies readonly TenderKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TENDER_SORTABLE_FIELDS = ['code', 'createdAt', 'publishedOn', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly TenderKey[];

export const TENDER_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly TenderKey[];

export const TENDER_FILTERABLE_FIELDS = ['budgetId', 'code', 'estimatedValue', 'id', 'isCurrent', 'issuingUnitId', 'kindId', 'legalBasisId', 'methodId', 'procuringOfficeId', 'status', 'title', 'version', ] as const satisfies readonly TenderKey[];

export const TENDER_DATE_RANGE_FIELDS = ['createdAt', 'publishedOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly TenderKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TENDER_SELECTABLE_FIELDS = ['budgetId', 'closesOn', 'code', 'createdAt', 'currencyCode', 'estimatedValue', 'id', 'isCurrent', 'issuingUnitId', 'kindId', 'legalBasisId', 'methodId', 'procuringOfficeId', 'publishedOn', 'status', 'title', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'versionNumber', ] as const satisfies readonly TenderKey[];

export const TENDER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly TenderSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TENDER_EDITABLE_FIELDS = ['budgetId', 'closesOn', 'code', 'currencyCode', 'estimatedValue', 'isCurrent', 'issuingUnitId', 'kindId', 'legalBasisId', 'methodId', 'procuringOfficeId', 'publishedOn', 'status', 'title', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'versionNumber', ] as const satisfies readonly TenderKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TENDER_AS_ONE_RELATION_CONFIG = {
  relation: 'tender',
  type: ERelationType.One,
  selectableFields: TENDER_SELECTABLE_FIELDS,
  defaultSelectFields: TENDER_DEFAULT_SELECT_FIELDS
} as const satisfies ITenderAsOneRelationConfig;

export const TENDER_AS_MANY_RELATION_CONFIG = {
  relation: 'tenders',
  type: ERelationType.Many,
  selectableFields: TENDER_SELECTABLE_FIELDS,
  defaultSelectFields: TENDER_DEFAULT_SELECT_FIELDS,
  sortableFields: TENDER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ITenderAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TENDER_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const TENDER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TENDER_QUERY_OPTIONS = {
  searchableFields: TENDER_SEARCHABLE_FIELDS,
  selectableFields: TENDER_SELECTABLE_FIELDS,
  defaultSelectFields: TENDER_DEFAULT_SELECT_FIELDS,
  sortableFields: TENDER_SORTABLE_FIELDS,
  filterFields: TENDER_FILTERABLE_FIELDS,
  dateRangeFields: TENDER_DATE_RANGE_FIELDS,
  oneRelations: TENDER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TENDER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ITender,
  TenderSortableField,
  TenderSelectableField,
  TenderFilterableField,
  TenderDateRangeField,
  TenderRelationKey,
  typeof TENDER_ONE_RELATION_QUERY_OPTIONS,
  typeof TENDER_MANY_RELATION_QUERY_OPTIONS
>;