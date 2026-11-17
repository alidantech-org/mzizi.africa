// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AddressesTypes from "#/modules/source/schema/types/addresses/addresses.types";
import type * as ArtifactsTypes from "#/modules/source/schema/types/artifacts/artifacts.types";
import type * as CapturesTypes from "#/modules/source/schema/types/captures/captures.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CITATIONS_RELATION_KEYS,
  CITATIONS_SORTABLE_FIELDS,
  CITATIONS_SEARCHABLE_FIELDS,
  CITATIONS_FILTERABLE_FIELDS,
  CITATIONS_DATE_RANGE_FIELDS,
  CITATIONS_SELECTABLE_FIELDS,
  CITATIONS_DEFAULT_SELECT_FIELDS,
  CITATIONS_EDITABLE_FIELDS,
} from "./citations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp. */
export interface ICitations extends B.IBase {
  addressId: string | null;
  artifactId: string | null;
  captureId: string | null;
  code: string;
  locator: string;
  locatorKindId: string;
  quotedHash: string | null;
  recordedAt: Date;
  subjectId: string | null;
  subjectTable: SubjectTable | null;
  readonly address?: AddressesTypes.IAddresses;
  readonly artifact?: ArtifactsTypes.IArtifacts;
  readonly capture?: CapturesTypes.ICaptures;
  readonly locatorKind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CitationsKey = keyof ICitations;

export type CitationsRelationKey = (typeof CITATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICitationsReadonlyFields = B.IBaseReadonlyFields;

export type ICitationsContextualFields = never;

export type ICitationsSensitiveFields = never;

export type ICitationsTransitionFields = never;

export type ICitationsImmutableFields =
  | ICitationsReadonlyFields
  | ICitationsContextualFields
  | ICitationsSensitiveFields
  | ICitationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICitationsCreatable = Omit<
  ICitations,
  ICitationsImmutableFields | CitationsRelationKey
>;

export type ICitationsSystemWritable = Omit<
  ICitations,
  B.IBaseReadonlyFields | CitationsRelationKey
>;

export type ICitationsUpdatable = Partial<
  Omit<ICitations, ICitationsImmutableFields | CitationsRelationKey>
>;

export interface ICitationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CitationsSortableField = (typeof CITATIONS_SORTABLE_FIELDS)[number];

export type CitationsSearchableField = (typeof CITATIONS_SEARCHABLE_FIELDS)[number];

export type CitationsFilterableField = (typeof CITATIONS_FILTERABLE_FIELDS)[number];

export type CitationsDateRangeField = (typeof CITATIONS_DATE_RANGE_FIELDS)[number];

export type CitationsSelectableField = (typeof CITATIONS_SELECTABLE_FIELDS)[number];

export type CitationsDefaultSelectField = (typeof CITATIONS_DEFAULT_SELECT_FIELDS)[number];

export type CitationsEditableField = (typeof CITATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICitationsAsOneRelationConfig = Q.IOneRelationConfig<
  "citations",
  CitationsSelectableField
>;

export type ICitationsAsManyRelationConfig = Q.IManyRelationConfig<
  "citations",
  CitationsSelectableField,
  CitationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICitationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  ICitations,
  CitationsSelectableField
>;

export type ICitationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICitations,
  CitationsSelectableField,
  CitationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICitationsRelationMap extends Record<CitationsRelationKey, unknown> {
  address: AddressesTypes.IAddressesAsOneRelationQuery;
  artifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  capture: CapturesTypes.ICapturesAsOneRelationQuery;
  locatorKind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICitationsRelationQueries = Q.IBaseRelationQueries<
  ICitations,
  CitationsRelationKey,
  ICitationsRelationMap
>;

export type ICitationsItemQuery = Q.IBaseItemQuery<
  ICitations,
  CitationsRelationKey,
  CitationsSelectableField,
  CitationsRelationKey,
  CitationsSelectableField,
  ICitationsRelationMap,
  ICitationsRelationQueries
>;

export type ICitationsListQuery = Q.IBaseListQuery<
  ICitations,
  CitationsRelationKey,
  CitationsSelectableField,
  CitationsSortableField,
  CitationsRelationKey,
  CitationsSelectableField,
  CitationsSortableField,
  CitationsDateRangeField,
  CitationsFilterableField,
  ICitationsRelationMap,
  ICitationsRelationQueries,
  ICitationsItemQuery
>;
