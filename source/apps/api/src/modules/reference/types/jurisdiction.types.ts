// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { JurisdictionKind } from '#/types/reference/jurisdiction-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  JURISDICTION_RELATION_KEYS,
  JURISDICTION_SORTABLE_FIELDS,
  JURISDICTION_SEARCHABLE_FIELDS,
  JURISDICTION_FILTERABLE_FIELDS,
  JURISDICTION_DATE_RANGE_FIELDS,
  JURISDICTION_SELECTABLE_FIELDS,
  JURISDICTION_DEFAULT_SELECT_FIELDS,
  JURISDICTION_EDITABLE_FIELDS
} from './jurisdiction.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Jurisdiction */
export interface IJurisdiction extends B.IBase {
  code: string;
  isCurrent: boolean;
  kind: JurisdictionKind;
  name: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type JurisdictionKey = keyof IJurisdiction;

export type JurisdictionRelationKey = (typeof JURISDICTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IJurisdictionReadonlyFields = B.IBaseReadonlyFields;

export type IJurisdictionContextualFields = never;

export type IJurisdictionSensitiveFields = never;

export type IJurisdictionTransitionFields = never;

export type IJurisdictionImmutableFields =
  | IJurisdictionReadonlyFields
  | IJurisdictionContextualFields
  | IJurisdictionSensitiveFields
  | IJurisdictionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IJurisdictionCreatable = Omit<IJurisdiction, IJurisdictionImmutableFields | JurisdictionRelationKey>;

export type IJurisdictionSystemWritable = Omit<IJurisdiction, B.IBaseReadonlyFields | JurisdictionRelationKey>;

export type IJurisdictionUpdatable = Partial<Omit<IJurisdiction, IJurisdictionImmutableFields | JurisdictionRelationKey>>;

export interface IJurisdictionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type JurisdictionSortableField = (typeof JURISDICTION_SORTABLE_FIELDS)[number];

export type JurisdictionSearchableField = (typeof JURISDICTION_SEARCHABLE_FIELDS)[number];

export type JurisdictionFilterableField = (typeof JURISDICTION_FILTERABLE_FIELDS)[number];

export type JurisdictionDateRangeField = (typeof JURISDICTION_DATE_RANGE_FIELDS)[number];

export type JurisdictionSelectableField = (typeof JURISDICTION_SELECTABLE_FIELDS)[number];

export type JurisdictionDefaultSelectField = (typeof JURISDICTION_DEFAULT_SELECT_FIELDS)[number];

export type JurisdictionEditableField = (typeof JURISDICTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IJurisdictionAsOneRelationConfig = Q.IOneRelationConfig<'jurisdiction', JurisdictionSelectableField>;

export type IJurisdictionAsManyRelationConfig = Q.IManyRelationConfig<'jurisdictions', JurisdictionSelectableField, JurisdictionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IJurisdictionAsOneRelationQuery = Q.IAsOneRelationQuery<IJurisdiction, JurisdictionSelectableField>;

export type IJurisdictionAsManyRelationQuery = Q.IAsManyRelationQuery<IJurisdiction, JurisdictionSelectableField, JurisdictionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IJurisdictionRelationMap extends Record<JurisdictionRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IJurisdictionRelationQueries = Q.IBaseRelationQueries<IJurisdiction, JurisdictionRelationKey, IJurisdictionRelationMap>;

export type IJurisdictionItemQuery = Q.IBaseItemQuery<
  IJurisdiction,
  JurisdictionRelationKey,
  JurisdictionSelectableField,
  JurisdictionRelationKey,
  JurisdictionSelectableField,
  IJurisdictionRelationMap,
  IJurisdictionRelationQueries
>;

export type IJurisdictionListQuery = Q.IBaseListQuery<
  IJurisdiction,
  JurisdictionRelationKey,
  JurisdictionSelectableField,
  JurisdictionSortableField,
  JurisdictionRelationKey,
  JurisdictionSelectableField,
  JurisdictionSortableField,
  JurisdictionDateRangeField,
  JurisdictionFilterableField,
  IJurisdictionRelationMap,
  IJurisdictionRelationQueries,
  IJurisdictionItemQuery
>;