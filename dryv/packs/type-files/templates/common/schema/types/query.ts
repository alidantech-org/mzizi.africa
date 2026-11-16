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

/**
 * A relation config, or a function that returns one. Generated config modules reference each other (a publisher relates to an
 * entity that relates to a citation that relates to a publisher), so a direct reference would be read before its module has
 * finished loading. A function is called on first use instead, after every module has loaded.
 */
export type Lazy<T> = T | (() => T);

function resolveRelation<T extends object>(source: Lazy<T>, override: Partial<T>): T {
  if (typeof source !== 'function') {
    return { ...source, ...override };
  }
  let cached: T | undefined;
  const resolved = (): T => (cached ??= { ...(source as () => T)(), ...override });
  return new Proxy({} as T, {
    get: (_target, key) => Reflect.get(resolved(), key),
    has: (_target, key) => key in resolved(),
    ownKeys: () => Reflect.ownKeys(resolved()),
    getOwnPropertyDescriptor: (_target, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(resolved(), key);
      return descriptor ? { ...descriptor, configurable: true } : undefined;
    }
  });
}

export function createRelationKeyMapper<TParentRelationKey extends string>() {
  return {
    one: <TCustomKey extends TParentRelationKey, TSelectableField extends string>(
      config: Lazy<IOneRelationConfig<string, TSelectableField>>,
      customKey: TCustomKey
    ): IOneRelationConfig<TCustomKey, TSelectableField> =>
      resolveRelation(config, { relation: customKey }) as IOneRelationConfig<TCustomKey, TSelectableField>,

    many: <TCustomKey extends TParentRelationKey, TSelectableField extends string, TSortableField extends string>(
      config: Lazy<IManyRelationConfig<string, TSelectableField, TSortableField>>,
      customKey: TCustomKey
    ): IManyRelationConfig<TCustomKey, TSelectableField, TSortableField> =>
      resolveRelation(config, { relation: customKey }) as IManyRelationConfig<TCustomKey, TSelectableField, TSortableField>
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
  /** The entity's relation names a client may load. */
  relationKeys: readonly TRelationKey[];
  /** The fields a client may write; everything else is set by the system. */
  editableFields: readonly (keyof TEntity & string)[];
  /** How the entity looks as one related row, and as a list of related rows, of another entity. */
  asOne: IOneRelationConfig<string, TSelectableField>;
  asMany: IManyRelationConfig<string, TSelectableField, TSortableField>;
  oneRelations: TOneRelationConfig;
  manyRelations: TManyRelationConfig;
}
