// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { ReferenceMethod } from "#/modules/legal/schema/enum/reference-method.enum";
import type { ReferenceRelation } from "#/modules/legal/schema/enum/reference-relation.enum";
import type { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as WordingsTypes from "#/modules/legal/schema/types/wordings/wordings.types";
import type * as TranslationsTypes from "#/modules/legal/schema/types/translations/translations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REFERENCES_RELATION_KEYS,
  REFERENCES_SORTABLE_FIELDS,
  REFERENCES_SEARCHABLE_FIELDS,
  REFERENCES_FILTERABLE_FIELDS,
  REFERENCES_DATE_RANGE_FIELDS,
  REFERENCES_SELECTABLE_FIELDS,
  REFERENCES_DEFAULT_SELECT_FIELDS,
  REFERENCES_EDITABLE_FIELDS,
} from "./references.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment. */
export interface IReferences extends B.IBase {
  code: string;
  method: ReferenceMethod;
  relation: ReferenceRelation;
  reviewStatus: ReviewStatus;
  spanEnd: number;
  spanStart: number;
  spanText: string;
  targetProvisionId: string;
  targetWordingId: string | null;
  translationId: string | null;
  wordingId: string | null;
  readonly targetProvision?: ProvisionsTypes.IProvisions;
  readonly targetWording?: WordingsTypes.IWordings;
  readonly translation?: TranslationsTypes.ITranslations;
  readonly wording?: WordingsTypes.IWordings;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReferencesKey = keyof IReferences;

export type ReferencesRelationKey = (typeof REFERENCES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReferencesReadonlyFields = B.IBaseReadonlyFields;

export type IReferencesContextualFields = never;

export type IReferencesSensitiveFields = never;

export type IReferencesTransitionFields = never;

export type IReferencesImmutableFields =
  | IReferencesReadonlyFields
  | IReferencesContextualFields
  | IReferencesSensitiveFields
  | IReferencesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReferencesCreatable = Omit<
  IReferences,
  IReferencesImmutableFields | ReferencesRelationKey
>;

export type IReferencesSystemWritable = Omit<
  IReferences,
  B.IBaseReadonlyFields | ReferencesRelationKey
>;

export type IReferencesUpdatable = Partial<
  Omit<IReferences, IReferencesImmutableFields | ReferencesRelationKey>
>;

export interface IReferencesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReferencesSortableField = (typeof REFERENCES_SORTABLE_FIELDS)[number];

export type ReferencesSearchableField = (typeof REFERENCES_SEARCHABLE_FIELDS)[number];

export type ReferencesFilterableField = (typeof REFERENCES_FILTERABLE_FIELDS)[number];

export type ReferencesDateRangeField = (typeof REFERENCES_DATE_RANGE_FIELDS)[number];

export type ReferencesSelectableField = (typeof REFERENCES_SELECTABLE_FIELDS)[number];

export type ReferencesDefaultSelectField = (typeof REFERENCES_DEFAULT_SELECT_FIELDS)[number];

export type ReferencesEditableField = (typeof REFERENCES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReferencesAsOneRelationConfig = Q.IOneRelationConfig<
  "references",
  ReferencesSelectableField
>;

export type IReferencesAsManyRelationConfig = Q.IManyRelationConfig<
  "references",
  ReferencesSelectableField,
  ReferencesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReferencesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IReferences,
  ReferencesSelectableField
>;

export type IReferencesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IReferences,
  ReferencesSelectableField,
  ReferencesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReferencesRelationMap extends Record<ReferencesRelationKey, unknown> {
  targetProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  targetWording: WordingsTypes.IWordingsAsOneRelationQuery;
  translation: TranslationsTypes.ITranslationsAsOneRelationQuery;
  wording: WordingsTypes.IWordingsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReferencesRelationQueries = Q.IBaseRelationQueries<
  IReferences,
  ReferencesRelationKey,
  IReferencesRelationMap
>;

export type IReferencesItemQuery = Q.IBaseItemQuery<
  IReferences,
  ReferencesRelationKey,
  ReferencesSelectableField,
  ReferencesRelationKey,
  ReferencesSelectableField,
  IReferencesRelationMap,
  IReferencesRelationQueries
>;

export type IReferencesListQuery = Q.IBaseListQuery<
  IReferences,
  ReferencesRelationKey,
  ReferencesSelectableField,
  ReferencesSortableField,
  ReferencesRelationKey,
  ReferencesSelectableField,
  ReferencesSortableField,
  ReferencesDateRangeField,
  ReferencesFilterableField,
  IReferencesRelationMap,
  IReferencesRelationQueries,
  IReferencesItemQuery
>;
