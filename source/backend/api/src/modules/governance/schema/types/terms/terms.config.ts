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
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ITerms,
  TermsKey,
  TermsRelationKey,
  TermsSortableField,
  TermsFilterableField,
  TermsDateRangeField,
  TermsSelectableField,
  ITermsAsOneRelationConfig,
  ITermsAsManyRelationConfig,
} from "./terms.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TERMS_RELATION_KEYS = [
  "country",
  "institution",
  "sourceCitation",
  "termKind",
  "unitFeature",
] as const satisfies readonly TermsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TERMS_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "institutionId",
  "ordinal",
  "sourceCitationId",
  "startsOn",
  "termKindId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly TermsKey[];

export const TERMS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly TermsKey[];

export const TERMS_FILTERABLE_FIELDS = [
  "countryId",
  "id",
  "institutionId",
  "sourceCitationId",
  "termKindId",
  "unitFeatureId",
] as const satisfies readonly TermsKey[];

export const TERMS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "startsOn",
  "updatedAt",
] as const satisfies readonly TermsKey[];

export const TERMS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ITerms> = {
  searchableFields: [...TERMS_SEARCHABLE_FIELDS],
  filterFields: [...TERMS_FILTERABLE_FIELDS],
  dateRangeFields: [...TERMS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TERMS_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "institutionId",
  "ordinal",
  "sourceCitationId",
  "startsOn",
  "termKindId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly TermsKey[];

export const TERMS_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "institutionId",
  "ordinal",
  "sourceCitationId",
  "startsOn",
  "termKindId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly TermsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TERMS_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "endsOn",
  "institutionId",
  "ordinal",
  "sourceCitationId",
  "startsOn",
  "termKindId",
  "unitFeatureId",
] as const satisfies readonly TermsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TERMS_AS_ONE_RELATION_CONFIG = {
  relation: "terms",
  type: ERelationType.One,
  selectableFields: TERMS_SELECTABLE_FIELDS,
  defaultSelectFields: TERMS_DEFAULT_SELECT_FIELDS,
} as const satisfies ITermsAsOneRelationConfig;

export const TERMS_AS_MANY_RELATION_CONFIG = {
  relation: "terms",
  type: ERelationType.Many,
  selectableFields: TERMS_SELECTABLE_FIELDS,
  defaultSelectFields: TERMS_DEFAULT_SELECT_FIELDS,
  sortableFields: TERMS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ITermsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TERMS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<TermsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<TermsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<TermsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<TermsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "termKind",
  ),
  Q.createRelationKeyMapper<TermsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
] as const;

export const TERMS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TERMS_QUERY_OPTIONS = {
  searchableFields: TERMS_SEARCHABLE_FIELDS,
  selectableFields: TERMS_SELECTABLE_FIELDS,
  defaultSelectFields: TERMS_DEFAULT_SELECT_FIELDS,
  sortableFields: TERMS_SORTABLE_FIELDS,
  filterFields: TERMS_FILTERABLE_FIELDS,
  dateRangeFields: TERMS_DATE_RANGE_FIELDS,
  relationKeys: TERMS_RELATION_KEYS,
  editableFields: TERMS_EDITABLE_FIELDS,
  asOne: TERMS_AS_ONE_RELATION_CONFIG,
  asMany: TERMS_AS_MANY_RELATION_CONFIG,
  oneRelations: TERMS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TERMS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ITerms,
  TermsSortableField,
  TermsSelectableField,
  TermsFilterableField,
  TermsDateRangeField,
  TermsRelationKey,
  typeof TERMS_ONE_RELATION_QUERY_OPTIONS,
  typeof TERMS_MANY_RELATION_QUERY_OPTIONS
>;
