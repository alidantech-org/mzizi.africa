// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROVISIONS_RELATION_KEYS,
  PROVISIONS_SORTABLE_FIELDS,
  PROVISIONS_SEARCHABLE_FIELDS,
  PROVISIONS_FILTERABLE_FIELDS,
  PROVISIONS_DATE_RANGE_FIELDS,
  PROVISIONS_SELECTABLE_FIELDS,
  PROVISIONS_DEFAULT_SELECT_FIELDS,
  PROVISIONS_EDITABLE_FIELDS,
} from "./provisions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement. */
export interface IProvisions extends B.IBase {
  code: string;
  designation: string;
  instrumentId: string;
  kind: ProvisionKind;
  parentId: string | null;
  position: number;
  title: string | null;
  readonly instrument?: InstrumentsTypes.IInstruments;
  readonly parent?: IProvisions;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProvisionsKey = keyof IProvisions;

export type ProvisionsRelationKey = (typeof PROVISIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProvisionsReadonlyFields = B.IBaseReadonlyFields;

export type IProvisionsContextualFields = never;

export type IProvisionsSensitiveFields = never;

export type IProvisionsTransitionFields = never;

export type IProvisionsImmutableFields =
  | IProvisionsReadonlyFields
  | IProvisionsContextualFields
  | IProvisionsSensitiveFields
  | IProvisionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProvisionsCreatable = Omit<
  IProvisions,
  IProvisionsImmutableFields | ProvisionsRelationKey
>;

export type IProvisionsSystemWritable = Omit<
  IProvisions,
  B.IBaseReadonlyFields | ProvisionsRelationKey
>;

export type IProvisionsUpdatable = Partial<
  Omit<IProvisions, IProvisionsImmutableFields | ProvisionsRelationKey>
>;

export interface IProvisionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProvisionsSortableField = (typeof PROVISIONS_SORTABLE_FIELDS)[number];

export type ProvisionsSearchableField = (typeof PROVISIONS_SEARCHABLE_FIELDS)[number];

export type ProvisionsFilterableField = (typeof PROVISIONS_FILTERABLE_FIELDS)[number];

export type ProvisionsDateRangeField = (typeof PROVISIONS_DATE_RANGE_FIELDS)[number];

export type ProvisionsSelectableField = (typeof PROVISIONS_SELECTABLE_FIELDS)[number];

export type ProvisionsDefaultSelectField = (typeof PROVISIONS_DEFAULT_SELECT_FIELDS)[number];

export type ProvisionsEditableField = (typeof PROVISIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProvisionsAsOneRelationConfig = Q.IOneRelationConfig<
  "provisions",
  ProvisionsSelectableField
>;

export type IProvisionsAsManyRelationConfig = Q.IManyRelationConfig<
  "provisions",
  ProvisionsSelectableField,
  ProvisionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProvisionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IProvisions,
  ProvisionsSelectableField
>;

export type IProvisionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProvisions,
  ProvisionsSelectableField,
  ProvisionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProvisionsRelationMap extends Record<ProvisionsRelationKey, unknown> {
  instrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  parent: IProvisionsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProvisionsRelationQueries = Q.IBaseRelationQueries<
  IProvisions,
  ProvisionsRelationKey,
  IProvisionsRelationMap
>;

export type IProvisionsItemQuery = Q.IBaseItemQuery<
  IProvisions,
  ProvisionsRelationKey,
  ProvisionsSelectableField,
  ProvisionsRelationKey,
  ProvisionsSelectableField,
  IProvisionsRelationMap,
  IProvisionsRelationQueries
>;

export type IProvisionsListQuery = Q.IBaseListQuery<
  IProvisions,
  ProvisionsRelationKey,
  ProvisionsSelectableField,
  ProvisionsSortableField,
  ProvisionsRelationKey,
  ProvisionsSelectableField,
  ProvisionsSortableField,
  ProvisionsDateRangeField,
  ProvisionsFilterableField,
  IProvisionsRelationMap,
  IProvisionsRelationQueries,
  IProvisionsItemQuery
>;
