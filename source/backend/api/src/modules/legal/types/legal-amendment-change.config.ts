// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalAmendmentConfig from '#/modules/legal/types/legal-amendment.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILegalAmendmentChange,
  LegalAmendmentChangeKey,
  LegalAmendmentChangeRelationKey,
  LegalAmendmentChangeSortableField,
  LegalAmendmentChangeFilterableField,
  LegalAmendmentChangeDateRangeField,
  LegalAmendmentChangeSelectableField,
  ILegalAmendmentChangeAsOneRelationConfig,
  ILegalAmendmentChangeAsManyRelationConfig
} from './legal-amendment-change.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_RELATION_KEYS = ['legalAmendment', ] as const satisfies readonly LegalAmendmentChangeKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalAmendmentChangeKey[];

export const LEGAL_AMENDMENT_CHANGE_SEARCHABLE_FIELDS = [] as const satisfies readonly LegalAmendmentChangeKey[];

export const LEGAL_AMENDMENT_CHANGE_FILTERABLE_FIELDS = ['amendmentId', 'id', 'isCurrent', 'kind', 'provisionId', 'version', ] as const satisfies readonly LegalAmendmentChangeKey[];

export const LEGAL_AMENDMENT_CHANGE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalAmendmentChangeKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS = ['amendmentId', 'createdAt', 'id', 'isCurrent', 'kind', 'newText', 'previousText', 'provisionId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAmendmentChangeKey[];

export const LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalAmendmentChangeSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_EDITABLE_FIELDS = ['amendmentId', 'isCurrent', 'kind', 'newText', 'previousText', 'provisionId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAmendmentChangeKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_AS_ONE_RELATION_CONFIG = {
  relation: 'legalAmendmentChange',
  type: ERelationType.One,
  selectableFields: LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalAmendmentChangeAsOneRelationConfig;

export const LEGAL_AMENDMENT_CHANGE_AS_MANY_RELATION_CONFIG = {
  relation: 'legalAmendmentChanges',
  type: ERelationType.Many,
  selectableFields: LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AMENDMENT_CHANGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalAmendmentChangeAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LegalAmendmentChangeRelationKey>().one(LegalAmendmentConfig.LEGAL_AMENDMENT_AS_ONE_RELATION_CONFIG, 'legalAmendment'),
] as const;

export const LEGAL_AMENDMENT_CHANGE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_AMENDMENT_CHANGE_QUERY_OPTIONS = {
  searchableFields: LEGAL_AMENDMENT_CHANGE_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AMENDMENT_CHANGE_SORTABLE_FIELDS,
  filterFields: LEGAL_AMENDMENT_CHANGE_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_AMENDMENT_CHANGE_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_AMENDMENT_CHANGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_AMENDMENT_CHANGE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalAmendmentChange,
  LegalAmendmentChangeSortableField,
  LegalAmendmentChangeSelectableField,
  LegalAmendmentChangeFilterableField,
  LegalAmendmentChangeDateRangeField,
  LegalAmendmentChangeRelationKey,
  typeof LEGAL_AMENDMENT_CHANGE_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_AMENDMENT_CHANGE_MANY_RELATION_QUERY_OPTIONS
>;