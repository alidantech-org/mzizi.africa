// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIdentifiers,
  IdentifiersKey,
  IdentifiersRelationKey,
  IdentifiersSortableField,
  IdentifiersFilterableField,
  IdentifiersDateRangeField,
  IdentifiersSelectableField,
  IIdentifiersAsOneRelationConfig,
  IIdentifiersAsManyRelationConfig,
} from "./identifiers.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const IDENTIFIERS_RELATION_KEYS = [
  "feature",
  "identifierScheme",
] as const satisfies readonly IdentifiersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "externalId",
  "featureId",
  "id",
  "identifierSchemeId",
  "namespace",
  "updatedAt",
  "version",
] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_SEARCHABLE_FIELDS = [
  "externalId",
  "namespace",
] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_FILTERABLE_FIELDS = [
  "featureId",
  "id",
  "identifierSchemeId",
] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IIdentifiers> = {
  searchableFields: [...IDENTIFIERS_SEARCHABLE_FIELDS],
  filterFields: [...IDENTIFIERS_FILTERABLE_FIELDS],
  dateRangeFields: [...IDENTIFIERS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "externalId",
  "featureId",
  "id",
  "identifierSchemeId",
  "namespace",
  "updatedAt",
  "version",
] as const satisfies readonly IdentifiersKey[];

export const IDENTIFIERS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "externalId",
  "featureId",
  "id",
  "identifierSchemeId",
  "namespace",
  "updatedAt",
  "version",
] as const satisfies readonly IdentifiersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const IDENTIFIERS_EDITABLE_FIELDS = [
  "externalId",
  "featureId",
  "identifierSchemeId",
  "namespace",
] as const satisfies readonly IdentifiersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const IDENTIFIERS_AS_ONE_RELATION_CONFIG = {
  relation: "identifiers",
  type: ERelationType.One,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS,
} as const satisfies IIdentifiersAsOneRelationConfig;

export const IDENTIFIERS_AS_MANY_RELATION_CONFIG = {
  relation: "identifiers",
  type: ERelationType.Many,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS,
  sortableFields: IDENTIFIERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IIdentifiersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<IdentifiersRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "identifierScheme",
  ),
] as const;

export const IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const IDENTIFIERS_QUERY_OPTIONS = {
  searchableFields: IDENTIFIERS_SEARCHABLE_FIELDS,
  selectableFields: IDENTIFIERS_SELECTABLE_FIELDS,
  defaultSelectFields: IDENTIFIERS_DEFAULT_SELECT_FIELDS,
  sortableFields: IDENTIFIERS_SORTABLE_FIELDS,
  filterFields: IDENTIFIERS_FILTERABLE_FIELDS,
  dateRangeFields: IDENTIFIERS_DATE_RANGE_FIELDS,
  relationKeys: IDENTIFIERS_RELATION_KEYS,
  editableFields: IDENTIFIERS_EDITABLE_FIELDS,
  asOne: IDENTIFIERS_AS_ONE_RELATION_CONFIG,
  asMany: IDENTIFIERS_AS_MANY_RELATION_CONFIG,
  oneRelations: IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IIdentifiers,
  IdentifiersSortableField,
  IdentifiersSelectableField,
  IdentifiersFilterableField,
  IdentifiersDateRangeField,
  IdentifiersRelationKey,
  typeof IDENTIFIERS_ONE_RELATION_QUERY_OPTIONS,
  typeof IDENTIFIERS_MANY_RELATION_QUERY_OPTIONS
>;
