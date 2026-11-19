// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BidsConfig from "#/modules/civic/schema/types/bids/bids.config";
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPartners,
  PartnersKey,
  PartnersRelationKey,
  PartnersSortableField,
  PartnersFilterableField,
  PartnersDateRangeField,
  PartnersSelectableField,
  IPartnersAsOneRelationConfig,
  IPartnersAsManyRelationConfig,
} from "./partners.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTNERS_RELATION_KEYS = [
  "bid",
  "contract",
  "partnerEntity",
  "role",
  "sourceCitation",
] as const satisfies readonly PartnersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTNERS_SORTABLE_FIELDS = [
  "bidId",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "partnerEntityId",
  "roleId",
  "sharePercentage",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly PartnersKey[];

export const PARTNERS_SEARCHABLE_FIELDS = [] as const satisfies readonly PartnersKey[];

export const PARTNERS_FILTERABLE_FIELDS = [
  "bidId",
  "contractId",
  "id",
  "partnerEntityId",
  "roleId",
  "sourceCitationId",
] as const satisfies readonly PartnersKey[];

export const PARTNERS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly PartnersKey[];

export const PARTNERS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPartners> = {
  searchableFields: [...PARTNERS_SEARCHABLE_FIELDS],
  filterFields: [...PARTNERS_FILTERABLE_FIELDS],
  dateRangeFields: [...PARTNERS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTNERS_SELECTABLE_FIELDS = [
  "bidId",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "partnerEntityId",
  "roleId",
  "sharePercentage",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly PartnersKey[];

export const PARTNERS_DEFAULT_SELECT_FIELDS = [
  "bidId",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "partnerEntityId",
  "roleId",
  "sharePercentage",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly PartnersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTNERS_EDITABLE_FIELDS = [
  "bidId",
  "contractId",
  "partnerEntityId",
  "roleId",
  "sharePercentage",
  "sourceCitationId",
] as const satisfies readonly PartnersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTNERS_AS_ONE_RELATION_CONFIG = {
  relation: "partners",
  type: ERelationType.One,
  selectableFields: PARTNERS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTNERS_DEFAULT_SELECT_FIELDS,
} as const satisfies IPartnersAsOneRelationConfig;

export const PARTNERS_AS_MANY_RELATION_CONFIG = {
  relation: "partners",
  type: ERelationType.Many,
  selectableFields: PARTNERS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTNERS_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTNERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPartnersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTNERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartnersRelationKey>().one(
    () => BidsConfig.BIDS_AS_ONE_RELATION_CONFIG,
    "bid",
  ),
  Q.createRelationKeyMapper<PartnersRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<PartnersRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "partnerEntity",
  ),
  Q.createRelationKeyMapper<PartnersRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
  Q.createRelationKeyMapper<PartnersRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const PARTNERS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTNERS_QUERY_OPTIONS = {
  searchableFields: PARTNERS_SEARCHABLE_FIELDS,
  selectableFields: PARTNERS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTNERS_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTNERS_SORTABLE_FIELDS,
  filterFields: PARTNERS_FILTERABLE_FIELDS,
  dateRangeFields: PARTNERS_DATE_RANGE_FIELDS,
  relationKeys: PARTNERS_RELATION_KEYS,
  editableFields: PARTNERS_EDITABLE_FIELDS,
  asOne: PARTNERS_AS_ONE_RELATION_CONFIG,
  asMany: PARTNERS_AS_MANY_RELATION_CONFIG,
  oneRelations: PARTNERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTNERS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPartners,
  PartnersSortableField,
  PartnersSelectableField,
  PartnersFilterableField,
  PartnersDateRangeField,
  PartnersRelationKey,
  typeof PARTNERS_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTNERS_MANY_RELATION_QUERY_OPTIONS
>;
