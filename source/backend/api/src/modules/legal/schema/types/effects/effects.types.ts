// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as WordingsTypes from "#/modules/legal/schema/types/wordings/wordings.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EFFECTS_RELATION_KEYS,
  EFFECTS_SORTABLE_FIELDS,
  EFFECTS_SEARCHABLE_FIELDS,
  EFFECTS_FILTERABLE_FIELDS,
  EFFECTS_DATE_RANGE_FIELDS,
  EFFECTS_SELECTABLE_FIELDS,
  EFFECTS_DEFAULT_SELECT_FIELDS,
  EFFECTS_EDITABLE_FIELDS,
} from "./effects.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject. */
export interface IEffects extends B.IBase {
  code: string;
  effectiveOn: Date | null;
  endedOn: Date | null;
  explanation: string | null;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  kindId: string;
  observedAt: Date;
  reviewStatus: ReviewStatus;
  subjectId: string;
  subjectTable: SubjectTable;
  toYear: number | null;
  wordingId: string;
  readonly kind?: ValueTypes.IValue;
  readonly wording?: WordingsTypes.IWordings;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EffectsKey = keyof IEffects;

export type EffectsRelationKey = (typeof EFFECTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEffectsReadonlyFields = B.IBaseReadonlyFields;

export type IEffectsContextualFields = never;

export type IEffectsSensitiveFields = never;

export type IEffectsTransitionFields = never;

export type IEffectsImmutableFields =
  | IEffectsReadonlyFields
  | IEffectsContextualFields
  | IEffectsSensitiveFields
  | IEffectsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEffectsCreatable = Omit<IEffects, IEffectsImmutableFields | EffectsRelationKey>;

export type IEffectsSystemWritable = Omit<IEffects, B.IBaseReadonlyFields | EffectsRelationKey>;

export type IEffectsUpdatable = Partial<
  Omit<IEffects, IEffectsImmutableFields | EffectsRelationKey>
>;

export interface IEffectsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EffectsSortableField = (typeof EFFECTS_SORTABLE_FIELDS)[number];

export type EffectsSearchableField = (typeof EFFECTS_SEARCHABLE_FIELDS)[number];

export type EffectsFilterableField = (typeof EFFECTS_FILTERABLE_FIELDS)[number];

export type EffectsDateRangeField = (typeof EFFECTS_DATE_RANGE_FIELDS)[number];

export type EffectsSelectableField = (typeof EFFECTS_SELECTABLE_FIELDS)[number];

export type EffectsDefaultSelectField = (typeof EFFECTS_DEFAULT_SELECT_FIELDS)[number];

export type EffectsEditableField = (typeof EFFECTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEffectsAsOneRelationConfig = Q.IOneRelationConfig<"effects", EffectsSelectableField>;

export type IEffectsAsManyRelationConfig = Q.IManyRelationConfig<
  "effects",
  EffectsSelectableField,
  EffectsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEffectsAsOneRelationQuery = Q.IAsOneRelationQuery<IEffects, EffectsSelectableField>;

export type IEffectsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IEffects,
  EffectsSelectableField,
  EffectsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEffectsRelationMap extends Record<EffectsRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  wording: WordingsTypes.IWordingsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEffectsRelationQueries = Q.IBaseRelationQueries<
  IEffects,
  EffectsRelationKey,
  IEffectsRelationMap
>;

export type IEffectsItemQuery = Q.IBaseItemQuery<
  IEffects,
  EffectsRelationKey,
  EffectsSelectableField,
  EffectsRelationKey,
  EffectsSelectableField,
  IEffectsRelationMap,
  IEffectsRelationQueries
>;

export type IEffectsListQuery = Q.IBaseListQuery<
  IEffects,
  EffectsRelationKey,
  EffectsSelectableField,
  EffectsSortableField,
  EffectsRelationKey,
  EffectsSelectableField,
  EffectsSortableField,
  EffectsDateRangeField,
  EffectsFilterableField,
  IEffectsRelationMap,
  IEffectsRelationQueries,
  IEffectsItemQuery
>;
