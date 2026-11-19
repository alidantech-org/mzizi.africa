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
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as PositionsTypes from "#/modules/governance/schema/types/positions/positions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProceduresTypes from "#/modules/governance/schema/types/procedures/procedures.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  POWERS_RELATION_KEYS,
  POWERS_SORTABLE_FIELDS,
  POWERS_SEARCHABLE_FIELDS,
  POWERS_FILTERABLE_FIELDS,
  POWERS_DATE_RANGE_FIELDS,
  POWERS_SELECTABLE_FIELDS,
  POWERS_DEFAULT_SELECT_FIELDS,
  POWERS_EDITABLE_FIELDS,
} from "./powers.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored. */
export interface IPowers extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  holderInstitutionId: string | null;
  holderPositionId: string | null;
  isBinding: boolean;
  kindId: string;
  procedureId: string | null;
  sourceCitationId: string | null;
  stepOrder: number | null;
  targetInstitutionId: string | null;
  targetPositionId: string | null;
  thresholdId: string | null;
  toYear: number | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly holderInstitution?: InstitutionsTypes.IInstitutions;
  readonly holderPosition?: PositionsTypes.IPositions;
  readonly kind?: ValueTypes.IValue;
  readonly procedure?: ProceduresTypes.IProcedures;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly targetInstitution?: InstitutionsTypes.IInstitutions;
  readonly targetPosition?: PositionsTypes.IPositions;
  readonly threshold?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PowersKey = keyof IPowers;

export type PowersRelationKey = (typeof POWERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPowersReadonlyFields = B.IBaseReadonlyFields;

export type IPowersContextualFields = never;

export type IPowersSensitiveFields = never;

export type IPowersTransitionFields = never;

export type IPowersImmutableFields =
  | IPowersReadonlyFields
  | IPowersContextualFields
  | IPowersSensitiveFields
  | IPowersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPowersCreatable = Omit<IPowers, IPowersImmutableFields | PowersRelationKey>;

export type IPowersSystemWritable = Omit<IPowers, B.IBaseReadonlyFields | PowersRelationKey>;

export type IPowersUpdatable = Partial<Omit<IPowers, IPowersImmutableFields | PowersRelationKey>>;

export interface IPowersTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PowersSortableField = (typeof POWERS_SORTABLE_FIELDS)[number];

export type PowersSearchableField = (typeof POWERS_SEARCHABLE_FIELDS)[number];

export type PowersFilterableField = (typeof POWERS_FILTERABLE_FIELDS)[number];

export type PowersDateRangeField = (typeof POWERS_DATE_RANGE_FIELDS)[number];

export type PowersSelectableField = (typeof POWERS_SELECTABLE_FIELDS)[number];

export type PowersDefaultSelectField = (typeof POWERS_DEFAULT_SELECT_FIELDS)[number];

export type PowersEditableField = (typeof POWERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPowersAsOneRelationConfig = Q.IOneRelationConfig<"powers", PowersSelectableField>;

export type IPowersAsManyRelationConfig = Q.IManyRelationConfig<
  "powers",
  PowersSelectableField,
  PowersSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPowersAsOneRelationQuery = Q.IAsOneRelationQuery<IPowers, PowersSelectableField>;

export type IPowersAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPowers,
  PowersSelectableField,
  PowersSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPowersRelationMap extends Record<PowersRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  holderInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  holderPosition: PositionsTypes.IPositionsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  procedure: ProceduresTypes.IProceduresAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  targetInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  targetPosition: PositionsTypes.IPositionsAsOneRelationQuery;
  threshold: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPowersRelationQueries = Q.IBaseRelationQueries<
  IPowers,
  PowersRelationKey,
  IPowersRelationMap
>;

export type IPowersItemQuery = Q.IBaseItemQuery<
  IPowers,
  PowersRelationKey,
  PowersSelectableField,
  PowersRelationKey,
  PowersSelectableField,
  IPowersRelationMap,
  IPowersRelationQueries
>;

export type IPowersListQuery = Q.IBaseListQuery<
  IPowers,
  PowersRelationKey,
  PowersSelectableField,
  PowersSortableField,
  PowersRelationKey,
  PowersSelectableField,
  PowersSortableField,
  PowersDateRangeField,
  PowersFilterableField,
  IPowersRelationMap,
  IPowersRelationQueries,
  IPowersItemQuery
>;
