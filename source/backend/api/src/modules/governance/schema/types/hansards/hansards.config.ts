// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ArtifactsConfig from "#/modules/source/schema/types/artifacts/artifacts.config";
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IHansards,
  HansardsKey,
  HansardsRelationKey,
  HansardsSortableField,
  HansardsFilterableField,
  HansardsDateRangeField,
  HansardsSelectableField,
  IHansardsAsOneRelationConfig,
  IHansardsAsManyRelationConfig,
} from "./hansards.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const HANSARDS_RELATION_KEYS = [
  "artifact",
  "language",
  "sitting",
  "sourceCitation",
] as const satisfies readonly HansardsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const HANSARDS_SORTABLE_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "isProvisional",
  "languageId",
  "publishedOn",
  "reference",
  "sittingId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly HansardsKey[];

export const HANSARDS_SEARCHABLE_FIELDS = [
  "code",
  "reference",
] as const satisfies readonly HansardsKey[];

export const HANSARDS_FILTERABLE_FIELDS = [
  "artifactId",
  "id",
  "isProvisional",
  "languageId",
  "sittingId",
  "sourceCitationId",
] as const satisfies readonly HansardsKey[];

export const HANSARDS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly HansardsKey[];

export const HANSARDS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IHansards> = {
  searchableFields: [...HANSARDS_SEARCHABLE_FIELDS],
  filterFields: [...HANSARDS_FILTERABLE_FIELDS],
  dateRangeFields: [...HANSARDS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const HANSARDS_SELECTABLE_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "isProvisional",
  "languageId",
  "publishedOn",
  "reference",
  "sittingId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly HansardsKey[];

export const HANSARDS_DEFAULT_SELECT_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "isProvisional",
  "languageId",
  "publishedOn",
  "reference",
  "sittingId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly HansardsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const HANSARDS_EDITABLE_FIELDS = [
  "artifactId",
  "code",
  "isProvisional",
  "languageId",
  "publishedOn",
  "reference",
  "sittingId",
  "sourceCitationId",
] as const satisfies readonly HansardsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const HANSARDS_AS_ONE_RELATION_CONFIG = {
  relation: "hansards",
  type: ERelationType.One,
  selectableFields: HANSARDS_SELECTABLE_FIELDS,
  defaultSelectFields: HANSARDS_DEFAULT_SELECT_FIELDS,
} as const satisfies IHansardsAsOneRelationConfig;

export const HANSARDS_AS_MANY_RELATION_CONFIG = {
  relation: "hansards",
  type: ERelationType.Many,
  selectableFields: HANSARDS_SELECTABLE_FIELDS,
  defaultSelectFields: HANSARDS_DEFAULT_SELECT_FIELDS,
  sortableFields: HANSARDS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IHansardsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const HANSARDS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<HansardsRelationKey>().one(
    () => ArtifactsConfig.ARTIFACTS_AS_ONE_RELATION_CONFIG,
    "artifact",
  ),
  Q.createRelationKeyMapper<HansardsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<HansardsRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<HansardsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const HANSARDS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const HANSARDS_QUERY_OPTIONS = {
  searchableFields: HANSARDS_SEARCHABLE_FIELDS,
  selectableFields: HANSARDS_SELECTABLE_FIELDS,
  defaultSelectFields: HANSARDS_DEFAULT_SELECT_FIELDS,
  sortableFields: HANSARDS_SORTABLE_FIELDS,
  filterFields: HANSARDS_FILTERABLE_FIELDS,
  dateRangeFields: HANSARDS_DATE_RANGE_FIELDS,
  relationKeys: HANSARDS_RELATION_KEYS,
  editableFields: HANSARDS_EDITABLE_FIELDS,
  asOne: HANSARDS_AS_ONE_RELATION_CONFIG,
  asMany: HANSARDS_AS_MANY_RELATION_CONFIG,
  oneRelations: HANSARDS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: HANSARDS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IHansards,
  HansardsSortableField,
  HansardsSelectableField,
  HansardsFilterableField,
  HansardsDateRangeField,
  HansardsRelationKey,
  typeof HANSARDS_ONE_RELATION_QUERY_OPTIONS,
  typeof HANSARDS_MANY_RELATION_QUERY_OPTIONS
>;
