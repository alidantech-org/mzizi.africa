// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as UnitsConfig from "#/modules/geography/schema/types/units/units.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOffices,
  OfficesKey,
  OfficesRelationKey,
  OfficesSortableField,
  OfficesFilterableField,
  OfficesDateRangeField,
  OfficesSelectableField,
  IOfficesAsOneRelationConfig,
  IOfficesAsManyRelationConfig,
} from "./offices.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OFFICES_RELATION_KEYS = [
  "institution",
  "officeKind",
  "sourceCitation",
  "unitFeature",
] as const satisfies readonly OfficesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OFFICES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeKindId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly OfficesKey[];

export const OFFICES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly OfficesKey[];

export const OFFICES_FILTERABLE_FIELDS = [
  "id",
  "institutionId",
  "officeKindId",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly OfficesKey[];

export const OFFICES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly OfficesKey[];

export const OFFICES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IOffices> = {
  searchableFields: [...OFFICES_SEARCHABLE_FIELDS],
  filterFields: [...OFFICES_FILTERABLE_FIELDS],
  dateRangeFields: [...OFFICES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OFFICES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeKindId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly OfficesKey[];

export const OFFICES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "officeKindId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly OfficesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OFFICES_EDITABLE_FIELDS = [
  "code",
  "institutionId",
  "officeKindId",
  "sourceCitationId",
  "unitFeatureId",
  "validFrom",
  "validUntil",
] as const satisfies readonly OfficesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OFFICES_AS_ONE_RELATION_CONFIG = {
  relation: "offices",
  type: ERelationType.One,
  selectableFields: OFFICES_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICES_DEFAULT_SELECT_FIELDS,
} as const satisfies IOfficesAsOneRelationConfig;

export const OFFICES_AS_MANY_RELATION_CONFIG = {
  relation: "offices",
  type: ERelationType.Many,
  selectableFields: OFFICES_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICES_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IOfficesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OFFICES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OfficesRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<OfficesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "officeKind",
  ),
  Q.createRelationKeyMapper<OfficesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<OfficesRelationKey>().one(
    () => UnitsConfig.UNITS_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
] as const;

export const OFFICES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OFFICES_QUERY_OPTIONS = {
  searchableFields: OFFICES_SEARCHABLE_FIELDS,
  selectableFields: OFFICES_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICES_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICES_SORTABLE_FIELDS,
  filterFields: OFFICES_FILTERABLE_FIELDS,
  dateRangeFields: OFFICES_DATE_RANGE_FIELDS,
  relationKeys: OFFICES_RELATION_KEYS,
  editableFields: OFFICES_EDITABLE_FIELDS,
  asOne: OFFICES_AS_ONE_RELATION_CONFIG,
  asMany: OFFICES_AS_MANY_RELATION_CONFIG,
  oneRelations: OFFICES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OFFICES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IOffices,
  OfficesSortableField,
  OfficesSelectableField,
  OfficesFilterableField,
  OfficesDateRangeField,
  OfficesRelationKey,
  typeof OFFICES_ONE_RELATION_QUERY_OPTIONS,
  typeof OFFICES_MANY_RELATION_QUERY_OPTIONS
>;
