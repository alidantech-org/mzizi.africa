// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';

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

export const LEGAL_INSTRUMENT_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly LegalInstrumentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_SORTABLE_FIELDS = ['code', 'createdAt', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'method', 'status', 'title', 'verificationState', 'version', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalInstrumentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'contentHash', 'createdAt', 'documentUrl', 'id', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'summary', 'title', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly LegalInstrumentKey[];

export const LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalInstrumentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_INSTRUMENT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'contentHash', 'documentUrl', 'isCurrent', 'issuingInstitutionId', 'jurisdictionId', 'kindId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'summary', 'title', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly LegalInstrumentKey[];

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
  Q.createRelationKeyMapper<LegalInstrumentRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
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