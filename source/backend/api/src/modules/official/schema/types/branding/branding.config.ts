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
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBranding,
  BrandingKey,
  BrandingRelationKey,
  BrandingSortableField,
  BrandingFilterableField,
  BrandingDateRangeField,
  BrandingSelectableField,
  IBrandingAsOneRelationConfig,
  IBrandingAsManyRelationConfig,
} from "./branding.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BRANDING_RELATION_KEYS = [
  "entity",
  "individual",
  "kind",
  "language",
  "sourceCitation",
] as const satisfies readonly BrandingKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BRANDING_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "kindId",
  "languageId",
  "sourceCitationId",
  "updatedAt",
  "value",
  "version",
] as const satisfies readonly BrandingKey[];

export const BRANDING_SEARCHABLE_FIELDS = [
  "code",
  "value",
] as const satisfies readonly BrandingKey[];

export const BRANDING_FILTERABLE_FIELDS = [
  "entityId",
  "id",
  "individualId",
  "kindId",
  "languageId",
  "sourceCitationId",
] as const satisfies readonly BrandingKey[];

export const BRANDING_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly BrandingKey[];

export const BRANDING_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBranding> = {
  searchableFields: [...BRANDING_SEARCHABLE_FIELDS],
  filterFields: [...BRANDING_FILTERABLE_FIELDS],
  dateRangeFields: [...BRANDING_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BRANDING_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "kindId",
  "languageId",
  "sourceCitationId",
  "updatedAt",
  "value",
  "version",
] as const satisfies readonly BrandingKey[];

export const BRANDING_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "kindId",
  "languageId",
  "sourceCitationId",
  "updatedAt",
  "value",
  "version",
] as const satisfies readonly BrandingSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BRANDING_EDITABLE_FIELDS = [
  "code",
  "entityId",
  "individualId",
  "kindId",
  "languageId",
  "sourceCitationId",
  "value",
] as const satisfies readonly BrandingKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BRANDING_AS_ONE_RELATION_CONFIG = {
  relation: "branding",
  type: ERelationType.One,
  selectableFields: BRANDING_SELECTABLE_FIELDS,
  defaultSelectFields: BRANDING_DEFAULT_SELECT_FIELDS,
} as const satisfies IBrandingAsOneRelationConfig;

export const BRANDING_AS_MANY_RELATION_CONFIG = {
  relation: "brandings",
  type: ERelationType.Many,
  selectableFields: BRANDING_SELECTABLE_FIELDS,
  defaultSelectFields: BRANDING_DEFAULT_SELECT_FIELDS,
  sortableFields: BRANDING_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBrandingAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BRANDING_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BrandingRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "entity",
  ),
  Q.createRelationKeyMapper<BrandingRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "individual",
  ),
  Q.createRelationKeyMapper<BrandingRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<BrandingRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<BrandingRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const BRANDING_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BRANDING_QUERY_OPTIONS = {
  searchableFields: BRANDING_SEARCHABLE_FIELDS,
  selectableFields: BRANDING_SELECTABLE_FIELDS,
  defaultSelectFields: BRANDING_DEFAULT_SELECT_FIELDS,
  sortableFields: BRANDING_SORTABLE_FIELDS,
  filterFields: BRANDING_FILTERABLE_FIELDS,
  dateRangeFields: BRANDING_DATE_RANGE_FIELDS,
  relationKeys: BRANDING_RELATION_KEYS,
  editableFields: BRANDING_EDITABLE_FIELDS,
  asOne: BRANDING_AS_ONE_RELATION_CONFIG,
  asMany: BRANDING_AS_MANY_RELATION_CONFIG,
  oneRelations: BRANDING_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BRANDING_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBranding,
  BrandingSortableField,
  BrandingSelectableField,
  BrandingFilterableField,
  BrandingDateRangeField,
  BrandingRelationKey,
  typeof BRANDING_ONE_RELATION_QUERY_OPTIONS,
  typeof BRANDING_MANY_RELATION_QUERY_OPTIONS
>;
