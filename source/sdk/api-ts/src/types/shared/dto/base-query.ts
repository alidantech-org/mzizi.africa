import { SharedSortDirection } from "#sdk/types/shared/enums/sort-direction.ts";

/** Base Query */
export interface SharedBaseQuery {
  limit?: number;
  order?: SharedSortDirection;
  page?: number;
  sort?: string;
}
