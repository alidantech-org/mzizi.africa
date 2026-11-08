// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as OfficeConfig from '#/modules/governance/types/office.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISelectionProcedure,
  SelectionProcedureKey,
  SelectionProcedureRelationKey,
  SelectionProcedureSortableField,
  SelectionProcedureFilterableField,
  SelectionProcedureDateRangeField,
  SelectionProcedureSelectableField,
  ISelectionProcedureAsOneRelationConfig,
  ISelectionProcedureAsManyRelationConfig
} from './selection-procedure.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SELECTION_PROCEDURE_RELATION_KEYS = ['office', ] as const satisfies readonly SelectionProcedureKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SELECTION_PROCEDURE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly SelectionProcedureKey[];

export const SELECTION_PROCEDURE_SEARCHABLE_FIELDS = [] as const satisfies readonly SelectionProcedureKey[];

export const SELECTION_PROCEDURE_FILTERABLE_FIELDS = ['id', 'isCurrent', 'legalBasisId', 'methodId', 'officeId', 'version', ] as const satisfies readonly SelectionProcedureKey[];

export const SELECTION_PROCEDURE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SelectionProcedureKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SELECTION_PROCEDURE_SELECTABLE_FIELDS = ['createdAt', 'description', 'id', 'isCurrent', 'legalBasisId', 'methodId', 'officeId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SelectionProcedureKey[];

export const SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SelectionProcedureSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SELECTION_PROCEDURE_EDITABLE_FIELDS = ['description', 'isCurrent', 'legalBasisId', 'methodId', 'officeId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SelectionProcedureKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SELECTION_PROCEDURE_AS_ONE_RELATION_CONFIG = {
  relation: 'selectionProcedure',
  type: ERelationType.One,
  selectableFields: SELECTION_PROCEDURE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS
} as const satisfies ISelectionProcedureAsOneRelationConfig;

export const SELECTION_PROCEDURE_AS_MANY_RELATION_CONFIG = {
  relation: 'selectionProcedures',
  type: ERelationType.Many,
  selectableFields: SELECTION_PROCEDURE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS,
  sortableFields: SELECTION_PROCEDURE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISelectionProcedureAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SELECTION_PROCEDURE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SelectionProcedureRelationKey>().one(OfficeConfig.OFFICE_AS_ONE_RELATION_CONFIG, 'office'),
] as const;

export const SELECTION_PROCEDURE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SELECTION_PROCEDURE_QUERY_OPTIONS = {
  searchableFields: SELECTION_PROCEDURE_SEARCHABLE_FIELDS,
  selectableFields: SELECTION_PROCEDURE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS,
  sortableFields: SELECTION_PROCEDURE_SORTABLE_FIELDS,
  filterFields: SELECTION_PROCEDURE_FILTERABLE_FIELDS,
  dateRangeFields: SELECTION_PROCEDURE_DATE_RANGE_FIELDS,
  oneRelations: SELECTION_PROCEDURE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SELECTION_PROCEDURE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISelectionProcedure,
  SelectionProcedureSortableField,
  SelectionProcedureSelectableField,
  SelectionProcedureFilterableField,
  SelectionProcedureDateRangeField,
  SelectionProcedureRelationKey,
  typeof SELECTION_PROCEDURE_ONE_RELATION_QUERY_OPTIONS,
  typeof SELECTION_PROCEDURE_MANY_RELATION_QUERY_OPTIONS
>;