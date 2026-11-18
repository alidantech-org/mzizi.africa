// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as BillsTypes from "#/modules/governance/schema/types/bills/bills.types";
import type * as MotionsTypes from "#/modules/governance/schema/types/motions/motions.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  AGENDA_RELATION_KEYS,
  AGENDA_SORTABLE_FIELDS,
  AGENDA_SEARCHABLE_FIELDS,
  AGENDA_FILTERABLE_FIELDS,
  AGENDA_DATE_RANGE_FIELDS,
  AGENDA_SELECTABLE_FIELDS,
  AGENDA_DEFAULT_SELECT_FIELDS,
  AGENDA_EDITABLE_FIELDS,
} from "./agenda.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One item of a sitting's order paper, in order, with the bill or motion it is about. */
export interface IAgenda extends B.IBase {
  agendaKindId: string;
  billId: string | null;
  motionId: string | null;
  position: number;
  sittingId: string;
  sourceCitationId: string | null;
  title: string;
  readonly agendaKind?: ValueTypes.IValue;
  readonly bill?: BillsTypes.IBills;
  readonly motion?: MotionsTypes.IMotions;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AgendaKey = keyof IAgenda;

export type AgendaRelationKey = (typeof AGENDA_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAgendaReadonlyFields = B.IBaseReadonlyFields;

export type IAgendaContextualFields = never;

export type IAgendaSensitiveFields = never;

export type IAgendaTransitionFields = never;

export type IAgendaImmutableFields =
  | IAgendaReadonlyFields
  | IAgendaContextualFields
  | IAgendaSensitiveFields
  | IAgendaTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAgendaCreatable = Omit<IAgenda, IAgendaImmutableFields | AgendaRelationKey>;

export type IAgendaSystemWritable = Omit<IAgenda, B.IBaseReadonlyFields | AgendaRelationKey>;

export type IAgendaUpdatable = Partial<Omit<IAgenda, IAgendaImmutableFields | AgendaRelationKey>>;

export interface IAgendaTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AgendaSortableField = (typeof AGENDA_SORTABLE_FIELDS)[number];

export type AgendaSearchableField = (typeof AGENDA_SEARCHABLE_FIELDS)[number];

export type AgendaFilterableField = (typeof AGENDA_FILTERABLE_FIELDS)[number];

export type AgendaDateRangeField = (typeof AGENDA_DATE_RANGE_FIELDS)[number];

export type AgendaSelectableField = (typeof AGENDA_SELECTABLE_FIELDS)[number];

export type AgendaDefaultSelectField = (typeof AGENDA_DEFAULT_SELECT_FIELDS)[number];

export type AgendaEditableField = (typeof AGENDA_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAgendaAsOneRelationConfig = Q.IOneRelationConfig<"agenda", AgendaSelectableField>;

export type IAgendaAsManyRelationConfig = Q.IManyRelationConfig<
  "agendas",
  AgendaSelectableField,
  AgendaSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAgendaAsOneRelationQuery = Q.IAsOneRelationQuery<IAgenda, AgendaSelectableField>;

export type IAgendaAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAgenda,
  AgendaSelectableField,
  AgendaSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAgendaRelationMap extends Record<AgendaRelationKey, unknown> {
  agendaKind: ValueTypes.IValueAsOneRelationQuery;
  bill: BillsTypes.IBillsAsOneRelationQuery;
  motion: MotionsTypes.IMotionsAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAgendaRelationQueries = Q.IBaseRelationQueries<
  IAgenda,
  AgendaRelationKey,
  IAgendaRelationMap
>;

export type IAgendaItemQuery = Q.IBaseItemQuery<
  IAgenda,
  AgendaRelationKey,
  AgendaSelectableField,
  AgendaRelationKey,
  AgendaSelectableField,
  IAgendaRelationMap,
  IAgendaRelationQueries
>;

export type IAgendaListQuery = Q.IBaseListQuery<
  IAgenda,
  AgendaRelationKey,
  AgendaSelectableField,
  AgendaSortableField,
  AgendaRelationKey,
  AgendaSelectableField,
  AgendaSortableField,
  AgendaDateRangeField,
  AgendaFilterableField,
  IAgendaRelationMap,
  IAgendaRelationQueries,
  IAgendaItemQuery
>;
