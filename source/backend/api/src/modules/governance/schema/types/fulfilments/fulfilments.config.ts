// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AppropriationsConfig from "#/modules/finance/schema/types/appropriations/appropriations.config";
import * as BillsConfig from "#/modules/governance/schema/types/bills/bills.config";
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as PromisesConfig from "#/modules/governance/schema/types/promises/promises.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFulfilments,
  FulfilmentsKey,
  FulfilmentsRelationKey,
  FulfilmentsSortableField,
  FulfilmentsFilterableField,
  FulfilmentsDateRangeField,
  FulfilmentsSelectableField,
  IFulfilmentsAsOneRelationConfig,
  IFulfilmentsAsManyRelationConfig,
} from "./fulfilments.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FULFILMENTS_RELATION_KEYS = [
  "appropriation",
  "bill",
  "contract",
  "evidenceStatus",
  "instrument",
  "kind",
  "project",
  "promise",
  "sourceCitation",
] as const satisfies readonly FulfilmentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FULFILMENTS_SORTABLE_FIELDS = [
  "appropriationId",
  "billId",
  "contractId",
  "createdAt",
  "deletedAt",
  "evidenceStatusId",
  "id",
  "instrumentId",
  "kindId",
  "projectId",
  "promiseId",
  "recordedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FulfilmentsKey[];

export const FULFILMENTS_SEARCHABLE_FIELDS = [] as const satisfies readonly FulfilmentsKey[];

export const FULFILMENTS_FILTERABLE_FIELDS = [
  "appropriationId",
  "billId",
  "contractId",
  "evidenceStatusId",
  "id",
  "instrumentId",
  "kindId",
  "projectId",
  "promiseId",
  "sourceCitationId",
] as const satisfies readonly FulfilmentsKey[];

export const FULFILMENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "recordedOn",
  "updatedAt",
] as const satisfies readonly FulfilmentsKey[];

export const FULFILMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFulfilments> = {
  searchableFields: [...FULFILMENTS_SEARCHABLE_FIELDS],
  filterFields: [...FULFILMENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...FULFILMENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FULFILMENTS_SELECTABLE_FIELDS = [
  "appropriationId",
  "billId",
  "contractId",
  "createdAt",
  "deletedAt",
  "evidenceStatusId",
  "id",
  "instrumentId",
  "kindId",
  "projectId",
  "promiseId",
  "recordedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FulfilmentsKey[];

export const FULFILMENTS_DEFAULT_SELECT_FIELDS = [
  "appropriationId",
  "billId",
  "contractId",
  "createdAt",
  "deletedAt",
  "evidenceStatusId",
  "id",
  "instrumentId",
  "kindId",
  "projectId",
  "promiseId",
  "recordedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FulfilmentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FULFILMENTS_EDITABLE_FIELDS = [
  "appropriationId",
  "billId",
  "contractId",
  "evidenceStatusId",
  "instrumentId",
  "kindId",
  "projectId",
  "promiseId",
  "recordedOn",
  "sourceCitationId",
] as const satisfies readonly FulfilmentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FULFILMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "fulfilments",
  type: ERelationType.One,
  selectableFields: FULFILMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: FULFILMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFulfilmentsAsOneRelationConfig;

export const FULFILMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "fulfilments",
  type: ERelationType.Many,
  selectableFields: FULFILMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: FULFILMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: FULFILMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFulfilmentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FULFILMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => AppropriationsConfig.APPROPRIATIONS_AS_ONE_RELATION_CONFIG,
    "appropriation",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => BillsConfig.BILLS_AS_ONE_RELATION_CONFIG,
    "bill",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "evidenceStatus",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => PromisesConfig.PROMISES_AS_ONE_RELATION_CONFIG,
    "promise",
  ),
  Q.createRelationKeyMapper<FulfilmentsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const FULFILMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FULFILMENTS_QUERY_OPTIONS = {
  searchableFields: FULFILMENTS_SEARCHABLE_FIELDS,
  selectableFields: FULFILMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: FULFILMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: FULFILMENTS_SORTABLE_FIELDS,
  filterFields: FULFILMENTS_FILTERABLE_FIELDS,
  dateRangeFields: FULFILMENTS_DATE_RANGE_FIELDS,
  relationKeys: FULFILMENTS_RELATION_KEYS,
  editableFields: FULFILMENTS_EDITABLE_FIELDS,
  asOne: FULFILMENTS_AS_ONE_RELATION_CONFIG,
  asMany: FULFILMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: FULFILMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FULFILMENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFulfilments,
  FulfilmentsSortableField,
  FulfilmentsSelectableField,
  FulfilmentsFilterableField,
  FulfilmentsDateRangeField,
  FulfilmentsRelationKey,
  typeof FULFILMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof FULFILMENTS_MANY_RELATION_QUERY_OPTIONS
>;
