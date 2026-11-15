import { ESortOrder, ERelationType } from './enums';

// ----------------------------------
// PRIMITIVES
// ----------------------------------

export type IDateRange = {
  from?: Date;
  to?: Date;
};

export type IRelationQueryValue<
  TRelatedEntity,
  TSelectableField extends keyof TRelatedEntity & string,
  TSortableField extends keyof TRelatedEntity & string
> = IAsOneRelationQuery<TRelatedEntity, TSelectableField> | IAsManyRelationQuery<TRelatedEntity, TSelectableField, TSortableField>;

// ----------------------------------
// RELATION QUERIES
// ----------------------------------

export type IBaseRelationQueries<TEntity, TRelationKey extends keyof TEntity, TMap extends Record<TRelationKey, unknown>> = {
  readonly [K in TRelationKey]?: TMap[K];
};

// ----------------------------------
// FILTER
// ----------------------------------

export type IBaseFilter<TEntity, TFilterableField extends keyof TEntity> = Partial<Pick<TEntity, TFilterableField>>;

// ----------------------------------
// ITEM QUERY
// ----------------------------------

export type IBaseItemQuery<
  TEntity,
  TRelationKey extends keyof TEntity,
  TSelectableField extends keyof TEntity & string,
  TInclude extends TRelationKey,
  TFields extends TSelectableField,
  TRelationMap extends Record<TRelationKey, unknown>,
  TRelationQueries extends IBaseRelationQueries<TEntity, TRelationKey, TRelationMap>
> = TRelationQueries & {
  include?: TInclude[];
  fields?: TFields[];
  withDeleted?: boolean;
};

// ----------------------------------
// LIST QUERY
// ----------------------------------

export type IBaseListQuery<
  TEntity,
  TRelationKey extends keyof TEntity,
  TSelectableField extends keyof TEntity & string,
  TSortableField extends keyof TEntity & string,
  TInclude extends TRelationKey,
  TFields extends TSelectableField,
  TSort extends TSortableField,
  TDateRangeField extends keyof TEntity & string,
  TFilterableField extends keyof TEntity & string,
  TRelationMap extends Record<TRelationKey, unknown>,
  TRelationQueries extends IBaseRelationQueries<TEntity, TRelationKey, TRelationMap>,
  TItemQuery extends IBaseItemQuery<TEntity, TRelationKey, TSelectableField, TInclude, TFields, TRelationMap, TRelationQueries>
> = TItemQuery &
  TFilterableField & {
    cursor?: string;
    first?: number;
    last?: number;
    q?: string;
    sortBy?: TSort[];
    sortOrder?: ESortOrder[];
    dateRange?: Partial<Record<TDateRangeField, IDateRange>>;
  };

// ----------------------------------
// INTERNAL FIND OPTIONS
// ----------------------------------

export type InternalFindOptions<TEntity, TFields extends keyof TEntity & string> = {
  filters?: Partial<{
    [K in keyof TEntity]: NonNullable<TEntity[K]>;
  }>;
  take?: number;
  select?: TFields[];
};

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export interface IOneRelationConfig<TRelationKey extends string, TSelectableField extends string> {
  relation: TRelationKey;
  type: ERelationType.One;
  selectableFields: readonly TSelectableField[];
  defaultSelectFields: readonly TSelectableField[];
}

export interface IManyRelationConfig<TRelationKey extends string, TSelectableField extends string, TSortableField extends string> {
  relation: TRelationKey;
  type: ERelationType.Many;
  selectableFields: readonly TSelectableField[];
  defaultSelectFields: readonly TSelectableField[];
  sortableFields: readonly TSortableField[];
  defaultLimit: number;
  maxLimit: number;
}

// ----------------------------------
// RELATION CONFIG KEY MAPPER
// ----------------------------------

export function createRelationKeyMapper<TParentRelationKey extends string>() {
  return {
    one: <TCustomKey extends TParentRelationKey, TSelectableField extends string>(
      config: IOneRelationConfig<string, TSelectableField>,
      customKey: TCustomKey
    ): IOneRelationConfig<TCustomKey, TSelectableField> => ({
      ...config,
      relation: customKey
    }),

    many: <TCustomKey extends TParentRelationKey, TSelectableField extends string, TSortableField extends string>(
      config: IManyRelationConfig<string, TSelectableField, TSortableField>,
      customKey: TCustomKey
    ): IManyRelationConfig<TCustomKey, TSelectableField, TSortableField> => ({
      ...config,
      relation: customKey
    })
  };
}

// ----------------------------------
// RELATION QUERY PARAM TYPES
// ----------------------------------

export interface IAsOneRelationQuery<TEntity, TSelectableField extends keyof TEntity & string> {
  fields?: TSelectableField[];
}

export type IAsManyRelationQuery<
  TEntity,
  TSelectableField extends keyof TEntity & string,
  TSortableField extends keyof TEntity & string,
  TAsOneQuery extends IAsOneRelationQuery<TEntity, TSelectableField> = IAsOneRelationQuery<TEntity, TSelectableField>
> = TAsOneQuery & {
  sortBy?: TSortableField[];
  sortOrder?: ESortOrder[];
  page?: number;
  limit?: number;
};

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export interface IEntityQueryOptions<
  TEntity,
  TSortableField extends keyof TEntity & string,
  TSelectableField extends keyof TEntity & string,
  TFilterableField extends keyof TEntity & string,
  TDateRangeField extends keyof TEntity & string,
  TRelationKey extends keyof TEntity & string,
  TOneRelationConfig extends readonly IOneRelationConfig<TRelationKey, string>[] = readonly [],
  TManyRelationConfig extends readonly IManyRelationConfig<TRelationKey, string, string>[] = readonly []
> {
  searchableFields: readonly (keyof TEntity & string)[];
  selectableFields: readonly TSelectableField[];
  defaultSelectFields: readonly TSelectableField[];
  sortableFields: readonly TSortableField[];
  filterFields: readonly TFilterableField[];
  dateRangeFields: readonly TDateRangeField[];
  oneRelations: TOneRelationConfig;
  manyRelations: TManyRelationConfig;
}
