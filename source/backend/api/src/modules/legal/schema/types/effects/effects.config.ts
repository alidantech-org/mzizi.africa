// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as WordingsConfig from "#/modules/legal/schema/types/wordings/wordings.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEffects,
  EffectsKey,
  EffectsRelationKey,
  EffectsSortableField,
  EffectsFilterableField,
  EffectsDateRangeField,
  EffectsSelectableField,
  IEffectsAsOneRelationConfig,
  IEffectsAsManyRelationConfig,
} from "./effects.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EFFECTS_RELATION_KEYS = ["kind", "wording"] as const satisfies readonly EffectsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EFFECTS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "endedOn",
  "explanation",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "observedAt",
  "reviewStatus",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly EffectsKey[];

export const EFFECTS_SEARCHABLE_FIELDS = [
  "code",
  "explanation",
] as const satisfies readonly EffectsKey[];

export const EFFECTS_FILTERABLE_FIELDS = [
  "fromToPrecision",
  "id",
  "kindId",
  "reviewStatus",
  "subjectId",
  "subjectTable",
  "wordingId",
] as const satisfies readonly EffectsKey[];

export const EFFECTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "endedOn",
  "observedAt",
  "updatedAt",
] as const satisfies readonly EffectsKey[];

export const EFFECTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IEffects> = {
  searchableFields: [...EFFECTS_SEARCHABLE_FIELDS],
  filterFields: [...EFFECTS_FILTERABLE_FIELDS],
  dateRangeFields: [...EFFECTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EFFECTS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "endedOn",
  "explanation",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "observedAt",
  "reviewStatus",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly EffectsKey[];

export const EFFECTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "endedOn",
  "explanation",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "observedAt",
  "reviewStatus",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly EffectsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EFFECTS_EDITABLE_FIELDS = [
  "code",
  "effectiveOn",
  "endedOn",
  "explanation",
  "fromToPrecision",
  "fromYear",
  "kindId",
  "observedAt",
  "reviewStatus",
  "subjectId",
  "subjectTable",
  "toYear",
  "wordingId",
] as const satisfies readonly EffectsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EFFECTS_AS_ONE_RELATION_CONFIG = {
  relation: "effects",
  type: ERelationType.One,
  selectableFields: EFFECTS_SELECTABLE_FIELDS,
  defaultSelectFields: EFFECTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IEffectsAsOneRelationConfig;

export const EFFECTS_AS_MANY_RELATION_CONFIG = {
  relation: "effects",
  type: ERelationType.Many,
  selectableFields: EFFECTS_SELECTABLE_FIELDS,
  defaultSelectFields: EFFECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: EFFECTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IEffectsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EFFECTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EffectsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<EffectsRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "wording",
  ),
] as const;

export const EFFECTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EFFECTS_QUERY_OPTIONS = {
  searchableFields: EFFECTS_SEARCHABLE_FIELDS,
  selectableFields: EFFECTS_SELECTABLE_FIELDS,
  defaultSelectFields: EFFECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: EFFECTS_SORTABLE_FIELDS,
  filterFields: EFFECTS_FILTERABLE_FIELDS,
  dateRangeFields: EFFECTS_DATE_RANGE_FIELDS,
  relationKeys: EFFECTS_RELATION_KEYS,
  editableFields: EFFECTS_EDITABLE_FIELDS,
  asOne: EFFECTS_AS_ONE_RELATION_CONFIG,
  asMany: EFFECTS_AS_MANY_RELATION_CONFIG,
  oneRelations: EFFECTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EFFECTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IEffects,
  EffectsSortableField,
  EffectsSelectableField,
  EffectsFilterableField,
  EffectsDateRangeField,
  EffectsRelationKey,
  typeof EFFECTS_ONE_RELATION_QUERY_OPTIONS,
  typeof EFFECTS_MANY_RELATION_QUERY_OPTIONS
>;
