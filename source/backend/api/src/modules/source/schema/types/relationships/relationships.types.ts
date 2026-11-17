// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ArtifactsTypes from "#/modules/source/schema/types/artifacts/artifacts.types";
import type * as CapturesTypes from "#/modules/source/schema/types/captures/captures.types";
import type * as EditionsTypes from "#/modules/source/schema/types/editions/editions.types";
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as ProductsTypes from "#/modules/source/schema/types/products/products.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  RELATIONSHIPS_RELATION_KEYS,
  RELATIONSHIPS_SORTABLE_FIELDS,
  RELATIONSHIPS_SEARCHABLE_FIELDS,
  RELATIONSHIPS_FILTERABLE_FIELDS,
  RELATIONSHIPS_DATE_RANGE_FIELDS,
  RELATIONSHIPS_SELECTABLE_FIELDS,
  RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  RELATIONSHIPS_EDITABLE_FIELDS,
} from "./relationships.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship. */
export interface IRelationships extends B.IBase {
  executionRef: string | null;
  inputArtifactId: string | null;
  inputCaptureId: string | null;
  inputEditionId: string | null;
  inputFileVersionId: string | null;
  inputProductId: string | null;
  kindId: string;
  method: string | null;
  outputArtifactId: string | null;
  outputCaptureId: string | null;
  outputEditionId: string | null;
  outputFileVersionId: string | null;
  outputProductId: string | null;
  subjectId: string | null;
  subjectTable: SubjectTable | null;
  readonly inputArtifact?: ArtifactsTypes.IArtifacts;
  readonly inputCapture?: CapturesTypes.ICaptures;
  readonly inputEdition?: EditionsTypes.IEditions;
  readonly inputFileVersion?: FileVersionsTypes.IFileVersions;
  readonly inputProduct?: ProductsTypes.IProducts;
  readonly kind?: ValueTypes.IValue;
  readonly outputArtifact?: ArtifactsTypes.IArtifacts;
  readonly outputCapture?: CapturesTypes.ICaptures;
  readonly outputEdition?: EditionsTypes.IEditions;
  readonly outputFileVersion?: FileVersionsTypes.IFileVersions;
  readonly outputProduct?: ProductsTypes.IProducts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RelationshipsKey = keyof IRelationships;

export type RelationshipsRelationKey = (typeof RELATIONSHIPS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRelationshipsReadonlyFields = B.IBaseReadonlyFields;

export type IRelationshipsContextualFields = never;

export type IRelationshipsSensitiveFields = never;

export type IRelationshipsTransitionFields = never;

export type IRelationshipsImmutableFields =
  | IRelationshipsReadonlyFields
  | IRelationshipsContextualFields
  | IRelationshipsSensitiveFields
  | IRelationshipsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRelationshipsCreatable = Omit<
  IRelationships,
  IRelationshipsImmutableFields | RelationshipsRelationKey
>;

export type IRelationshipsSystemWritable = Omit<
  IRelationships,
  B.IBaseReadonlyFields | RelationshipsRelationKey
>;

export type IRelationshipsUpdatable = Partial<
  Omit<IRelationships, IRelationshipsImmutableFields | RelationshipsRelationKey>
>;

export interface IRelationshipsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RelationshipsSortableField = (typeof RELATIONSHIPS_SORTABLE_FIELDS)[number];

export type RelationshipsSearchableField = (typeof RELATIONSHIPS_SEARCHABLE_FIELDS)[number];

export type RelationshipsFilterableField = (typeof RELATIONSHIPS_FILTERABLE_FIELDS)[number];

export type RelationshipsDateRangeField = (typeof RELATIONSHIPS_DATE_RANGE_FIELDS)[number];

export type RelationshipsSelectableField = (typeof RELATIONSHIPS_SELECTABLE_FIELDS)[number];

export type RelationshipsDefaultSelectField = (typeof RELATIONSHIPS_DEFAULT_SELECT_FIELDS)[number];

export type RelationshipsEditableField = (typeof RELATIONSHIPS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRelationshipsAsOneRelationConfig = Q.IOneRelationConfig<
  "relationships",
  RelationshipsSelectableField
>;

export type IRelationshipsAsManyRelationConfig = Q.IManyRelationConfig<
  "relationships",
  RelationshipsSelectableField,
  RelationshipsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRelationshipsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IRelationships,
  RelationshipsSelectableField
>;

export type IRelationshipsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IRelationships,
  RelationshipsSelectableField,
  RelationshipsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRelationshipsRelationMap extends Record<RelationshipsRelationKey, unknown> {
  inputArtifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  inputCapture: CapturesTypes.ICapturesAsOneRelationQuery;
  inputEdition: EditionsTypes.IEditionsAsOneRelationQuery;
  inputFileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  inputProduct: ProductsTypes.IProductsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  outputArtifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  outputCapture: CapturesTypes.ICapturesAsOneRelationQuery;
  outputEdition: EditionsTypes.IEditionsAsOneRelationQuery;
  outputFileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  outputProduct: ProductsTypes.IProductsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRelationshipsRelationQueries = Q.IBaseRelationQueries<
  IRelationships,
  RelationshipsRelationKey,
  IRelationshipsRelationMap
>;

export type IRelationshipsItemQuery = Q.IBaseItemQuery<
  IRelationships,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  IRelationshipsRelationMap,
  IRelationshipsRelationQueries
>;

export type IRelationshipsListQuery = Q.IBaseListQuery<
  IRelationships,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsSortableField,
  RelationshipsRelationKey,
  RelationshipsSelectableField,
  RelationshipsSortableField,
  RelationshipsDateRangeField,
  RelationshipsFilterableField,
  IRelationshipsRelationMap,
  IRelationshipsRelationQueries,
  IRelationshipsItemQuery
>;
