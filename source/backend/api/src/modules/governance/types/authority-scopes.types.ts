// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';
import type * as CountryTypes from '#/modules/reference/types/country.types';
import type * as InstitutionsTypes from '#/modules/governance/types/institutions.types';
import type * as OfficesTypes from '#/modules/governance/types/offices.types';
import type * as CitationsTypes from '#/modules/source/types/citations.types';
import type * as UnitsTypes from '#/modules/geography/types/units.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  AUTHORITY_SCOPES_RELATION_KEYS,
  AUTHORITY_SCOPES_SORTABLE_FIELDS,
  AUTHORITY_SCOPES_SEARCHABLE_FIELDS,
  AUTHORITY_SCOPES_FILTERABLE_FIELDS,
  AUTHORITY_SCOPES_DATE_RANGE_FIELDS,
  AUTHORITY_SCOPES_SELECTABLE_FIELDS,
  AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS,
  AUTHORITY_SCOPES_EDITABLE_FIELDS
} from './authority-scopes.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One institution or office authority over a required Geography unit for an effective period. */
export interface IAuthorityScopes extends B.IBase {
  authorityKindId: string;
  countryId: string | null;
  institutionId: string | null;
  officeId: string | null;
  sourceCitationId: string | null;
  unitFeatureId: string;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly authorityKind?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly office?: OfficesTypes.IOffices;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly unitFeature?: UnitsTypes.IUnits;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AuthorityScopesKey = keyof IAuthorityScopes;

export type AuthorityScopesRelationKey = (typeof AUTHORITY_SCOPES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAuthorityScopesReadonlyFields = B.IBaseReadonlyFields;

export type IAuthorityScopesContextualFields = never;

export type IAuthorityScopesSensitiveFields = never;

export type IAuthorityScopesTransitionFields = never;

export type IAuthorityScopesImmutableFields =
  | IAuthorityScopesReadonlyFields
  | IAuthorityScopesContextualFields
  | IAuthorityScopesSensitiveFields
  | IAuthorityScopesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAuthorityScopesCreatable = Omit<IAuthorityScopes, IAuthorityScopesImmutableFields | AuthorityScopesRelationKey>;

export type IAuthorityScopesSystemWritable = Omit<IAuthorityScopes, B.IBaseReadonlyFields | AuthorityScopesRelationKey>;

export type IAuthorityScopesUpdatable = Partial<Omit<IAuthorityScopes, IAuthorityScopesImmutableFields | AuthorityScopesRelationKey>>;

export interface IAuthorityScopesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AuthorityScopesSortableField = (typeof AUTHORITY_SCOPES_SORTABLE_FIELDS)[number];

export type AuthorityScopesSearchableField = (typeof AUTHORITY_SCOPES_SEARCHABLE_FIELDS)[number];

export type AuthorityScopesFilterableField = (typeof AUTHORITY_SCOPES_FILTERABLE_FIELDS)[number];

export type AuthorityScopesDateRangeField = (typeof AUTHORITY_SCOPES_DATE_RANGE_FIELDS)[number];

export type AuthorityScopesSelectableField = (typeof AUTHORITY_SCOPES_SELECTABLE_FIELDS)[number];

export type AuthorityScopesDefaultSelectField = (typeof AUTHORITY_SCOPES_DEFAULT_SELECT_FIELDS)[number];

export type AuthorityScopesEditableField = (typeof AUTHORITY_SCOPES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAuthorityScopesAsOneRelationConfig = Q.IOneRelationConfig<'authorityScopes', AuthorityScopesSelectableField>;

export type IAuthorityScopesAsManyRelationConfig = Q.IManyRelationConfig<'authorityScopess', AuthorityScopesSelectableField, AuthorityScopesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAuthorityScopesAsOneRelationQuery = Q.IAsOneRelationQuery<IAuthorityScopes, AuthorityScopesSelectableField>;

export type IAuthorityScopesAsManyRelationQuery = Q.IAsManyRelationQuery<IAuthorityScopes, AuthorityScopesSelectableField, AuthorityScopesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAuthorityScopesRelationMap extends Record<AuthorityScopesRelationKey, unknown> {
  authorityKind: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  unitFeature: UnitsTypes.IUnitsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAuthorityScopesRelationQueries = Q.IBaseRelationQueries<IAuthorityScopes, AuthorityScopesRelationKey, IAuthorityScopesRelationMap>;

export type IAuthorityScopesItemQuery = Q.IBaseItemQuery<
  IAuthorityScopes,
  AuthorityScopesRelationKey,
  AuthorityScopesSelectableField,
  AuthorityScopesRelationKey,
  AuthorityScopesSelectableField,
  IAuthorityScopesRelationMap,
  IAuthorityScopesRelationQueries
>;

export type IAuthorityScopesListQuery = Q.IBaseListQuery<
  IAuthorityScopes,
  AuthorityScopesRelationKey,
  AuthorityScopesSelectableField,
  AuthorityScopesSortableField,
  AuthorityScopesRelationKey,
  AuthorityScopesSelectableField,
  AuthorityScopesSortableField,
  AuthorityScopesDateRangeField,
  AuthorityScopesFilterableField,
  IAuthorityScopesRelationMap,
  IAuthorityScopesRelationQueries,
  IAuthorityScopesItemQuery
>;