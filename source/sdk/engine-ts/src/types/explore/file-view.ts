/** File View */
export interface ExploreFileView {
  actions: string[];
  header: string[];
  kind: string;
  modified: string;
  name: string;
  parsed?: unknown | null;
  path: string;
  root: string;
  rows: unknown[];
  size: number;
  text: string | null;
  total_rows: number | null;
  truncated: boolean;
}
