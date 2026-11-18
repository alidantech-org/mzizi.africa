// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ArtifactsTypes from "#/modules/source/schema/types/artifacts/artifacts.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  HANSARDS_RELATION_KEYS,
  HANSARDS_SORTABLE_FIELDS,
  HANSARDS_SEARCHABLE_FIELDS,
  HANSARDS_FILTERABLE_FIELDS,
  HANSARDS_DATE_RANGE_FIELDS,
  HANSARDS_SELECTABLE_FIELDS,
  HANSARDS_DEFAULT_SELECT_FIELDS,
  HANSARDS_EDITABLE_FIELDS,
} from "./hansards.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages. */
export interface IHansards extends B.IBase {
  artifactId: string;
  code: string;
  isProvisional: boolean;
  languageId: string;
  publishedOn: Date | null;
  reference: string | null;
  sittingId: string;
  sourceCitationId: string | null;
  readonly artifact?: ArtifactsTypes.IArtifacts;
  readonly language?: LanguageTypes.ILanguage;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type HansardsKey = keyof IHansards;

export type HansardsRelationKey = (typeof HANSARDS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IHansardsReadonlyFields = B.IBaseReadonlyFields;

export type IHansardsContextualFields = never;

export type IHansardsSensitiveFields = never;

export type IHansardsTransitionFields = never;

export type IHansardsImmutableFields =
  | IHansardsReadonlyFields
  | IHansardsContextualFields
  | IHansardsSensitiveFields
  | IHansardsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IHansardsCreatable = Omit<IHansards, IHansardsImmutableFields | HansardsRelationKey>;

export type IHansardsSystemWritable = Omit<IHansards, B.IBaseReadonlyFields | HansardsRelationKey>;

export type IHansardsUpdatable = Partial<
  Omit<IHansards, IHansardsImmutableFields | HansardsRelationKey>
>;

export interface IHansardsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type HansardsSortableField = (typeof HANSARDS_SORTABLE_FIELDS)[number];

export type HansardsSearchableField = (typeof HANSARDS_SEARCHABLE_FIELDS)[number];

export type HansardsFilterableField = (typeof HANSARDS_FILTERABLE_FIELDS)[number];

export type HansardsDateRangeField = (typeof HANSARDS_DATE_RANGE_FIELDS)[number];

export type HansardsSelectableField = (typeof HANSARDS_SELECTABLE_FIELDS)[number];

export type HansardsDefaultSelectField = (typeof HANSARDS_DEFAULT_SELECT_FIELDS)[number];

export type HansardsEditableField = (typeof HANSARDS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IHansardsAsOneRelationConfig = Q.IOneRelationConfig<
  "hansards",
  HansardsSelectableField
>;

export type IHansardsAsManyRelationConfig = Q.IManyRelationConfig<
  "hansards",
  HansardsSelectableField,
  HansardsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IHansardsAsOneRelationQuery = Q.IAsOneRelationQuery<IHansards, HansardsSelectableField>;

export type IHansardsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IHansards,
  HansardsSelectableField,
  HansardsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IHansardsRelationMap extends Record<HansardsRelationKey, unknown> {
  artifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IHansardsRelationQueries = Q.IBaseRelationQueries<
  IHansards,
  HansardsRelationKey,
  IHansardsRelationMap
>;

export type IHansardsItemQuery = Q.IBaseItemQuery<
  IHansards,
  HansardsRelationKey,
  HansardsSelectableField,
  HansardsRelationKey,
  HansardsSelectableField,
  IHansardsRelationMap,
  IHansardsRelationQueries
>;

export type IHansardsListQuery = Q.IBaseListQuery<
  IHansards,
  HansardsRelationKey,
  HansardsSelectableField,
  HansardsSortableField,
  HansardsRelationKey,
  HansardsSelectableField,
  HansardsSortableField,
  HansardsDateRangeField,
  HansardsFilterableField,
  IHansardsRelationMap,
  IHansardsRelationQueries,
  IHansardsItemQuery
>;
