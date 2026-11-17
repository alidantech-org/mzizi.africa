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
import * as CapturesConfig from "#/modules/source/schema/types/captures/captures.config";
import * as EditionsConfig from "#/modules/source/schema/types/editions/editions.config";
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as ProductsConfig from "#/modules/source/schema/types/products/products.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRelationships,
  RelationshipsKey,
  RelationshipsRelationKey,
  RelationshipsSortableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsSelectableField,
  IRelationshipsAsOneRelationConfig,
  IRelationshipsAsManyRelationConfig,
} from "./relationships.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const RELATIONSHIPS_RELATION_KEYS = [
  "inputArtifact",
  "inputCapture",
  "inputEdition",
  "inputFileVersion",
  "inputProduct",
  "kind",
  "outputArtifact",
  "outputCapture",
  "outputEdition",
  "outputFileVersion",
  "outputProduct",
] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "executionRef",
  "id",
  "inputArtifactId",
  "inputCaptureId",
  "inputEditionId",
  "inputFileVersionId",
  "inputProductId",
  "kindId",
  "method",
  "outputArtifactId",
  "outputCaptureId",
  "outputEditionId",
  "outputFileVersionId",
  "outputProductId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_SEARCHABLE_FIELDS = [
  "executionRef",
  "method",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_FILTERABLE_FIELDS = [
  "id",
  "inputArtifactId",
  "inputCaptureId",
  "inputEditionId",
  "inputFileVersionId",
  "inputProductId",
  "kindId",
  "outputArtifactId",
  "outputCaptureId",
  "outputEditionId",
  "outputFileVersionId",
  "outputProductId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IRelationships> = {
  searchableFields: [...RELATIONSHIPS_SEARCHABLE_FIELDS],
  filterFields: [...RELATIONSHIPS_FILTERABLE_FIELDS],
  dateRangeFields: [...RELATIONSHIPS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "executionRef",
  "id",
  "inputArtifactId",
  "inputCaptureId",
  "inputEditionId",
  "inputFileVersionId",
  "inputProductId",
  "kindId",
  "method",
  "outputArtifactId",
  "outputCaptureId",
  "outputEditionId",
  "outputFileVersionId",
  "outputProductId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "executionRef",
  "id",
  "inputArtifactId",
  "inputCaptureId",
  "inputEditionId",
  "inputFileVersionId",
  "inputProductId",
  "kindId",
  "method",
  "outputArtifactId",
  "outputCaptureId",
  "outputEditionId",
  "outputFileVersionId",
  "outputProductId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_EDITABLE_FIELDS = [
  "executionRef",
  "inputArtifactId",
  "inputCaptureId",
  "inputEditionId",
  "inputFileVersionId",
  "inputProductId",
  "kindId",
  "method",
  "outputArtifactId",
  "outputCaptureId",
  "outputEditionId",
  "outputFileVersionId",
  "outputProductId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const RELATIONSHIPS_AS_ONE_RELATION_CONFIG = {
  relation: "relationships",
  type: ERelationType.One,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
} as const satisfies IRelationshipsAsOneRelationConfig;

export const RELATIONSHIPS_AS_MANY_RELATION_CONFIG = {
  relation: "relationships",
  type: ERelationType.Many,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IRelationshipsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ArtifactsConfig.ARTIFACTS_AS_ONE_RELATION_CONFIG,
    "inputArtifact",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG,
    "inputCapture",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => EditionsConfig.EDITIONS_AS_ONE_RELATION_CONFIG,
    "inputEdition",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "inputFileVersion",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ProductsConfig.PRODUCTS_AS_ONE_RELATION_CONFIG,
    "inputProduct",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ArtifactsConfig.ARTIFACTS_AS_ONE_RELATION_CONFIG,
    "outputArtifact",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG,
    "outputCapture",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => EditionsConfig.EDITIONS_AS_ONE_RELATION_CONFIG,
    "outputEdition",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "outputFileVersion",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ProductsConfig.PRODUCTS_AS_ONE_RELATION_CONFIG,
    "outputProduct",
  ),
] as const;

export const RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_QUERY_OPTIONS = {
  searchableFields: RELATIONSHIPS_SEARCHABLE_FIELDS,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  filterFields: RELATIONSHIPS_FILTERABLE_FIELDS,
  dateRangeFields: RELATIONSHIPS_DATE_RANGE_FIELDS,
  relationKeys: RELATIONSHIPS_RELATION_KEYS,
  editableFields: RELATIONSHIPS_EDITABLE_FIELDS,
  asOne: RELATIONSHIPS_AS_ONE_RELATION_CONFIG,
  asMany: RELATIONSHIPS_AS_MANY_RELATION_CONFIG,
  oneRelations: RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IRelationships,
  RelationshipsSortableField,
  RelationshipsSelectableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsRelationKey,
  typeof RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  typeof RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS
>;
