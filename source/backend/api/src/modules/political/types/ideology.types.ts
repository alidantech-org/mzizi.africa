// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  IDEOLOGY_RELATION_KEYS,
  IDEOLOGY_SORTABLE_FIELDS,
  IDEOLOGY_SEARCHABLE_FIELDS,
  IDEOLOGY_FILTERABLE_FIELDS,
  IDEOLOGY_DATE_RANGE_FIELDS,
  IDEOLOGY_SELECTABLE_FIELDS,
  IDEOLOGY_DEFAULT_SELECT_FIELDS,
  IDEOLOGY_EDITABLE_FIELDS
} from './ideology.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Ideology */
export interface IIdeology extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  description: string | null;
  isCurrent: boolean;
  jurisdictionId: string;
  label: string;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IdeologyKey = keyof IIdeology;

export type IdeologyRelationKey = (typeof IDEOLOGY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIdeologyReadonlyFields = B.IBaseReadonlyFields;

export type IIdeologyContextualFields = never;

export type IIdeologySensitiveFields = never;

export type IIdeologyTransitionFields = never;

export type IIdeologyImmutableFields =
  | IIdeologyReadonlyFields
  | IIdeologyContextualFields
  | IIdeologySensitiveFields
  | IIdeologyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIdeologyCreatable = Omit<IIdeology, IIdeologyImmutableFields | IdeologyRelationKey>;

export type IIdeologySystemWritable = Omit<IIdeology, B.IBaseReadonlyFields | IdeologyRelationKey>;

export type IIdeologyUpdatable = Partial<Omit<IIdeology, IIdeologyImmutableFields | IdeologyRelationKey>>;

export interface IIdeologyTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IdeologySortableField = (typeof IDEOLOGY_SORTABLE_FIELDS)[number];

export type IdeologySearchableField = (typeof IDEOLOGY_SEARCHABLE_FIELDS)[number];

export type IdeologyFilterableField = (typeof IDEOLOGY_FILTERABLE_FIELDS)[number];

export type IdeologyDateRangeField = (typeof IDEOLOGY_DATE_RANGE_FIELDS)[number];

export type IdeologySelectableField = (typeof IDEOLOGY_SELECTABLE_FIELDS)[number];

export type IdeologyDefaultSelectField = (typeof IDEOLOGY_DEFAULT_SELECT_FIELDS)[number];

export type IdeologyEditableField = (typeof IDEOLOGY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIdeologyAsOneRelationConfig = Q.IOneRelationConfig<'ideology', IdeologySelectableField>;

export type IIdeologyAsManyRelationConfig = Q.IManyRelationConfig<'ideologys', IdeologySelectableField, IdeologySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIdeologyAsOneRelationQuery = Q.IAsOneRelationQuery<IIdeology, IdeologySelectableField>;

export type IIdeologyAsManyRelationQuery = Q.IAsManyRelationQuery<IIdeology, IdeologySelectableField, IdeologySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIdeologyRelationMap extends Record<IdeologyRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIdeologyRelationQueries = Q.IBaseRelationQueries<IIdeology, IdeologyRelationKey, IIdeologyRelationMap>;

export type IIdeologyItemQuery = Q.IBaseItemQuery<
  IIdeology,
  IdeologyRelationKey,
  IdeologySelectableField,
  IdeologyRelationKey,
  IdeologySelectableField,
  IIdeologyRelationMap,
  IIdeologyRelationQueries
>;

export type IIdeologyListQuery = Q.IBaseListQuery<
  IIdeology,
  IdeologyRelationKey,
  IdeologySelectableField,
  IdeologySortableField,
  IdeologyRelationKey,
  IdeologySelectableField,
  IdeologySortableField,
  IdeologyDateRangeField,
  IdeologyFilterableField,
  IIdeologyRelationMap,
  IIdeologyRelationQueries,
  IIdeologyItemQuery
>;