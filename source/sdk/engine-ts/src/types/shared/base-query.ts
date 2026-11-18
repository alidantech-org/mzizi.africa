import { SharedSortDirection } from "#sdk/types/enums/shared/sort-direction.ts";

/** Base Query */
export interface SharedBaseQuery {
  limit?: number;
  order?: SharedSortDirection;
  page?: number;
  sort?: string;
}
