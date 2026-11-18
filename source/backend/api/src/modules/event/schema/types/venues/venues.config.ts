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
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IVenues,
  VenuesKey,
  VenuesRelationKey,
  VenuesSortableField,
  VenuesFilterableField,
  VenuesDateRangeField,
  VenuesSelectableField,
  IVenuesAsOneRelationConfig,
  IVenuesAsManyRelationConfig,
} from "./venues.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VENUES_RELATION_KEYS = [
  "feature",
  "occurrence",
  "role",
] as const satisfies readonly VenuesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VENUES_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "id",
  "note",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly VenuesKey[];

export const VENUES_SEARCHABLE_FIELDS = ["note"] as const satisfies readonly VenuesKey[];

export const VENUES_FILTERABLE_FIELDS = [
  "featureId",
  "id",
  "occurrenceId",
  "roleId",
] as const satisfies readonly VenuesKey[];

export const VENUES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly VenuesKey[];

export const VENUES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IVenues> = {
  searchableFields: [...VENUES_SEARCHABLE_FIELDS],
  filterFields: [...VENUES_FILTERABLE_FIELDS],
  dateRangeFields: [...VENUES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VENUES_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "id",
  "note",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly VenuesKey[];

export const VENUES_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "id",
  "note",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly VenuesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VENUES_EDITABLE_FIELDS = [
  "featureId",
  "note",
  "occurrenceId",
  "roleId",
] as const satisfies readonly VenuesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VENUES_AS_ONE_RELATION_CONFIG = {
  relation: "venues",
  type: ERelationType.One,
  selectableFields: VENUES_SELECTABLE_FIELDS,
  defaultSelectFields: VENUES_DEFAULT_SELECT_FIELDS,
} as const satisfies IVenuesAsOneRelationConfig;

export const VENUES_AS_MANY_RELATION_CONFIG = {
  relation: "venues",
  type: ERelationType.Many,
  selectableFields: VENUES_SELECTABLE_FIELDS,
  defaultSelectFields: VENUES_DEFAULT_SELECT_FIELDS,
  sortableFields: VENUES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IVenuesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VENUES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<VenuesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<VenuesRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<VenuesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const VENUES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VENUES_QUERY_OPTIONS = {
  searchableFields: VENUES_SEARCHABLE_FIELDS,
  selectableFields: VENUES_SELECTABLE_FIELDS,
  defaultSelectFields: VENUES_DEFAULT_SELECT_FIELDS,
  sortableFields: VENUES_SORTABLE_FIELDS,
  filterFields: VENUES_FILTERABLE_FIELDS,
  dateRangeFields: VENUES_DATE_RANGE_FIELDS,
  relationKeys: VENUES_RELATION_KEYS,
  editableFields: VENUES_EDITABLE_FIELDS,
  asOne: VENUES_AS_ONE_RELATION_CONFIG,
  asMany: VENUES_AS_MANY_RELATION_CONFIG,
  oneRelations: VENUES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VENUES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IVenues,
  VenuesSortableField,
  VenuesSelectableField,
  VenuesFilterableField,
  VenuesDateRangeField,
  VenuesRelationKey,
  typeof VENUES_ONE_RELATION_QUERY_OPTIONS,
  typeof VENUES_MANY_RELATION_QUERY_OPTIONS
>;
