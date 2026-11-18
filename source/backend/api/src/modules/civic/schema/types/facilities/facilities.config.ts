// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFacilities,
  FacilitiesKey,
  FacilitiesRelationKey,
  FacilitiesSortableField,
  FacilitiesFilterableField,
  FacilitiesDateRangeField,
  FacilitiesSelectableField,
  IFacilitiesAsOneRelationConfig,
  IFacilitiesAsManyRelationConfig,
} from "./facilities.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FACILITIES_RELATION_KEYS = [
  "country",
  "facilityClass",
  "feature",
  "operatorEntity",
  "ownerEntity",
  "ownership",
  "responsibleInstitution",
  "sourceCitation",
  "status",
] as const satisfies readonly FacilitiesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FACILITIES_SORTABLE_FIELDS = [
  "closedOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "facilityClassId",
  "featureId",
  "id",
  "openedOn",
  "operatorEntityId",
  "ownerEntityId",
  "ownershipId",
  "responsibleInstitutionId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly FacilitiesKey[];

export const FACILITIES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly FacilitiesKey[];

export const FACILITIES_FILTERABLE_FIELDS = [
  "countryId",
  "facilityClassId",
  "featureId",
  "id",
  "operatorEntityId",
  "ownerEntityId",
  "ownershipId",
  "responsibleInstitutionId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly FacilitiesKey[];

export const FACILITIES_DATE_RANGE_FIELDS = [
  "closedOn",
  "createdAt",
  "deletedAt",
  "openedOn",
  "updatedAt",
] as const satisfies readonly FacilitiesKey[];

export const FACILITIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFacilities> = {
  searchableFields: [...FACILITIES_SEARCHABLE_FIELDS],
  filterFields: [...FACILITIES_FILTERABLE_FIELDS],
  dateRangeFields: [...FACILITIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FACILITIES_SELECTABLE_FIELDS = [
  "closedOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "facilityClassId",
  "featureId",
  "id",
  "openedOn",
  "operatorEntityId",
  "ownerEntityId",
  "ownershipId",
  "responsibleInstitutionId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly FacilitiesKey[];

export const FACILITIES_DEFAULT_SELECT_FIELDS = [
  "closedOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "facilityClassId",
  "featureId",
  "id",
  "openedOn",
  "operatorEntityId",
  "ownerEntityId",
  "ownershipId",
  "responsibleInstitutionId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly FacilitiesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FACILITIES_EDITABLE_FIELDS = [
  "closedOn",
  "code",
  "countryId",
  "facilityClassId",
  "featureId",
  "openedOn",
  "operatorEntityId",
  "ownerEntityId",
  "ownershipId",
  "responsibleInstitutionId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly FacilitiesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FACILITIES_AS_ONE_RELATION_CONFIG = {
  relation: "facilities",
  type: ERelationType.One,
  selectableFields: FACILITIES_SELECTABLE_FIELDS,
  defaultSelectFields: FACILITIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IFacilitiesAsOneRelationConfig;

export const FACILITIES_AS_MANY_RELATION_CONFIG = {
  relation: "facilities",
  type: ERelationType.Many,
  selectableFields: FACILITIES_SELECTABLE_FIELDS,
  defaultSelectFields: FACILITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: FACILITIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFacilitiesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FACILITIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "facilityClass",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "operatorEntity",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "ownerEntity",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "ownership",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "responsibleInstitution",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<FacilitiesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const FACILITIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FACILITIES_QUERY_OPTIONS = {
  searchableFields: FACILITIES_SEARCHABLE_FIELDS,
  selectableFields: FACILITIES_SELECTABLE_FIELDS,
  defaultSelectFields: FACILITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: FACILITIES_SORTABLE_FIELDS,
  filterFields: FACILITIES_FILTERABLE_FIELDS,
  dateRangeFields: FACILITIES_DATE_RANGE_FIELDS,
  relationKeys: FACILITIES_RELATION_KEYS,
  editableFields: FACILITIES_EDITABLE_FIELDS,
  asOne: FACILITIES_AS_ONE_RELATION_CONFIG,
  asMany: FACILITIES_AS_MANY_RELATION_CONFIG,
  oneRelations: FACILITIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FACILITIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFacilities,
  FacilitiesSortableField,
  FacilitiesSelectableField,
  FacilitiesFilterableField,
  FacilitiesDateRangeField,
  FacilitiesRelationKey,
  typeof FACILITIES_ONE_RELATION_QUERY_OPTIONS,
  typeof FACILITIES_MANY_RELATION_QUERY_OPTIONS
>;
