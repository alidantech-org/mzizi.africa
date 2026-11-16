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
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as OfficesConfig from "#/modules/governance/schema/types/offices/offices.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAuthorityScopes,
  AuthorityScopesKey,
  AuthorityScopesRelationKey,
  AuthorityScopesSortableField,
  AuthorityScopesFilterableField,
  AuthorityScopesDateRangeField,
  AuthorityScopesSelectableField,
  IAuthorityScopesAsOneRelationConfig,
  IAuthorityScopesAsManyRelationConfig,
} from "./authority-scopes.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const AUTHORITY_SCOPES_RELATION_KEYS = [
  "authorityKind",
  "country",
  "institution",
  "office",
  "sourceCitation",
  "unitFeature",
] as const satisfies readonly AuthorityScopesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const AUTHORITY_SCOPES_SORTABLE_FIELDS = [
  "authorityKindId",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly AuthorityScopesKey[];

export const AUTHORITY_SCOPES_SEARCHABLE_FIELDS =
  [] as const satisfies readonly AuthorityScopesKey[];

export const AUTHORITY_SCOPES_FILTERABLE_FIELDS = [
  "authorityKindId",
  "countryId",
  "id",
  "institutionId",
  "officeId",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly AuthorityScopesKey[];

export const AUTHORITY_SCOPES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly AuthorityScopesKey[];

export const AUTHORITY_SCOPES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAuthorityScopes> =
  {
    searchableFields: [...AUTHORITY_SCOPES_SEARCHABLE_FIELDS],
    filterFields: [...AUTHORITY_SCOPES_FILTERABLE_FIELDS],
    dateRangeFields: [...AUTHORITY_SCOPES_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const AUTHORITY_SCOPES_SELECTABLE_FIELDS = [
  "authorityKindId",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly AuthorityScopesKey[];

export const AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS = [
  "authorityKindId",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly AuthorityScopesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const AUTHORITY_SCOPES_EDITABLE_FIELDS = [
  "authorityKindId",
  "countryId",
  "institutionId",
  "officeId",
  "sourceCitationId",
  "unitFeatureId",
  "validFrom",
  "validUntil",
] as const satisfies readonly AuthorityScopesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const AUTHORITY_SCOPES_AS_ONE_RELATION_CONFIG = {
  relation: "authorityScopes",
  type: ERelationType.One,
  selectableFields: AUTHORITY_SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS,
} as const satisfies IAuthorityScopesAsOneRelationConfig;

export const AUTHORITY_SCOPES_AS_MANY_RELATION_CONFIG = {
  relation: "authorityScopes",
  type: ERelationType.Many,
  selectableFields: AUTHORITY_SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS,
  sortableFields: AUTHORITY_SCOPES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAuthorityScopesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const AUTHORITY_SCOPES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "authorityKind",
  ),
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG,
    "office",
  ),
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<AuthorityScopesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
] as const;

export const AUTHORITY_SCOPES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const AUTHORITY_SCOPES_QUERY_OPTIONS = {
  searchableFields: AUTHORITY_SCOPES_SEARCHABLE_FIELDS,
  selectableFields: AUTHORITY_SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS,
  sortableFields: AUTHORITY_SCOPES_SORTABLE_FIELDS,
  filterFields: AUTHORITY_SCOPES_FILTERABLE_FIELDS,
  dateRangeFields: AUTHORITY_SCOPES_DATE_RANGE_FIELDS,
  relationKeys: AUTHORITY_SCOPES_RELATION_KEYS,
  editableFields: AUTHORITY_SCOPES_EDITABLE_FIELDS,
  asOne: AUTHORITY_SCOPES_AS_ONE_RELATION_CONFIG,
  asMany: AUTHORITY_SCOPES_AS_MANY_RELATION_CONFIG,
  oneRelations: AUTHORITY_SCOPES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: AUTHORITY_SCOPES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAuthorityScopes,
  AuthorityScopesSortableField,
  AuthorityScopesSelectableField,
  AuthorityScopesFilterableField,
  AuthorityScopesDateRangeField,
  AuthorityScopesRelationKey,
  typeof AUTHORITY_SCOPES_ONE_RELATION_QUERY_OPTIONS,
  typeof AUTHORITY_SCOPES_MANY_RELATION_QUERY_OPTIONS
>;
