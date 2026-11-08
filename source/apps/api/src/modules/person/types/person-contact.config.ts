// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PersonConfig from '#/modules/person/types/person.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPersonContact,
  PersonContactKey,
  PersonContactRelationKey,
  PersonContactSortableField,
  PersonContactFilterableField,
  PersonContactDateRangeField,
  PersonContactSelectableField,
  IPersonContactAsOneRelationConfig,
  IPersonContactAsManyRelationConfig
} from './person-contact.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERSON_CONTACT_RELATION_KEYS = ['person', ] as const satisfies readonly PersonContactKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERSON_CONTACT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PersonContactKey[];

export const PERSON_CONTACT_SEARCHABLE_FIELDS = [] as const satisfies readonly PersonContactKey[];

export const PERSON_CONTACT_FILTERABLE_FIELDS = ['exposure', 'id', 'isCurrent', 'kind', 'officeId', 'personId', 'version', ] as const satisfies readonly PersonContactKey[];

export const PERSON_CONTACT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PersonContactKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERSON_CONTACT_SELECTABLE_FIELDS = ['createdAt', 'exposure', 'id', 'isCurrent', 'kind', 'label', 'officeId', 'personId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', ] as const satisfies readonly PersonContactKey[];

export const PERSON_CONTACT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PersonContactSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERSON_CONTACT_EDITABLE_FIELDS = ['exposure', 'isCurrent', 'kind', 'label', 'officeId', 'personId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', ] as const satisfies readonly PersonContactKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERSON_CONTACT_AS_ONE_RELATION_CONFIG = {
  relation: 'personContact',
  type: ERelationType.One,
  selectableFields: PERSON_CONTACT_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_CONTACT_DEFAULT_SELECT_FIELDS
} as const satisfies IPersonContactAsOneRelationConfig;

export const PERSON_CONTACT_AS_MANY_RELATION_CONFIG = {
  relation: 'personContacts',
  type: ERelationType.Many,
  selectableFields: PERSON_CONTACT_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_CONTACT_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_CONTACT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPersonContactAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERSON_CONTACT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PersonContactRelationKey>().one(PersonConfig.PERSON_AS_ONE_RELATION_CONFIG, 'person'),
] as const;

export const PERSON_CONTACT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERSON_CONTACT_QUERY_OPTIONS = {
  searchableFields: PERSON_CONTACT_SEARCHABLE_FIELDS,
  selectableFields: PERSON_CONTACT_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_CONTACT_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_CONTACT_SORTABLE_FIELDS,
  filterFields: PERSON_CONTACT_FILTERABLE_FIELDS,
  dateRangeFields: PERSON_CONTACT_DATE_RANGE_FIELDS,
  oneRelations: PERSON_CONTACT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERSON_CONTACT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPersonContact,
  PersonContactSortableField,
  PersonContactSelectableField,
  PersonContactFilterableField,
  PersonContactDateRangeField,
  PersonContactRelationKey,
  typeof PERSON_CONTACT_ONE_RELATION_QUERY_OPTIONS,
  typeof PERSON_CONTACT_MANY_RELATION_QUERY_OPTIONS
>;