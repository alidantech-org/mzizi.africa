/** Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from. */
export interface SourceProvenance {
  captureId?: string | null;
  columnName?: string | null;
  createdAt: string;
  datasetId: string;
  deletedAt?: string | null;
  documentId?: string | null;
  id: string;
  line?: number | null;
  recordId: string;
  tableName: string;
  updatedAt: string;
  version: number;
}
