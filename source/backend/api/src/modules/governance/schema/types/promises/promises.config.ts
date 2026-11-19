// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as HoldersConfig from "#/modules/governance/schema/types/holders/holders.config";
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as OfficesConfig from "#/modules/governance/schema/types/offices/offices.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as SpeechesConfig from "#/modules/governance/schema/types/speeches/speeches.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as TopicConfig from "#/modules/reference/schema/types/topic/topic.config";
import * as UnitConfig from "#/modules/reference/schema/types/unit/unit.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPromises,
  PromisesKey,
  PromisesRelationKey,
  PromisesSortableField,
  PromisesFilterableField,
  PromisesDateRangeField,
  PromisesSelectableField,
  IPromisesAsOneRelationConfig,
  IPromisesAsManyRelationConfig,
} from "./promises.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROMISES_RELATION_KEYS = [
  "makerHolder",
  "makerIndividual",
  "occurrence",
  "office",
  "placeFeature",
  "sitting",
  "sourceCitation",
  "speech",
  "status",
  "topic",
  "unit",
] as const satisfies readonly PromisesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROMISES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "id",
  "madeOn",
  "makerHolderId",
  "makerIndividualId",
  "occurrenceId",
  "officeId",
  "placeFeatureId",
  "quantity",
  "sittingId",
  "sourceCitationId",
  "speechId",
  "statement",
  "statusAsOf",
  "statusId",
  "topicId",
  "unitId",
  "updatedAt",
  "version",
] as const satisfies readonly PromisesKey[];

export const PROMISES_SEARCHABLE_FIELDS = [
  "code",
  "statement",
] as const satisfies readonly PromisesKey[];

export const PROMISES_FILTERABLE_FIELDS = [
  "id",
  "makerHolderId",
  "makerIndividualId",
  "occurrenceId",
  "officeId",
  "placeFeatureId",
  "sittingId",
  "sourceCitationId",
  "speechId",
  "statusId",
  "topicId",
  "unitId",
] as const satisfies readonly PromisesKey[];

export const PROMISES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "dueOn",
  "madeOn",
  "statusAsOf",
  "updatedAt",
] as const satisfies readonly PromisesKey[];

export const PROMISES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPromises> = {
  searchableFields: [...PROMISES_SEARCHABLE_FIELDS],
  filterFields: [...PROMISES_FILTERABLE_FIELDS],
  dateRangeFields: [...PROMISES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROMISES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "id",
  "madeOn",
  "makerHolderId",
  "makerIndividualId",
  "occurrenceId",
  "officeId",
  "placeFeatureId",
  "quantity",
  "sittingId",
  "sourceCitationId",
  "speechId",
  "statement",
  "statusAsOf",
  "statusId",
  "topicId",
  "unitId",
  "updatedAt",
  "version",
] as const satisfies readonly PromisesKey[];

export const PROMISES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "id",
  "madeOn",
  "makerHolderId",
  "makerIndividualId",
  "occurrenceId",
  "officeId",
  "placeFeatureId",
  "quantity",
  "sittingId",
  "sourceCitationId",
  "speechId",
  "statement",
  "statusAsOf",
  "statusId",
  "topicId",
  "unitId",
  "updatedAt",
  "version",
] as const satisfies readonly PromisesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROMISES_EDITABLE_FIELDS = [
  "code",
  "dueOn",
  "madeOn",
  "makerHolderId",
  "makerIndividualId",
  "occurrenceId",
  "officeId",
  "placeFeatureId",
  "quantity",
  "sittingId",
  "sourceCitationId",
  "speechId",
  "statement",
  "statusAsOf",
  "statusId",
  "topicId",
  "unitId",
] as const satisfies readonly PromisesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROMISES_AS_ONE_RELATION_CONFIG = {
  relation: "promises",
  type: ERelationType.One,
  selectableFields: PROMISES_SELECTABLE_FIELDS,
  defaultSelectFields: PROMISES_DEFAULT_SELECT_FIELDS,
} as const satisfies IPromisesAsOneRelationConfig;

export const PROMISES_AS_MANY_RELATION_CONFIG = {
  relation: "promises",
  type: ERelationType.Many,
  selectableFields: PROMISES_SELECTABLE_FIELDS,
  defaultSelectFields: PROMISES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROMISES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPromisesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROMISES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => HoldersConfig.HOLDERS_AS_ONE_RELATION_CONFIG,
    "makerHolder",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "makerIndividual",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG,
    "office",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "placeFeature",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => SpeechesConfig.SPEECHES_AS_ONE_RELATION_CONFIG,
    "speech",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => TopicConfig.TOPIC_AS_ONE_RELATION_CONFIG,
    "topic",
  ),
  Q.createRelationKeyMapper<PromisesRelationKey>().one(
    () => UnitConfig.UNIT_AS_ONE_RELATION_CONFIG,
    "unit",
  ),
] as const;

export const PROMISES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROMISES_QUERY_OPTIONS = {
  searchableFields: PROMISES_SEARCHABLE_FIELDS,
  selectableFields: PROMISES_SELECTABLE_FIELDS,
  defaultSelectFields: PROMISES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROMISES_SORTABLE_FIELDS,
  filterFields: PROMISES_FILTERABLE_FIELDS,
  dateRangeFields: PROMISES_DATE_RANGE_FIELDS,
  relationKeys: PROMISES_RELATION_KEYS,
  editableFields: PROMISES_EDITABLE_FIELDS,
  asOne: PROMISES_AS_ONE_RELATION_CONFIG,
  asMany: PROMISES_AS_MANY_RELATION_CONFIG,
  oneRelations: PROMISES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROMISES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPromises,
  PromisesSortableField,
  PromisesSelectableField,
  PromisesFilterableField,
  PromisesDateRangeField,
  PromisesRelationKey,
  typeof PROMISES_ONE_RELATION_QUERY_OPTIONS,
  typeof PROMISES_MANY_RELATION_QUERY_OPTIONS
>;
