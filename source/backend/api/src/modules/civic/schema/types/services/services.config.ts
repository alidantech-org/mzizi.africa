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
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IServices,
  ServicesKey,
  ServicesRelationKey,
  ServicesSortableField,
  ServicesFilterableField,
  ServicesDateRangeField,
  ServicesSelectableField,
  IServicesAsOneRelationConfig,
  IServicesAsManyRelationConfig,
} from "./services.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SERVICES_RELATION_KEYS = [
  "placeFeature",
  "providerEntity",
  "responsibleInstitution",
  "scopeUnitFeature",
  "serviceKind",
  "sourceCitation",
] as const satisfies readonly ServicesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SERVICES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endsOn",
  "id",
  "name",
  "placeFeatureId",
  "providerEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "serviceKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly ServicesKey[];

export const SERVICES_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "name",
] as const satisfies readonly ServicesKey[];

export const SERVICES_FILTERABLE_FIELDS = [
  "id",
  "placeFeatureId",
  "providerEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "serviceKindId",
  "sourceCitationId",
] as const satisfies readonly ServicesKey[];

export const SERVICES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "startsOn",
  "updatedAt",
] as const satisfies readonly ServicesKey[];

export const SERVICES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IServices> = {
  searchableFields: [...SERVICES_SEARCHABLE_FIELDS],
  filterFields: [...SERVICES_FILTERABLE_FIELDS],
  dateRangeFields: [...SERVICES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SERVICES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endsOn",
  "id",
  "name",
  "placeFeatureId",
  "providerEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "serviceKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly ServicesKey[];

export const SERVICES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endsOn",
  "id",
  "name",
  "placeFeatureId",
  "providerEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "serviceKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly ServicesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SERVICES_EDITABLE_FIELDS = [
  "code",
  "description",
  "endsOn",
  "name",
  "placeFeatureId",
  "providerEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "serviceKindId",
  "sourceCitationId",
  "startsOn",
] as const satisfies readonly ServicesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SERVICES_AS_ONE_RELATION_CONFIG = {
  relation: "services",
  type: ERelationType.One,
  selectableFields: SERVICES_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICES_DEFAULT_SELECT_FIELDS,
} as const satisfies IServicesAsOneRelationConfig;

export const SERVICES_AS_MANY_RELATION_CONFIG = {
  relation: "services",
  type: ERelationType.Many,
  selectableFields: SERVICES_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICES_DEFAULT_SELECT_FIELDS,
  sortableFields: SERVICES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IServicesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SERVICES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "placeFeature",
  ),
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "providerEntity",
  ),
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "responsibleInstitution",
  ),
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeUnitFeature",
  ),
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "serviceKind",
  ),
  Q.createRelationKeyMapper<ServicesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const SERVICES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SERVICES_QUERY_OPTIONS = {
  searchableFields: SERVICES_SEARCHABLE_FIELDS,
  selectableFields: SERVICES_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICES_DEFAULT_SELECT_FIELDS,
  sortableFields: SERVICES_SORTABLE_FIELDS,
  filterFields: SERVICES_FILTERABLE_FIELDS,
  dateRangeFields: SERVICES_DATE_RANGE_FIELDS,
  relationKeys: SERVICES_RELATION_KEYS,
  editableFields: SERVICES_EDITABLE_FIELDS,
  asOne: SERVICES_AS_ONE_RELATION_CONFIG,
  asMany: SERVICES_AS_MANY_RELATION_CONFIG,
  oneRelations: SERVICES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SERVICES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IServices,
  ServicesSortableField,
  ServicesSelectableField,
  ServicesFilterableField,
  ServicesDateRangeField,
  ServicesRelationKey,
  typeof SERVICES_ONE_RELATION_QUERY_OPTIONS,
  typeof SERVICES_MANY_RELATION_QUERY_OPTIONS
>;
