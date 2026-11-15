// common/interfaces/query.types.ts

import { ESortOrder } from "./sort-order.enums.ts";
import { type FindOptionsWhere } from "typeorm";

export interface IFindAllOptions<T> {
  /** Page number, 1-indexed */
  page?: number;

  /** Number of records per page — capped at 100 in BaseRepository */
  limit?: number;

  /** TypeORM-compatible where clause — used for simple exact-match filters */
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];

  /** Relations to eager-load */
  relations?: (keyof T)[];

  /** Fields to select - array of field names to return */
  select?: (keyof T)[];

  /** Field(s) to sort by - can be single field or array of fields */
  sortBy?: keyof T | (keyof T)[];

  /** Sort direction(s) - array matching sortBy fields */
  sortOrder?: ESortOrder | ESortOrder[];

  /** Include soft-deleted records */
  withDeleted?: boolean;

  /**
   * Cross-field search string.
   * BaseRepository ignores this — child repositories handle it in findWithFilters().
   * Declared here so it travels through the options object without being stripped.
   */
  search?: string;
}

export interface IFindAllResponse<T> {
  data: T[];
  total: number;
}

export interface IBuildWhereConditionsOptions<TEntity> {
  searchableFields?: (keyof Partial<TEntity>)[];
  filterFields?: (keyof Partial<TEntity>)[];
  dateRangeFields?: (keyof Partial<TEntity>)[];
}

/**
 * Type for internal find method options
 */
export type InternalFindOptions<T> = {
  filters?: FindOptionsWhere<T>;
  take?: number;
  select?: (keyof T)[];
};
