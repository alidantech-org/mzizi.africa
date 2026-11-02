// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalInstrumentConfig from '#/modules/legal/types/legal-instrument.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILegalAmendment,
  LegalAmendmentKey,
  LegalAmendmentRelationKey,
  LegalAmendmentSortableField,
  LegalAmendmentFilterableField,
  LegalAmendmentDateRangeField,
  LegalAmendmentSelectableField,
  ILegalAmendmentAsOneRelationConfig,
  ILegalAmendmentAsManyRelationConfig
} from './legal-amendment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_AMENDMENT_RELATION_KEYS = ['legalInstrument', ] as const satisfies readonly LegalAmendmentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalAmendmentKey[];

export const LEGAL_AMENDMENT_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly LegalAmendmentKey[];

export const LEGAL_AMENDMENT_FILTERABLE_FIELDS = ['amendingInstrumentId', 'code', 'id', 'instrumentId', 'isCurrent', 'version', ] as const satisfies readonly LegalAmendmentKey[];

export const LEGAL_AMENDMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalAmendmentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_SELECTABLE_FIELDS = ['amendingInstrumentId', 'code', 'createdAt', 'id', 'instrumentId', 'isCurrent', 'summary', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAmendmentKey[];

export const LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalAmendmentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_EDITABLE_FIELDS = ['amendingInstrumentId', 'code', 'instrumentId', 'isCurrent', 'summary', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAmendmentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_AMENDMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'legalAmendment',
  type: ERelationType.One,
  selectableFields: LEGAL_AMENDMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalAmendmentAsOneRelationConfig;

export const LEGAL_AMENDMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'legalAmendments',
  type: ERelationType.Many,
  selectableFields: LEGAL_AMENDMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AMENDMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalAmendmentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_AMENDMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LegalAmendmentRelationKey>().one(LegalInstrumentConfig.LEGAL_INSTRUMENT_AS_ONE_RELATION_CONFIG, 'legalInstrument'),
] as const;

export const LEGAL_AMENDMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_AMENDMENT_QUERY_OPTIONS = {
  searchableFields: LEGAL_AMENDMENT_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_AMENDMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AMENDMENT_SORTABLE_FIELDS,
  filterFields: LEGAL_AMENDMENT_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_AMENDMENT_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_AMENDMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_AMENDMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalAmendment,
  LegalAmendmentSortableField,
  LegalAmendmentSelectableField,
  LegalAmendmentFilterableField,
  LegalAmendmentDateRangeField,
  LegalAmendmentRelationKey,
  typeof LEGAL_AMENDMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_AMENDMENT_MANY_RELATION_QUERY_OPTIONS
>;