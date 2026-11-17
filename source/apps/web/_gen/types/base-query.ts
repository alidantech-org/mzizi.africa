
import { SortDirection } from './enums/sort-direction';

/** Base Query */
export interface BaseQuery {
  limit?: number;
  order?: SortDirection;
  page?: number;
  sort?: string;
}