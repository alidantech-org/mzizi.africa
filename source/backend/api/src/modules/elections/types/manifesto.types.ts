// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CandidateTypes from '#/modules/elections/types/candidate.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANIFESTO_RELATION_KEYS,
  MANIFESTO_SORTABLE_FIELDS,
  MANIFESTO_SEARCHABLE_FIELDS,
  MANIFESTO_FILTERABLE_FIELDS,
  MANIFESTO_DATE_RANGE_FIELDS,
  MANIFESTO_SELECTABLE_FIELDS,
  MANIFESTO_DEFAULT_SELECT_FIELDS,
  MANIFESTO_EDITABLE_FIELDS
} from './manifesto.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Manifesto */
export interface IManifesto extends B.IBase {
  candidateId: string;
  documentUrl: string | null;
  isCurrent: boolean;
  language: string | null;
  publishedOn: Date | null;
  title: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly candidate?: CandidateTypes.ICandidate;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ManifestoKey = keyof IManifesto;

export type ManifestoRelationKey = (typeof MANIFESTO_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IManifestoReadonlyFields = B.IBaseReadonlyFields;

export type IManifestoContextualFields = never;

export type IManifestoSensitiveFields = never;

export type IManifestoTransitionFields = never;

export type IManifestoImmutableFields =
  | IManifestoReadonlyFields
  | IManifestoContextualFields
  | IManifestoSensitiveFields
  | IManifestoTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IManifestoCreatable = Omit<IManifesto, IManifestoImmutableFields | ManifestoRelationKey>;

export type IManifestoSystemWritable = Omit<IManifesto, B.IBaseReadonlyFields | ManifestoRelationKey>;

export type IManifestoUpdatable = Partial<Omit<IManifesto, IManifestoImmutableFields | ManifestoRelationKey>>;

export interface IManifestoTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ManifestoSortableField = (typeof MANIFESTO_SORTABLE_FIELDS)[number];

export type ManifestoSearchableField = (typeof MANIFESTO_SEARCHABLE_FIELDS)[number];

export type ManifestoFilterableField = (typeof MANIFESTO_FILTERABLE_FIELDS)[number];

export type ManifestoDateRangeField = (typeof MANIFESTO_DATE_RANGE_FIELDS)[number];

export type ManifestoSelectableField = (typeof MANIFESTO_SELECTABLE_FIELDS)[number];

export type ManifestoDefaultSelectField = (typeof MANIFESTO_DEFAULT_SELECT_FIELDS)[number];

export type ManifestoEditableField = (typeof MANIFESTO_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IManifestoAsOneRelationConfig = Q.IOneRelationConfig<'manifesto', ManifestoSelectableField>;

export type IManifestoAsManyRelationConfig = Q.IManyRelationConfig<'manifestos', ManifestoSelectableField, ManifestoSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IManifestoAsOneRelationQuery = Q.IAsOneRelationQuery<IManifesto, ManifestoSelectableField>;

export type IManifestoAsManyRelationQuery = Q.IAsManyRelationQuery<IManifesto, ManifestoSelectableField, ManifestoSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IManifestoRelationMap extends Record<ManifestoRelationKey, unknown> {
  candidate: CandidateTypes.ICandidateAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IManifestoRelationQueries = Q.IBaseRelationQueries<IManifesto, ManifestoRelationKey, IManifestoRelationMap>;

export type IManifestoItemQuery = Q.IBaseItemQuery<
  IManifesto,
  ManifestoRelationKey,
  ManifestoSelectableField,
  ManifestoRelationKey,
  ManifestoSelectableField,
  IManifestoRelationMap,
  IManifestoRelationQueries
>;

export type IManifestoListQuery = Q.IBaseListQuery<
  IManifesto,
  ManifestoRelationKey,
  ManifestoSelectableField,
  ManifestoSortableField,
  ManifestoRelationKey,
  ManifestoSelectableField,
  ManifestoSortableField,
  ManifestoDateRangeField,
  ManifestoFilterableField,
  IManifestoRelationMap,
  IManifestoRelationQueries,
  IManifestoItemQuery
>;