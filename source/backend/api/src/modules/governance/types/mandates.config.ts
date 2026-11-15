// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as InstitutionsConfig from '#/modules/governance/types/institutions.config';
import * as ValueConfig from '#/modules/reference/types/value.config';
import * as OfficesConfig from '#/modules/governance/types/offices.config';
import * as CitationsConfig from '#/modules/source/types/citations.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IMandates,
  MandatesKey,
  MandatesRelationKey,
  MandatesSortableField,
  MandatesFilterableField,
  MandatesDateRangeField,
  MandatesSelectableField,
  IMandatesAsOneRelationConfig,
  IMandatesAsManyRelationConfig
} from './mandates.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANDATES_RELATION_KEYS = ['institution', 'mandateKind', 'office', 'sourceCitation', ] as const satisfies readonly MandatesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANDATES_SORTABLE_FIELDS = [] as const satisfies readonly MandatesKey[];

export const MANDATES_SEARCHABLE_FIELDS = [] as const satisfies readonly MandatesKey[];

export const MANDATES_FILTERABLE_FIELDS = [] as const satisfies readonly MandatesKey[];

export const MANDATES_DATE_RANGE_FIELDS = [] as const satisfies readonly MandatesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANDATES_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'description', 'id', 'institutionId', 'mandateKindId', 'officeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly MandatesKey[];

export const MANDATES_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'description', 'id', 'institutionId', 'mandateKindId', 'officeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly MandatesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANDATES_EDITABLE_FIELDS = ['description', 'institutionId', 'mandateKindId', 'officeId', 'sourceCitationId', 'validFrom', 'validUntil', ] as const satisfies readonly MandatesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANDATES_AS_ONE_RELATION_CONFIG = {
  relation: 'mandates',
  type: ERelationType.One,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS
} as const satisfies IMandatesAsOneRelationConfig;

export const MANDATES_AS_MANY_RELATION_CONFIG = {
  relation: 'mandatess',
  type: ERelationType.Many,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANDATES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IMandatesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANDATES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<MandatesRelationKey>().one(InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG, 'institution'),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'mandateKind'),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG, 'office'),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG, 'sourceCitation'),
] as const;

export const MANDATES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANDATES_QUERY_OPTIONS = {
  searchableFields: MANDATES_SEARCHABLE_FIELDS,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANDATES_SORTABLE_FIELDS,
  filterFields: MANDATES_FILTERABLE_FIELDS,
  dateRangeFields: MANDATES_DATE_RANGE_FIELDS,
  oneRelations: MANDATES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANDATES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IMandates,
  MandatesSortableField,
  MandatesSelectableField,
  MandatesFilterableField,
  MandatesDateRangeField,
  MandatesRelationKey,
  typeof MANDATES_ONE_RELATION_QUERY_OPTIONS,
  typeof MANDATES_MANY_RELATION_QUERY_OPTIONS
>;