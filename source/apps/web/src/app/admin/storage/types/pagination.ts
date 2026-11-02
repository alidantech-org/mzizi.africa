/**
 * Pagination interface
 */

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  has_more: boolean;
}
