// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as OfficesTypes from "#/modules/governance/schema/types/offices/offices.types";
import type * as ProcurementsTypes from "#/modules/civic/schema/types/procurements/procurements.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OFFICIALS_RELATION_KEYS,
  OFFICIALS_SORTABLE_FIELDS,
  OFFICIALS_SEARCHABLE_FIELDS,
  OFFICIALS_FILTERABLE_FIELDS,
  OFFICIALS_DATE_RANGE_FIELDS,
  OFFICIALS_SELECTABLE_FIELDS,
  OFFICIALS_DEFAULT_SELECT_FIELDS,
  OFFICIALS_EDITABLE_FIELDS,
} from "./officials.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature. */
export interface IOfficials extends B.IBase {
  actedOn: Date | null;
  contractId: string | null;
  individualId: string;
  officeId: string | null;
  procurementId: string | null;
  roleId: string;
  sourceCitationId: string | null;
  readonly contract?: ContractsTypes.IContracts;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly office?: OfficesTypes.IOffices;
  readonly procurement?: ProcurementsTypes.IProcurements;
  readonly role?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OfficialsKey = keyof IOfficials;

export type OfficialsRelationKey = (typeof OFFICIALS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOfficialsReadonlyFields = B.IBaseReadonlyFields;

export type IOfficialsContextualFields = never;

export type IOfficialsSensitiveFields = never;

export type IOfficialsTransitionFields = never;

export type IOfficialsImmutableFields =
  | IOfficialsReadonlyFields
  | IOfficialsContextualFields
  | IOfficialsSensitiveFields
  | IOfficialsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOfficialsCreatable = Omit<
  IOfficials,
  IOfficialsImmutableFields | OfficialsRelationKey
>;

export type IOfficialsSystemWritable = Omit<
  IOfficials,
  B.IBaseReadonlyFields | OfficialsRelationKey
>;

export type IOfficialsUpdatable = Partial<
  Omit<IOfficials, IOfficialsImmutableFields | OfficialsRelationKey>
>;

export interface IOfficialsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OfficialsSortableField = (typeof OFFICIALS_SORTABLE_FIELDS)[number];

export type OfficialsSearchableField = (typeof OFFICIALS_SEARCHABLE_FIELDS)[number];

export type OfficialsFilterableField = (typeof OFFICIALS_FILTERABLE_FIELDS)[number];

export type OfficialsDateRangeField = (typeof OFFICIALS_DATE_RANGE_FIELDS)[number];

export type OfficialsSelectableField = (typeof OFFICIALS_SELECTABLE_FIELDS)[number];

export type OfficialsDefaultSelectField = (typeof OFFICIALS_DEFAULT_SELECT_FIELDS)[number];

export type OfficialsEditableField = (typeof OFFICIALS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOfficialsAsOneRelationConfig = Q.IOneRelationConfig<
  "officials",
  OfficialsSelectableField
>;

export type IOfficialsAsManyRelationConfig = Q.IManyRelationConfig<
  "officials",
  OfficialsSelectableField,
  OfficialsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOfficialsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IOfficials,
  OfficialsSelectableField
>;

export type IOfficialsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IOfficials,
  OfficialsSelectableField,
  OfficialsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOfficialsRelationMap extends Record<OfficialsRelationKey, unknown> {
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  procurement: ProcurementsTypes.IProcurementsAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOfficialsRelationQueries = Q.IBaseRelationQueries<
  IOfficials,
  OfficialsRelationKey,
  IOfficialsRelationMap
>;

export type IOfficialsItemQuery = Q.IBaseItemQuery<
  IOfficials,
  OfficialsRelationKey,
  OfficialsSelectableField,
  OfficialsRelationKey,
  OfficialsSelectableField,
  IOfficialsRelationMap,
  IOfficialsRelationQueries
>;

export type IOfficialsListQuery = Q.IBaseListQuery<
  IOfficials,
  OfficialsRelationKey,
  OfficialsSelectableField,
  OfficialsSortableField,
  OfficialsRelationKey,
  OfficialsSelectableField,
  OfficialsSortableField,
  OfficialsDateRangeField,
  OfficialsFilterableField,
  IOfficialsRelationMap,
  IOfficialsRelationQueries,
  IOfficialsItemQuery
>;
