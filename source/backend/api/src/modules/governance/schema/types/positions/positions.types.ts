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
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as LevelsTypes from "#/modules/geography/schema/types/levels/levels.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  POSITIONS_RELATION_KEYS,
  POSITIONS_SORTABLE_FIELDS,
  POSITIONS_SEARCHABLE_FIELDS,
  POSITIONS_FILTERABLE_FIELDS,
  POSITIONS_DATE_RANGE_FIELDS,
  POSITIONS_SELECTABLE_FIELDS,
  POSITIONS_DEFAULT_SELECT_FIELDS,
  POSITIONS_EDITABLE_FIELDS,
} from "./positions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it. */
export interface IPositions extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  displayOrder: number | null;
  exposureId: string | null;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  institutionId: string;
  jurisdictionLevelId: string | null;
  roleId: string;
  seatBasisId: string;
  seatCount: number | null;
  seatUnitLevelId: string | null;
  selectionMethodId: string;
  sourceCitationId: string | null;
  termLimit: number | null;
  termYears: number | null;
  titleId: string;
  toYear: number | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly exposure?: ValueTypes.IValue;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly jurisdictionLevel?: LevelsTypes.ILevels;
  readonly role?: ValueTypes.IValue;
  readonly seatBasis?: ValueTypes.IValue;
  readonly seatUnitLevel?: LevelsTypes.ILevels;
  readonly selectionMethod?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly title?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PositionsKey = keyof IPositions;

export type PositionsRelationKey = (typeof POSITIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPositionsReadonlyFields = B.IBaseReadonlyFields;

export type IPositionsContextualFields = never;

export type IPositionsSensitiveFields = never;

export type IPositionsTransitionFields = never;

export type IPositionsImmutableFields =
  | IPositionsReadonlyFields
  | IPositionsContextualFields
  | IPositionsSensitiveFields
  | IPositionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPositionsCreatable = Omit<
  IPositions,
  IPositionsImmutableFields | PositionsRelationKey
>;

export type IPositionsSystemWritable = Omit<
  IPositions,
  B.IBaseReadonlyFields | PositionsRelationKey
>;

export type IPositionsUpdatable = Partial<
  Omit<IPositions, IPositionsImmutableFields | PositionsRelationKey>
>;

export interface IPositionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PositionsSortableField = (typeof POSITIONS_SORTABLE_FIELDS)[number];

export type PositionsSearchableField = (typeof POSITIONS_SEARCHABLE_FIELDS)[number];

export type PositionsFilterableField = (typeof POSITIONS_FILTERABLE_FIELDS)[number];

export type PositionsDateRangeField = (typeof POSITIONS_DATE_RANGE_FIELDS)[number];

export type PositionsSelectableField = (typeof POSITIONS_SELECTABLE_FIELDS)[number];

export type PositionsDefaultSelectField = (typeof POSITIONS_DEFAULT_SELECT_FIELDS)[number];

export type PositionsEditableField = (typeof POSITIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPositionsAsOneRelationConfig = Q.IOneRelationConfig<
  "positions",
  PositionsSelectableField
>;

export type IPositionsAsManyRelationConfig = Q.IManyRelationConfig<
  "positions",
  PositionsSelectableField,
  PositionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPositionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IPositions,
  PositionsSelectableField
>;

export type IPositionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPositions,
  PositionsSelectableField,
  PositionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPositionsRelationMap extends Record<PositionsRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  exposure: ValueTypes.IValueAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  jurisdictionLevel: LevelsTypes.ILevelsAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
  seatBasis: ValueTypes.IValueAsOneRelationQuery;
  seatUnitLevel: LevelsTypes.ILevelsAsOneRelationQuery;
  selectionMethod: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  title: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPositionsRelationQueries = Q.IBaseRelationQueries<
  IPositions,
  PositionsRelationKey,
  IPositionsRelationMap
>;

export type IPositionsItemQuery = Q.IBaseItemQuery<
  IPositions,
  PositionsRelationKey,
  PositionsSelectableField,
  PositionsRelationKey,
  PositionsSelectableField,
  IPositionsRelationMap,
  IPositionsRelationQueries
>;

export type IPositionsListQuery = Q.IBaseListQuery<
  IPositions,
  PositionsRelationKey,
  PositionsSelectableField,
  PositionsSortableField,
  PositionsRelationKey,
  PositionsSelectableField,
  PositionsSortableField,
  PositionsDateRangeField,
  PositionsFilterableField,
  IPositionsRelationMap,
  IPositionsRelationQueries,
  IPositionsItemQuery
>;
