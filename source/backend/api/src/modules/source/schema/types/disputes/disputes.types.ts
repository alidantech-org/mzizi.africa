// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DISPUTES_RELATION_KEYS,
  DISPUTES_SORTABLE_FIELDS,
  DISPUTES_SEARCHABLE_FIELDS,
  DISPUTES_FILTERABLE_FIELDS,
  DISPUTES_DATE_RANGE_FIELDS,
  DISPUTES_SELECTABLE_FIELDS,
  DISPUTES_DEFAULT_SELECT_FIELDS,
  DISPUTES_EDITABLE_FIELDS,
} from "./disputes.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A recorded disagreement between sources about one record. Both claims are kept with their citations and shown side by side; nothing is overwritten. */
export interface IDisputes extends B.IBase {
  code: string;
  kindId: string;
  resolutionCitationId: string | null;
  resolvedOn: Date | null;
  statusId: string;
  subjectId: string;
  subjectTable: SubjectTable;
  summary: string;
  readonly kind?: ValueTypes.IValue;
  readonly resolutionCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DisputesKey = keyof IDisputes;

export type DisputesRelationKey = (typeof DISPUTES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDisputesReadonlyFields = B.IBaseReadonlyFields;

export type IDisputesContextualFields = never;

export type IDisputesSensitiveFields = never;

export type IDisputesTransitionFields = never;

export type IDisputesImmutableFields =
  | IDisputesReadonlyFields
  | IDisputesContextualFields
  | IDisputesSensitiveFields
  | IDisputesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDisputesCreatable = Omit<IDisputes, IDisputesImmutableFields | DisputesRelationKey>;

export type IDisputesSystemWritable = Omit<IDisputes, B.IBaseReadonlyFields | DisputesRelationKey>;

export type IDisputesUpdatable = Partial<
  Omit<IDisputes, IDisputesImmutableFields | DisputesRelationKey>
>;

export interface IDisputesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DisputesSortableField = (typeof DISPUTES_SORTABLE_FIELDS)[number];

export type DisputesSearchableField = (typeof DISPUTES_SEARCHABLE_FIELDS)[number];

export type DisputesFilterableField = (typeof DISPUTES_FILTERABLE_FIELDS)[number];

export type DisputesDateRangeField = (typeof DISPUTES_DATE_RANGE_FIELDS)[number];

export type DisputesSelectableField = (typeof DISPUTES_SELECTABLE_FIELDS)[number];

export type DisputesDefaultSelectField = (typeof DISPUTES_DEFAULT_SELECT_FIELDS)[number];

export type DisputesEditableField = (typeof DISPUTES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDisputesAsOneRelationConfig = Q.IOneRelationConfig<
  "disputes",
  DisputesSelectableField
>;

export type IDisputesAsManyRelationConfig = Q.IManyRelationConfig<
  "disputes",
  DisputesSelectableField,
  DisputesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDisputesAsOneRelationQuery = Q.IAsOneRelationQuery<IDisputes, DisputesSelectableField>;

export type IDisputesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDisputes,
  DisputesSelectableField,
  DisputesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDisputesRelationMap extends Record<DisputesRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  resolutionCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDisputesRelationQueries = Q.IBaseRelationQueries<
  IDisputes,
  DisputesRelationKey,
  IDisputesRelationMap
>;

export type IDisputesItemQuery = Q.IBaseItemQuery<
  IDisputes,
  DisputesRelationKey,
  DisputesSelectableField,
  DisputesRelationKey,
  DisputesSelectableField,
  IDisputesRelationMap,
  IDisputesRelationQueries
>;

export type IDisputesListQuery = Q.IBaseListQuery<
  IDisputes,
  DisputesRelationKey,
  DisputesSelectableField,
  DisputesSortableField,
  DisputesRelationKey,
  DisputesSelectableField,
  DisputesSortableField,
  DisputesDateRangeField,
  DisputesFilterableField,
  IDisputesRelationMap,
  IDisputesRelationQueries,
  IDisputesItemQuery
>;
