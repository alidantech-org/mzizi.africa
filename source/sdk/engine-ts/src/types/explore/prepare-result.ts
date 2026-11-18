/** Prepare Result */
export interface ExplorePrepareResult {
  dropped_rows: number;
  header: string[];
  problems: string[];
  rows: unknown[];
  saved: string;
  total_rows: number;
}
