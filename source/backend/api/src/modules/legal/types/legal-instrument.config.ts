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
  ILegalInstrument,
  LegalInstrumentKey,
  LegalInstrumentRelationKey,
  LegalInstrumentSortableField,
  LegalInstrumentFilterableField,
  LegalInstrumentDateRangeField,
  LegalInstrumentSelectableField,
  ILegalInstrumentAsOneRelationConfig,
  ILegalInstrumentAsManyRelationConfig
} from './legal-instrument.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_INSTRUMENT_RELATION_KEYS = [] as const satisfies readonly LegalInstrumentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_SORTABLE_FIELDS = ['code', 'createdAt', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'status', 'title', 'version', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalInstrumentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_SELECTABLE_FIELDS = ['code', 'contentHash', 'createdAt', 'documentUrl', 'id', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'status', 'summary', 'title', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalInstrumentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_EDITABLE_FIELDS = ['code', 'contentHash', 'documentUrl', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'status', 'summary', 'title', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalInstrumentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_INSTRUMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'legalInstrument',
  type: ERelationType.One,
  selectableFields: LEGAL_INSTRUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalInstrumentAsOneRelationConfig;

export const LEGAL_INSTRUMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'legalInstruments',
  type: ERelationType.Many,
  selectableFields: LEGAL_INSTRUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_INSTRUMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalInstrumentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_INSTRUMENT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const LEGAL_INSTRUMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_INSTRUMENT_QUERY_OPTIONS = {
  searchableFields: LEGAL_INSTRUMENT_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_INSTRUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_INSTRUMENT_SORTABLE_FIELDS,
  filterFields: LEGAL_INSTRUMENT_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_INSTRUMENT_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_INSTRUMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_INSTRUMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalInstrument,
  LegalInstrumentSortableField,
  LegalInstrumentSelectableField,
  LegalInstrumentFilterableField,
  LegalInstrumentDateRangeField,
  LegalInstrumentRelationKey,
  typeof LEGAL_INSTRUMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_INSTRUMENT_MANY_RELATION_QUERY_OPTIONS
>;