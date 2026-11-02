// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { LaunchStage } from '#/types/website/launch-stage.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOSSIER_RELATION_KEYS,
  DOSSIER_SORTABLE_FIELDS,
  DOSSIER_SEARCHABLE_FIELDS,
  DOSSIER_FILTERABLE_FIELDS,
  DOSSIER_DATE_RANGE_FIELDS,
  DOSSIER_SELECTABLE_FIELDS,
  DOSSIER_DEFAULT_SELECT_FIELDS,
  DOSSIER_EDITABLE_FIELDS
} from './dossier.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Dossier */
export interface IDossier extends B.IBase {
  applicableLaws: string;
  isCurrent: boolean;
  jurisdictionId: string;
  launchStage: LaunchStage;
  legislationRepositoryUrl: string | null;
  openQuestions: string | null;
  regulator: string | null;
  reviewDueAt: Date | null;
  reviewedAt: Date | null;
  reviewerId: string | null;
  supersedesId: string | null;
  treatyStatus: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DossierKey = keyof IDossier;

export type DossierRelationKey = (typeof DOSSIER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDossierReadonlyFields = B.IBaseReadonlyFields;

export type IDossierContextualFields = never;

export type IDossierSensitiveFields = never;

export type IDossierTransitionFields = never;

export type IDossierImmutableFields =
  | IDossierReadonlyFields
  | IDossierContextualFields
  | IDossierSensitiveFields
  | IDossierTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDossierCreatable = Omit<IDossier, IDossierImmutableFields | DossierRelationKey>;

export type IDossierSystemWritable = Omit<IDossier, B.IBaseReadonlyFields | DossierRelationKey>;

export type IDossierUpdatable = Partial<Omit<IDossier, IDossierImmutableFields | DossierRelationKey>>;

export interface IDossierTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DossierSortableField = (typeof DOSSIER_SORTABLE_FIELDS)[number];

export type DossierSearchableField = (typeof DOSSIER_SEARCHABLE_FIELDS)[number];

export type DossierFilterableField = (typeof DOSSIER_FILTERABLE_FIELDS)[number];

export type DossierDateRangeField = (typeof DOSSIER_DATE_RANGE_FIELDS)[number];

export type DossierSelectableField = (typeof DOSSIER_SELECTABLE_FIELDS)[number];

export type DossierDefaultSelectField = (typeof DOSSIER_DEFAULT_SELECT_FIELDS)[number];

export type DossierEditableField = (typeof DOSSIER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDossierAsOneRelationConfig = Q.IOneRelationConfig<'dossier', DossierSelectableField>;

export type IDossierAsManyRelationConfig = Q.IManyRelationConfig<'dossiers', DossierSelectableField, DossierSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDossierAsOneRelationQuery = Q.IAsOneRelationQuery<IDossier, DossierSelectableField>;

export type IDossierAsManyRelationQuery = Q.IAsManyRelationQuery<IDossier, DossierSelectableField, DossierSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDossierRelationMap extends Record<DossierRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDossierRelationQueries = Q.IBaseRelationQueries<IDossier, DossierRelationKey, IDossierRelationMap>;

export type IDossierItemQuery = Q.IBaseItemQuery<
  IDossier,
  DossierRelationKey,
  DossierSelectableField,
  DossierRelationKey,
  DossierSelectableField,
  IDossierRelationMap,
  IDossierRelationQueries
>;

export type IDossierListQuery = Q.IBaseListQuery<
  IDossier,
  DossierRelationKey,
  DossierSelectableField,
  DossierSortableField,
  DossierRelationKey,
  DossierSelectableField,
  DossierSortableField,
  DossierDateRangeField,
  DossierFilterableField,
  IDossierRelationMap,
  IDossierRelationQueries,
  IDossierItemQuery
>;