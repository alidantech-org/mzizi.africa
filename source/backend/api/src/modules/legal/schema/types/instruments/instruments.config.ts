// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IInstruments,
  InstrumentsKey,
  InstrumentsRelationKey,
  InstrumentsSortableField,
  InstrumentsFilterableField,
  InstrumentsDateRangeField,
  InstrumentsSelectableField,
  IInstrumentsAsOneRelationConfig,
  IInstrumentsAsManyRelationConfig,
} from "./instruments.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INSTRUMENTS_RELATION_KEYS = [
  "issuingEntity",
  "issuingUnit",
  "kind",
  "status",
] as const satisfies readonly InstrumentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INSTRUMENTS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "enactedOn",
  "id",
  "issuingEntityId",
  "issuingUnitId",
  "kindId",
  "publishedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly InstrumentsKey[];

export const INSTRUMENTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly InstrumentsKey[];

export const INSTRUMENTS_FILTERABLE_FIELDS = [
  "id",
  "issuingEntityId",
  "issuingUnitId",
  "kindId",
  "statusId",
] as const satisfies readonly InstrumentsKey[];

export const INSTRUMENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "enactedOn",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly InstrumentsKey[];

export const INSTRUMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IInstruments> = {
  searchableFields: [...INSTRUMENTS_SEARCHABLE_FIELDS],
  filterFields: [...INSTRUMENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...INSTRUMENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INSTRUMENTS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "enactedOn",
  "id",
  "issuingEntityId",
  "issuingUnitId",
  "kindId",
  "publishedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly InstrumentsKey[];

export const INSTRUMENTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "enactedOn",
  "id",
  "issuingEntityId",
  "issuingUnitId",
  "kindId",
  "publishedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly InstrumentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INSTRUMENTS_EDITABLE_FIELDS = [
  "code",
  "enactedOn",
  "issuingEntityId",
  "issuingUnitId",
  "kindId",
  "publishedOn",
  "statusId",
] as const satisfies readonly InstrumentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INSTRUMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "instruments",
  type: ERelationType.One,
  selectableFields: INSTRUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTRUMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IInstrumentsAsOneRelationConfig;

export const INSTRUMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "instruments",
  type: ERelationType.Many,
  selectableFields: INSTRUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTRUMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTRUMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IInstrumentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INSTRUMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<InstrumentsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "issuingEntity",
  ),
  Q.createRelationKeyMapper<InstrumentsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "issuingUnit",
  ),
  Q.createRelationKeyMapper<InstrumentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<InstrumentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const INSTRUMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INSTRUMENTS_QUERY_OPTIONS = {
  searchableFields: INSTRUMENTS_SEARCHABLE_FIELDS,
  selectableFields: INSTRUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTRUMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTRUMENTS_SORTABLE_FIELDS,
  filterFields: INSTRUMENTS_FILTERABLE_FIELDS,
  dateRangeFields: INSTRUMENTS_DATE_RANGE_FIELDS,
  relationKeys: INSTRUMENTS_RELATION_KEYS,
  editableFields: INSTRUMENTS_EDITABLE_FIELDS,
  asOne: INSTRUMENTS_AS_ONE_RELATION_CONFIG,
  asMany: INSTRUMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: INSTRUMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INSTRUMENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IInstruments,
  InstrumentsSortableField,
  InstrumentsSelectableField,
  InstrumentsFilterableField,
  InstrumentsDateRangeField,
  InstrumentsRelationKey,
  typeof INSTRUMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof INSTRUMENTS_MANY_RELATION_QUERY_OPTIONS
>;
