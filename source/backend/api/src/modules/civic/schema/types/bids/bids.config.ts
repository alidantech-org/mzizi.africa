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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as ProcurementsConfig from "#/modules/civic/schema/types/procurements/procurements.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBids,
  BidsKey,
  BidsRelationKey,
  BidsSortableField,
  BidsFilterableField,
  BidsDateRangeField,
  BidsSelectableField,
  IBidsAsOneRelationConfig,
  IBidsAsManyRelationConfig,
} from "./bids.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BIDS_RELATION_KEYS = [
  "bidderEntity",
  "currency",
  "outcome",
  "procurement",
  "sourceCitation",
] as const satisfies readonly BidsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BIDS_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "bidderEntityId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "outcomeId",
  "procurementId",
  "sourceCitationId",
  "submittedOn",
  "updatedAt",
  "version",
] as const satisfies readonly BidsKey[];

export const BIDS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly BidsKey[];

export const BIDS_FILTERABLE_FIELDS = [
  "bidderEntityId",
  "currencyId",
  "id",
  "outcomeId",
  "procurementId",
  "sourceCitationId",
] as const satisfies readonly BidsKey[];

export const BIDS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "submittedOn",
  "updatedAt",
] as const satisfies readonly BidsKey[];

export const BIDS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBids> = {
  searchableFields: [...BIDS_SEARCHABLE_FIELDS],
  filterFields: [...BIDS_FILTERABLE_FIELDS],
  dateRangeFields: [...BIDS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BIDS_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "bidderEntityId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "outcomeId",
  "procurementId",
  "sourceCitationId",
  "submittedOn",
  "updatedAt",
  "version",
] as const satisfies readonly BidsKey[];

export const BIDS_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "bidderEntityId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "outcomeId",
  "procurementId",
  "sourceCitationId",
  "submittedOn",
  "updatedAt",
  "version",
] as const satisfies readonly BidsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BIDS_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "bidderEntityId",
  "code",
  "currencyId",
  "outcomeId",
  "procurementId",
  "sourceCitationId",
  "submittedOn",
] as const satisfies readonly BidsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BIDS_AS_ONE_RELATION_CONFIG = {
  relation: "bids",
  type: ERelationType.One,
  selectableFields: BIDS_SELECTABLE_FIELDS,
  defaultSelectFields: BIDS_DEFAULT_SELECT_FIELDS,
} as const satisfies IBidsAsOneRelationConfig;

export const BIDS_AS_MANY_RELATION_CONFIG = {
  relation: "bids",
  type: ERelationType.Many,
  selectableFields: BIDS_SELECTABLE_FIELDS,
  defaultSelectFields: BIDS_DEFAULT_SELECT_FIELDS,
  sortableFields: BIDS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBidsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BIDS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BidsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "bidderEntity",
  ),
  Q.createRelationKeyMapper<BidsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<BidsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "outcome",
  ),
  Q.createRelationKeyMapper<BidsRelationKey>().one(
    () => ProcurementsConfig.PROCUREMENTS_AS_ONE_RELATION_CONFIG,
    "procurement",
  ),
  Q.createRelationKeyMapper<BidsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const BIDS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BIDS_QUERY_OPTIONS = {
  searchableFields: BIDS_SEARCHABLE_FIELDS,
  selectableFields: BIDS_SELECTABLE_FIELDS,
  defaultSelectFields: BIDS_DEFAULT_SELECT_FIELDS,
  sortableFields: BIDS_SORTABLE_FIELDS,
  filterFields: BIDS_FILTERABLE_FIELDS,
  dateRangeFields: BIDS_DATE_RANGE_FIELDS,
  relationKeys: BIDS_RELATION_KEYS,
  editableFields: BIDS_EDITABLE_FIELDS,
  asOne: BIDS_AS_ONE_RELATION_CONFIG,
  asMany: BIDS_AS_MANY_RELATION_CONFIG,
  oneRelations: BIDS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BIDS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBids,
  BidsSortableField,
  BidsSelectableField,
  BidsFilterableField,
  BidsDateRangeField,
  BidsRelationKey,
  typeof BIDS_ONE_RELATION_QUERY_OPTIONS,
  typeof BIDS_MANY_RELATION_QUERY_OPTIONS
>;
