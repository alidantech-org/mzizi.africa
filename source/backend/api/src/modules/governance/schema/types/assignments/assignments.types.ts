// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as FunctionsTypes from "#/modules/governance/schema/types/functions/functions.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as PositionsTypes from "#/modules/governance/schema/types/positions/positions.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ASSIGNMENTS_RELATION_KEYS,
  ASSIGNMENTS_SORTABLE_FIELDS,
  ASSIGNMENTS_SEARCHABLE_FIELDS,
  ASSIGNMENTS_FILTERABLE_FIELDS,
  ASSIGNMENTS_DATE_RANGE_FIELDS,
  ASSIGNMENTS_SELECTABLE_FIELDS,
  ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  ASSIGNMENTS_EDITABLE_FIELDS,
} from "./assignments.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Who is responsible for a function, how it is shared, where a person starts, and the law that assigns it. */
export interface IAssignments extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  functionId: string;
  institutionId: string | null;
  obligorKindId: string | null;
  shareId: string;
  sourceCitationId: string | null;
  startInstitutionId: string | null;
  startPositionId: string | null;
  toYear: number | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly function?: FunctionsTypes.IFunctions;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly obligorKind?: ValueTypes.IValue;
  readonly share?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly startInstitution?: InstitutionsTypes.IInstitutions;
  readonly startPosition?: PositionsTypes.IPositions;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AssignmentsKey = keyof IAssignments;

export type AssignmentsRelationKey = (typeof ASSIGNMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAssignmentsReadonlyFields = B.IBaseReadonlyFields;

export type IAssignmentsContextualFields = never;

export type IAssignmentsSensitiveFields = never;

export type IAssignmentsTransitionFields = never;

export type IAssignmentsImmutableFields =
  | IAssignmentsReadonlyFields
  | IAssignmentsContextualFields
  | IAssignmentsSensitiveFields
  | IAssignmentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAssignmentsCreatable = Omit<
  IAssignments,
  IAssignmentsImmutableFields | AssignmentsRelationKey
>;

export type IAssignmentsSystemWritable = Omit<
  IAssignments,
  B.IBaseReadonlyFields | AssignmentsRelationKey
>;

export type IAssignmentsUpdatable = Partial<
  Omit<IAssignments, IAssignmentsImmutableFields | AssignmentsRelationKey>
>;

export interface IAssignmentsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AssignmentsSortableField = (typeof ASSIGNMENTS_SORTABLE_FIELDS)[number];

export type AssignmentsSearchableField = (typeof ASSIGNMENTS_SEARCHABLE_FIELDS)[number];

export type AssignmentsFilterableField = (typeof ASSIGNMENTS_FILTERABLE_FIELDS)[number];

export type AssignmentsDateRangeField = (typeof ASSIGNMENTS_DATE_RANGE_FIELDS)[number];

export type AssignmentsSelectableField = (typeof ASSIGNMENTS_SELECTABLE_FIELDS)[number];

export type AssignmentsDefaultSelectField = (typeof ASSIGNMENTS_DEFAULT_SELECT_FIELDS)[number];

export type AssignmentsEditableField = (typeof ASSIGNMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAssignmentsAsOneRelationConfig = Q.IOneRelationConfig<
  "assignments",
  AssignmentsSelectableField
>;

export type IAssignmentsAsManyRelationConfig = Q.IManyRelationConfig<
  "assignments",
  AssignmentsSelectableField,
  AssignmentsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAssignmentsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IAssignments,
  AssignmentsSelectableField
>;

export type IAssignmentsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAssignments,
  AssignmentsSelectableField,
  AssignmentsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAssignmentsRelationMap extends Record<AssignmentsRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  function: FunctionsTypes.IFunctionsAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  obligorKind: ValueTypes.IValueAsOneRelationQuery;
  share: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  startInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  startPosition: PositionsTypes.IPositionsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAssignmentsRelationQueries = Q.IBaseRelationQueries<
  IAssignments,
  AssignmentsRelationKey,
  IAssignmentsRelationMap
>;

export type IAssignmentsItemQuery = Q.IBaseItemQuery<
  IAssignments,
  AssignmentsRelationKey,
  AssignmentsSelectableField,
  AssignmentsRelationKey,
  AssignmentsSelectableField,
  IAssignmentsRelationMap,
  IAssignmentsRelationQueries
>;

export type IAssignmentsListQuery = Q.IBaseListQuery<
  IAssignments,
  AssignmentsRelationKey,
  AssignmentsSelectableField,
  AssignmentsSortableField,
  AssignmentsRelationKey,
  AssignmentsSelectableField,
  AssignmentsSortableField,
  AssignmentsDateRangeField,
  AssignmentsFilterableField,
  IAssignmentsRelationMap,
  IAssignmentsRelationQueries,
  IAssignmentsItemQuery
>;
