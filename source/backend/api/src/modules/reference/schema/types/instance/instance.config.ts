// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ContactsConfig from "#/modules/official/schema/types/contacts/contacts.config";
import * as DomainsConfig from "#/modules/source/schema/types/domains/domains.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as OfficesConfig from "#/modules/governance/schema/types/offices/offices.config";
import * as PositionsConfig from "#/modules/governance/schema/types/positions/positions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as TemplateConfig from "#/modules/reference/schema/types/template/template.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IInstance,
  InstanceKey,
  InstanceRelationKey,
  InstanceSortableField,
  InstanceFilterableField,
  InstanceDateRangeField,
  InstanceSelectableField,
  IInstanceAsOneRelationConfig,
  IInstanceAsManyRelationConfig,
} from "./instance.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INSTANCE_RELATION_KEYS = [
  "contact",
  "domain",
  "institution",
  "office",
  "position",
  "status",
  "template",
  "unitFeature",
  "verifiedCitation",
] as const satisfies readonly InstanceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INSTANCE_SORTABLE_FIELDS = [
  "contactId",
  "createdAt",
  "deletedAt",
  "domainId",
  "generatedAt",
  "id",
  "institutionId",
  "officeId",
  "positionId",
  "statusId",
  "templateId",
  "unitFeatureId",
  "updatedAt",
  "verifiedCitationId",
  "version",
] as const satisfies readonly InstanceKey[];

export const INSTANCE_SEARCHABLE_FIELDS = [] as const satisfies readonly InstanceKey[];

export const INSTANCE_FILTERABLE_FIELDS = [
  "contactId",
  "domainId",
  "id",
  "institutionId",
  "officeId",
  "positionId",
  "statusId",
  "templateId",
  "unitFeatureId",
  "verifiedCitationId",
] as const satisfies readonly InstanceKey[];

export const INSTANCE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "generatedAt",
  "updatedAt",
] as const satisfies readonly InstanceKey[];

export const INSTANCE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IInstance> = {
  searchableFields: [...INSTANCE_SEARCHABLE_FIELDS],
  filterFields: [...INSTANCE_FILTERABLE_FIELDS],
  dateRangeFields: [...INSTANCE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INSTANCE_SELECTABLE_FIELDS = [
  "contactId",
  "createdAt",
  "deletedAt",
  "domainId",
  "generatedAt",
  "id",
  "institutionId",
  "officeId",
  "positionId",
  "statusId",
  "templateId",
  "unitFeatureId",
  "updatedAt",
  "verifiedCitationId",
  "version",
] as const satisfies readonly InstanceKey[];

export const INSTANCE_DEFAULT_SELECT_FIELDS = [
  "contactId",
  "createdAt",
  "deletedAt",
  "domainId",
  "generatedAt",
  "id",
  "institutionId",
  "officeId",
  "positionId",
  "statusId",
  "templateId",
  "unitFeatureId",
  "updatedAt",
  "verifiedCitationId",
  "version",
] as const satisfies readonly InstanceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INSTANCE_EDITABLE_FIELDS = [
  "contactId",
  "domainId",
  "generatedAt",
  "institutionId",
  "officeId",
  "positionId",
  "statusId",
  "templateId",
  "unitFeatureId",
  "verifiedCitationId",
] as const satisfies readonly InstanceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INSTANCE_AS_ONE_RELATION_CONFIG = {
  relation: "instance",
  type: ERelationType.One,
  selectableFields: INSTANCE_SELECTABLE_FIELDS,
  defaultSelectFields: INSTANCE_DEFAULT_SELECT_FIELDS,
} as const satisfies IInstanceAsOneRelationConfig;

export const INSTANCE_AS_MANY_RELATION_CONFIG = {
  relation: "instances",
  type: ERelationType.Many,
  selectableFields: INSTANCE_SELECTABLE_FIELDS,
  defaultSelectFields: INSTANCE_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTANCE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IInstanceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INSTANCE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => ContactsConfig.CONTACTS_AS_ONE_RELATION_CONFIG,
    "contact",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => DomainsConfig.DOMAINS_AS_ONE_RELATION_CONFIG,
    "domain",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG,
    "office",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => PositionsConfig.POSITIONS_AS_ONE_RELATION_CONFIG,
    "position",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => TemplateConfig.TEMPLATE_AS_ONE_RELATION_CONFIG,
    "template",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
  Q.createRelationKeyMapper<InstanceRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "verifiedCitation",
  ),
] as const;

export const INSTANCE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INSTANCE_QUERY_OPTIONS = {
  searchableFields: INSTANCE_SEARCHABLE_FIELDS,
  selectableFields: INSTANCE_SELECTABLE_FIELDS,
  defaultSelectFields: INSTANCE_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTANCE_SORTABLE_FIELDS,
  filterFields: INSTANCE_FILTERABLE_FIELDS,
  dateRangeFields: INSTANCE_DATE_RANGE_FIELDS,
  relationKeys: INSTANCE_RELATION_KEYS,
  editableFields: INSTANCE_EDITABLE_FIELDS,
  asOne: INSTANCE_AS_ONE_RELATION_CONFIG,
  asMany: INSTANCE_AS_MANY_RELATION_CONFIG,
  oneRelations: INSTANCE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INSTANCE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IInstance,
  InstanceSortableField,
  InstanceSelectableField,
  InstanceFilterableField,
  InstanceDateRangeField,
  InstanceRelationKey,
  typeof INSTANCE_ONE_RELATION_QUERY_OPTIONS,
  typeof INSTANCE_MANY_RELATION_QUERY_OPTIONS
>;
