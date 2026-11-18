// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IObligations,
  ObligationsKey,
  ObligationsRelationKey,
  ObligationsSortableField,
  ObligationsFilterableField,
  ObligationsDateRangeField,
  ObligationsSelectableField,
  IObligationsAsOneRelationConfig,
  IObligationsAsManyRelationConfig,
} from "./obligations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OBLIGATIONS_RELATION_KEYS = [
  "basisProvision",
  "country",
  "frequency",
  "obligationKind",
  "obligorInstitution",
  "obligorKind",
  "recipientEntity",
  "sourceCitation",
] as const satisfies readonly ObligationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OBLIGATIONS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "frequencyId",
  "fromToPrecision",
  "fromYear",
  "id",
  "obligationKindId",
  "obligorInstitutionId",
  "obligorKindId",
  "recipientEntityId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ObligationsKey[];

export const OBLIGATIONS_SEARCHABLE_FIELDS = [
  "code",
  "description",
] as const satisfies readonly ObligationsKey[];

export const OBLIGATIONS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "countryId",
  "frequencyId",
  "fromToPrecision",
  "id",
  "obligationKindId",
  "obligorInstitutionId",
  "obligorKindId",
  "recipientEntityId",
  "sourceCitationId",
] as const satisfies readonly ObligationsKey[];

export const OBLIGATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ObligationsKey[];

export const OBLIGATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IObligations> = {
  searchableFields: [...OBLIGATIONS_SEARCHABLE_FIELDS],
  filterFields: [...OBLIGATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...OBLIGATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OBLIGATIONS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "frequencyId",
  "fromToPrecision",
  "fromYear",
  "id",
  "obligationKindId",
  "obligorInstitutionId",
  "obligorKindId",
  "recipientEntityId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ObligationsKey[];

export const OBLIGATIONS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "frequencyId",
  "fromToPrecision",
  "fromYear",
  "id",
  "obligationKindId",
  "obligorInstitutionId",
  "obligorKindId",
  "recipientEntityId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ObligationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OBLIGATIONS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "description",
  "frequencyId",
  "fromToPrecision",
  "fromYear",
  "obligationKindId",
  "obligorInstitutionId",
  "obligorKindId",
  "recipientEntityId",
  "sourceCitationId",
  "toYear",
] as const satisfies readonly ObligationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OBLIGATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "obligations",
  type: ERelationType.One,
  selectableFields: OBLIGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: OBLIGATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IObligationsAsOneRelationConfig;

export const OBLIGATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "obligations",
  type: ERelationType.Many,
  selectableFields: OBLIGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: OBLIGATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: OBLIGATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IObligationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OBLIGATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "frequency",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "obligationKind",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "obligorInstitution",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "obligorKind",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "recipientEntity",
  ),
  Q.createRelationKeyMapper<ObligationsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const OBLIGATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OBLIGATIONS_QUERY_OPTIONS = {
  searchableFields: OBLIGATIONS_SEARCHABLE_FIELDS,
  selectableFields: OBLIGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: OBLIGATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: OBLIGATIONS_SORTABLE_FIELDS,
  filterFields: OBLIGATIONS_FILTERABLE_FIELDS,
  dateRangeFields: OBLIGATIONS_DATE_RANGE_FIELDS,
  relationKeys: OBLIGATIONS_RELATION_KEYS,
  editableFields: OBLIGATIONS_EDITABLE_FIELDS,
  asOne: OBLIGATIONS_AS_ONE_RELATION_CONFIG,
  asMany: OBLIGATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: OBLIGATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OBLIGATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IObligations,
  ObligationsSortableField,
  ObligationsSelectableField,
  ObligationsFilterableField,
  ObligationsDateRangeField,
  ObligationsRelationKey,
  typeof OBLIGATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof OBLIGATIONS_MANY_RELATION_QUERY_OPTIONS
>;
