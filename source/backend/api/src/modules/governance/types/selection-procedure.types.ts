// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as OfficeTypes from '#/modules/governance/types/office.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SELECTION_PROCEDURE_RELATION_KEYS,
  SELECTION_PROCEDURE_SORTABLE_FIELDS,
  SELECTION_PROCEDURE_SEARCHABLE_FIELDS,
  SELECTION_PROCEDURE_FILTERABLE_FIELDS,
  SELECTION_PROCEDURE_DATE_RANGE_FIELDS,
  SELECTION_PROCEDURE_SELECTABLE_FIELDS,
  SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS,
  SELECTION_PROCEDURE_EDITABLE_FIELDS
} from './selection-procedure.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Selection Procedure */
export interface ISelectionProcedure extends B.IBase {
  description: string | null;
  isCurrent: boolean;
  legalBasisId: string | null;
  methodId: string;
  officeId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly office?: OfficeTypes.IOffice;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SelectionProcedureKey = keyof ISelectionProcedure;

export type SelectionProcedureRelationKey = (typeof SELECTION_PROCEDURE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISelectionProcedureReadonlyFields = B.IBaseReadonlyFields;

export type ISelectionProcedureContextualFields = never;

export type ISelectionProcedureSensitiveFields = never;

export type ISelectionProcedureTransitionFields = never;

export type ISelectionProcedureImmutableFields =
  | ISelectionProcedureReadonlyFields
  | ISelectionProcedureContextualFields
  | ISelectionProcedureSensitiveFields
  | ISelectionProcedureTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISelectionProcedureCreatable = Omit<ISelectionProcedure, ISelectionProcedureImmutableFields | SelectionProcedureRelationKey>;

export type ISelectionProcedureSystemWritable = Omit<ISelectionProcedure, B.IBaseReadonlyFields | SelectionProcedureRelationKey>;

export type ISelectionProcedureUpdatable = Partial<Omit<ISelectionProcedure, ISelectionProcedureImmutableFields | SelectionProcedureRelationKey>>;

export interface ISelectionProcedureTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SelectionProcedureSortableField = (typeof SELECTION_PROCEDURE_SORTABLE_FIELDS)[number];

export type SelectionProcedureSearchableField = (typeof SELECTION_PROCEDURE_SEARCHABLE_FIELDS)[number];

export type SelectionProcedureFilterableField = (typeof SELECTION_PROCEDURE_FILTERABLE_FIELDS)[number];

export type SelectionProcedureDateRangeField = (typeof SELECTION_PROCEDURE_DATE_RANGE_FIELDS)[number];

export type SelectionProcedureSelectableField = (typeof SELECTION_PROCEDURE_SELECTABLE_FIELDS)[number];

export type SelectionProcedureDefaultSelectField = (typeof SELECTION_PROCEDURE_DEFAULT_SELECT_FIELDS)[number];

export type SelectionProcedureEditableField = (typeof SELECTION_PROCEDURE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISelectionProcedureAsOneRelationConfig = Q.IOneRelationConfig<'selectionProcedure', SelectionProcedureSelectableField>;

export type ISelectionProcedureAsManyRelationConfig = Q.IManyRelationConfig<'selectionProcedures', SelectionProcedureSelectableField, SelectionProcedureSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISelectionProcedureAsOneRelationQuery = Q.IAsOneRelationQuery<ISelectionProcedure, SelectionProcedureSelectableField>;

export type ISelectionProcedureAsManyRelationQuery = Q.IAsManyRelationQuery<ISelectionProcedure, SelectionProcedureSelectableField, SelectionProcedureSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISelectionProcedureRelationMap extends Record<SelectionProcedureRelationKey, unknown> {
  office: OfficeTypes.IOfficeAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISelectionProcedureRelationQueries = Q.IBaseRelationQueries<ISelectionProcedure, SelectionProcedureRelationKey, ISelectionProcedureRelationMap>;

export type ISelectionProcedureItemQuery = Q.IBaseItemQuery<
  ISelectionProcedure,
  SelectionProcedureRelationKey,
  SelectionProcedureSelectableField,
  SelectionProcedureRelationKey,
  SelectionProcedureSelectableField,
  ISelectionProcedureRelationMap,
  ISelectionProcedureRelationQueries
>;

export type ISelectionProcedureListQuery = Q.IBaseListQuery<
  ISelectionProcedure,
  SelectionProcedureRelationKey,
  SelectionProcedureSelectableField,
  SelectionProcedureSortableField,
  SelectionProcedureRelationKey,
  SelectionProcedureSelectableField,
  SelectionProcedureSortableField,
  SelectionProcedureDateRangeField,
  SelectionProcedureFilterableField,
  ISelectionProcedureRelationMap,
  ISelectionProcedureRelationQueries,
  ISelectionProcedureItemQuery
>;